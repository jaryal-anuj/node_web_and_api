class NotFoundException extends Error{
	constructor(message){
		super(message)
		this.status = 404;
		this.code = "Not Found";
	}
}

class ForbiddenException extends Error{
	constructor(message){
		super(message)
		this.status= 403;
		this.code = "Forbidden"
	}
}

module.exports = {NotFoundException, ForbiddenException};
