const authRoutes = require('./routes/auth.js')
const productRoutes = require('./routes/products')
const categoryRoutes = require('./routes/category')
const brandRoues = require('./routes/brand')
const seriesRoutes = require('./routes/series')
const imagesRoutes = require('./routes/images')
const faqRoutes = require('./routes/faq')


require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
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
// app.use(
//     (req, res, next) =>
//     {
//         if (req.files && req.files.length > 0)
//         {
//             multer({ storage: diskstorage }).array('images')
//         } else
//         {
//             multer({ storage: diskstorage }).single('image')
//             next()
//         }
//     }
// )
app.use(multer({ storage: diskstorage }).single('image'))

app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()
})


app.use('/api/images', express.static(path.join(__dirname, 'images')))
app.use('/api/auth', authRoutes)
app.use('/api/product', productRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/brand', brandRoues)
app.use('/api/series', seriesRoutes)
app.use('/api/image', imagesRoutes)
app.use('/api/faq', faqRoutes)

app.use((error, req, res, next) =>
{
    return res.status(error.status ?? 500)
        .json({ message: error.message, errorsData: error.data, isSuccess: false, status: error.status ?? 500 })
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