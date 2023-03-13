const express = require('express');
const router = express.Router()
const { body, param } = require('express-validator')

const categoryController = require('../controllers/category.controller');
const auth = require('../middlewares/auth.middleware');



router.post('/addCategory', auth, [body('name').isString().isLength({ max: 20 })], categoryController.addCategory)

router.get('/', auth, categoryController.getCategories)

router.put('/updateCategory/:categoryId', [
    param('categoryId').isString().custom((value) =>
    {
        if (!value)
        {
            throw new Error('categoryId is required')
        }
        return value
    }),
    body('name').isString().isLength({ max: 20 }).notEmpty(),

], auth, categoryController.updateCategory)

router.delete('/deleteCategory', auth, [
    body('categoryId').isString().custom((value) =>
    {
        if (!value)
        {
            throw new Error('categoryId is required')
        }
        return true
    })
], categoryController.deleteCategory)


module.exports = router