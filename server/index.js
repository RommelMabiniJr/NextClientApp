const { stringifyPaymentMethods, jsonifyPaymentMethods } = require('./utils/utils');
const cors = require('cors');
const session = require('express-session');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { getImagePath } = require('./utils/imageUtils');
// import fetch from 'node-fetch';
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const db = require('./db');
// const { cloudinary } = require('./utils/cloudinary');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') }) // This is required inorder to load the .env file to process.env

// const captchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
// console.log(process.env.RECAPTCHA_SECRET_KEY)

const employerRoute = require('./routes/Employer');

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './server/assets';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// Use this route for testing
app.use('/employer', employerRoute);

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
    console.log(user.user_id)
    const imagePath = await getImagePath(user.user_id);

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
        street: user.street,
        imageUrl: `http://localhost:5000/server/assets/${path.basename(imagePath)}`,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Example endpoint for handling reCAPTCHA verification
app.post('/verify-recaptcha', async (req, res) => {
  
  ////Destructuring response token and input field value from request body
  const { token } = req.body;
  console.log("secret: " + process.env.RECAPTCHA_SECRET_KEY)
  console.log("token: " + token)

  try {
    // Sending secret key and response token to Google Recaptcha API for authentication.
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    );

    console.log(response.data.success);

    // Check response status and send back to the client-side
    if (response.data.success) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    // Handle any errors that occur during the reCAPTCHA verification process
    console.error(error);
    res.status(500).send("Error verifying reCAPTCHA");
   }
});

app.post('/profile-img/upload', upload.single('croppedImage'), async (req, res) => {
  const { uuid } = req.body;

  try {
    const userId = await db.getUserIdbyUuid(uuid);

    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }

    // retrieve current profile image filename
    const currentProfileImageUrl = await db.getProfileURL(userId);
    
    //delete current profile image if it exists
    if (currentProfileImageUrl) {
      const filePath = path.join(__dirname, 'assets', currentProfileImageUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.error(err);
      });
    }

    const success = await db.uploadProfileURL(userId, req.file.filename);
    if (!success) {
      return res.status(404).json({ message: 'Upload unsuccesful' });
    }
    res.json({ imageUrl: `server/assets/${req.file.filename}` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Image upload failed! Server error' });
  }
});

app.get('/profile-img', async (req, res) => {
  const { uuid } = req.query;


  try {
    const userId = await db.getUserIdbyUuid(uuid);

    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const imageUrl = await db.getProfileURL(userId);

    if (!imageUrl) {
      return res.status(404).json({ message: 'Profile image not found' });
    }

    const imagePath = path.join(__dirname, 'assets', imageUrl);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: 'Profile image not found' });
    }

    // // set the Content-Type header to the correct MIME type
    // const contentType = mime.getType(imagePath);
    res.setHeader('Content-Type', "image/jpeg");

    // read the image file from disk and stream it to the client
    const fileStream = fs.createReadStream(imagePath);
    fileStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve profile image' });
  }
});


// Use this as reference of the object to be passed on this api
// {householdSize: '12', hasPets: 'yes', specificNeeds: 'ajsbdjhasdivawdja', paymentMethods: Array(2), paymentFrequency: 'Daily', …}

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

  // this fields must be converted to strings before being stored in the database
  const certificationsStr = JSON.stringify(certifications);
  const languagesStr = JSON.stringify(languages);

  try {
    // Check if user exists in the database
    const user = await db.getUserByUuid(uuid);
    const worker_id = user.user_id;
    if (!worker_id) {
      return res.status(401).json({ message: 'Invalid UUID' });
    } 

    // Update the user's completed_profile field to true
    await db.updateCompletedProfile(worker_id, true);

    // Store the worker's profile information
    await db.insertWorkerProfile(worker_id, availability, bio, certificationsStr, education, hourlyRate, languagesStr, skillsStr, workExperience);
    //                          (worker_id, availability, bio, certifications, education, hourlyRate, languages, skillsStr, workExperience)

    await db.insertServicesOffered(worker_id, servicesOffered);

    res.status(200).send('Worker profile created for ' + user.first_name);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating profile');
  }
});

app.get('/worker/job-listings', async (req, res) => {

  try {
    // Get available job listings
    const jobListings = await db.getJobListings();
    res.status(200).json(jobListings);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting job listings');
  }
});

app.get('/worker/:uuid', async (req, res) => {
  const { uuid } = req.params;

  try {
    // Check if user exists in the database
    const user = await db.getUserByUuid(uuid);
    const worker_id = user.user_id;
    if (!worker_id) {
      return res.status(401).json({ message: 'Invalid UUID' });
    }

    // Get the worker's profile information
    const workerProfile = await db.getWorkerByUserId(worker_id);

    // Get the services offered by the worker
    const workerServices = await db.getServiceIdsByWorkerId(worker_id);

    //Get service fields for each service offered

    const servicesOffered = [];
    for (let i = 0; i < workerServices.length; i++) {
      const service = await db.getServiceByServiceId(workerServices[i].service_id);
      servicesOffered.push(service[0]); // Assign as a json object and not as an array
    }


    // pass the services offered to the worker profile
    workerProfile.servicesOffered = servicesOffered;
    res.status(200).json(workerProfile);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting worker profile');
  }
});

app.patch('/worker/update-info/basics', async (req, res) => {
  const { uuid, bio, servicesOffered, availability } = req.body;

  try {
    // Check if user exists in the database
    const user = await db.getUserByUuid(uuid);
    const workerId = user.user_id;
    if (!workerId) {
      return res.status(401).json({ message: 'Invalid UUID' });
    }

    // set update info type to household
    const infoType = 'basics';

    // Create a variable to store all the employer information
    const workerInfo = {
      workerId,
      bio,
      availability
    };

    // Update the employer's household information
    await db.updateWorkerInfo(infoType, workerInfo);
    
    // Update the services offered by the worker
    await db.updateWorkerServices(workerId, servicesOffered);

    res.status(200).send('Worker Information updated for ' + user.first_name);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating profile');
  }
});

app.patch('/worker/update-info/experience', async (req, res) => {

  // Note that two skills fields are being passed in: skills and skillsString
  const { uuid, workExperience, hourlyRate, skills, skillsString} = req.body;

  // console.log(skills)

  try {
    // Check if user exists in the database
    const user = await db.getUserByUuid(uuid);
    const workerId = user.user_id;
    if (!workerId) {
      return res.status(401).json({ message: 'Invalid UUID' });
    }

    // set update info type to experience
    const infoType = 'experience';

    // Create a variable to store all the employer information
    const workerInfo = {
      workerId,
      workExperience,
      hourlyRate,
      skillsString
    };

    // Update the employer's household information
    await db.updateWorkerInfo(infoType, workerInfo);

    res.status(200).send('Worker Information updated for ' + user.first_name);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating profile');
  }
});

app.patch('/worker/update-info/background', async (req, res) => {
  const { uuid, education, certifications, languages } = req.body;

  const certificationsStr = JSON.stringify(certifications);
  const languagesStr = JSON.stringify(languages);

  try {
    // Check if user exists in the database
    const user = await db.getUserByUuid(uuid);
    const workerId = user.user_id;
    if (!workerId) {
      return res.status(401).json({ message: 'Invalid UUID' });
    }

    // set update info type to background
    const infoType = 'background';
    
    // Create a variable to store all the employer information
    const workerInfo = {
      workerId,
      education,
      certificationsStr,
      languagesStr
    };

    // Update the employer's household information
    await db.updateWorkerInfo(infoType, workerInfo);

    res.status(200).send('Worker Information updated for ' + user.first_name);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating profile');
  }
});

//BIG GOAL: Create an api for uploading images to the server
//https://www.youtube.com/watch?v=Rw_QeJLnCK4




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