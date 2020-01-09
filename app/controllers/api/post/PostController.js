const fs = require('fs');
const PostModel = require(process.cwd()+'/app/models').post;
const UserModel = require(process.cwd()+'/app/models').user;
const PostImageModel = require(process.cwd()+'/app/models').post_image;
const CommentModel = require(process.cwd()+'/app/models').comment;
const {destination, fileName,imageFilter} = require(process.cwd()+'/app/helpers/file_upload.js');
const {NotFoundException, ForbiddenException} = require(process.cwd()+'/app/exceptions/exception.js');
const { validationResult } = require('express-validator');
const multer = require('multer');
const storage = multer.diskStorage({
    destination:destination ,
    filename: fileName
})
const upload = multer({ storage: storage, fileFilter:imageFilter,limits: { fileSize: 1000*1000*2 } }).array('files',5);

class PostController{
	async upload_files(req, res, next){
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


	async create(req, res, next){
		try{
			const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(422).json({code:"Unprocessable Entity",message:"Validation failed",errors:errors.array( {onlyFirstError: true} )});
            }
			console.log(req.body);
            let post = await PostModel.create({
                user_id:req.user.id,
                title:req.body.title,
                description:req.body.desc
            });
            if(req.body.files && req.body.files.length){
                let files = req.body.files.map((files)=>{
                    return {post_id:post.id,file:files};
                });
                await PostImageModel.bulkCreate(files);
			}
			return res.status(201).json();
		}catch(err){
			next(err)
		}
	}

	async edit(req, res, next){
		try{
			const errors = validationResult(req);
            let post_id = req.params.id;
            if (!errors.isEmpty()) {
				return res.status(422).json({code:"Unprocessable Entity",message:"Validation failed",errors:errors.array( {onlyFirstError: true} )});
            }
			let post = await PostModel.findOne({ where:{ id:post_id },include:'post_image' });

			if(!post){
				throw new NotFoundException('Post not found!');
			}
			if(req.user.id != post.user_id){
				throw new ForbiddenException('You are not authorized to edit this post');
			}


            await post.update({title:req.body.title,description:req.body.desc});

            if(req.body.files && req.body.files.length){
                let files = req.body.files.map((files)=>{
                    return {post_id:post_id,file:files};
                })
                await PostImageModel.bulkCreate(files);
            }
            return res.status(200).json(post);
		}catch(err){
			next(err);
		}
	}

	async show(req, res, next){
		try{
			let post = await PostModel.findOne({ where:{ id:req.params.id },include:'post_image' });

			if(!post){
				throw new NotFoundException('Post not found!');
			}
			return res.status(200).json(post);
		}catch(err){
			next(err);
		}
	}

	async delete(req, res, next){
		try{
			let post_id = req.params.id;
			let post = await PostModel.findOne({ where:{ id:req.params.id },include:'post_image' });
			if(!post){
				throw new NotFoundException('Post not found!');
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
			return res.status(201).json();
		}catch(err){
			next(err)
		}
	}
}
module.exports = new PostController;
