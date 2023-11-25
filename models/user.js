const mongoose = require('mongoose');

// noinspection JSValidateTypes
const userSchema = mongoose.Schema({
    name: {type: String, required: true },
    email: {type: String, required: true, unique: true}, //unique speeds up queries
    password: {type: String, required: true, minLength:3},
    image: {type: String, required: true},
    places: {type: String, required: true},
});


module.exports = mongoose.model('User', userSchema);