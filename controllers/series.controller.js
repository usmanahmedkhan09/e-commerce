const { response } = require('express');
const { validationResult } = require('express-validator');
const Series = require('../models/series.model')


exports.addSeries = async (req, res, next) =>
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
    const brandId = req.body.brandId

    try
    {
        let series = new Series({
            name: name,
            brand: brandId
        })
        let response = await series.save()
        if (response)
        {
            res.status(201).json({ message: 'Series successfully created.', data: response })
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

exports.updateSeries = async (req, res, next) =>
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
    const brandId = req.body.brandId
    const seriesId = req.params.seriesId

    try
    {
        let series = Series.findOne({ _id: seriesId })
        if (series)
        {
            series.name = name
            series.brand = brandId
            let response = await series.save()
            if (response)
            {
                res.status(201).json({ message: 'Series successfully updated.', data: response })
            }
        } else
        {
            res.status(404).json({ message: 'Series not found.', data: response })
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

exports.deleteSeries = async (req, res, next) =>
{
    const { errors } = validationResult(req)
    if (errors.length > 0)
    {
        let error = new Error('Validations failed')
        error.status = 422
        error.data = errors
        next(error)
    }

    const seriesId = req.body.seriesId

    try
    {
        let series = await Series.findById(seriesId)
        if (series)
        {
            let response = await Series.deleteOne({ _id: series._id })
            res.status(200).json({ message: 'Series deleted successfully.', series: response })
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

exports.getSeries = async (req, res, next) =>
{
    try
    {
        let series = await Series.find()
        res.status(200).json({ message: 'Series found successfully.', series: series })
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