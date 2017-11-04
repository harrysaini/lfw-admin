(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
  .module('admin')
  .factory('propertiesCRUDService', propertiesCRUDService);

  propertiesCRUDService.$inject = ['$resource'];

  function propertiesCRUDService($resource) {
   

    var propertyApi = $resource('/api/admin/property/:propertyId', {propertyId : '@propertyId' }, {
      

      toggle_show_in_listing : {
        method : 'PUT',
        url : '/api/admin/property/:propertyId/toggleShowInListing'
      },

      toggle_admin_verified : {
        method : 'PUT',
        url : '/api/admin/property/:propertyId/toggleAdminVerified'
      },

      delete_property : {
        method : 'DELETE',
        url : '/api/admin/property/:propertyId'
      }

    });

    angular.extend(propertyApi, {
     
      
      toggleShowInListing : function(id  , data){
        return this.toggle_show_in_listing({
          propertyId : id
        },data).$promise;
      },
      toggleAdminVerified : function(id ,data){
        return this.toggle_admin_verified({
          propertyId : id
        },data).$promise;
      },
      deleteProperty : function(id){
        return this.delete_property({
          propertyId : id
        }).$promise;

        
      }
    });

    return propertyApi;
  }


}());
