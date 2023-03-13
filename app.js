require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const multer = require('multer')
const app = express()



const diskstorage = multer.diskStorage({
    destination: function (req, file, cb) 
    {
        cb(null, 'images')
    },
    filename: function (req, file, cb) 
    {
        cb(null, Date.now().toString() + '-' + file.originalname)
    }
})

app.use(bodyParser.json())
app.use(
    multer({ storage: diskstorage }).single('image')
)
app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()
})


const authRoutes = require('./routes/auth.js')
const productRoutes = require('./routes/products')
const categoryRoutes = require('./routes/category')
const brand = require('./routes/brand')
app.use('/auth', authRoutes)
app.use('/product', productRoutes)
app.use('/category', categoryRoutes)
app.use('/brand', brand)
app.use((error, req, res, next) =>
{
    return res.status(error.status ?? 500).json({ message: error.message, errorsData: error.data })
})


mongoose.
    connect(process.env.MONGODB_URI)
    .then((response) =>
    {
        app.listen(3000, () =>
        {
            console.log('connected to', process.env.MONGODB_URI)
        })
    }).catch((error) =>
    {
        console.log(error)
    })