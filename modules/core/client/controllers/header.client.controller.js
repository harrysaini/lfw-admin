(function() {
  'use strict';

  angular
  .module('core')
  .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', '$rootScope', '$window', 'commonService'];


  function HeaderController($scope, $state, Authentication, $rootScope, $window, commonService) {

    $scope.user = $window.user || null;
    $scope.showUsersMenu = false;


    $rootScope.setNavBarActive = function(name){
      $scope.navBarHeading = name ;
    }

    $scope.openLoginSignupPopup = function openLoginSignupPopup() {

      $rootScope.displayLoginSignupPopup();
    }

    
    

    



  }
}());
