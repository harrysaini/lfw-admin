// (function() {
'use strict';






angular.module('core').controller('mapController', ['$rootScope', '$scope', '$state', '$window',
  function($rootScope, $scope, $state, $window) {



    $scope.map_field = 0;

    var map;

    var request;
    var origin;
    $scope.initialize_map = function() {
      setTimeout(function() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: parseFloat($rootScope.house_lat), lng: parseFloat($rootScope.house_lng) },
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER
          },
          zoom: 13
        });
        var marker = new google.maps.Marker({
          position: { lat: parseFloat($rootScope.house_lat), lng: parseFloat($rootScope.house_lng) },
          map: map,

          title: 'Hello World!'
        });


      }, 500);




    }


    $scope.fetch_data_from_service = function(request) {


      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);

      function callback(results, status) {
        console.log("res", results, status);

        if (status == google.maps.places.PlacesServiceStatus.OK) {

          console.log("res", results, status);
          $scope.r_list = $scope.truncate_map_result(results);
          console.log("res", $scope.r_list);
          $scope.get_distance_time($scope.r_list)
        } else

        {
          $scope.r_list = [];
          $scope.$apply();
        }


      }





    };

    $scope.get_distance_time = function(data) {

      origin = new google.maps.LatLng(parseFloat($rootScope.house_lat), parseFloat($rootScope.house_lng));
      console.log("origins", origin);


      angular.forEach($scope.r_list, function(datum, index) {

        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
          origins: [origin],
          destinations: [datum.geometry.location],
          travelMode: 'DRIVING',
        }, callback);

        function callback(response, status) {

          console.log("response", response);

          datum.distance = response.rows[0].elements[0].distance.text;
          datum.duration = response.rows[0].elements[0].duration.text;

          $scope.r_list[index].distance = response.rows[0].elements[0].distance.text;
          $scope.r_list[index].duration = response.rows[0].elements[0].duration.text;

          $scope.$apply();

          // See Parsing the Results for
          // the basics of a callback function.
        }



      });

      // $scope.r_list;
      console.log($scope.r_list);

      // $scope.$apply();

      // console.log("data.results");
      // console.log(data.results);

      // return data;

    };


    $scope.truncate_map_result = function(data) {

      if (data.length >= 5)
        data.length = 5;
      return data;

    };

    $scope.fetch_restaurants = function() {


      request = {
        location: new google.maps.LatLng(parseFloat($rootScope.house_lat), parseFloat($rootScope.house_lng)),
        radius: '5000',
        types: ['restaurant'],
      };

      $scope.fetch_data_from_service(request);


      $scope.map_field = 1;

    };



    $scope.fetch_trains = function(lat, long) {

      request = {
        location: new google.maps.LatLng(parseFloat($rootScope.house_lat), parseFloat($rootScope.house_lng)),
        radius: '5000',
        types: ['train_station'],
      };

      $scope.fetch_data_from_service(request);

      $scope.map_field = 4;

    };

    $scope.fetch_buses = function(lat, long) {

      request = {
        location: new google.maps.LatLng(parseFloat($rootScope.house_lat), parseFloat($rootScope.house_lng)),
        radius: '5000',
        types: ['bus_station'],
      };

      $scope.fetch_data_from_service(request);


      $scope.map_field = 5;

    };

    $scope.fetch_banks = function(lat, long) {


      request = {
        location: new google.maps.LatLng(parseFloat($rootScope.house_lat), parseFloat($rootScope.house_lng)),
        radius: '5000',
        types: ['bank'],
      };

      $scope.fetch_data_from_service(request);


      $scope.map_field = 3;
    };


    $scope.fetch_atms = function(lat, long) {

      request = {
        location: new google.maps.LatLng(parseFloat($rootScope.house_lat), parseFloat($rootScope.house_lng)),
        radius: '5000',
        types: ['atm'],
      };

      $scope.fetch_data_from_service(request);


      $scope.map_field = 2;
    };



    $scope.fetch_hospitals = function(lat, long) {


      request = {
        location: new google.maps.LatLng(parseFloat($rootScope.house_lat), parseFloat($rootScope.house_lng)),
        radius: '5000',
        types: ['hospital'],
      };

      $scope.fetch_data_from_service(request);


      $scope.map_field = 6;
    };



    $scope.fetch_gym = function(lat, long) {

      request = {
        location: new google.maps.LatLng(parseFloat($rootScope.house_lat), parseFloat($rootScope.house_lng)),
        radius: '5000',
        types: ['gym'],
      };

      $scope.fetch_data_from_service(request);



      $scope.map_field = 7;

    };



  }
]);
