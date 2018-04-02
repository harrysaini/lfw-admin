(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
  .module('admin')
  .factory('AreaService', AreaService);

  AreaService.$inject = ['$resource'];

  function AreaService($resource) {
   

    var areaApi = $resource('/api/admin/area', {propertyId : '@propertyId' }, {
      
      list_areas : {
        method : 'GET',
        url : '/api/admin/area/list'
      },

      add_area : {
        method : 'POST',
        url : '/api/admin/area/add'
      },

      update_area : {
        method : 'PUT',
        url : '/api/admin/area/:areaId/update'
      },

      delete_area : {
        method : 'DELETE',
        url : '/api/admin/area/:areaId'
      }
     

    });

    angular.extend(areaApi, {
     
        listAreas : function(data){
          return this.list_areas(data).$promise;
        },

        updateArea : function(id , data){
          return this.update_area({
            areaId : id
          }, data).$promise;
        },

        addArea : function(data){
          return this.add_area(data).$promise;
        },

        deleteArea : function(id){
          return this.delete_area({
            areaId : id
          }).$promise;
        }
      
    });

    return areaApi;
  }


}());
