const express = require('express');
const router = express.Router();
const { body } = require('express-validator')


const imagesController = require('../controllers/images.controller')
const auth = require('../middlewares/auth.middleware')

router.post('/multiple', auth, imagesController.uploadMultipleImages)

router.post('/single', auth, imagesController.uploadSingleImage)

router.delete('/removeImage', auth, [
    body('name').notEmpty().isString(),
    body('path').notEmpty().isString()
], imagesController.removeImage)


module.exports = router