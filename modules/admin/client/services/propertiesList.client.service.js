(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
  .module('admin')
  .factory('propertiesListService', propertiesListService);

  propertiesListService.$inject = ['$resource'];

  function propertiesListService($resource) {
   

    var propertyApi = $resource('/api/admin', {propertyId : '@id' }, {
      fetch_properties : {
        method : 'GET',
        url : '/api/admin/properties/list'
      },
      fetch_unverified : {
        method : 'GET',
        url : '/api/admin/properties/verify-list'
      }

      
    });

    angular.extend(propertyApi, {
     
      fetchProperties : function(data){
        return this.fetch_properties(data).$promise;
      },
      fetchUnverifiedProperties : function(data){
        return this.fetch_unverified(data).$promise;
      }
    });

    return propertyApi;
  }


}());
