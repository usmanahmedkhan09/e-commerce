const { validationResult } = require('express-validator')


const Faq = require('../models/faq.model')


exports.addFaq = async (req, res, next) =>
{
    const { errors } = validationResult(req)

    if (errors.length > 0)
    {
        let error = new Error('Validations failed')
        error.status = 422
        error.data = errors
        next(error)
    }

    const question = req.body.question
    const productId = req.body.productId

    try
    {
        let faq = new Faq({ question: question, product: productId })
        const response = await faq.save().then((faq) => faq.populate('product', { name: 1, _id: 1 }))
        if (response)
        {
            res.status(201).json({ message: 'Success', data: response, isSuccess: true })
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


exports.updateFaq = async (req, res, next) =>
{
    const { errors } = validationResult(req)

    if (errors.length > 0)
    {
        let error = new Error('Validations failed')
        error.status = 422
        error.data = errors
        next(error)
    }

    const question = req.body.question
    const answer = req.body.answer
    const productId = req.body.productId
    const faqId = req.body.faqId

    try
    {
        let faq = await Faq.findById(faqId)
        if (faq)
        {
            faq.question = question
            faq.answer = answer
            faq.productId = productId
            let response = await faq.save().then((faq) => faq.populate('product', { name: 1, _id: 1 }))
            res.status(200).json({ message: 'faq successfully updated.', data: response, isSuccess: true })
        } else
        {
            res.status(404).send({ message: 'faq not found.', data: {}, isSuccess: false })
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

exports.deleteFaq = async (req, res, next) =>
{
    const { errors } = validationResult(req)

    if (errors.length > 0)
    {
        let error = new Error('Validations failed')
        error.status = 422
        error.data = errors
        next(error)
    }

    const faqId = req.body.faqId

    try
    {
        let faq = await Faq.findById(faqId)
        if (faq)
        {
            let response = await Faq.deleteOne({ _id: faq._id })
            res.status(200).json({ message: 'faq successfully deleted.', data: response, isSuccess: true })
        } else
        {
            res.status(404).send({ message: 'faq not found.', data: {}, isSuccess: false })
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


exports.getFaqs = async (req, res, next) =>
{
    let query = null

    if (req.query.productId)
    {
        query = { product: req.query.productId }
    }

    try
    {
        let faqs = await Faq.find(query)
        res.status(200).json({ message: 'faqs found successfully.', data: faqs, isSuccess: true })
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