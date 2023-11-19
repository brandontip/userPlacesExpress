const express = require('express');

const router = express.Router();

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



router.get('/user/:uid', (req, res, next) => {
    let place = DUMMY_PLACES.find(p => p.creator === req.params.uid);
    res.json({place});
});

router.get('/:pid', (req, res, next) => {
    let place = DUMMY_PLACES.find(p => p.id === req.params.pid);
    res.json({place});
});

module.exports = router;