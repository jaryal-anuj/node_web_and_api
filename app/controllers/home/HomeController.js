const PostModel = require(process.cwd()+"/app/models").post;
const Op = require('sequelize').Op;

class HomeController {

	async index(req, res, next){
		try{

			let queryData = {
				current_page:req.query.page ? req.query.page:1,
			}
			let options = {
				page: queryData.current_page, // Default 1
				paginate: 5, // Default 25
				include:'post_image',
				order: [['id', 'DESC']]
			}

			if(req.query.search){
				options.where={title:{ [Op.like]:`%${req.query.search}%` }}
			}
			const { docs, pages, total } = await PostModel.paginate(options);
			queryData.pages = pages;
			queryData.total = total;

			res.render('home/index',{user:req.user,posts:docs,query:queryData})
		}catch(err){
			next(err);
		}
	}
}

module.exports = new HomeController;
