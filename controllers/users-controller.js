const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");



const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Max Schwarz',
        email: 'asdf@gmail.com',
        password: 'asdf',
    }]


const getUsers = async (req, res, next) => {
    res.status(200).json({users: DUMMY_USERS});
};



const signup = async (req, res, next) => {
    let errors= validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next( new HttpError("Invalid inputs passed, please check your data.", 422));
    }
    const {name, email, password} = req.body;
    const createdUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password
    };
    DUMMY_USERS.push(createdUser);
    res.status(201).json({user: createdUser});
}

const login = async (req, res, next) => {
    //dummy code until proper login is implemented
    const {email, password} = req.body;
    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if(!identifiedUser || identifiedUser.password !== password){
        return next(new HttpError("Could not identify user, credentials seem to be wrong.", 401));
    }
    res.json({message: "Logged in!"});
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;