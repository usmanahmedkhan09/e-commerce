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
    const categories = req.body.categories

    try
    {
        let brand = new Brand({ name: name, categories: categories })
        let response = await brand.save()
        await Category.updateMany({ '_id': response.categories }, { $push: { brands: response._id }, })

        if (response)
        {
            res.status(201).json({ message: 'Brand created successfully.', data: response })
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
    const categories = req.body.categories
    try
    {
        let brand = await Brand.findOne({ _id: brandId })
        if (brand)
        {
            brand.name = name
            brand.categories = categories
            let response = await brand.save()
            await Category.updateMany({ '_id': response.categories }, { $pull: { brands: response._id } })
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
        // let category = await Category.findOne({ _id: brand.category })
        if (brand)
        {
            await Category.updateMany({ '_id': brand.categories }, { $pull: { brands: brand._id } })
            // category.brands.pull(brand._id)
            // await category.save()
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
        let brands = await Brand.find().populate('categories', { name: 1, _id: 1 }).exec()
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
