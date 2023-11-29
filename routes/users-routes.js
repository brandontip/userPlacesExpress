const express = require('express');
const usersControllers = require('../controllers/users-controller');
const {check} = require('express-validator');

const fileUpload = require('../middleware/file-upload');


const router = express.Router();

router.post('/signup',fileUpload.single('image'),check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:6}), usersControllers.signup);
//image here is key, not type

router.post('/login', usersControllers.login);

router.get('/', usersControllers.getUsers);


module.exports = router;