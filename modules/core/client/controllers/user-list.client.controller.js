(function() {
  'use strict';

  angular
  .module('core')
  .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', '$state', 'Authentication', '$rootScope', '$window', 'commonService' ,'usersListService'];


  function UserListController($scope, $state, Authentication, $rootScope, $window, commonService , usersListService) {

      $scope.displayedTable= 'tenant';
      $scope.showLoader = true;

      $rootScope.setNavBarActive('users');

      $scope.changeDisplayedTable = function(table){
        $scope.displayedTable = table;
      }


      /*get tenants list*/
      function getTenantsList(){
        usersListService.getTenantsList({limit : 5 }).then(function(response){
          $scope.tenantsList = response.users ; 
        })
      }

      getTenantsList();




      // testing data

      $scope.tenantsList = [];
      var p =[];
      for(var i=0;i<15;i++){
        p.push({
          displayName : 'Aashish'+i,
          email : 'ab@gmail.com'+i,
          interestCount : i+6,
          phoneNumber : '+91-9805641230',
          verificationStatus : 'verified' 
        })
      }

      $scope.tenantsList = p;

      var k =[];
      for(var i=0;i<15;i++){
        k.push({
          displayName : 'Aashish'+i,
          email : 'ab@gmail.com'+i,
          propertiesCount : 15%i,
          phoneNumber : '+91-9805641230',
          verificationStatus : 'verified' 
        })
      }
      $scope.brokerList = k;


    



  }
}());
