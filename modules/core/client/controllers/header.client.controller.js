(function() {
  'use strict';

  angular
  .module('core')
  .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', '$rootScope', '$window', 'commonService'];


  function HeaderController($scope, $state, Authentication, $rootScope, $window, commonService) {


    $rootScope.setNavBarActive = function(name){
      $scope.navBarHeading = name ;
    }

    $scope.isUserSignedIn = Authentication.user && Authentication.user.email ? true : false ;

    if($scope.isUserSignedIn){
      $scope.userName = Authentication.user.displayName ;
    }
    

    
    

    



  }
}());
