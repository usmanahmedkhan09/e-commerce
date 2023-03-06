const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const authRoutes = require('./routes/auth.js')
app.use('/auth', authRoutes)

const MONGODB_URI = 'mongodb+srv://usmanahmed:usman123@node-practice.ivqzeor.mongodb.net/e-commerce'


app.use((error, req, res, next) =>
{
    return res.status(error.status ?? 500).json({ message: error.message, errorsData: error.data })
})


mongoose.
    connect(MONGODB_URI)
    .then((response) =>
    {
        console.log('connected')
        app.listen(3000)
    })