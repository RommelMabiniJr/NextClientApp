const boddParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
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
    credentials:true
}));

app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false
  }));  

app.use(cookieParser('mySecretKey'));
app.use(passport.initialize());
app.use(passport.session());


app.post('/register', async (req, res) => {
    // completed_profile field is not included in the req body because it is set to 'false' by default
    const { firstName, secondName, email, phone, password, user_type } = req.body;
  
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
      const userId = await db.insertUser(firstName, secondName, email, phone, hashedPassword, user_type);
  
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


app.listen(port, () => console.log(`Server started on port ${port}`));