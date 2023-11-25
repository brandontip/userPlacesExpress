const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");


const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password'); //exclude password
    }
    catch (err) {
        return next(new HttpError("Fetching users failed, please try again later.", 500));
    }
    res.json({users: users.map(user => user.toObject({getters: true}))});
};

const signup = async (req, res, next) => {
    let errors= validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next( new HttpError("Invalid inputs passed, please check your data.", 422));
    }
    const {name, email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    }
    catch (err) {
        return next(new HttpError("Signing up failed, please try again later.", 500));
    }
    if(existingUser){
        return next(new HttpError("User exists already, please login instead.", 422));
    }
    const createdUser = new User({
        name,
        email,
        image: "https://www.planetware.com/photos-large/USNY/new-york-city-empire-state-building.jpg",
        password, //todo: hash password
        places: []
    });

    try{
        await createdUser.save();
    }
    catch(err){
        console.log(err);
        return next(new HttpError("Signup failed, please try again.", 500));
    }
    res.status(201).json({user: createdUser.toObject({getters: true})});
    console.log("Created user!");
}

const login = async (req, res, next) => {
    //dummy code until proper login is implemented
    const {email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    }
    catch (err) {
        return next(new HttpError("Login failed, please try again.", 500));
    }
    if(!existingUser || existingUser.password !== password){
        return next(new HttpError("Could not identify user, credentials seem to be wrong.", 401));
    }
    res.json({message: "Logged in!"});
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;