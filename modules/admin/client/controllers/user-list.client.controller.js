(function() {
  'use strict';

  angular
  .module('admin')
  .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', '$state', '$rootScope', '$window', 'commonService' ,'usersListService' , '$timeout' , 'Notification' ,'userCRUDService'];


  function UserListController($scope, $state, $rootScope, $window, commonService , usersListService , $timeout ,Notification , userCRUDService) {


    var fetched = {
      tenant : true,
      broker : false,
      landlord :  false
    };
    var perPageCount = 50 ;


    $scope.displayedTable= 'tenant';
    $scope.showLoader = true;
    $scope.displayFilters = false;
    $scope.isLoading = false;
    $scope.tenantsData = {};
    $scope.brokersData = {};
    $scope.landlordsData = {};
    $scope.searchQuery = "";
    $scope.displayExportPopup = false;
    $scope.searchType = "";
    $scope.pageNumber = 1;

    $scope.tenantSortBy = 'name';
    $scope.landlordSortBy = 'name';
    $scope.brokerSortBy = 'name';




    function initFilterVariable(){
      $scope.filters = {
        verified : false,
        notVerified : false
      }
      $scope.displayFilters = false;

    }

    initFilterVariable();

    $rootScope.setNavBarActive('users');

    $scope.changeDisplayedTable = function(table){
      $scope.displayedTable = table;
      fetchUsersOnTabSwitch(table);
      initFilterVariable();
    }


    function fetchUsersOnTabSwitch(table) {
      if(!fetched[table]){
        fetchUsersList();
        fetched[table]  = true ;
      }else{
        setPaginationInformationOnTabSwitch();
      }
    }




    function toggleLoader(show){
      $timeout(function() {
        $scope.$apply(function() {
          $scope.isLoading = show;
        });
      }, 100);
    }


    /*get tenants list*/
    function getTenantsList(isSearch){
      toggleLoader(true);

      var query = isSearch ? $scope.searchQuery : "" ;
      var searchObj = {};
      searchObj.search = query ? query : '';
      searchObj.searchType = $scope.searchType ;
      searchObj.sortBy = $scope.tenantSortBy;

      searchObj.filters = $scope.filters;

      searchObj.skip = 50 * ($scope.pageNumber -1);

      usersListService.getTenantsList(searchObj).then(function(response){

        toggleLoader(false);
        $scope.tenantsData.list = response.users ; 
        $scope.tenantsData.total = response.totalUsers;

        $scope.setPaginationVariable({
          count : response.totalUsers,
          currentPage : $scope.pageNumber
        });

      }).catch(apiFailureHandler);
    }



    /*get brokers list*/
    function getBrokersList(isSearch){
      toggleLoader(true);

      var query = isSearch ? $scope.searchQuery : "";
      var searchObj = {};
      searchObj.search = query ? query : '';
      searchObj.searchType = $scope.searchType ;
      searchObj.sortBy = $scope.brokerSortBy;

        //todo get filters for tenants only
        searchObj.filters = $scope.filters;

        //searchObj.limit = 50;
        searchObj.skip = 50 * ($scope.pageNumber-1);

        usersListService.getBrokersList(searchObj).then(function(response){

          toggleLoader(false);
          $scope.brokersData.list = response.users ; 
          $scope.brokersData.total = response.totalUsers;

          $scope.setPaginationVariable({
            count : response.totalUsers,
            currentPage : $scope.pageNumber
          });

        }).catch(apiFailureHandler);
      }

      /*get landlords list*/
      function getLandlordsList(isSearch){
        toggleLoader(true);

        var query = isSearch ? $scope.searchQuery : "" ;
        var searchObj = {};
        searchObj.search = query ? query : '';
        searchObj.searchType = $scope.searchType ;
        searchObj.sortBy = $scope.landlordSortBy;

        //todo get filters for tenants only
        searchObj.filters = $scope.filters;

        //searchObj.limit = 50;
        searchObj.skip = 50 * ($scope.pageNumber-1);

        usersListService.getLandlordsList(searchObj).then(function(response){

          toggleLoader(false);
          $scope.landlordsData.list = response.users ; 
          $scope.landlordsData.total = response.totalUsers;

          $scope.setPaginationVariable({
            count : response.totalUsers,
            currentPage : $scope.pageNumber
          });

        }).catch(apiFailureHandler);
      }

      getTenantsList();


      /*reset pagination variabllels*/
      function setPaginationInformationOnTabSwitch(){

        var displayedTable = $scope.displayedTable;

        $scope.pageNumber = 1;

        if(displayedTable==='tenant'){
          $scope.setPaginationVariable({
            count : $scope.tenantsData.total,
            currentPage : $scope.pageNumber
          });
        }
        if(displayedTable==='broker'){
          $scope.setPaginationVariable({
            count : $scope.brokersData.total,
            currentPage : $scope.pageNumber
          });
        }
        if(displayedTable==='landlord'){
          $scope.setPaginationVariable({
            count : $scope.landlordsData.total,
            currentPage : $scope.pageNumber
          });
        }
      }

      function fetchUsersList(isSearch , isPageChange ){

        //if not page change
        if(!isPageChange){
          $scope.pageNumber = 1 ;
        }

        var displayedTable = $scope.displayedTable;

        if(displayedTable==='tenant'){
          return getTenantsList(isSearch);
        }
        if(displayedTable==='broker'){
          return getBrokersList(isSearch);
        }
        if(displayedTable==='landlord'){
          return getLandlordsList(isSearch);
        }
      }

      $scope.fetchUsersList = fetchUsersList;


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


      $scope.showExportsPopup = function(show){
        $scope.displayExportPopup = show;
      }


      $scope.applyFilters = function(){
        $scope.displayFilters = false;
        fetchUsersList();

      }


      $scope.searchBtnClick = function(){
        //initPageNumber();
        fetchUsersList(true);
      }

      $scope.fetchUserCsv = function(userType){
        var getObj = {
          userType : userType
        };
        usersListService.getUsersCSV(getObj).then(function(data){
          console.log(data);
        }).catch(apiFailureHandler);
      }    



      $scope.toggleAdminVerified = function(id , value){

        if(value=='pending'){
          return;
        }
        
        var userID = id;
        var obj = {
          isAdminVerified : (value==='rejected' ? false :  true )
        };

        userCRUDService.toggleAdminVerified(userID , obj).then(function(response){
          Notification.success({ 
            message: 'User verification status is '+response.user.isAdminVerified, 
            title: 'Updated succesfully', 
            delay: 6000 
          });


        }).catch(apiFailureHandler);
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
