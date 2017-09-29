(function() {
  'use strict';

  angular
  .module('admin')
  .controller('PropertiesListController', PropertiesListController);

  PropertiesListController.$inject = ['$scope', '$state'  ,'propertiesListService' , '$timeout' , 'Notification' ,'$rootScope'];


  function PropertiesListController($scope, $state , propertiesListService , $timeout ,Notification , $rootScope) {

    $rootScope.setNavBarActive('properties');

    var perPageCount = 20;
    var isVerifiedPage = $state.current.name==="verify_properties" ? true : false;

    $scope.isVerifiedPage = isVerifiedPage;

    $scope.pageNumber = 1 ;
    $scope.propertiesData = {};
    $scope.isLoading = false;
    $scope.noResultsFound = true;

    
    function fetchPropertiesList(){
      toggleLoader(true);
      var obj={
        limit : perPageCount,
        skip : (perPageCount*($scope.pageNumber-1))
      }

      propertiesListService.fetchProperties(obj)
      .then(function(response){
        toggleLoader(false);
        $scope.house_list = response.properties;
        $scope.propertiesData.total = response.count;

        if(response.properties.length>0){
          $scope.noResultsFound = false;
        }else{
          $scope.noResultsFound = true;
        }

        $scope.setPaginationVariable({
         count : response.count,
         currentPage : $scope.pageNumber
       })

      }).catch(apiFailureHandler);
    }


    function fetchUnverifiedProperties(){
      toggleLoader(true);
      var obj={
        limit : perPageCount,
        skip : (perPageCount*($scope.pageNumber-1))
      }

      propertiesListService.fetchUnverifiedProperties(obj)
      .then(function(response){
        toggleLoader(false);
        $scope.house_list = response.properties;
        $scope.propertiesData.total = response.count;
        
        if(response.properties.length>0){
          $scope.noResultsFound = false;
        }else{
          $scope.noResultsFound = true;
        }

        $scope.setPaginationVariable({
         count : response.count,
         currentPage : $scope.pageNumber
       })

      }).catch(apiFailureHandler);
    }

    function fetchProperties(){
      if(isVerifiedPage){
        fetchUnverifiedProperties();
      }else{
        fetchPropertiesList();
      }
    }

    fetchProperties();


    function toggleLoader(show){
      $timeout(function() {
        $scope.$apply(function() {
          $scope.isLoading = show;
        });
      }, 100);
    }



    function apiFailureHandler(response) {
      Notification.error({ 
        message: 'api failure' , 
        title: 'Request Failed!!', 
        delay: 6000 }
        );
    }


    function updatePage(page){
      $scope.pageNumber = page;
      fetchProperties();
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
