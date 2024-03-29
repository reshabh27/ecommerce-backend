const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
    },
    currentStock: {
        type: Number,
        required: true,
    },
    productImg: {
        type: String,
        trim: true
    },
}, {
    timestamps: true
})

productSchema.virtual('myOwners', {
    ref: 'Cart',
    localField: '_id',
    foreignField: 'productId'
})


const Product = mongoose.model('Product', productSchema);

module.exports = Product;