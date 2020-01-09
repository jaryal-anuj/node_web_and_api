const { validationResult } = require('express-validator');
const CommentModel = require(process.cwd()+"/app/models").comment;
class CommentController {

    async store(req, res, next) {
        try{
            const errors = validationResult(req);
            let post_id = req.body.post_id;
            if (!errors.isEmpty()) {
                req.flash('body',req.body);
                req.flash('errors',errors.mapped());
                return res.redirect('/post/show/'+post_id);
            }
            await CommentModel.create({
                user_id:req.user.id,
                post_id:post_id,
                comment:req.body.comment
            });
            req.flash("success_msg", "Commented successfully !");
            return res.redirect('/post/show/'+post_id);

        }catch(err){
            next(err);
        }
    }

}

module.exports = new CommentController;