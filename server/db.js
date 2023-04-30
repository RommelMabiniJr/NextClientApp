const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'F4CAPSTONERS',
  database: 'app_next',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0
});

const testConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Connected to MySQL database as ID:', connection.threadId);
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

testConnection();

const checkUserExists = async (email) => {
  const query = `SELECT * FROM User WHERE email = '${email}'`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    console.log(rows);
    return rows.length > 0;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const insertUser = async (firstName, secondName, email, phone, hashedPassword, userType, city, barangay, street) => {
  const saltRounds = 10;
  const query = `INSERT INTO User (first_name, last_name, email, phone, password, user_type, city_municipality, barangay, street) VALUES ('${firstName}', '${secondName}','${email}', '${phone}', '${hashedPassword}', '${userType}', '${city}', '${barangay}', '${street}')`;
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(query);
    return result.insertId;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const getUserIdByEmail = async (email) => {
  const query = `SELECT user_id FROM User WHERE email = '${email}'`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows[0].user_id;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
  
};

const getUserByEmail = async (email) => {
  const query = `SELECT * FROM User WHERE email = '${email}'`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
  
};

const insertUuid = async (userId, uuid) => {
  const query = `INSERT INTO User_UUID (user_id, uuid) VALUES ('${userId}', '${uuid}')`;
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(query);
    return result.insertId;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const getPasswordByEmail = async (email) => {
  const query = `SELECT password FROM User WHERE email = '${email}'`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows[0].password;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const getUserById = async (userId) => {
  const query = `SELECT * FROM User WHERE user_id = '${userId}'`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const getUuidByUserId = async (userId) => {
  const query = `SELECT uuid FROM User_UUID WHERE user_id = '${userId}'`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows.length > 0 ? rows[0].uuid : null;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const getUserIdbyUuid = async (uuid) => {
  const query = `SELECT user_id FROM User_UUID WHERE uuid = '${uuid}'`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows.length > 0 ? rows[0].user_id : null;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const checkHouseholdExists = async (employerId) => {
  const query = `SELECT * FROM HouseholdEmployer WHERE employer_id = '${employerId}'`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows.length > 0;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const insertHouseholdEmployer = async (fullName, address, paymentMethod, employerId) => {
  const query = `INSERT INTO HouseholdEmployer (full_name, address, payment_method, employer_id) VALUES ('${fullName}', '${address}', '${paymentMethod}', '${employerId}')`;
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(query);
    return result.insertId;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const updateCompletedProfile = async (userId) => {
  const query = `UPDATE User SET completed_profile = 'true' WHERE user_id = '${userId}'`;
  const connection = await pool.getConnection();
  try {
    await connection.query(query);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const checkWorkerExists = async (workerId) => {
  const query = `SELECT * FROM DomesticWorker WHERE worker_id = '${workerId}'`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows.length > 0;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const inserDomesticWorker = async (full_name, profile_picture, hourly_rate, location, rating, availability, worker_id) => {
  const query = `INSERT INTO DomesticWorker (full_name, profile_picture, hourly_rate, location, rating, availability, worker_id) VALUES ('${full_name}', '${profile_picture}', '${hourly_rate}', '${location}', '${rating}', '${availability}', '${worker_id}')`;
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(query);
    return result.insertId;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

// Helper function to get the domestic worker details by user ID
const getDomesticWorkerByUserId = async (userId) => {
  const query = `SELECT * FROM DomesticWorker WHERE worker_id = '${userId}'`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

// Helper function to get the household employer details by user ID
const getHouseholdEmployerByUserId = async (userId) => {
  const query = `SELECT * FROM HouseholdEmployer WHERE employer_id = '${userId}'`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const updateHouseholdEmployer = async (employer_id, full_name, address, payment_method) => {
  const query = `UPDATE HouseholdEmployer SET full_name = '${full_name}', address = '${address}', payment_method = '${payment_method}' WHERE employer_id = '${employer_id}'`;
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(query);
    return result.affectedRows > 0; // Returns true if the row was updated
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const updateDomesticWorker = async (worker_id, full_name, profile_picture, hourly_rate, location, rating, availability) => {
  const query = `UPDATE DomesticWorker SET full_name = '${full_name}', profile_picture = '${profile_picture}', hourly_rate = '${hourly_rate}', location = '${location}', rating = '${rating}', availability = '${availability}' WHERE worker_id = '${worker_id}'`;
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(query);
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};


module.exports = {
  checkUserExists,
  insertUser,
  getUserIdByEmail,
  insertUuid,
  getPasswordByEmail,
  getUserById,
  getUuidByUserId,
  getUserIdbyUuid,
  getUserByEmail,
  checkHouseholdExists,
  insertHouseholdEmployer,
  checkWorkerExists,
  inserDomesticWorker,
  getDomesticWorkerByUserId,
  getHouseholdEmployerByUserId,
  updateHouseholdEmployer,
  updateDomesticWorker,
  updateCompletedProfile,
  pool,
};
