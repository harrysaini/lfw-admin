'use strict';
module.exports = function(app){

	var propertiesListController = require('../controllers/lfw-admin-properties.server.controller');


	app.route('/api/admin/properties/list').get(propertiesListController.getPropertiesList);
	app.route('/api/admin/properties/verify-list').get(propertiesListController.getUnverifiedPropertiesList);
}