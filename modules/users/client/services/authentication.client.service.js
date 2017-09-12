(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('users.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$window'];

  function Authentication($window) {
    console.log("user",user,$window);
    var auth = {
      user: $window.user
    };

    return auth;
  }
}());
