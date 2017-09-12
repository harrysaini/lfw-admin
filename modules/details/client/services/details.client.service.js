'use strict';



angular.module('details').factory('detailsService', ['$resource',
  function($resource) {

    // console.log($resource);
    return $resource('/api/details', {}, {

      fetch_house: { method: 'GET', url: '/api/details/fetchhouse' },
      fetch_similar_properties: { method: 'GET', isArray: true, url: '/api/common/fetchsimilar' }



    });
  }
]);
