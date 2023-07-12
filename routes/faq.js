const express = require('express')
const { body, param } = require('express-validator')
const router = express.Router()


const faqController = require('../controllers/faq.controller')
const auth = require('../middlewares/auth.middleware');


router.post('/addFaq', [body('question').notEmpty().isString(), body('productId').notEmpty().isString()], faqController.addFaq)

router.put('/update', [
    body('question').notEmpty().isString(),
    body('answer').notEmpty().isString(),
    body('productId').notEmpty().isString(),
    body('faqId').notEmpty().isString(),
], faqController.updateFaq)

router.delete('/deleteFaq', auth, [
    body('faqId').notEmpty().isString(),
], faqController.deleteFaq)

router.get('/get/:productId', faqController.getFaqs)

module.exports = router