const router = require('express').Router();
const UserController = require(process.cwd()+"/app/controllers/user/UserController.js");
const { ensureAuthenticated, forwardAuthenticated } = require(process.cwd()+'/config/auth');
const multer = require('multer');
const {destination, fileName,imageFilter} = require(process.cwd()+'/app/helpers/file_upload.js');
const storage = multer.diskStorage({
    destination:destination ,
    filename: fileName
})
const upload = multer({ storage: storage, fileFilter:imageFilter,limits: { fileSize: 1000*1000*2 } })


router.use('/',ensureAuthenticated);
router.post('/upload_profile_image',upload.single('file'),UserController.uploadProfileImage);



module.exports = router;
