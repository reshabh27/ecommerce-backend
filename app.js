const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart.js')
require('dotenv').config();
require('./db/db.js')




const app = express();

app.use(express.json())
app.use(cors())

app.use('/api/v1/user',userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/cart', cartRouter);


app.listen(5000,()=> {
    console.log("server started at 5000");
})
