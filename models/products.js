const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    price : {
        type : Number,
        required : true,
    },
    currentStock : {
        type : Number,
        required : true,
    },
    productImg : {
        type : String,
    },
})

const Product = mongoose.model('Product',productSchema);

module.exports = Product;