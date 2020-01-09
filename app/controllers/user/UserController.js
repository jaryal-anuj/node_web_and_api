

class UserController {

    async uploadProfileImage(req, res, next) {
        try{
            let user = req.user;
            await user.update({profile_image:req.file.filename});
            return res.status(200).json({status:true,message:"File uploaded successfully",data:req.file})
        }catch(err){
            next(err);
        }
    }
}

module.exports = new UserController;