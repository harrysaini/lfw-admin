(function() {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
  .module('listing')
  .factory('ListingService', ListingService);

  ListingService.$inject = ['$resource'];

  function ListingService($resource) {

    var List =  $resource('/api/listing/', {}, {

      search_house: {
        method: 'POST',
        url: '/api/listing/search'
      },
      fetch_house: { 
        method: 'GET', 
        isArray: true, 
        url: '/api/listing/fetchhouses'
      },
    });

    angular.extend(List , {
      searchHouse : function(searchObj){
        return this.search_house(searchObj).$promise;
      }

    });

    return List;
  }
}());
