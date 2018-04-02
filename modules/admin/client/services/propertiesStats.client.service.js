(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
  .module('admin')
  .factory('lfwStatsService', lfwStatsService);

  lfwStatsService.$inject = ['$resource'];

  function lfwStatsService($resource) {
   

    var propertyApi = $resource('/api/admin/stats', {}, {
      
      fetch_properties_stats : {
        method : 'GET',
        url : '/api/admin/stats/propertyData'
      },

      fetch_users_stats : {
        method : 'GET',
        url : '/api/admin/stats/userData'
      }
      
    });

    angular.extend(propertyApi, {
     
      fetchPropertiesStats : function(data){
        return this.fetch_properties_stats(data).$promise;
      },

      fetchUsersStats : function(data){
        return this.fetch_users_stats(data).$promise;
      } 

      
    });

    return propertyApi;
  }


}());
