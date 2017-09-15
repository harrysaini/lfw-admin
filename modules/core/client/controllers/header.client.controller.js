(function() {
  'use strict';

  angular
  .module('core')
  .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', '$rootScope', '$window', 'commonService'];


  function HeaderController($scope, $state, Authentication, $rootScope, $window, commonService) {

    $scope.user = $window.user || null;


    $rootScope.setNavBarActive = function(name){
      $scope.navBarHeading = name ;
    }

    $scope.openLoginSignupPopup = function openLoginSignupPopup() {

      $rootScope.displayLoginSignupPopup();
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
      $scope.navBarHeading  = toState.name;
    })
    

    



  }
}());
