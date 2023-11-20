const HttpError = require("../models/http-error");

const DUMMY_PLACES = [{
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
    let place = DUMMY_PLACES.find(p => p.creator === req.params.uid);
    if(!place){
        return next(new HttpError("Could not find a place for the provided user id.", 404));
    }
    res.json({place});
}

const getPlaceById = async (req, res, next) => {
    let place = DUMMY_PLACES.find(p => p.id === req.params.pid);
    if(!place){
        return next(new HttpError("Could not find a place for the provided place id.", 404));
    }
    res.json({place});
}

const createPlace = async (req, res, next) => {
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

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;