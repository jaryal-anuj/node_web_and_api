const PostModel = require(process.cwd()+'/app/models').post;
const UserModel = require(process.cwd()+'/app/models').user;
const PostImageModel = require(process.cwd()+'/app/models').post_image;
const CommentModel = require(process.cwd()+'/app/models').comment;
const { validationResult } = require('express-validator');
const fs = require('fs');
const {destination, fileName,imageFilter} = require(process.cwd()+'/app/helpers/file_upload.js');

const multer = require('multer');
var storage = multer.diskStorage({
    destination:destination ,
    filename: fileName
})
const upload = multer({ storage: storage, fileFilter:imageFilter,limits: { fileSize: 1000*1000*2 } }).array('files',5);

class PostController {
    async showCreatePost(req, res, next){
        try{
            res.render('post/create');
        }catch(err){
            next(err);
        }
    }

    async postFileUpload(req, res, next) {

        try{
            upload(req,res,err => {
                let error='';
                if (req.fileValidationError) {
                    return res.status(400).json({errors:req.fileValidationError});
                }
                else if (err instanceof multer.MulterError) {
                    return res.status(400).json({errors:err.message});
                }
                else if (err) {
                    return res.status(400).json({errors:err.message});
                }
                return res.status(200).json({data:req.files});
            });
        }catch(err){
            next(err);
        }
    }

    async store(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                req.flash('body',req.body);
                req.flash('errors',errors.mapped());
                return res.redirect('/post/create');
            }

            let post = await PostModel.create({
                user_id:req.user.id,
                title:req.body.title,
                description:req.body.desc
            });
            if(req.body.images && req.body.images.length){
                let files = req.body.images.map((files)=>{
                    return {post_id:post.id,file:files};
                });
                await PostImageModel.bulkCreate(files);
            }
            req.flash("success_msg", "Post created successfully !");
            res.redirect('/home');

        }catch(err){
            next(err);
        }
    }

    async show(req, res, next) {
        try{

            let post = await PostModel.findOne({ where:{ id:req.params.id },include:[ {model:CommentModel,include:[UserModel]},{model:PostImageModel,as:'post_image'} ] });

            if(!post){
                throw new Error("Not Found");
            }

            res.render('post/show',{post:post});
        }catch(err){
            next(err);
        }
    }

    async showEditForm(req, res, next) {
        try{
            let post = await PostModel.findOne({ where:{ id:req.params.id },include:'post_image' });
            if(!post){
                throw new Error("Not Found");
            }

            res.render('post/edit',{post:post});
        }catch(err){
            next(err);
        }
    }

    async update(req, res, next){
        try{
            const errors = validationResult(req);
            let post_id = req.body.post_id;
            if (!errors.isEmpty()) {
                req.flash('body',req.body);
                req.flash('errors',errors.mapped());
                return res.redirect('/post/edit/'+post_id);
            }
            let post = await PostModel.findOne({ where:{ id:post_id } });
            if(!post){
                throw new Error('Post not found!');
            }

            await post.update({title:req.body.title,description:req.body.desc});

            if(req.body.images && req.body.images.length){
                let files = req.body.images.map((files)=>{
                    return {post_id:post_id,file:files};
                })
                await PostImageModel.bulkCreate(files);
            }
            req.flash("success_msg", "Post update successfully !");
            return res.redirect('/post/edit/'+post_id);

        }catch(err){
            next(err);
        }
    }

    async delete(req, res, next){
        try{
            let post_id = req.params.id;
            let post = await PostModel.findOne({where: { id:post_id },include:'post_image' });
            if(!post){
                throw new Error('Post not found!');
            }
            let postImages = post.post_image;
            await post.destroy();
            for(let image of postImages){
				try{
					fs.unlinkSync(process.cwd()+'/public/uploads/user_'+req.user.id+'/'+image.file);
				}catch(err){
					continue;
				}
            }
            req.flash("success_msg", "Post deleted successfully !");
            res.redirect('/home');
        }catch(err){
            next(err);
        }
    }

    async postImageDelete(req, res,next){
        try{
            let id = req.body.id;
            let postImage = await PostImageModel.findOne({ where:{ id:id } });
            if(!postImage){
                throw new Error('Image not found!');
            }
            let file = postImage.file;
            await postImage.destroy();
            fs.unlinkSync(process.cwd()+'/public/uploads/user_'+req.user.id+'/'+file);
            res.status(200).json({status:true,message:"Image deleted successfully",data:{}});

        }catch(err){
            next(err);
        }
    }
}

module.exports = new PostController;
