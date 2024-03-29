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
        let response = await brand.save().then((brand) => brand.populate('categories', { name: 1, _id: 1 }))
        await Category.updateMany({ '_id': response.categories }, { $push: { brands: response._id }, })

        if (response)
        {
            res.status(201).json({ message: 'Brand created successfully.', data: response, isSuccess: true })
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
            let response = await brand.save().then((brand) => brand.populate('categories', { name: 1, _id: 1 }))
            await Category.updateMany({ _id: { $nin: response.categories } }, { $pull: response._id })
            await Category.updateMany({ '_id': response.categories }, { $push: { brands: response._id } })
            res.status(200).json({ message: 'Brand updated successfully.', data: response, isSuccess: true })
        } else
        {
            res.status(404).json({ message: 'Brand not found', brand: {}, isSuccess: false })
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
        if (brand)
        {
            await Category.updateMany({ '_id': brand.categories }, { $pull: { brands: brand._id } })
            let response = await Brand.deleteOne({ _id: brand._id })
            await Series.deleteMany({ _id: brand._id })

            res.status(200).json({ message: 'Brand deleted successfully.', data: response, isSuccess: true })
        } else
        {
            res.status(404).json({ message: 'Brand not found', data: {}, isSuccess: false })
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
            res.status(200).json({ data: brands, isSuccess: true })
        } else
        {
            res.status(404).json({ message: 'Brands not found', data: [], isSuccess: false })
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

exports.getBrandsByCategory = async (req, res, next) =>
{
    console.log(req.params.categoryName)
    const categoryName = req.params.categoryName
    try
    {
        let brands = await Brand.aggregate([
            {
                $lookup:
                {
                    from: "categories",
                    localField: "categories",
                    foreignField: "_id",
                    as: "categories"
                }
            },
            {
                $match: { "categories.name": categoryName }
            },
            {
                $project: {
                    name: 1,
                },
            },
        ])
        if (brands)
        {
            res.status(200).json({ data: brands, isSuccess: true })
        } else
        {
            res.status(404).json({ message: 'Brands not found', data: [], isSuccess: false })
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