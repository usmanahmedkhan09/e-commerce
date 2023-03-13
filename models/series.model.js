const mongoose = require('mongoose');
const seriesSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    }
}, { timestamps: true })

module.exports = mongoose.model('Series', seriesSchema)