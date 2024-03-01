const Product = require("../models/products");
const CustomError = require("../utils/CustomError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");


// GET /tasks?limit=1&skip=2
// GET /tasks?sortBy=createdAt:desc
exports.handleGetAllProducts = asyncErrorHandler(async (req, res, next) => {
    // const match = {};
    const sort = {};
    let limit = parseInt(req.query.limit) || 0;
    let skip = parseInt(req.query.skip) || 0;

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    const products = await Product.find().sort(sort).skip(skip).limit(limit);

    res.status(200).send(products);
});

exports.handleGetProductById = asyncErrorHandler(async (req, res, next) => {
    // console.log(req.params);
    const product = await Product.findById(req.params.id)
    // console.log(product);
    if (!product)
        return next(new CustomError(`Product is not available`, 404));
    return res.send(product);
})


exports.handleAddProduct = asyncErrorHandler(async (req, res, next) => {
    if (req.role === 'user') {
        return res.status(403).send({ message: "You do not have permission to perform this action." });
    }
    const product = new Product(req.body);
    // console.log(product);
    await product.save();
    return res.status(201).send({ message: "Successfully added product." })
})

exports.handleProductUpdate = asyncErrorHandler(async (req, res, next) => {
    if (req.role === 'user') {
        return res.status(403).send({ message: "You do not have permission to perform this action." });
    }
    const updates = req.body;
    // console.log(updates);
    await Product.findByIdAndUpdate(req.params.id, updates);
    return res.send("updated fields successfully");
})



exports.handleProductDelete = asyncErrorHandler(async (req, res, next) => {
    if (req.role === 'user') {
        return next(new CustomError(`You do not have permission to perform this action.`, 403));
    }
    const isAvailable = await Product.findById(req.params.id);
    if (!isAvailable)
        return next(new CustomError(`Product already Deleted`, 404));
    await Product.findByIdAndDelete(req.params.id);
    res.send("product deleted successfully");
})


