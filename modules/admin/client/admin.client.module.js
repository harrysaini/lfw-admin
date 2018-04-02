(function (app) {
  'use strict';

  app.registerModule('admin', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('admin.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
