const express = require('express');
const cors = require('cors');
require('dotenv').config();
// require('./db/db.js')




const app = express();

app.use(express.json())
app.use(cors())






app.listen(5000,()=> {
    console.log("server started at 5000");
})
