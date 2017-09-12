'use strict';
var details = require('../controllers/details.server.controller');
var addPolicy = require('../policies/details.server.policy');
module.exports = function(app) {


  app.route('/api/details/fetchhouse').get(details.fetch_house);
  app.route('/api/common/fetchsimilar').get(details.fetchsimilar_properties);



}
