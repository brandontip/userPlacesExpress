const express = require('express');
const placesControllers = require('../controllers/places-controller');
const {check} = require('express-validator');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById);

router.patch('/:pid',
    check('title').not().isEmpty(),
    check('description').isLength({min: 5}), placesControllers.updatePlace);

router.delete('/:pid', placesControllers.deletePlace);

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.post('/', fileUpload.single('image'),
    check('title').not().isEmpty(),
    check('description').isLength({min: 5}),
    check('address').not().isEmpty(),
    placesControllers.createPlace
);

module.exports = router;