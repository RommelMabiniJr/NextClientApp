const { stringifyPaymentMethods, jsonifyPaymentMethods } = require('./utils/utils');
const cors = require('cors');
const session = require('express-session');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const db = require('./db');


const app = express();

const port = 5000;


app.use(express.json())
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false
}));


app.post('/register', async (req, res) => {
  // completed_profile field is not included in the req body because it is set to 'false' by default
  const { firstName, secondName, email, phone, password, user_type, city, barangay, street  } = req.body;

  try {
    // Check if user already exists
    const userExists = await db.checkUserExists(email);
    if (userExists) {
      return res.status(400).send('User already exists');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(password, hashedPassword);
    console.log(await bcrypt.compare(password, hashedPassword));

    // Insert the user into the database
    const userId = await db.insertUser(firstName, secondName, email, phone, hashedPassword, user_type, city, barangay, street);

    // Generate a UUID for the user and store it in the database
    const userUuid = uuid.v4();
    await db.insertUuid(userId, userUuid);

    const token = jwt.sign({ email }, 'secret');
    res.status(200).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists in the database
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // get the user's uuid
    const userUuid = await db.getUuidByUserId(user.user_id);
    if (!userUuid) {
      return res.status(401).json({ message: 'Error getting UUID' });
    }

    // Compare the password with the hashed password in the database
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a token for the user
    const token = jwt.sign({ id: user.id }, 'secret');

    res.json({
        uuid: userUuid,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        email: user.email,
        userType: user.user_type,
        completedProfile: user.completed_profile,
        city: user.city_municipality,
        barangay: user.barangay,
        street: user.street
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Use this as reference of the object to be passed on this api
// {householdSize: '12', hasPets: 'yes', specificNeeds: 'ajsbdjhasdivawdja', paymentMethods: Array(2), paymentFrequency: 'Daily', …}

app.post('/employer/complete-profile', async (req, res) => {
  const { uuid, householdSize, hasPets, specificNeeds, paymentMethods, paymentFrequency, bio } = req.body;

  // convert a few fields to proper data types
  const hasPetsInt = hasPets === true ? 1 : 0;
  const paymentMethodsString = stringifyPaymentMethods(paymentMethods);

  try {
    // Check if user exists in the database
    const user = await db.getUserByUuid(uuid);
    if (!user) {
      return res.status(401).json({ message: 'Invalid UUID' });
    }

    // Insert the user into the database
    const userId = await db.insertEmployerProfile(user.user_id, householdSize, hasPetsInt, specificNeeds, paymentMethodsString, paymentFrequency, bio);

    // Update the user's completed_profile field to true
    await db.updateCompletedProfile(user.user_id, true);

    res.status(200).send('Profile completed for' + user.first_name);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error completing profile');
  }
});

app.get('/employer/:uuid', async (req, res) => {
  const { uuid } = req.params;

  try {
    // Check if user exists in the database
    const user = await db.getUserByUuid(uuid);
    if (!user) {
      return res.status(401).json({ message: 'Invalid UUID' });
    }

    // Get the user's profile
    const profile = await db.getEmployerByUserId(user.user_id);
    if (!profile) {
      return res.status(401).json({ message: 'Error getting profile' });
    }

    // Convert a few fields to proper data types
    const hasPetsBool = profile.has_pets === 1 ? true : false;
    const paymentMethods_inJson = jsonifyPaymentMethods(profile.payment_methods);

    res.status(200).json({
      householdSize: profile.household_size,
      hasPets: hasPetsBool,
      specificNeeds: profile.specific_needs,
      paymentMethods: paymentMethods_inJson,
      paymentFrequency: profile.payment_frequency,
      bio: profile.bio
    });

    console.log(paymentMethods_inJson)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.patch('/user/update-info', async (req, res) => {
  const { uuid, phoneNumber, email } = req.body;

  try {
    // Check if user exists in the database
    const user = await db.getUserByUuid(uuid);
    if (!user) {
      return res.status(401).json({ message: 'Invalid UUID' });
    }

    // Update the user's phone number
    await db.updateUserInfo(user.user_id, email, phoneNumber);

    res.status(200).send('Phone number updated for ' + user.first_name);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating phone number');
  }
});

app.patch('/employer/update-info/household', async (req, res) => {
  const { uuid, householdSize, hasPets, specificNeeds } = req.body;

  // convert a few fields to proper data types
  const hasPetsInt = hasPets === true ? 1 : 0;

  try {
    // Check if user exists in the database
    const user = await db.getUserByUuid(uuid);
    if (!user) {
      return res.status(401).json({ message: 'Invalid UUID' });
    }

    const infoType = 'household';
    const employerId = user.user_id;

    // Create a variable to store all the employer information
    const employerInfo = {
      employerId,
      householdSize,
      hasPetsInt,
      specificNeeds
    };


    // Update the employer's household information
    await db.updateEmployerInfo(infoType, employerInfo);

    res.status(200).send('Employer Household Information updated for ' + user.first_name);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating profile');
  }
});

app.patch('/employer/update-info/payment', async (req, res) => {
  const { uuid, paymentMethods, paymentFrequency } = req.body;

  // convert a few fields to proper data types
  const paymentMethodsString = stringifyPaymentMethods(paymentMethods);

  try {
    // Check if user exists in the database
    const user = await db.getUserByUuid(uuid);
    if (!user) {
      return res.status(401).json({ message: 'Invalid UUID' });
    }

    const infoType = 'payment';
    const employerId = user.user_id;
    
    // Create a variable to store all the employer information
    const employerInfo = {
      employerId,
      paymentMethods: paymentMethodsString,
      paymentFrequency
    };

    // Update the employer's payment information
    await db.updateEmployerInfo(infoType, employerInfo);

    res.status(200).send('Employer Payment Information updated for ' + user.first_name);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating profile');
  }
});

app.post('/employer/post/create', async (req, res) => {
  const { uuid, serviceId, jobTitle, jobDescription, jobStartDate, jobEndDate, jobStartTime, jobEndTime, jobType } = req.body;


  try {
    // Check if user exists in the database
    const user = await db.getUserByUuid(uuid);
    if (!user) {
      return res.status(401).json({ message: 'Invalid UUID' });
    }

    const employerId = user.user_id;

    // Create the job post
    await db.createJobPost(employerId, serviceId, jobTitle, jobDescription, jobStartDate, jobEndDate, jobStartTime, jobEndTime, jobType);
    res.status(200).send('Job post created for ' + user.first_name);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating post');
  }
});

app.put('/employer/post/update', async (req, res) => {
  const { jobId, serviceId, jobTitle, jobDescription, jobStartDate, jobEndDate, jobStartTime, jobEndTime, jobType} = req.body;

  try {
    // Update the job post
    await db.updateJobPost(jobId, serviceId, jobTitle, jobDescription, jobStartDate, jobEndDate, jobStartTime, jobEndTime, jobType);
    res.status(200).send('Job post updated');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating post');
  }
});

app.delete('/employer/post/delete/:job_id', async (req, res) => {
  const { job_id } = req.params;

  try {
    // Delete the job post
    let isDeleted = await db.deleteJobPost(job_id);
    if (isDeleted) {
      res.status(200).send('Job post deleted');
    } else {
      res.status(500).send('Error deleting post');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting post');
  }
});

app.get('/employer/post/get-posts', async (req, res) => {
  const { uuid } = req.query;

  try {
    // Check if user exists in the database
    const user = await db.getUserByUuid(uuid);
    if (!user) {
      return res.status(401).json({ message: 'Invalid UUID' });
    }

    const employerId = user.user_id;

    // Get the job posts
    const jobPosts = await db.getJobPostsWithServiceName(employerId);

    console.log(jobPosts);
    res.status(200).json(jobPosts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting posts');
  }
});

app.get('/all/user/counts', async (req, res) => { 
  try {
    const userCounts = await db.getUserCounts();
    res.status(200).json(userCounts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting user counts');
  }
});

app.get('/all/post/counts', async (req, res) => {
  try {
    const postCounts = await db.getPostCounts();
    res.status(200).json(postCounts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting post counts');
  }
});

app.post('/worker/complete-profile', async (req, res) => {
  const { uuid, availability, bio, certifications, education, hourlyRate, languages, servicesOffered, skills, workExperience } = req.body;

  // skills is in the form of an array of strings
  // turn it into a string of comma separated values
  const skillsStr = skills.join(',');
  const certificationsStr = JSON.stringify(certifications);
  const languagesStr = JSON.stringify(languages);

  try {
    // Check if user exists in the database
    const user = await db.getUserByUuid(uuid);
    const userId = user.user_id;
    if (!userId) {
      return res.status(401).json({ message: 'Invalid UUID' });
    }

    // Update the user's completed_profile field to true
    await db.updateCompletedProfile(userId, true);

    // Store the worker's profile information
    await db.insertWorkerProfile(userId, availability, bio, certificationsStr, education, hourlyRate, languagesStr, skillsStr, workExperience);
    //                          (userId, availability, bio, certifications, education, hourlyRate, languages, skillsStr, workExperience)

    res.status(200).send('Worker profile created for ' + user.first_name);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating profile');
  }
});


    








app.post('/test-stringify', async (req, res) => {
  const { paymentMethods } = req.body;
  
  const paymentMethodsString = stringifyPaymentMethods(paymentMethods);

  res.status(200).send(paymentMethodsString);
});

app.post('/test-jsonify', async (req, res) => {
  const { paymentMethodsString } = req.body;

  const paymentMethods = jsonifyPaymentMethods(paymentMethodsString);

  res.status(200).send(paymentMethods);
});


app.post('/employee/revert-user-status', async (req, res) => {
  const { uuid } = req.body;

  try {
    // Check if user exists in the database
    const user = await db.getUserByUuid(uuid);
    if (!user) {
      return res.status(401).json({ message: 'Invalid UUID' });
    }

    // Update the user's completed_profile field to true
    await db.updateCompletedProfile(user.user_id, false);

    res.status(200).send('User status reverted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error reverting user status');
  }
});






app.listen(port, () => console.log(`Server started on port ${port}`));