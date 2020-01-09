const fs = require('fs');
const path = require('path');

module.exports.destination = (req, file, cb)=>{

    const dir = 'public/uploads/user_'+req.user.id;
    let stat = null;
    try {
        stat = fs.statSync(dir);
    }
    catch (err) {
        fs.mkdirSync(dir);
    }
    if (stat && !stat.isDirectory()) {
        throw new Error('Directory cannot be created');
    }

    cb(null, dir);
}

module.exports.fileName = (req, file, cb)=>{
    cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname));
}

module.exports.imageFilter = function(req, file, cb) {

    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
