(function() {
  'use strict';

  angular
  .module('core')
  .controller('UserAddController', UserAddController);

  UserAddController.$inject = ['$scope', '$state', 'Authentication', '$rootScope'];


  function UserAddController($scope, $state, Authentication, $rootScope) {

    $rootScope.setNavBarActive('users');
    

  }
}());
