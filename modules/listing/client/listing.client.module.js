(function (app) {
  'use strict';

  app.registerModule('listing', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('listing.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
