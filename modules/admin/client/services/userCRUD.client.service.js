(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
  .module('admin')
  .factory('userCRUDService', userCRUDService);

  userCRUDService.$inject = ['$resource'];

  function userCRUDService($resource) {
   

    var api = $resource('/api/admin/user/:userId', {userId : '@userId' }, {
      

      

      toggle_admin_verified : {
        method : 'PUT',
        url : '/api/admin/user/:userId/toggleAdminVerified'
      },

      delete_property : {
        method : 'DELETE',
        url : '/api/admin/user/:userId'
      }

    });

    angular.extend(api, {
     
      
     
      toggleAdminVerified : function(id ,data){
        return this.toggle_admin_verified({
          userId : id
        },data).$promise;
      },
      deleteProperty : function(id){
        return this.delete_property({
          userId : id
        }).$promise;

        
      }
    });

    return api;
  }


}());
