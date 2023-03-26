const mongoose = require('mongoose')
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    image: { type: String, require: true },
    brands: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    }]
}, { timestamps: true })

module.exports = mongoose.model('Category', categorySchema)