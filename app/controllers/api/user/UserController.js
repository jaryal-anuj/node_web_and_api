
class UserController {

	async profile(req, res, next) {
		try{
			res.status(200).json({status:true,message:'request processed',data:req.user});
		}catch(err){
			next(err);
		}
	}

	async uploadProfileImage(req, res, next) {
        try{
            let user = req.user;
            await user.update({profile_image:req.file.filename});
            return res.status(200).json(req.file)
        }catch(err){
            next(err);
        }
    }

}

module.exports = new UserController;
