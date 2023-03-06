const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken')


const User = require('../models/user.model.js');

const signUp = async (req, res, next) =>
{
    const { errors } = validationResult(req)
    if (errors.length > 0)
    {
        let error = new Error('Validation failed')
        error.status = 422
        error.data = errors
        throw error
    }
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    let hashPassword = await bcrypt.hash(password, 12)
    if (hashPassword)
    {
        try
        {
            let user = new User({ name: name, email: email, password: hashPassword })
            let response = await user.save()
            if (response)
            {
                res.status(201).json({ message: 'User successfully created', data: user })
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
        throw error
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
            let token = await jsonwebtoken.sign({ userId: user._id, email: user.email }, 'privateKey', { expiresIn: '2h' })
            user.token = token
            return res.status(200).json({ message: 'Successfully login', data: user })
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

module.exports = { signUp, login }