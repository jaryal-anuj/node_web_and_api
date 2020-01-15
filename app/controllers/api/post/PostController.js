const fs = require('fs');
const PostModel = require(process.cwd()+'/app/models').post;
const UserModel = require(process.cwd()+'/app/models').user;
const PostImageModel = require(process.cwd()+'/app/models').post_image;
const CommentModel = require(process.cwd()+'/app/models').comment;
const {destination, fileName,imageFilter} = require(process.cwd()+'/app/helpers/file_upload.js');
const {NotFoundException, ForbiddenException} = require(process.cwd()+'/app/exceptions/exception.js');
const { validationResult } = require('express-validator');
const Op = require('sequelize').Op;
const multer = require('multer');
const storage = multer.diskStorage({
    destination:destination ,
    filename: fileName
})
const upload = multer({ storage: storage, fileFilter:imageFilter,limits: { fileSize: 1000*1000*2 } }).array('files',5);
const config = require(process.cwd()+'/config');

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
			await post.reload();

			if(post.post_image.length){
				let postImage = post.post_image.map(doc=>{
					doc.dataValues.fileUrl = config.app.baseUrl+"/uploads/user_"+post.user_id+"/"+doc.file;
					return doc;
				});
				post.dataValues.post_image = postImage;
			}
			console.log(post);
            return res.status(200).json(post);
		}catch(err){
			next(err);
		}
	}

	async show(req, res, next){
		try{
			let post = await PostModel.findOne({ where:{ id:req.params.id },include:[ {model:CommentModel,include:[UserModel]},{model:PostImageModel,as:'post_image'} ] });

			if(!post){
				throw new NotFoundException('Post not found!');
			}
			if(post.post_image.length){
				let postImage = post.post_image.map(doc=>{
					doc.dataValues.fileUrl = config.app.baseUrl+"/uploads/user_"+post.user_id+"/"+doc.file;
					return doc;
				});
				// postImage.push(...postImage);
				// postImage.push(...postImage);
				post.dataValues.post_image = postImage;
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
			return res.status(204).json();
		}catch(err){
			next(err)
		}
	}

	async deletPostImage(req, res, next){
		try{
			let post_id = req.params.postId;
			let file_id = req.params.fileId;
			let postImage = await PostImageModel.findOne({ where:{ id:file_id,post_id:post_id } });
			if(!postImage){
				throw new NotFoundException('Post Image not found!');
			}
			let file_path = process.cwd()+'/public/uploads/user_'+req.user.id+'/'+postImage.file;
			fs.exists(file_path,(exists)=>{
				if(exists){
					fs.unlinkSync(file_path);
				}
			})
			await postImage.destroy();
			return res.status(204).json();

		}catch(err){
			next(err);
		}
	}

	async user(req, res, next){
		try{
			let user_id = req.user.id;
			let queryData = {
				current_page:req.query.page ? req.query.page:1,
			}

			let options = {
				page: queryData.current_page,
				paginate: 5,
				include:['post_image','user'],
				order: [['id', 'DESC']],
				where:{ user_id:user_id }
			}
			let search = '';
			if(req.query.search){
				options.where={title:{ [Op.like]:`%${req.query.search}%` }};
				search = "?search="+req.query.search;
			}

			const { docs, pages, total } = await PostModel.paginate(options);

			let links={};
			if(parseInt(queryData.current_page)<=pages){
				if(queryData.current_page != 1){
					links.prev_link = req.appUrl+'/'+req.baseUrl+"/?page="+(parseInt(queryData.current_page)-1)+search;
				}
				if(pages !=parseInt(queryData.current_page)) {
					links.next_link = req.appUrl+'/'+req.baseUrl+"/?page="+(parseInt(queryData.current_page)+1)+search;
				}
			}

			//let docs = await PostModel.findAll({ where:{ user_id:user_id }, include:'post_image' });
			if(!docs.length){
				throw new NotFoundException('No post found for user');
			}

			let postImage = docs.map(doc=>doc.post_image.map(dpi=>{
				dpi.file = config.app.baseUrl+"/uploads/user_"+docs[0].user_id+"/"+dpi.file;
				return dpi;
			}));
			docs.post_image = postImage;
			return res.status(200).json({data:docs,metadata:{current_page:queryData.current_page,pages:pages, total_results:total,links:links} });

		}catch(err){
			next(err);
		}
	}

	async all(req, res, next){

		try{

			let queryData = {
				current_page:req.query.page ? req.query.page:1,
			}

			let options = {
				page: queryData.current_page,
				paginate: 5,
				include:['post_image','user'],
				order: [['id', 'DESC']]
			}
			let search = '';
			if(req.query.search){
				options.where={title:{ [Op.like]:`%${req.query.search}%` }}
				search = "?search="+req.query.search;
			}

			const { docs, pages, total } = await PostModel.paginate(options);

			if(!docs.length){
				throw new NotFoundException('No post found for user');
			}

			let links={};
			if(parseInt(queryData.current_page)<=pages){
				if(queryData.current_page != 1){
					links.prev_link = req.appUrl+req.baseUrl+"/?page="+(parseInt(queryData.current_page)-1)+search;
				}
				if(pages !=parseInt(queryData.current_page)) {
					links.next_link = req.appUrl+req.baseUrl+"/?page="+(parseInt(queryData.current_page)+1)+search;
				}
				links.self_link = req.appUrl+req.baseUrl+"/?page="+(parseInt(queryData.current_page))+search;
			}
			//let posts = await PostModel.findAll({include:'post_image' });
			//console.log(posts);


			let postImage = docs.map(doc=>doc.post_image.map(dpi=>{
				dpi.file = config.app.baseUrl+"/uploads/user_"+docs[0].user_id+"/"+dpi.file;
				return dpi;
			}));
			docs.post_image = postImage;
			return res.status(200).json({data:docs,metadata:{current_page:queryData.current_page,pages:pages, total_results:total,links:links}});

		}catch(err){
			next(err);
		}
	}
}
module.exports = new PostController;
