const { validationResult } = require('express-validator')


const Subcategory = require('../models/subcategory.model')


exports.addSubcategory = async (req, res, next) =>
{

    const { errors } = validationResult(req)

    if (errors.length > 0)
    {
        let error = new Error('Validations failed')
        error.status = 422
        next(error)
    }

    const name = req.body.name
    const categoryId = req.body.categoryId

    try
    {
        let subcategory = new Subcategory({
            name: name,
            category: categoryId
        })

        let response = await subcategory.save()
        if (response)
        {
            res.status(201).json({ message: 'Subcategory created successfully.', subcategory: subcategory })
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

exports.getSubcategories = async (req, res, next) =>
{
    try
    {
        let subcategories = await Subcategory.find().populate('category', { name: 1, _id: 1 }).exec()
        if (subcategories)
        {
            res.status(200).json({ message: 'Subcategories found successfully.', subcategories: subcategories })
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
