const express = require('express');
const placesControllers = require('../controllers/places-controller');

const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById);
router.patch('/:pid', placesControllers.updatePlace);
router.delete('/:pid', placesControllers.deletePlace);

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.post('/', placesControllers.createPlace);




module.exports = router;