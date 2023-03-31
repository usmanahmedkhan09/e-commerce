const mongoose = require('mongoose');
const faqSchema = mongoose.Schema({
    question: {
        type: String,
        require: true
    },
    answer: {
        type: String,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
}, { timestamps: true })

module.exports = mongoose.model('Faq', faqSchema)