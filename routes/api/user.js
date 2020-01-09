const router = require('express').Router();
const UserController = require(process.cwd()+"/app/controllers/api/user/UserController");
const passport = require('passport');

const multer = require('multer');
const {destination, fileName,imageFilter} = require(process.cwd()+'/app/helpers/file_upload.js');
const storage = multer.diskStorage({
    destination:destination ,
    filename: fileName
})
const upload = multer({ storage: storage, fileFilter:imageFilter,limits: { fileSize: 1000*1000*2 } })


router.use('/',passport.authenticate('jwt', {session: false}));
//router.get('/profile',UserController.profile);
router.post('/upload_profile_image',upload.single('file'),UserController.uploadProfileImage);

module.exports = router;
