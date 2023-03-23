const { validationResult } = require('express-validator')


const Brand = require('../models/brand.model')
const Series = require('../models/series.model')
const Category = require('../models/category.model')


exports.addBrand = async (req, res, next) =>
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
    const categoryId = req.body.categoryId

    try
    {
        let brand = new Brand({
            name: name,
            category: categoryId
        })

        let response = await brand.save()
        let category = await Category.findOne({ _id: categoryId })
        category.brands.push(response._id)
        await category.save()

        if (response)
        {
            res.status(201).json({ message: 'Brand created successfully.', Brand: response })
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

exports.updateBrand = async (req, res, next) =>
{
    const { errors } = validationResult(req)

    if (errors.length > 0)
    {
        let error = new Error('Validations failed')
        error.status = 422
        error.data = errors
        next(error)
        return
    }

    const name = req.body.name
    const brandId = req.params.brandId
    const categoryId = req.body.categoryId
    try
    {
        let brand = await Brand.findOne({ _id: brandId })
        if (brand)
        {
            brand.name = name
            brand.categoryId = categoryId
            let response = await brand.save()
            res.status(200).json({ message: 'Brand updated successfully.', brand: response })
        } else
        {
            res.status(404).json({ message: 'Brand not found', brand: {} })
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

exports.deleteBrand = async (req, res, next) =>
{
    const { errors } = validationResult(req)

    if (errors.length > 0)
    {
        let error = new Error('Validations failed')
        error.status = 422
        next(error)
        return
    }

    const brandId = req.body.brandId
    try
    {
        let brand = await Brand.findOne({ _id: brandId })
        let category = await Category.findOne({ _id: brand.category })
        if (brand)
        {
            category.brands.pull(brand._id)
            await category.save()
            let response = await Brand.deleteOne({ _id: brand._id })
            await Series.deleteMany({ _id: brand._id })

            res.status(200).json({ message: 'Brand deleted successfully.', brand: response })
        } else
        {
            res.status(404).json({ message: 'Brand not found', brand: {} })
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


exports.getBrands = async (req, res, next) =>
{
    try
    {
        let brands = await Brand.find().populate('category', { name: 1, _id: 1 }).exec()
        if (brands)
        {
            res.status(200).json({ message: 'Brands found successfully.', brands: brands })
        } else
        {
            res.status(404).json({ message: 'Brands not found', brand: [] })
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
