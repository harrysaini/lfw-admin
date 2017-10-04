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
      },
      add_admin : {
        method : 'POST',
        url : '/api/admin/auth/add-admin'
      }
    });

    angular.extend(AdminApi, {
      addUser : function(user){
        return this.add_user(user).$promise;
      },
      addAdmin : function(user){
        return this.add_admin(user).$promise;
      }
    });

    return AdminApi;
  }


}());
