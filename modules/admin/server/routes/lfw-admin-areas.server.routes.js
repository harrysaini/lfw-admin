'use strict';
module.exports = function(app){

	var lfwAdminAreas = require('../controllers/lfw-admin-areas.server.controller');


	/* add admin */
	app.route('/api/admin/areas/list').get(lfwAdminAreas.getAreasList);

	app.route('/api/admin/areas/add').post(lfwAdminAreas.addNewArea);

	app.route('/api/admin/area/:areaId/update').post(lfwAdminAreas.updateArea);

	app.route('/api/admin/area/:areaId').delete(lfwAdminAreas.deleteArea);
	
}