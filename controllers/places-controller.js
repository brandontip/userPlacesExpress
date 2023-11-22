const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

let DUMMY_PLACES = [{
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://www.planetware.com/photos-large/USNY/new-york-city-empire-state-building.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
        lat: 40.7484405,
        lng: -73.9878531
    },
    creator: 'u1'
}];

const getPlacesByUserId = async (req, res, next) => {
    let places = DUMMY_PLACES.filter(p => p.creator === req.params.uid);
    if(!places || places.length === 0){
        return next(new HttpError("Could not find a place for the provided user id.", 404));
    }
    res.json({places});
}

const getPlaceById = async (req, res, next) => {
    let place = DUMMY_PLACES.find(p => p.id === req.params.pid);
    if(!place){
        return next(new HttpError("Could not find a place for the provided place id.", 404));
    }
    res.json({place});
}


const createPlace = async (req, res, next) => {
    let errors= validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next( new HttpError("Invalid inputs passed, please check your data.", 422));
    }
    const {title, description, coordinates, address, creator} = req.body;
    const createdPlace = {
        id: crypto.randomUUID(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };
    DUMMY_PLACES.push(createdPlace);
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
    let place = {... DUMMY_PLACES.find(p => p.id === req.params.pid)};
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === req.params.pid);
    if(!place){
        return next(new HttpError("Could not find a place for the provided place id.", 404));
    }
    place.title = title;
    place.description = description;
    DUMMY_PLACES[placeIndex] = place;
    res.status(200).json(place);
}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    if(!DUMMY_PLACES.find(p => p.id === placeId)){
        throw new HttpError("Could not find a place for that id.", 404);
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
    res.status(200).json({message: "Deleted place."});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;