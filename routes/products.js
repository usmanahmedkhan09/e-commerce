const express = require('express')
const router = express.Router()
const { body, query, param } = require('express-validator')
const mongoose = require('mongoose')

const productController = require('../controllers/product.controller')
const auth = require('../middlewares/auth.middleware')


router.post('/addProduct', auth,
    [
        body('name').isString().notEmpty().withMessage('Product name is mandotary'),
        body('price').isDecimal().notEmpty(),
        body('description').notEmpty().isLength({ min: 10, max: 500 }).withMessage('Product description must includes 100 to 500 characters.'),
    ],
    productController.addProduct)

router.get('/', auth, productController.getProducts)

router.put('/update', auth,
    [
        body('name').isString().withMessage('Product name is mandotary'),
        body('price').isDecimal().withMessage('Price is required'),
        body('description').isLength({ min: 100, max: 500 }).withMessage('Product description must includes 100 to 500 characters.'),
        body('productId').isString().withMessage('Product id is required.')
    ],
    productController.updateProduct
)

router.delete('/delete/:productId', auth, [
    param('productId').customSanitizer(value =>
    {
        if (!value)
        {
            throw new Error('Product id is not found.');
        }
        return value
    })
], productController.deleteProduct)

module.exports = router