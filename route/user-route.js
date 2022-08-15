const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator');
let user = require('../models/user');
const config = require('../config');


const route = express.Router();

function comparePassword(password, hashPassword, flagCallback) {
    bcrypt.compare(password, hashPassword, (err, isMatch) => {
        if (err) {
            console.log(err);
        }
        return flagCallback(isMatch);
    })
}



route.post("/register", [
    body('Email', 'Enter a valid email').isEmail(),
    body('Password', 'password must be 8 characters including one uppercase letter, one special character and alphanumeric characters.').matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'),
    body('FirstName', 'FirstName required').isLength({ min: 1 }),
    body('LastName', 'LastName required').isLength({ min: 1 }),
    body('Role', 'Please Provide a Role').isLength({ min: 1 })
], async (req, res) => {
    try {
        //If there are errors return Bad request and return the errors 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ status: 'errors', errors: errors.array() });
        }
        let Obj = req.body;

        let data = await user.findOne({ Email: Obj.Email });
        if (data != null) {
            return res.json({ status: 'error', error: 'email already taken!' })
        }
        const hashPassword = await bcrypt.hash(Obj.Password, 10);
        data = await user.create({
            Email: Obj.Email,
            FirstName: Obj.FirstName,
            LastName: Obj.LastName,
            Password: hashPassword,
            Role: Obj.Role
        })
        return res.json({ status: 'ok' })
    }
    catch (error) {
        console.log(error.message);
        return res.json({ status: 'error', error: "Internal Server Error!" });
    }
})

route.post('/login', (req, res) => {
    user.findOne({ Email: req.body.Email }, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            if (!data) {
                return res.json({ status: 'error', error: 'invalid email/password' })
            }
            comparePassword(req.body.Password, data.Password, (flag) => {
                if (flag) {
                    const token = jwt.sign({
                        id: data._id,
                        email: data.Email,
                        role: data.Role
                    }, config.TOKEN_SECRET)
                    return res.json({ status: 'ok', data: token })
                }
                else {
                    return res.json({ status: 'error', error: 'invalid email/password' });
                }
            });

        }
    })
})
route.post('/changePassword', (req, res) => {
    const { Password, token } = req.body
    try {
        const Obj = jwt.verify(token, config.TOKEN_SECRET)
        const _id = Obj.id;
        user.findById(_id, (err, data) => {
            if (err) {
                console.log(err);
            }
            if (data) {
                const flag = comparePassword(Password, data.Password);
                if (flag) {
                    // const hashPassword=bcrypt.hash(Password);
                    // user.updateOne({_id}),{
                    // $set:{password:hashPassword}
                    // }
                }
                else {
                    res.json({ status: 'error', error: 'invalid password' });
                }
            }
        })

    }
    catch (error) {
        return res.json({ status: 'error', error: "invalid token" })
    }
})
route.post('/loggedUser', (req, res) => {
    try {
        const Obj = jwt.verify(req.body.token, config.TOKEN_SECRET)
        const _id = Obj.id;
        user.findById(_id, (err, data) => {
            if (err) {
                console.log(err);
            }
            if (data) {
                return res.json({ status: 'ok', data: data })

            }
        });
    }
    catch (err) {
        return res.json({ status: 'error', error: "invalid token" })
    }
})

route.post('/addDescription', (req, res) => {
    user.findByIdAndUpdate(req.body.id, { Description: req.body.description }, (err, data) => {
        if (err) {
            console.log(err);
        }
    })
})
route.post('/addCategory', (req, res) => {
    user.findByIdAndUpdate(req.body.id, { Category: req.body.category }, (err, data) => {
        if (err) {
            console.log(err);
        }
    })
})

route.post('/addEducation', (req, res) => {
    user.findByIdAndUpdate(req.body.id, {
        CollegeCountry: req.body.collegeCountry,
        CollegeName: req.body.collegeName,
        Degree: req.body.degree,
        Branch: req.body.branch,
        YearOfGraduation: req.body.yearOfGraduation
    }, (err, data) => {
        if (err) {
            console.log(err);
        }
    })
})

route.post('/addCertificate', (req, res) => {
    user.findByIdAndUpdate(req.body.id, {
        Certificate: req.body.certificate,
        CertificateFrom: req.body.certificateFrom,
        YearOfCertificate: req.body.yearOfCertificate
    }, (err, data) => {
        if (err) {
            console.log(err);
        }
    })
})

route.post('/addProfileImg', (req, res) => {
    user.findByIdAndUpdate(req.body.id, {
        profileImg: req.body.fileName
    }, (err, data) => {
        if (err) {
            console.log(err);
        }
    })
})

route.get('/getUser/:id', (req, res) => {
    user.findById(req.params.id, (err, data) => {
        if (err) {
            return res.json({ status: 'error' });
        }
        else {
            return res.json({ status: 'ok', data: data });
        }
    })
})

module.exports = route;