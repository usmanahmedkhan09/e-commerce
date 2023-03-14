const express = require('express')
const { body, param } = require('express-validator')
const router = express.Router()


const seriesController = require('../controllers/series.controller')
const auth = require('../middlewares/auth.middleware')



router.post('/addSeries', auth, [
    body('name').isString().isLength({ max: 10 }).notEmpty().withMessage('Series is required with max length of 10 characters'),
    body('brandId').isString().notEmpty()
], seriesController.addSeries)


router.put('/updateSeries/:seriesId', auth, [
    param('seriesId').custom(value =>
    {
        if (!value)
        {
            throw new Error('seriesId not found.')
        }
        return value
    }),
    body('name').isString().isLength({ max: 10 }).notEmpty().withMessage('Series is required with max length of 10 characters'),
    body('brandId').isString().notEmpty()
], seriesController.updateSeries)

router.delete('/deleteSeries', auth, seriesController.deleteSeries)

router.get('/', auth, seriesController.getSeries)

module.exports = router