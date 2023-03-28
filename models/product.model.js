const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    productImages: {
        type: Array,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    description: String,
    quantity: {
        type: Number,
        require: true
    },
    model: { type: String, require: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    series: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Series'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)