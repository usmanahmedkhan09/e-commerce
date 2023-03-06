const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const Product = require('../models/product.model.js');


exports.addProduct = async (req, res, next) =>
{
    const file = req.file
    if (!file)
    {
        let error = new Error('Image file not found.')
        error.status = 422
        throw error
    }

    const { errors } = validationResult(req)
    if (errors.length > 0)
    {
        let error = new Error('Validations failed')
        error.status = 422
        next(error)
    }

    const productImage = file.path
    const productName = req.body.name
    const productDescription = req.body.description
    const productPrice = req.body.price

    try
    {
        let product = new Product({
            name: productName,
            description: productDescription,
            price: productPrice,
            imageUrl: productImage,
            user: req.userId,
        })
        let response = await product.save()
        res.status(201).json({ message: 'Product successfully created.', product: response })

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

exports.getProducts = async (req, res, next) =>
{
    try
    {
        let response = await Product.find({ user: req.userId }).populate('user', { name: 1, email: 1 }).exec()
        res.status(200).json({ message: 'Products successfully fetched', products: response })
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

exports.updateProduct = async (req, res, next) =>
{
    const { errors } = validationResult(req)
    if (errors.length > 0)
    {
        let error = new Error('Validations failed')
        error.status = 422
        error.data = errors
        next(error)
    }

    const file = req.file
    let updatedFile;
    if (file)
    {
        updatedFile = req.file.path
    }

    try
    {
        let product = await Product.findById(req.body.productId)
        if (product)
        {
            product.name = req.body.name
            product.description = req.body.description
            product.price = req.body.price
            if (!updatedFile)
            {
                updatedFile = product.image
            }
            product.imageUrl = updatedFile
            let response = await product.save()
            res.status(200).json({ message: 'Product updated successfully', data: response })
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

    const productId = req.params.productId
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
            unlinkImage(response.imageUrl)
            res.status(200).json({ message: 'Product deleted successfully.', product: response })
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

const unlinkImage = (imagePath) =>
{
    imagePath = path.join(__dirname, '..', imagePath)
    fs.unlink(imagePath, (err, file) =>
    {
        console.log(err)
    })
}