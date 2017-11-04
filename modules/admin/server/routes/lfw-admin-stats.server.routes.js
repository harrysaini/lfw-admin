'use strict';
module.exports = function(app){

	var lfwStats = require('../controllers/lfw-admin-stats.server.controller');


	app.route('/api/admin/stats/propertyData').get(lfwStats.propertyStats);
	app.route('/api/admin/stats/userData').get(lfwStats.userStats);

}