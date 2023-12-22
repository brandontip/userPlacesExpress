const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token;
    if(req.method === 'OPTIONS'){
        return next();
    } //something the browser does to check if the server will accept a request with a token attached

    try {
        token = req.headers.authorization.split(' ')[1]; //Authorization: 'Bearer TOKEN'
        if(!token){
            throw new Error('Authentication failed!');
        }
    }
    catch (err) {
        const error = new HttpError('Authentication failed!', 403);
        return next(error);
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token,  process.env.JWT_KEY);
        req.userData = {userId: decodedToken.userId}; //can always add to req object
        next();
    }
    catch (err) {
        const error = new HttpError('Authentication failed!', 403);
        return next(error);
    }
}