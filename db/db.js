const mongoose = require('mongoose');
// console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL);


const db = mongoose.connection;

db.once('open', () => {
    console.log('MongoDB connected successfully');
});