const express = require('express');
const router = express.Router();
const db = require('../db');
const { stringifyPaymentMethods, jsonifyPaymentMethods } = require('../utils/utils');


router.patch('/update-info/household', async (req, res) => {
    const { uuid, householdSize, hasPets, specificNeeds } = req.body;

    // convert a few fields to proper data types
    const hasPetsInt = hasPets === true ? 1 : 0;

    try {
        // Check if user exists in the database
        const user = await db.getUserByUuid(uuid);
        if (!user) {
            return res.status(401).json({ message: 'Invalid UUID' });
        }

        // set update info type to household
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

router.patch('/update-info/payment', async (req, res) => {
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

router.post('/post/create', async (req, res) => {
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

router.put('/post/update', async (req, res) => {
    const { jobId, serviceId, jobTitle, jobDescription, jobStartDate, jobEndDate, jobStartTime, jobEndTime, jobType } = req.body;

    try {
        // Update the job post
        await db.updateJobPost(jobId, serviceId, jobTitle, jobDescription, jobStartDate, jobEndDate, jobStartTime, jobEndTime, jobType);
        res.status(200).send('Job post updated');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating post');
    }
});

router.delete('/post/delete/:job_id', async (req, res) => {
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

router.get('/post/get-posts', async (req, res) => {
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

router.post('/complete-profile', async (req, res) => {
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

router.get('/:uuid', async (req, res) => {
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

router.get('/search/workers', async (req, res) => {
    try {
        const workers = await db.getWorkersWithServicesOffered();
        res.status(200).json(workers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;