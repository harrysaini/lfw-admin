'use strict';



angular.module('core').factory('addPropertyService', ['$resource',
  function($resource) {

    // console.log($resource);
    return $resource('/api/addProperty/', {}, {
      // nearby_houses: { method: 'GET', isArray: true, url: '/api/v1/flatmate/nearby-houses', params: { lat: '@_lat',lng: '@_lng',slug: '@_slug' } },
      post_data: { method: 'POST', url: '/api/addProperty/post' },





    });
  }
]);
