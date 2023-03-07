const express = require('express');
const router = express.Router()
const { body, param } = require('express-validator')

const categoryController = require('../controllers/category.controller');
const auth = require('../middlewares/auth.middleware');



router.post('/addCategory', auth, [body('name').isString().isLength({ max: 20 })], categoryController.addCategory)

router.get('/', auth, categoryController.getCategories)

router.put('/updateCategory', [
    body('name').isString().isLength({ max: 20 }),
    body('categoryId').isString().custom((value) =>
    {
        if (!value)
        {
            throw new Error('categoryId is required')
        }
        return true
    })
], auth, categoryController.updateCategory)

router.delete('/deleteCategory/:categoryId', auth, [
    param('categoryId').customSanitizer(value =>
    {
        if (!value)
        {
            throw new Error('categoryId is not found.');
        }
        return value
    })
], categoryController.deleteCategory)


module.exports = router