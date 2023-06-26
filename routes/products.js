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
    ],
    productController.addProduct)

router.get('/', auth, productController.getProducts)
router.get('productById/:productId', auth, [
    param('productId').customSanitizer(value =>
    {
        if (!value)
        {
            throw new Error('Product id is not found.');
        }
        return value
    })
], productController.getProductById)


router.put('/update', auth,
    [
        body('name').isString().withMessage('Product name is mandotary'),
        body('price').isDecimal().withMessage('Price is required'),
        body('description').isLength({ min: 100, max: 500 }).withMessage('Product description must includes 100 to 500 characters.'),
        body('productId').isString().withMessage('Product id is required.')
    ],
    productController.updateProduct
)

router.delete('/deleteProduct', auth, [
    body('productId').custom(value =>
    {
        if (!value)
        {
            throw new Error('Product id is not found.');
        }
        return value
    })
], productController.deleteProduct)

router.get('/getBestSellingProducts', productController.getBestSellingProducts)

router.get('/getproductsByCategoryName/:categoryName', productController.getproductsByCategory)

router.get('/getLatestProduct', productController.getlatestProducts)

router.get('/getProductByName/:productName', productController.getProductByName)


module.exports = router