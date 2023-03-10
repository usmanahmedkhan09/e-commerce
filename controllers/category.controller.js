const { validationResult } = require('express-validator')
const Category = require('../models/category.model')
const Brand = require('../models/brand.model')


exports.addCategory = async (req, res, next) =>
{
    const { errors } = validationResult(req)
    if (errors.length > 0)
    {
        let error = new Error('Validations failed')
        error.status = 422
        error.data = errors
        next(error)
    }

    const name = req.body.name

    try
    {
        let category = new Category({ name: name })
        let response = await category.save()
        if (response)
        {
            res.status(201).json({ message: 'Category succssfully created.', category: response })
        }
    } catch (error)
    {
        if (!error.status)
        {
            error.status = 500
            error.data = errors
        }
        next(error)
    }
}

exports.updateCategory = async (req, res, next) =>
{
    const { errors } = validationResult(req)
    if (errors.length > 0)
    {
        let error = new Error('Validations failed')
        error.status = 422
        error.data = errors
        next(error)
    }

    const name = req.body.name
    const categoryId = req.params.categoryId

    try
    {
        let category = await Category.findById(categoryId)
        if (category)
        {
            category.name = name
            let response = await category.save()
            res.status(200).json({ message: 'Category successfully updated.', category: response })
        } else
        {
            res.status(404).send({ message: 'Category not found.', category: {} })
        }
    } catch (error)
    {
        if (!error.status)
        {
            error.status = 500
            error.data = errors
        }
        next(error)
    }
}

exports.deleteCategory = async (req, res, next) =>
{
    const { errors } = validationResult(req)
    if (errors.length > 0)
    {
        let error = new Error('Validations failed')
        error.status = 422
        error.data = errors
        next(error)
    }
    const categoryId = req.body.categoryId
    try
    {
        let category = await Category.findById(categoryId)
        if (category)
        {
            let response = await Category.deleteOne({ _id: category._id })
            await Brand.deleteMany({ category: categoryId })
            res.status(200).json({ message: 'Category deleted successfully.', category: response })
        }
    } catch (error)
    {
        if (!error.status)
        {
            error.status = 500
            error.data = error
        }
        next(error)
    }
}

exports.getCategories = async (req, res, next) =>
{
    try
    {
        let categories = await Category.find()
        res.status(200).json({ message: 'Categories found successfully.', categories: categories })
    } catch (error)
    {
        if (!error.status)
        {
            error.status = 500
            error.data = error
        }
        next(error)
    }
}