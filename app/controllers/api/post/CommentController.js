const CommentModel = require(process.cwd()+"/app/models").comment;
const PostModel = require(process.cwd()+'/app/models').post;
const {NotFoundException, ForbiddenException} = require(process.cwd()+'/app/exceptions/exception.js');
class CommentController {

    async store(req, res, next) {
        try{
			let post_id = req.params.id;
			let post = await PostModel.findOne({ where:{ id:post_id } });

			if(!post){
				throw new NotFoundException('Post not found!');
			}

			if(req.user.id == post.user_id){
				throw new ForbiddenException("You cannot comment on your own post!");
			}

            let comment = await CommentModel.create({
                user_id:req.user.id,
                post_id:post_id,
                comment:req.body.comment
            });

			res.status(200).json(comment);
        }catch(err){
            next(err);
        }
    }

}

module.exports = new CommentController;
