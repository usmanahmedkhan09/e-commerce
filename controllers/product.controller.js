const { validationResult } = require('express-validator');
const mongoose = require('mongoose')


const Product = require('../models/product.model.js');


exports.addProduct = async (req, res, next) =>
{


    const { errors } = validationResult(req)
    if (errors.length > 0)
    {
        let error = new Error('Validations failed')
        error.status = 422
        return next(error)
    }

    const productImages = req.body.productImages
    const productName = req.body.name
    const productPrice = req.body.price
    const productModel = req.body.model
    const productQuantity = req.body.quantity
    const productCategoryId = req.body.categoryId
    const brandId = req.body.brandId
    const generalFeatures = req.body.generalFeatures
    const display = req.body.display
    const memory = req.body.memory
    const performance = req.body.performance
    const battery = req.body.battery
    const camera = req.body.camera
    const connectivity = req.body.connectivity
    const discount = req.body.discount

    try
    {
        let product = new Product({
            name: productName,
            price: productPrice,
            productImages: productImages,
            quantity: productQuantity,
            category: productCategoryId,
            brand: brandId,
            model: productModel,
            user: req.userId,
            generalFeatures: generalFeatures,
            display: display,
            memory: memory,
            performance: performance,
            battery: battery,
            camera: camera,
            connectivity: connectivity,
            discount: discount

        })
        let response = await product.save()
        res.status(201).json({ message: 'Product successfully created.', data: response, isSuccess: true })

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


exports.updateProduct = async (req, res, next) =>
{
    const { errors } = validationResult(req)
    if (errors.length > 0)
    {
        let error = new Error('Validations failed')
        error.status = 422
        error.data = errors
        return next(error)
    }


    try
    {
        let product = await Product.findById(req.body.productId)
        if (product)
        {
            product.name = req.body.name
            product.price = req.body.price
            product.quantity = req.body.quantity
            product.category = req.body.categoryId
            product.brand = req.body.brandId
            product.model = req.body.model
            product.productImages = req.body.productImages
            product.generalFeatures = req.generalFeatures
            product.display = req.display
            product.memory = req.memory
            product.performance = req.performance
            product.battery = req.battery
            product.camera = req.camera
            product.connectivity = req.connectivity
            product.discount = req.discount
            let response = await product.save()
            res.status(200).json({ message: 'Product updated successfully', data: response, isSuccess: true })
        } else
        {
            let error = new Error('Product not found.')
            error.status = 404
            next(error)
        }
    } catch (error)
    {
        if (!error.status)
        {
            error.status = 500
        }
        next(error)
    }
}

exports.deleteProduct = async (req, res, next) =>
{

    const { errors } = validationResult(req)

    if (errors.length > 0)
    {
        let error = new Error('Validations failed')
        error.status = 422
        error.data = errors
        next(error)
    }

    const productId = req.body.productId
    try
    {
        let product = await Product.findById(productId)
        if (!product)
        {
            let error = new Error('Product not found.')
            error.status = 422
            error.data = errors
            throw error
        }
        let response = await Product.deleteOne({ _id: product._id })
        if (response)
        {
            res.status(200).json({ message: 'Product deleted successfully.', data: response, isSuccess: true })
        }

    } catch (error)
    {
        if (!error.status)
        {
            error.status = 500
        }
        next(error)
    }
}

exports.getProducts = async (req, res, next) =>
{
    try
    {
        let response = await Product.find()
            .populate('category', { name: 1 })
            .populate('user', { name: 1, email: 1 })
            .populate('brand', { name: 1 })
            .exec()
        res.status(200).json({ message: '', data: response, isSuccess: true })
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

exports.getProductById = async (req, res, next) =>
{
    const { errors } = validationResult(req)
    if (errors.length > 0)
    {
        let error = new Error('Validations failed')
        error.status = 422
        error.data = errors
        return next(error)
    }

    const productId = req.params.productId

    try
    {
        let response = await Product.findOne({ _id: productId })
            .select({ ...Object.keys(Product.schema.obj).reduce((acc, key) => { acc[key] = `$${key}`; return acc; }, {}), brandId: '$brand', categoryId: '$category' });
        res.status(200).json({ message: '', data: response, isSuccess: true })
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

exports.getlatestProducts = async (req, res, next) =>
{
    try
    {
        const category = req.query.category
        const brand = req.query.brand
        const price = req.query.price
        let query = null
        if (price)
        {
            query = { price: price }
        }

        let response = await Product.find(query)
            .populate('category', { name: 1 })
            .populate('user', { name: 1, email: 1 })
            .populate('brand', { name: 1 })
            .populate('series', { name: 1 })
            .exec()
        let data = response
        if (category)
            data = response.filter((x) => x.category.name.toLowerCase() == category.toLowerCase())
        if (brand)
            data = data.filter((x) => x.brand.name.toLowerCase() == brand.toLowerCase())

        res.status(200).json({ message: 'Products successfully fetched', data: data, isSuccess: true })

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

exports.getProductByName = async (req, res, next) =>
{
    try
    {
        const productName = req.params.productName
        let response = await Product.find({ name: productName })
            .populate('category', { name: 1 })
            .populate('user', { name: 1, email: 1 })
            .populate('brand', { name: 1 })
            .populate('series', { name: 1 })
            .exec()

        res.status(200).json({ message: 'Product successfully fetched', data: response, isSuccess: true })

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


exports.getproductsByCategory = async (req, res, next) =>
{
    try
    {
        let filters = {
            'category.name': req.params.categoryName
        }
        if (req.query.brand)
        {
            filters["brand.name"] = { $in: req.query.brand.split("-") }
        }
        let response = await Product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'brand'
                }
            },
            {
                $match: filters
            },
            {
                $project: { name: 1, price: 1, productImages: 1 }
            },
            {
                $sort: { "name": +req.query.sort }
            },
            {
                $skip: (+req.query.page - 1) * +req.query.count
            },
            {
                $limit: +req.query.count ?? 8
            },
            {
                $group: { _id: null, products: { $push: "$$ROOT" }, totalCount: { $sum: 1 } }
            }
        ])

        res.status(200).json({ message: '', data: response[0], isSuccess: true })
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

exports.getBestSellingProducts = async (req, res, next) =>
{
    try
    {
        let products = await Product.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $group: {
                    _id: "$category",
                    product: { $first: "$$ROOT" },
                }
            },
            {
                $project: {
                    _id: 0,
                    "product.category.brand": 0
                }
            }
        ])

        res.status(200).json({ message: '', data: products, isSuccess: true })

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