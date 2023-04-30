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
  origin: 'http://localhost:3000',
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



app.listen(port, () => console.log(`Server started on port ${port}`));