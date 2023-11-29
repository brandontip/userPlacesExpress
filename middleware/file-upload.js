const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};


const fileUpload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images'); //null for no error, 2nd arg is path
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype]; //get extension
            cb(null, crypto.randomUUID() + '.' + ext)
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype]; //double bang converts null and undefined to false
        let error = isValid ? null : new Error('Invalid mime type!');
        cb(error, isValid);
    }
});

module.exports = fileUpload;