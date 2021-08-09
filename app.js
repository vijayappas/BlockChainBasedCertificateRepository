const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const studentRoutes = require('./api/routes/students');
const detailRoutes = require('./api/routes/details');

mongoose.connect(
    'mongodb+srv://noelvignesh:' + 
    process.env.MONGO_ATLAS_PW + 
'@cluster0-v30w0.mongodb.net/test?retryWrites=true&w=majority',
    {
        useMongoClient: true
     }
    );
    mongoose.Promise = global.Promise;


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


//Routes which should handle requests
app.use('/students', studentRoutes);
app.use('/details', detailRoutes);   

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });

});

module.exports = app;