const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken')
const nodemailer = require('nodemailer')


const User = require('../models/user.model.js');

const signUp = async (req, res, next) =>
{
    const { errors } = validationResult(req)
    if (errors.length > 0)
    {
        let error = new Error('Validation failed')
        error.status = 422
        error.data = errors
        return next(error)
    }
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const role = req.body.role

    let hashPassword = await bcrypt.hash(password, 12)
    let hashconfirmationToken = await bcrypt.hash(email, 12)
    if (hashPassword)
    {
        try
        {
            let user = new User({ name: name, email: email, password: hashPassword, role: role, confirmationToken: hashconfirmationToken })
            let response = await user.save()
            let transport = await nodemailer.createTransport({
                host: process.env.MAILTRAP_HOST,
                port: process.env.MAILTRAP_TRAP,
                auth: {
                    user: process.env.MAILTRAP_USER,
                    pass: process.env.MAILTRAP_PASS
                }
            });
            var mailOptions = {
                from: 'admin@gmail.com',
                to: `${email}`,
                subject: 'Verification of user account',
                text: 'Hey there, it’s our first message sent with Nodemailer 😉 ',
                html: `<b>Hey there! </b><br> This is our first message sent with Nodemailer<br> <a herf="http://localhost:3000/auth/verify?confirmationToken=${hashconfirmationToken}">Verify</a>`
            };
            await transport.sendMail(mailOptions, (error, info) =>
            {
                if (error)
                {
                    console.log(error);
                }
            })
            if (response)
            {
                res.status(201).json({ message: 'Check your email to activate your account.', data: user, isSuccess: true })
            }
        } catch (error)
        {
            if (!error.status)
            {
                error.status = 500
                error.data = errors
            }
            next(error)
        }
    }

}

const login = async (req, res, next) =>
{
    const { errors } = validationResult(req)
    if (errors.length > 0)
    {
        let error = new Error('Validation failed')
        error.status = 422
        error.data = errors
        return next(error)
    }
    const email = req.body.email
    const password = req.body.password
    try
    {
        let user = await User.findOne({ email: email })
        if (user)
        {
            let matchPassword = await bcrypt.compare(password, user.password)
            if (!matchPassword)
            {
                let error = new Error('Password is incorrect')
                error.status = 401
                error.data = errors
                throw error
            }
            if (!user.isActive)
            {
                let error = new Error('Please activate your account.')
                error.status = 401
                error.data = errors
                throw error
            }
            let token = await jsonwebtoken.sign({ userId: user._id, email: user.email }, 'privateKey', { expiresIn: '24h' })
            user.token = token
            return res.status(200).json({ message: 'Successfully login', data: user, isSuccess: true })
        } else
        {
            let error = new Error('User not found.')
            error.status = 400
            error.data = errors
            throw error
        }

    } catch (error)
    {
        if (!error.status)
        {
            error.status = 500
            error.data = errors
        }
        next(error)
    }

}


const verifyToken = async (req, res, next) =>
{
    const token = req.query.confirmationToken

    if (!token)
    {
        let error = new Error('Token is not present.')
        error.status = 422
        error.data = null
        throw error
    }

    try
    {
        let user = await User.findOne({ confirmationToken: token })
        if (user)
        {
            user.isActive = true
            user.confirmationToken = null
            let response = await user.save()
            res.status(200).json({ message: 'User is successfully active.', user: response })
        } else
        {
            let error = new Error('User not found.')
            error.status = 400
            next(error)
        }
    } catch (error)
    {
        if (!error.status)
        {
            error.status = 500
            error.data = error
        }
        next(error)
    }
}

module.exports = { signUp, login, verifyToken }