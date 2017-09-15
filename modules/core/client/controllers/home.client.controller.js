
(function() {
  'use strict';

  angular
  .module('core')
  .controller('HomeController', HomeController);

  HomeController.$inject = ['$rootScope', '$scope', '$state'];


  function HomeController($rootScope, $scope , $state) {

    $rootScope.setNavBarActive('overview');

    $scope.propertiesInfo = {
      new : 14,
      total : 220,
      notReviewed : 15,
      increment : 7
    }  

    $scope.usersInfo = {
      new : 14,
      total : 220,
      notReviewed : 15,
      increment : 7
    }    


    $scope.interestInfo = {
      clicksNew : 35,
      increment : 2
    }

  }

    



  
}());



