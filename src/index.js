const express = require('express');
const mongoose = require("mongoose")
const route = require('./routes/route.js');

const app = express();

app.use(express.json());

app.use('/', route);

mongoose.connect("mongodb+srv://sourav:project123@cluster0.hciw4.mongodb.net/OSlash")
    .then(() => console.log('mongodb Rock n Roll on 27017'))
    .catch(err => console.log(err))


app.listen(3000, function(){
    console.log('Express is running on port 3000');
})