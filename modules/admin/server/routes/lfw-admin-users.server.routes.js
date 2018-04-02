'use strict';
module.exports = function(app){

	var lfwAdminUsers = require('../controllers/lfw-admin-users.server.controller');
	var lfwAdminAddUsers = require('../controllers/lfw-admin-addUser.server.controller');
	var lfwAdminUserCRUD = require('../controllers/lfw-admin-user-crud.server.controller');


	//get users list
	app.route('/api/admin/usersList/tenants').get(lfwAdminUsers.getTenantsList);
	app.route('/api/admin/usersList/brokers').get(lfwAdminUsers.getBrokersList);
	app.route('/api/admin/usersList/landlords').get(lfwAdminUsers.getLandlordsList);
	app.route('/api/admin/usersList/admins').get(lfwAdminUsers.getAdminsList);

	app.route('/api/admin/usersList/unverified-users').get(lfwAdminUsers.getUnverifiedUsersList);


	//add users
	app.route('/api/admin/addUser').post(lfwAdminAddUsers.addUser);


	//get csv file
	app.route('/api/admin/getCSV').get(lfwAdminUsers.getUsersCSV);


	//user crud services
	app.route('/api/admin/user/:userId/toggleAdminVerified').put(lfwAdminUserCRUD.toggleAdminVerified);
	app.route('/api/admin/user/:userId').delete(lfwAdminUserCRUD.deleteUser);
}