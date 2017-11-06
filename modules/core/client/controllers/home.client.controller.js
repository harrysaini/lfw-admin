
(function() {
  'use strict';

  angular
  .module('core')
  .controller('HomeController', HomeController);

  HomeController.$inject = ['$rootScope', '$scope', '$state' , 'lfwStatsService' , 'Notification'];


  function HomeController($rootScope, $scope , $state , lfwStatsService , Notification) {

    $rootScope.setNavBarActive('overview');

    $scope.isPropertyDataLoading = true;
    $scope.isUserDataLoading = true;
    $scope.propertiesInfo = {};
    $scope.usersInfo = {};

    // $scope.propertiesInfo = {
    //   new : 14,
    //   total : 220,
    //   notReviewed : 15,
    //   increment : 7
    // }  

    // $scope.usersInfo = {
    //   new : 14,
    //   total : 220,
    //   notReviewed : 15,
    //   increment : 7
    // }    


    $scope.interestInfo = {
      clicksNew : 35,
      increment : 2
    }

    function apiFailureHandler(response) {
      Notification.error({ 
        message: 'api failure' , 
        title: 'Request Failed!!', 
        delay: 6000 }
        );
    }

    function fetchPropertiesStats(){
      lfwStatsService.fetchPropertiesStats().then(function(response){

        $scope.propertiesInfo = response.propertyStats;   
        

        $scope.isPropertyDataLoading = false;
      }).catch(apiFailureHandler);
    }

    function fetchUsersStats(){
      lfwStatsService.fetchUsersStats().then(function(response){
        $scope.usersInfo = response.userStats;
        $scope.isUserDataLoading = false;
      }).catch(apiFailureHandler);
    }

    fetchPropertiesStats();
    fetchUsersStats();

  }

  
}());



