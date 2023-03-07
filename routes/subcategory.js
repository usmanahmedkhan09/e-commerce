const express = require('express')
const { body } = require('express-validator')
const router = express.Router()


const subcategoryController = require('../controllers/subcategory.controller')
const auth = require('../middlewares/auth.middleware')

router.post('/add', auth, [
    body('name').isString().isLength({ max: 10 }).withMessage('Subcategory is required with max length of 10 characters')
], subcategoryController.addSubcategory)

module.exports = router