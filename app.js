const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart.js');
const errorController = require('./controllers/errorController.js');
const CustomError = require('./utils/CustomError.js');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');


require('dotenv').config();
require('./db/db.js')

const app = express();



process.on('uncaughtException', (err) => {
    console.log(err.name, err.message)
    console.log('uncaughtException occured!............ Shutting down')
    server.close(() => {
        process.exit(1);
    })
})

// it will add some more security headers
app.use(helmet());


// rate limiting will prevent brute force attack and denial of service attack
let limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: `we have recevied too many request in last hour from your ip.Please try after an hour.`
});

app.use('/api', limiter)


// by specifying amount of data we are getting from req body. it will prevent denial of service attack
// if body has more than 10kb of data then it will truncate to 10kb then run
app.use(express.json({ limit: '10kb' }))
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





const server = app.listen(5000, () => {
    console.log("server started at 5000");
})



process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message)
    console.log('unhandledRejection occured! Shutting down')
    server.close(() => {
        process.exit(1);
    })
})
