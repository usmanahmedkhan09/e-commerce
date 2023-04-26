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
    generalFeatures: {
        type: mongoose.Schema.Types.Mixed
    },
    display: {
        type: mongoose.Schema.Types.Mixed
    },
    memory: {
        type: mongoose.Schema.Types.Mixed
    },
    performance: {
        type: mongoose.Schema.Types.Mixed
    },
    battery: {
        type: mongoose.Schema.Types.Mixed
    },
    camera: {
        type: mongoose.Schema.Types.Mixed
    },
    connectivity: {
        type: mongoose.Schema.Types.Mixed
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })


const generalFeatures = mongoose.Schema({
    releaseDate: String,
    dimensions: String,
    simSupport: String,
    weight: String,
    operatingSystem: String
})

mongoose.model('GeneralFeatures', generalFeatures)

module.exports = mongoose.model('Product', productSchema)

