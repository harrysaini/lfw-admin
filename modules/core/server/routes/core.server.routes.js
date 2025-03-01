'use strict';

module.exports = function(app) {
  // Root routing
  var core = require('../controllers/core.server.controller');
  var common = require('../controllers/common.server.controller');




  app.route('/api/common/fetch_all').get(common.fetch_all_interest_bookmark);
  app.route('/api/common/toggleInterest').post(common.toggle_interest);



  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);



};
