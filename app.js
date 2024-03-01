const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart.js');
const errorController = require('./controllers/errorController.js');
const CustomError = require('./utils/CustomError.js');
require('dotenv').config();
require('./db/db.js')




const app = express();

app.use(express.json())
app.use(cors())

app.use('/api/v1/user', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/cart', cartRouter);

app.all('*', (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on the server`);
    // err.status = 'fail';
    // err.statusCode = 404;
    const err = new CustomError(`The URL ${req.originalUrl} is not available`, 404)

    next(err);
})

app.use(errorController)

app.listen(5000, () => {
    console.log("server started at 5000");
})



process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message)
    console.log('unhandledRejection occured! Shutting down')
    process.exit(1)
})
