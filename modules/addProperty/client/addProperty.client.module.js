(function (app) {
  'use strict';

  app.registerModule('addProperty', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('addProperty.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
