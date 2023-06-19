const express = require('express')
const { body, param } = require('express-validator')
const router = express.Router()


const brandController = require('../controllers/brand.controller')
const auth = require('../middlewares/auth.middleware')

router.post('/addBrand', auth, [
    body('name').isString().isLength({ max: 10 }).notEmpty().withMessage('Brand is required with max length of 10 characters')
], brandController.addBrand)

router.put('/updateBrand/:brandId', auth, [
    param('brandId').custom(value =>
    {
        if (!value)
        {
            throw new Error('BrandId not found.')
        }
        return value
    }),
    body('name').isString().isLength({ max: 10 }).notEmpty().withMessage('Brand is required with max length of 10 characters'),
], brandController.updateBrand)

router.delete('/deleteBrand', auth, brandController.deleteBrand)

router.get('/', auth, brandController.getBrands)

router.get('/getBrandsByCategory/:categoryName', brandController.getBrandsByCategory)

module.exports = router