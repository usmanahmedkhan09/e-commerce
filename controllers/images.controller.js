const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');



exports.uploadMultipleImages = (req, res, next) =>
{
    if (!req.files)
    {
        let error = new Error('Images not found.')
        error.status = 422
        error.data = error
        return next(error)
    }

    const files = req.files.map((x) =>
    {
        return {
            fileName: x.originalname,
            path: x.path
        }
    })

    res.status(200).json({ message: 'Images uploaded successfully.', data: files })
}

exports.uploadSingleImage = (req, res, next) =>
{
    if (!req.file)
    {
        let error = new Error('Images not found.')
        error.status = 422
        error.data = error
        return next(error)
    }

    const file = {
        fileName: req.file.originalname,
        path: req.file.path
    }

    res.status(201).json({ message: 'Image uploaded successfully.', data: file, isSuccess: true })
}

exports.removeImage = (req, res, next) =>
{
    const { errors } = validationResult(req)
    if (errors.length > 0)
    {
        let error = new Error('Validations failed')
        error.status = 422
        return next(error)
    }

    const imagePath = req.file.path
    const fullPath = path.join(__dirname, '..', imagePath)

    fs.unlink(fullPath, (error, file) =>
    {
        if (error)
        {
            if (!error.status)
            {
                error.status = 500
                error.data = error
            }
            next(error)
        } else
        {
            res.status(200).json({ message: 'Image deleted successfully.', file: file })
        }
    })
}