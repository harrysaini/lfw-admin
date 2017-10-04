(function () {
  'use strict';

  angular
  .module('admin.routes')
  .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });


    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    
    $stateProvider
    .state('users',{
        url : '/users',
        templateUrl : '/modules/admin/client/views/users-list.client.view.html'
      }).state('add-user',{
        url : '/users/addUser',
        templateUrl : '/modules/admin/client/views/user-add.client.view.html'
      }).state('properties',{
        url : '/properties',
        templateUrl : '/modules/admin/client/views/properties-list.client.view.html'
      }).state('verify_properties',{
        url : '/verify-properties',
        templateUrl : '/modules/admin/client/views/properties-list.client.view.html'
      }).state('verify_users',{
        url : '/verify-users',
        templateUrl : '/modules/admin/client/views/verify-users-list.client.view.html'
      }).state('add-admin',{
        url : '/add-admin',
        templateUrl : '/modules/admin/client/views/add-admin.client.view.html'
      }).state('admins_list',{
        url : '/admins',
        templateUrl : '/modules/admin/client/views/admins-list.client.view.html'
      });
  }


}());
