const { body } = require('express-validator');


const createPostValidate = ()=>{
    return [
		body('title').trim().not().isEmpty().withMessage('Title is required !'),
		body('desc').trim().not().isEmpty().withMessage("Description is required !"),
	];

}

module.exports = {createPostValidate};