(function() {
  'use strict';

  angular
  .module('admin')
  .controller('AdminListController', AdminListController);

  AdminListController.$inject = ['$scope', '$state', 'Authentication', '$rootScope', '$window', 'commonService' ,'usersListService' , '$timeout' , 'Notification'];


  function AdminListController($scope, $state, Authentication, $rootScope, $window, commonService , usersListService , $timeout ,Notification) {


    var fetched = {
      tenant : true,
      broker : false,
      landlord :  false
    };
    var perPageCount = 50 ;


    $scope.showLoader = true;
    $scope.displayFilters = false;
    $scope.isLoading = false;
    $scope.adminsData = {};
    $scope.searchQuery = "";
    $scope.searchType = "";
    $scope.pageNumber = 1;




    function initFilterVariable(){
      $scope.filters = {
        verified : false,
        notVerified : false
      }
      $scope.displayFilters = false;

    }

    initFilterVariable();

    $rootScope.setNavBarActive('users');

    

    function toggleLoader(show){
      $timeout(function() {
        $scope.$apply(function() {
          $scope.isLoading = show;
        });
      }, 100);
    }


    /*get tenants list*/
    function getAdminsList(isSearch){
      toggleLoader(true);

      var query = isSearch ? $scope.searchQuery : "" ;
      var searchObj = {};
      searchObj.search = query ? query : '';
      searchObj.searchType = $scope.searchType ;

        //todo get filters for tenants only
        searchObj.filters = $scope.filters;

        searchObj.skip = 50 * ($scope.pageNumber -1);

        usersListService.getAdminsList(searchObj).then(function(response){

          toggleLoader(false);
          $scope.adminsData.list = response.users ; 
          $scope.adminsData.total = response.totalUsers;

          $scope.setPaginationVariable({
            count : response.totalUsers,
            currentPage : $scope.pageNumber
          });

        }).catch(apiFailureHandler);
      }

      getAdminsList();


      
     
      function apiFailureHandler(response) {
        Notification.error({ 
          message: 'api failure' , 
          title: 'Request Failed!!', 
          delay: 6000 }
          );
      }



      $scope.showFilters = function(){
        $scope.displayFilters = true;
      }


     


      $scope.applyFilters = function(){
        $scope.displayFilters = false;
        fetchUsersList();

      }


      $scope.searchBtnClick = function(){
        getAdminsList(true);
      }

     

      /* update page */
      function updatePage(page){
        $scope.pageNumber = page;
        fetchUsersList(false , true );
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
