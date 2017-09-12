'use strict';
module.exports = function(app){

	var property = require('../controllers/addProperty.server.controller');
	var addPolicy = require('../policies/addProperty.server.policy');


	//Define post property route
	app.route('/api/addProperty/post').post(property.addProperty);
	app.route('/api/addProperty/upload-images').post(property.uploadPhotos);
}