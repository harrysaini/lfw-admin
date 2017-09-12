'use strict';




angular.module('core').controller('HomeController', ['$rootScope', '$scope',
  function($rootScope, $scope) {

    $scope.openSearchPopup = function(){
      $rootScope.showSearchPopup();
    }

    
    $scope.testimons = [{
      text: "We have always received good service from the flathood team",
      from: "Shouvik, Rimi , Swastika & Lily",
      city: "New Delhi",
      photo: "assets/img/tenant3.png"

    }, {
      text: "We have always received good service from the flathood team",
      from: "Shouvik, Rimi , Swastika & Lily",
      city: "New Delhi",
      photo: "assets/img/tenant3.png"

    }, {
      text: "We have always received good service from the flathood team",
      from: "Shouvik, Rimi , Swastika & Lily",
      city: "New Delhi",
      photo: "assets/img/tenant3.png"

    }, {
      text: "We have always received good service from the flathood team",
      from: "Shouvik, Rimi , Swastika & Lily",
      city: "New Delhi",
      photo: "assets/img/tenant3.png"

    }, {
      text: "We have always received good service from the flathood team",
      from: "Shouvik, Rimi , Swastika & Lily",
      city: "New Delhi",
      photo: "assets/img/tenant3.png"

    }, {
      text: "We have always received good service from the flathood team",
      from: "Shouvik, Rimi , Swastika & Lily",
      city: "New Delhi",
      photo: "assets/img/tenant3.png"

    }, {
      text: "We have always received good service from the flathood team",
      from: "Shouvik, Rimi , Swastika & Lily",
      city: "New Delhi",
      photo: "assets/img/tenant3.png"

    }, ];
    console.log("xxx", $scope.testimons);
    if (window.innerWidth > 450 && window.innerWidth < 768) {
      var length= Math.ceil($scope.testimons.length / 3);

    } else if (window.innerWidth > 768) {
      var length = Math.ceil($scope.testimons.length / 4);

    }else{
    	var length=$scope.testimons.length;
    }
    console.log("jjj", $scope.testimons.length);




    $scope.testimonial_index = 0;
    $scope.testimonial_left_disable = 1;

    $scope.testinomial_change = function(change_to) {



      if (change_to === "prev") {


        if ($scope.testimonial_index != 0) {
          $scope.testimonial_index--;
          $scope.testimonial_left_disable = 0;
          $scope.testimonial_right_disable = 0;

          if ($scope.testimonial_index === 0) {
            $scope.testimonial_left_disable = 1;

          }

        } else {

          $scope.testimonial_left_disable = 1;

        }

      } else if (change_to === "next") {

        if ($scope.testimonial_index + 1 < length) {
          $scope.testimonial_index++;
          $scope.testimonial_right_disable = 0;
          $scope.testimonial_left_disable = 0;
          if ($scope.testimonial_index === length - 1) {
            $scope.testimonial_right_disable = 1;

          }


        } else {
          $scope.testimonial_right_disable = 1;

        }

      }

    };

  }
  ]);
