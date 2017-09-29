(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
  .module('admin')
  .factory('AdminService', AdminService);

  AdminService.$inject = ['$resource'];

  function AdminService($resource) {
   

    var AdminApi = $resource('/api/admin', {}, {
      add_user : {
        method : 'POST',
        url : '/api/admin/addUser'
      }
    });

    angular.extend(AdminApi, {
      addUser : function(user){
        return this.add_user(user).$promise;
      }
    });

    return AdminApi;
  }


}());