'use strict';



angular.module('core').factory('commonService', ['$resource',
  function($resource) {

    // console.log($resource);
    return $resource('/api/common', {}, {


      toggle_interest: { method: 'POST', url: '/api/common/toggleInterest' },
      fetch_list_interest_bookmarked: { method: 'GET', url: '/api/common/fetch_all' }




    });
  }
]);
