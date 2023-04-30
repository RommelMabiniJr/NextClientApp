const pool = require('./db');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
    passport.use(
        new localStrategy((email, password, done) => {
            const query = "SELECT * FROM User WHERE email = ?";
            pool.query(query, [email], async (err, result) => {
                if (err) { throw err; }
                if (result.length === 0) {
                    return done(null, false)
                }
                bcrypt.compare(password, result[0].password, (err, response) => {
                    if (err) { throw err; }
                    if (response === true) {
                        return done(null, result[0]);

                    } else {
                        return done(null, false);
                    }
                }) 
            })
        })
    )


    passport.serializeUser((user, done) => {
        done(null, user.user_id);
    })

    passport.deserializeUser((id, done) => {
        const query = "SELECT * FROM User WHERE user_id = ?";
        pool.query(query, [id], (err, result) => {
            if (err) { throw err; }
            const userInfo = {
                user_id: result[0].user_id,
                firstName: result[0].first_name,
                secondName: result[0].last_name,
                email: result[0].email,
                phone: result[0].phone,
                userType: result[0].user_type,
            }

            done(err, userInfo);
        })
    })





}