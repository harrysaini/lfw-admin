(function() {
  'use strict';

  angular
  .module('admin')
  .controller('PropertiesListController', PropertiesListController);

  PropertiesListController.$inject = ['$scope', '$state'  ,'propertiesListService' , '$timeout' , 'Notification' ,'$rootScope' , 'propertiesCRUDService' , 'MyUtilityService'];


  function PropertiesListController($scope, $state , propertiesListService , $timeout ,Notification , $rootScope ,propertiesCRUDService ,MyUtilityService) {

    $rootScope.setNavBarActive('properties');

    var utils = MyUtilityService;
    var perPageCount = 20;
    var isVerifiedPage = $state.current.name==="verify_properties" ? true : false;

    $scope.isVerifiedPage = isVerifiedPage;

    $scope.pageNumber = 1 ;
    $scope.propertiesData = {};
    $scope.isLoading = false;
    $scope.noResultsFound = true;


     /* if area is passed in uri*/
    function checkIfAreaWiseList(){
      var main_locality = utils.getURIParameter('main_locality');
      var city = utils.getURIParameter('city');;

      if(main_locality){
        $scope.isAreaWiseList = true;
        $scope.main_locality = main_locality;
        $scope.city = city;
      }
    }
    checkIfAreaWiseList();

    
    /*all fetch*/
    function fetchPropertiesList(){
      toggleLoader(true);
      var obj={
        limit : perPageCount,
        skip : (perPageCount*($scope.pageNumber-1))
      }

      if($scope.isAreaWiseList){
        obj.main_locality = $scope.main_locality;
        obj.city = $scope.city
      }

      propertiesListService.fetchProperties(obj)
      .then(function(response){
        fetchApiSuccessHandler(response);

      }).catch(apiFailureHandler);
    }

    /*fetch proprties for area*/
    function fetchPropertiesListInArea(){
      toggleLoader(true);
      var obj={
        limit : perPageCount,
        skip : (perPageCount*($scope.pageNumber-1)),
        main_locality : $scope.main_locality,
        city : $scope.city
      }

      propertiesListService.fetchPropertiesInArea(obj)
      .then(function(response){
        fetchApiSuccessHandler(response);
      }).catch(apiFailureHandler);
    }

    /*unverified prop fetch*/
    function fetchUnverifiedProperties(){
      toggleLoader(true);
      var obj={
        limit : perPageCount,
        skip : (perPageCount*($scope.pageNumber-1))
      }

      propertiesListService.fetchUnverifiedProperties(obj)
      .then(function(response){
        fetchApiSuccessHandler(response);

      }).catch(apiFailureHandler);
    }

    /*api succes handler*/
    function fetchApiSuccessHandler(response){
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
    }

    /*handle all api and cjoose correct api*/
    function fetchProperties(){
      if(isVerifiedPage){
        fetchUnverifiedProperties();
      }else if($scope.isAreaWiseList){
        fetchPropertiesListInArea();
      }
      else{
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

    $scope.toggleAdminVerified = function(id , value){

      if(value=='pending'){
        return;
      }
      
      var propertyID = id;
      var obj = {
        isAdminVerified : (value==='rejected' ? false :  true )
      };

      propertiesCRUDService.toggleAdminVerified(propertyID , obj).then(function(response){
        Notification.success({ 
          message: 'Property verification status is '+response.property.isAdminVerified, 
          title: 'Updated succesfully', 
          delay: 6000 
        });


      }).catch(apiFailureHandler);
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
