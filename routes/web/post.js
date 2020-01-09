const router = require('express').Router();
const PostController = require(process.cwd()+"/app/controllers/post/PostController.js");
const CommentController = require(process.cwd()+"/app/controllers/post/CommentController.js");
const { ensureAuthenticated, forwardAuthenticated } = require(process.cwd()+'/config/auth');
const { createPostValidate } = require(process.cwd()+"/app/middlewares/validation/post.js");
const { body } = require('express-validator');

router.use('/',ensureAuthenticated);
router.get('/create',PostController.showCreatePost);
router.post('/store',createPostValidate(),PostController.store);
router.post('/post_file_upload',PostController.postFileUpload);
router.get('/show/:id',PostController.show);
router.get('/edit/:id',PostController.showEditForm);
router.post('/edit',createPostValidate(),PostController.update);
router.get('/delete/:id',PostController.delete);
router.delete('/post_image_delete',PostController.postImageDelete);

router.post('/comment',[body('comment').trim().not().isEmpty().withMessage('Comment is required !')],CommentController.store);



module.exports = router;