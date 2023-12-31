const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require('mongoose');
const fs = require("fs");

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userId).populate('places');
    }
    catch (err) {
        return next(new HttpError("Something went wrong, could not find a place.", 500));
    }
    if(!userWithPlaces || userWithPlaces.places.length === 0){
        return next(new HttpError("Could not find a place for the provided user id.", 404));
    }
    res.json({places : userWithPlaces.places.map(place => place.toObject({getters: true}))});
}

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId).exec();
    }
    catch (err) {
        return next(new HttpError("Something went wrong, could not find a place.", 500));
    }
    if(!place){
        return next(new HttpError("Could not find a place for the provided id.", 404));
    }
    res.json({place: place.toObject({getters: true})}); //getters removes underscore from id
}

const createPlace = async (req, res, next) => {
    let errors= validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next( new HttpError("Invalid inputs passed, please check your data.", 422));
    }
    const {title, description, coordinates, address, creator} = req.body;
    const createdPlace = new Place({
        title,
        description,
        // location: coordinates,
        address,
        creator,
        image: req.file.path
    });

    let user;
    try {
        user = await User.findById(creator);
    }
    catch (err) {
        return next(new HttpError("Creating place failed, please try again.", 500));
    }
    if(!user){
        return next(new HttpError("Could not find user for provided id.", 404));
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session: sess});
        user.places.push(createdPlace);
        await user.save({session: sess});
        await sess.commitTransaction();
    }
    catch(err){
        console.log(err);
        return next(new HttpError("Creating place failed, please try again.", 500));
    }
    res.status(201).json({place: createdPlace});
    console.log("Created place!");
}

const updatePlace = async (req, res, next) => {
    let errors= validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next( new HttpError("Invalid inputs passed, please check your data.", 422));
    }
    const {title, description} = req.body;
    let place;

    try {
        place = await Place.findById(req.params.pid);
    }
    catch (err) {
        return next(new HttpError("Something went wrong, could not update place.", 500));
    }
    if(place.creator.toString() !== req.userData.userId){ //creator is an object from mongoose
        return next(new HttpError("You are not allowed to edit this place.", 401));
    }

    if(!place){
        return next(new HttpError("Could not find a place for the provided place id.", 404));
    }
    try {
        place.title = title;
        place.description = description;
        await place.save();
    }
    catch (err) {
        return next(new HttpError("Something went wrong, could not update place.", 500));
    }
    res.status(200).json({place: place.toObject({getters: true})});
}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    }
    catch (err) {
        return next(new HttpError("Something went wrong, could not delete place.", 500));
    }
    // different from update because we populated creator
    if(place.creator.id !== req.userData.userId){
        return next(new HttpError("You are not allowed to delete this place.", 401));
    }


    if(!place){
        return next(new HttpError("Could not find a place for the provided id.", 404));
    }

    const imagePath = place.image;


    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({session: sess});
        place.creator.places.pull(place); // we have full user object in place.creator because of populate
        await place.creator.save({session: sess});
        await sess.commitTransaction();
    }
    catch (err) {
        return next(new HttpError("Something went wrong, could not delete place.", 500));
    }
    fs.unlink(imagePath, err => {
        console.log(err);
    });
    res.status(200).json({message: "Deleted place."});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;