'use strict';

/**
 * Module dependencies
 */

var listing = require('../controllers/listing.server.controller');

module.exports = function (app) {
  
  // listing search routes
  app.route('/api/listing/search').post(listing.search)
  app.route('/api/listing/fetchhouses').get(listing.fetch_houses);
  app.route('/api/listing/coordinateSearch').post(listing.coordinate_search);
  app.route('/api/listing/groupedCordinateSearch').post(listing.grouped_coordinate_search);
  app.route('/api/listing/groupedSearch').post(listing.group_search_location);


};
