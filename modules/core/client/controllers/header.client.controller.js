(function() {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', 'menuService', '$rootScope', '$window', 'commonService'];


  function HeaderController($scope, $state, Authentication, menuService, $rootScope, $window, commonService) {

    $scope.user = $window.user || null;
    $scope.openLoginSignupPopup = function openLoginSignupPopup() {

      $rootScope.displayLoginSignupPopup();
    }
    $scope.fetch_interested = function() {
      if ($rootScope.user_compare_list) {
        $scope.interest_count = $rootScope.user_compare_list.interested.length;

        return;
      }
      commonService.fetch_list_interest_bookmarked({}, function(response) {
        if (response.status) {
          $rootScope.user_compare_list = response.data;
          $scope.interest_count = response.data.interested.length;
        } else {
          $rootScope.user_compare_list = null;
          $scope.interest_count = null;

        }

      })

    }



  }
}());
