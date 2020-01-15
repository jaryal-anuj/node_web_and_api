const config = require(process.cwd()+'/config');

class UserController {

	async profile(req, res, next) {
		try{
			res.status(200).json(req.user);
		}catch(err){
			next(err);
		}
	}

	async uploadProfileImage(req, res, next) {
        try{
            let user = req.user;
			await user.update({profile_image:req.file.filename});
			let file = {...req.file};
			file.imageUrl = config.app.baseUrl+"/uploads/user_"+req.user.id+"/"+file.filename;
            return res.status(200).json(file)
        }catch(err){
            next(err);
        }
    }

}

module.exports = new UserController;
