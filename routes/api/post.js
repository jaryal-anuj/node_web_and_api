const router = require('express').Router();
const PostController = require(process.cwd()+"/app/controllers/api/post/PostController");
const CommentController = require(process.cwd()+"/app/controllers/api/post/CommentController");
const passport = require('passport');
const { createPostValidate } = require(process.cwd()+"/app/middlewares/validation/post.js");


router.use('/',(req,res,next)=>{

	passport.authenticate('jwt', {session: false},(info,user,err)=>{
		if(err){
			err.status=401;
			err.code = "Unauthorized";
			return next(err);
		}
		if (!user) {
			throw new Error("User not found")
		}
		req.logIn(user, async (err) => {
			if (err) { return next(err); }
			next()
		});
	})(req,res,next)

});
router.post('/upload_files',PostController.upload_files);
router.post('/create',createPostValidate(),PostController.create);
router.put('/edit/:id',createPostValidate(),PostController.edit);
router.get('/show/:id', PostController.show);
router.delete('/delete/:id', PostController.delete);
router.post('/:id/comment', CommentController.store);

module.exports = router;
