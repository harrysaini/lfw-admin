'use strict';
module.exports = function(app){

	var lfwAdminUsers = require('../controllers/lfw-admin-users.server.controller');
	var lfwAdminAddUsers = require('../controllers/lfw-admin-addUser.server.controller');


	//get users list
	app.route('/api/admin/userslist/tenants').get(lfwAdminUsers.getTenantsList);
	app.route('/api/admin/userslist/brokers').get(lfwAdminUsers.getBrokersList);
	app.route('/api/admin/userslist/landlords').get(lfwAdminUsers.getLandlordsList);


	//add users
	app.route('/api/admin/addUser').post(lfwAdminAddUsers.addUser);


	//get csv file
	app.route('/api/admin/getCSV').get(lfwAdminUsers.getUsersCSV);
}