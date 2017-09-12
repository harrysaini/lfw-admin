(function(app) {
  'use strict';

  app.registerModule('details', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('details.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
