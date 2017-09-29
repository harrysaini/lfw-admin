(function() {
  'use strict';

  angular
  .module('admin')
  .controller('UserListUnverifiedController', UserListUnverifiedController);

  UserListUnverifiedController.$inject = ['$scope', '$state', 'Authentication', '$rootScope', '$window', 'commonService' ,'usersListService' , '$timeout' , 'Notification'];


  function UserListUnverifiedController($scope, $state, Authentication, $rootScope, $window, commonService , usersListService , $timeout ,Notification) {



    var perPageCount = 50 ;


    $scope.showLoader = true;
    $scope.isLoading = false;
    $scope.usersData = {};
    $scope.pageNumber = 1;





   


    function toggleLoader(show){
      $timeout(function() {
        $scope.$apply(function() {
          $scope.isLoading = show;
        });
      }, 100);
    }


    /*get userss list*/
    function getUsersList(){
      toggleLoader(true);

      var searchObj = {};


        searchObj.skip = 50 * ($scope.pageNumber -1);

        usersListService.getUnverifiedUsersList(searchObj).then(function(response){

          toggleLoader(false);
          $scope.usersData.list = response.users ; 
          $scope.usersData.total = response.totalUsers;

          $scope.setPaginationVariable({
            count : response.totalUsers,
            currentPage : $scope.pageNumber
          });

        }).catch(apiFailureHandler);
      }


      getUsersList();


      
      function apiFailureHandler(response) {
        Notification.error({ 
          message: 'api failure' , 
          title: 'Request Failed!!', 
          delay: 6000 }
          );
      }





     

      /* update page */
      function updatePage(page){
        $scope.pageNumber = page;
        getUsersList();
      }



      /* pagination */
      $scope.currentPage = 1;
      $scope.frontCount = [];
      $scope.lastCount = [];
      $scope.showEclipses = true;
      $scope.lastPage = 0;


      $scope.setPaginationVariable = function(options){
        $scope.currentPage = options.currentPage;
        $scope.lastPage = Math.ceil(options.count/perPageCount);
        $scope.showPagination = options.showPagination;
        $scope.renderPagination();
      }

      function getFrontCount(current , lastPage){
        var frontCount = [];
        for(var i = current-1 ; i<current+3;i++){
          if(i>0 && i <= lastPage){
            frontCount.push(i);
          }
        }
        return frontCount;
      }

      function getLastCount(last , current){
        var lastCount = [];
        for(var i = last-2 ; i <= last ;i++){
          if(i > 0 && i > current+2){
            lastCount.push(i);
          }
        }

        return lastCount;
      }

      $scope.renderPagination = function(){
        if($scope.currentPage>$scope.lastPage){
          $scope.currentPage = $scope.lastPage;
        }
        $scope.frontCount = getFrontCount($scope.currentPage , $scope.lastPage);
        $scope.lastCount = getLastCount($scope.lastPage , $scope.currentPage);
        $scope.showEclipses = ( ($scope.lastPage-3) > ($scope.currentPage+2)) ? true : false;
      }

      $scope.setPageAs = function(page){
        $scope.currentPage = page;
        updatePage(page);
      }
      /*pagination ends*/





    }
  }());
