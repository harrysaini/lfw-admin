'use strict';
module.exports = function(app){

	var propertiesListController = require('../controllers/lfw-admin-properties.server.controller');
	var propertiesCRUDController = require('../controllers/lfw-admin-properties-crud.server.controller');


	app.route('/api/admin/properties/list').get(propertiesListController.getPropertiesList);
	app.route('/api/admin/properties/verify-list').get(propertiesListController.getUnverifiedPropertiesList);

	app.route('/api/admin/property/:propertyId').get(propertiesCRUDController.getProperty);
	app.route('/api/admin/property/:propertyId').delete(propertiesCRUDController.deleteProperty);
	app.route('/api/admin/property/:propertyId/toggleShowInListing').put(propertiesCRUDController.toggleShowInListing);
	app.route('/api/admin/property/:propertyId/toggleAdminVerified').put(propertiesCRUDController.toggleAdminVerified);

}