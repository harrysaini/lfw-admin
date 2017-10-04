'use strict';
module.exports = function(app){

	var lfwAdmin = require('../controllers/lfw-admin.server.controller');


	/* add admin */
	app.route('/api/admin/auth/add-admin').post(lfwAdmin.adminSignUp);

	
}