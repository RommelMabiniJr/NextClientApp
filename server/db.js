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
  const query = `INSERT INTO User (first_name, last_name, email, phone, password, user_type, city_municipality, barangay, street, profile_url) VALUES ('${firstName}', '${secondName}','${email}', '${phone}', '${hashedPassword}', '${userType}', '${city}', '${barangay}', '${street}', 'profile')`;
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

const createJobPost = async (userId, serviceId, jobTitle, jobDescription, jobStartDate, jobEndDate, jobStartTime, jobEndTime, jobType) => {
  const query = `INSERT INTO jobposting (employer_id, service_id, job_title, job_description, job_start_date, job_end_date, job_start_time, job_end_time, job_type) VALUES ('${userId}', '${serviceId}', '${jobTitle}', '${jobDescription}', '${jobStartDate}', '${jobEndDate}', '${jobStartTime}', '${jobEndTime}', '${jobType}')`;

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

const getJobPosts = async (employerId) => {
  const query = `SELECT * FROM jobposting WHERE employer_id = '${employerId}'`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const getUserCounts = async () => {
  const query = `SELECT user_type, COUNT(*) AS count FROM User GROUP BY user_type`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const getPostCounts = async () => {
  const query = `SELECT job_type, COUNT(*) AS count FROM jobposting GROUP BY job_type`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const getJobPostsWithServiceName = async (employerId) => {
  const query = `SELECT jobposting.*, service.service_name FROM jobposting INNER JOIN service ON jobposting.service_id = service.service_id WHERE employer_id = '${employerId}'`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows;
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

const getUserByUuid = async (uuid) => {
  const query = `SELECT * FROM User WHERE user_id IN (SELECT user_id FROM User_UUID WHERE uuid = '${uuid}')`;
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

const insertEmployerProfile = async (employerId, householdSize, hasPets, specificNeeds, paymentMethods, paymentFrequency, bio) => {
  const query = `INSERT INTO HouseholdEmployer (employer_id, household_size, has_pets, specific_needs, payment_methods, payment_frequency, bio) VALUES ('${employerId}', '${householdSize}', '${hasPets}', '${specificNeeds}', '${paymentMethods}', '${paymentFrequency}', '${bio}')`;
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

const insertWorkerProfile = async (userId, availability, bio, certifications, education, hourlyRate, languages, skillsString, workExperience) => {
  const query = `INSERT INTO DomesticWorker (worker_id, availability, bio, certifications, education, hourly_rate, languages, skills, work_experience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [userId, availability, bio, certifications, education, hourlyRate, languages, skillsString, workExperience];

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(query, values);
    return result.insertId;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const updateJobPost = async (jobId, serviceId, jobTitle, jobDescription, jobStartDate, jobEndDate, jobStartTime, jobEndTime, jobType) => {
  const query = `UPDATE JobPosting SET service_id = ?, job_title = ?, job_description = ?, job_start_date = ?, job_end_date = ?, job_start_time = ?, job_end_time = ?, job_type = ? WHERE job_id = ?`;

  const connection = await pool.getConnection();
  try {
    await connection.query(query, [serviceId, jobTitle, jobDescription, jobStartDate, jobEndDate, jobStartTime, jobEndTime, jobType, jobId]);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const updateCompletedProfile = async (userId, status) => {
  const query = `UPDATE User SET completed_profile = '${status}' WHERE user_id = '${userId}'`;
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

const uploadProfileURL = async (userId, profileURL) => {
  const query = `UPDATE User SET profile_url = '${profileURL}' WHERE user_id = '${userId}'`;
  const connection = await pool.getConnection();
  try {
    let [result] = await connection.query(query);
    return result = true;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const updateUserInfo = async (userId, email, phoneNumber) => {
  const query = `UPDATE User SET email = '${email}', phone = '${phoneNumber}' WHERE user_id = '${userId}'`;
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

const updateEmployerInfo = async (infoType, employerInfo) => {
  const { employerId, householdSize, hasPetsInt, specificNeeds, paymentMethods, paymentFrequency, bio } = employerInfo;

  let query = '';

  if (infoType == "household") {
    query = `UPDATE HouseholdEmployer SET household_size = '${householdSize}', has_pets = '${hasPetsInt}', specific_needs = '${specificNeeds}' WHERE employer_id = '${employerId}'`;
  
  } else if (infoType == "payment") {
    query = `UPDATE HouseholdEmployer SET payment_methods = '${paymentMethods}', payment_frequency = '${paymentFrequency}' WHERE employer_id = '${employerId}'`;
  
  } else if (infoType == "bio") {
    query = `UPDATE HouseholdEmployer SET bio = '${bio}' WHERE employer_id = '${employerId}'`;

  } else {
    console.error("Invalid infoType");
    throw "Invalid infoType";
  }

  const connection = await pool.getConnection();

  try {
    await connection.query(query);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateWorkerInfo = async (infoType, workerInfo) => {
  const { workerId, availability, bio, certificationsStr, education, hourlyRate, languagesStr, skillsString, workExperience } = workerInfo;

  let query = '';
  let values = [];

  if (infoType == "basics") {
    // use question marks for values to prevent SQL injection
    query = `UPDATE DomesticWorker SET availability = ?, bio = ? WHERE worker_id = ?`;
    values = [availability, bio, workerId];

  } else if (infoType == "experience") {
    query = `UPDATE DomesticWorker SET hourly_rate = ?, skills = ?, work_experience = ? WHERE worker_id = ?`;
    values = [hourlyRate, skillsString, workExperience, workerId];

  } else if (infoType == "background") {
    query = `UPDATE DomesticWorker SET certifications = ?, education = ?, languages = ? WHERE worker_id = ?`;
    values = [certificationsStr, education, languagesStr , workerId];

  } else {
    console.error("Invalid infoType");
    throw "Invalid infoType";
  }

  const connection = await pool.getConnection();

  try {
    await connection.query(query, values);
  } catch (err) {
    console.error(err);
    throw err;
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
const getWorkerByUserId = async (userId) => {
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
const getEmployerByUserId = async (userId) => {
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

const getEmployerByUUID = async (uuid) => {
  const query = `SELECT * FROM HouseholdEmployer WHERE employer_id = (SELECT user_id FROM User_UUID WHERE uuid = '${uuid}')`;
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

const deleteJobPost = async (jobId) => {
  const query = `DELETE FROM JobPosting WHERE job_id = '${jobId}'`;
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(query);
    return result.affectedRows > 0; // Returns true if the row was deleted
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const insertServicesOffered = async (worker_id, servicesOffered) => {
  const connection = await pool.getConnection();

  try {
    for ( const service of servicesOffered) {
      const serviceId = service.id || service.service_id;
      const query = `INSERT INTO WorkerService (worker_id, service_id) VALUES (?, ?)`;
      await connection.query(query, [worker_id, serviceId]);
    }
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const getServiceIdsByWorkerId = async (worker_id) => {
  const query = `SELECT * FROM WorkerService WHERE worker_id = '${worker_id}'`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const getServiceByServiceId = async (service_id) => {
  const query = `SELECT * FROM Service WHERE service_id = '${service_id}'`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const getServiceNamesByWorkerId = async (worker_id) => {
  const query = `SELECT service.service_id, service.service_name FROM service INNER JOIN workerservice ON service.service_id = workerservice.service_id WHERE workerservice.worker_id = ?;`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query, [worker_id]);
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};


const updateWorkerServices = async (worker_id, servicesOffered) => {
  const connection = await pool.getConnection();

  try {
    const query = `DELETE FROM WorkerService WHERE worker_id = '${worker_id}'`;
    const [result] = await connection.query(query);
    console.log(result);
    
    await insertServicesOffered(worker_id, servicesOffered);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const getWorkersWithServicesOffered = async () => {
  // COMPLEX QUERY: this query returns a list of workers with their services offered in a JSON array
  const query = `SELECT 
                  d.worker_id,
                  d.hourly_rate,
                  d.rating,
                  d.availability,
                  d.bio,
                  d.work_experience,
                  d.languages,
                  d.certifications,
                  d.skills,
                  d.education,
                  d.is_verified,
                  u.first_name,
                  u.last_name,
                  u.email,
                  u.phone,
                  u.city_municipality,
                  u.barangay,
                  u.street,
                  JSON_ARRAYAGG(
                    JSON_OBJECT(
                      'service_id', s.service_id,
                      'service_name', s.service_name
                    )
                  ) AS services
                FROM DomesticWorker d
                JOIN WorkerService ws ON d.worker_id = ws.worker_id
                JOIN Service s ON ws.service_id = s.service_id
                JOIN User u ON d.worker_id = u.user_id
                GROUP BY d.worker_id;`;

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const getJobListings = async () => {
  const query = `SELECT
                  j.job_id,
                  j.employer_id,
                  j.service_id,
                  j.job_title,
                  j.job_description,
                  j.job_type,
                  j.job_status,
                  j.job_start_date,
                  j.job_end_date,
                  j.job_start_time,
                  j.job_end_time,
                  j.job_posting_date,
                  u.first_name,
                  u.last_name,
                  u.email,
                  u.phone,
                  u.city_municipality,
                  u.barangay,
                  u.street,
                  JSON_ARRAYAGG(
                    JSON_OBJECT(
                      'service_id', s.service_id,
                      'service_name', s.service_name
                    )
                  ) AS services
                    FROM JobPosting j
                    JOIN Service s ON j.service_id = s.service_id
                    JOIN User u ON j.employer_id = u.user_id
                    GROUP BY j.job_id, j.employer_id;`;

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query);
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

// This is how it's called const imageUrl = await db.getProfileURL(userId);
const getProfileURL = async (userId) => {
  const query = `SELECT profile_url FROM User WHERE user_id = ?`;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(query, [userId]);
    console.log(rows[0].profile_url)
    return rows[0].profile_url;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

module.exports = {
  updateWorkerServices,
  checkUserExists,
  insertUser,
  getUserIdByEmail,
  getUserByUuid,
  insertUuid,
  createJobPost,
  getPasswordByEmail,
  getUserById,
  getUuidByUserId,
  getUserIdbyUuid,
  getUserByEmail,
  checkHouseholdExists,
  insertEmployerProfile,
  insertWorkerProfile,
  checkWorkerExists,
  inserDomesticWorker,
  getWorkerByUserId,
  getEmployerByUserId,
  getEmployerByUUID,
  getUserCounts,
  getPostCounts,
  getJobPosts,
  getJobPostsWithServiceName,
  updateUserInfo,
  updateJobPost,
  updateHouseholdEmployer,
  updateDomesticWorker,
  updateCompletedProfile,
  updateEmployerInfo,
  updateWorkerInfo,
  uploadProfileURL,
  deleteJobPost,
  insertServicesOffered,
  getServiceIdsByWorkerId,
  getServiceByServiceId,
  getServiceNamesByWorkerId,
  getWorkersWithServicesOffered,
  getJobListings,
  getProfileURL,
  pool,
};
