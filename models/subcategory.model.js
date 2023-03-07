const mongoose = require('mongoose');
const subcategorySchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
}, { timestamps: true })

module.exports = mongoose.model('Subcategory', subcategorySchema)