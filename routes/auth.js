const express = require('express');
const router = express.Router();
const { body } = require('express-validator')

const authContoller = require('../controllers/auth.controller')
const User = require('../models/user.model.js')


router.post('/signup', [
    body('email').isEmail().withMessage('Please enter a valid email').custom((value) =>
    {
        return User.findOne({ email: value }).then((user) =>
        {
            if (user)
            {
                return Promise.reject('E-mail already in use');
            }
            return true
        })
    }).normalizeEmail(),
    body('name').isLength({ min: 5, max: 20 }).trim().isAlpha().withMessage('The name must have 5 to 20 characters long'),
    body('password').isLength({ min: 8 }).trim().withMessage('The password is required and length must be 8 characters long'),
    // body('confirmPassword').isLength({ min: 8 }).trim().custom((value, { req }) =>
    // {
    //     if (value !== req.body.password)
    //     {
    //         let error = new Error('Password confirmation does not match password');
    //         error.status = 422
    //         return next(error)
    //     }
    //     return true
    // })
    // .withMessage('Confirm Password is required')

], authContoller.signUp)

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').isLength({ min: 8 }).trim().withMessage('The password is required and length must be 8 characters long'),
], authContoller.login)

router.post('/verify', authContoller.verifyToken)

module.exports = router