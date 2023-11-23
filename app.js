const express = require('express');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users-routes');
const placesRoutes = require('./routes/places-routes');
const HttpError = require('./models/http-error');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());

app.use("/api/places",placesRoutes);
app.use("/api/users",usersRoutes);

app.use((req, res, next) => {
    next(new HttpError("Could not find this route.", 404));
});



app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || "An unknown error occurred."});
});


mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(5000);
}).then(()=> console.log("started")).catch(err => {
    console.log(err);
});