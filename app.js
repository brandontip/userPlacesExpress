const express = require('express');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users-routes');
const placesRoutes = require('./routes/places-routes');

const app = express();

app.use("/api/places/",placesRoutes);
// app.use(usersRoutes);



app.listen(5000);