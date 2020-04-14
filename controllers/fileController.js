const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, './public/images') }, // file path where the file/image should be stored
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname) } // setting a unique filename
});

module.exports.storage = storage;