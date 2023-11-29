const express = require('express');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users-routes');
const placesRoutes = require('./routes/places-routes');
const HttpError = require('./models/http-error');
const mongoose = require('mongoose');
const fs = require('fs');
const app = express();
const path = require('path');

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE");
    next();
});

app.use("/api/places",placesRoutes);
app.use("/api/users",usersRoutes);

app.use('/uploads/images', express.static(path.join('uploads','images')));

app.use((req, res, next) => {
    next(new HttpError("Could not find this route.", 404));
});

app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error);
    }
    //rollback image upload if error occurs
    if(req.file){
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }
    res.status(error.code || 500);
    res.json({message: error.message || "An unknown error occurred."});
});


mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(5000);
}).then(()=> console.log("started")).catch(err => {
    console.log(err);
});