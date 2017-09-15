'use strict';
module.exports = function(app){

	var lfwAdminUsers = require('../controllers/lfw-admin-users.server.controller');

	app.route('/api/admin/userslist/tenants').get(lfwAdminUsers.getTenantsList);
	app.route('/api/admin/userslist/brokers').get(lfwAdminUsers.getBrokersList);
	app.route('/api/admin/userslist/landlords').get(lfwAdminUsers.getLandlordsList);
}