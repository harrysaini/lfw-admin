'use strict';




angular.module('addProperty').controller('addPropertyController', ['$rootScope', '$scope', 'Upload', '$timeout', 'addPropertyService',
  function($rootScope, $scope, Upload, $timeout, addPropertyService) {
    $scope.residential_type = ['multistorey apartment', 'builder floor apartment', 'residential house', 'residential villa',
      'residential plot', 'penthouse', 'studio apartment'
    ]
    $scope.commercial_type = ['commercial office space',
      'office in IT park/SEZ', 'commercial shop', 'commercial showroom', 'commercial land', 'warehouse/godown', 'industrial land', 'industrial building'
    ]
    $scope.available_for = ['all', 'family only', 'family & boys only', 'family & girls only', 'bachelors only', 'boys only', 'girls only', 'expats only'];
    $scope.house_furnishing = 'Not Furnished', 'Semi-Furnished', 'Furnished','Fully-Furnished';
    $scope.house_type = ['1 RK', '1 BHK' ,'2 BHK', '3 BHK', '4 BHK','5 BHK','6 BHK','7 BHK','8 BHK','9 BHK'];
    $scope.area_type = ['Sqft', 'Sqmt'];
    $scope.room_lenght = ['1', '2', '3', '4', '5', '6'];


    $scope.post_property = {};
    $scope.next_button_text = 'Continue';

    $scope.current_date = new Date().toString();
    $scope.transitionType = function(type) {
      $scope.post_property.transitionType = type;

    }
    $scope.propertyType = function(type) {
      $scope.post_property.propertyType = type;

    }
    var map;
    var autocomplete_address;
    $scope.location_entered;



    $scope.initialize_map = function() {
      if (map) {
        return;
      }
      var myLatLng = { lat: 28.614808, lng: 77.208975 };


      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: myLatLng
      });
      google.maps.event.addListener(map, 'dragend', function() {
        $scope.post_property.loc = [map.center.lng(), map.center.lat()];

        get_city(map.center.lat(), map.center.lng());





      });


    }
    autocomplete_address = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */
      (document.getElementById('autocomplete-address')), { types: ['geocode'], componentRestrictions: { country: "in" } });




    autocomplete_address.addListener('place_changed', fillInAddress);

    function fillInAddress() {
      var place = autocomplete_address.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }
      console.log("place1", place);
      map.setCenter(place.geometry.location);
      $scope.marker_pos = place.geometry.location;
      $scope.post_property.locality = place.formatted_address;
      // console.log("auto", $scope.auto_complete_address);
      $scope.$apply(function() {
        $scope.location_entered = true;


      })

      $scope.post_property.loc = [place.geometry.location.lng(), place.geometry.location.lat()];
      get_city(place.geometry.location.lat(), place.geometry.location.lng());




    }

    function get_city(lat, lng, fn) {


      var latlng;
      latlng = new google.maps.LatLng(lat, lng);

      new google.maps.Geocoder().geocode({ 'latLng': latlng }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

          if (results[0]) {

            console.log(results[0].formatted_address);
            var add = results[0].formatted_address;
            var value = add.split(",");
            // console.log(add);

            var count = value.length;
            var country = value[count - 1];
            var state = value[count - 2];
            var city = value[count - 3];

            if (typeof value[count - 5] == 'undefined') {
              $scope.post_property.locality = value[count - 4];
            } else {
              $scope.post_property.locality = value[count - 5] + "," + value[count - 4];

            }
            var locality_temp = $scope.post_property.locality.split(',');
            $scope.post_property.sub_locality = locality_temp[0];
            $scope.post_property.main_locality = locality_temp[1];


            // console.log($scope.post_property.locality);
            $scope.$apply(function() {
              $scope.post_property.state = state.replace(/\d+/g, '').replace(/ /g, '');
              $scope.post_property.pincode = state.replace(/\D/g, '');
              $scope.post_property.locality = value.slice(0, -3).join(',');
              $scope.post_property.city = city;

            })

            console.log("ddd", $scope.post_property);
            // console.log("city  is: " + $scope.post_property.city);
            // console.log("state  is: " + $scope.post_property.state);
            // console.log("pincode is: " + $scope.post_property.pin_code);
            // console.log("locality is: " + $scope.post_property.locality);
          } else {
            alert("address not found, please type correct address");
          }
          //                 
        }
      });



    };
    $scope.removeImagefromUpload = function(f, $index) {



      // console.log("file ", f);

      console.log("house images ", $scope.house_images);
      $scope.photos[$index].upload.abort();
      f.splice($index, 1);
      $scope.house_images.splice($index, 1);
      console.log("house images ", $scope.house_images);

      // console.log('removed array', $scope.house_images);




    };



    // $scope.house_images=[];
    $scope.uploadPhotos = function(photos, errFiles) {

      var total_photos;

      $scope.house_images = [];
      $scope.photos = photos;


      angular.forEach(photos, function(photo) {
        // console.log("photo====>", photo);

        photo.upload = Upload.upload({
          url: '/api/addProperty/upload-images',
          data: { 'photo': photo },


        });


        photo.upload.then(function(response) {

          $scope.house_images.push(response.data[0]);

          $timeout(function() {
            photo.result = response.data[0];

          });
        }, function(response) {
          if (response.status > 0)
            $scope.errorMsg = response.status + ': ' + response.data;
        }, function(evt) {


          photo.progress = Math.min(100, parseInt(100.0 *
            evt.loaded / evt.total));
        });

        // }



      });



      // console.log("images", $scope.house_images);
      // console.log($scope.photos);


    };
    $scope.primary_pic_index = 0;

    $scope.set_primary_pic = function(index) {

      // var moved_image = photos[$index];
      $scope.primary_pic_index = index;

      $scope.photos.forEach(function(elem) {

        elem.is_primary = true;
      });
      $scope.photos[index].is_primary = false;

      console.log("house images", $scope.house_images);
      // console.log(photos);

    }


    $scope.make_primary_pic = function() {

      // var moved_image = photos[$index];
      if (!$scope.house_images) {
        return;
      }

      var first_image = $scope.house_images[0];

      $scope.house_images[0] = $scope.house_images[$scope.primary_pic_index];
      $scope.house_images[$scope.primary_pic_index] = first_image;

    }

    function is_image_uploading_complete() {


      if (Upload.isUploadInProgress()) {
        // alert("yes uplading in prog");
        $scope.next_button_text = "Uploading Photos. Please wait..";

        return false;

      } else {
        return true;

      }



    };

    $scope.nextCall = function() {
      if (parseInt($scope.switch_type) < 4) {
        $scope.switch_type = (parseInt($scope.switch_type) + 1).toString();

        $scope.initialize_map();


      } else if (parseInt($scope.switch_type) == 4) {

        $scope.next_button_text = 'Submit';
        console.log("dddd", $scope.next_button_text);

        $scope.switch_type = (parseInt($scope.switch_type) + 1).toString();

      }


    }

    $scope.form_submit = function() {
      $scope.next_button_text = 'Submitting';
      if (is_image_uploading_complete()) {

        $scope.make_primary_pic();

        if ($scope.post_property) {

          $scope.post_property.house_images = $scope.house_images;
          addPropertyService.post_data({ post_details: $scope.post_property }, function(response) {
            $scope.next_button_text = 'Submitted';




          })



        }


      } else {

        var check_upload_status = setInterval(function() {


          if (is_image_uploading_complete()) {

            clearInterval(check_upload_status);
            form_submit();
          }


        }, 500);
      }




    }



  }
]);
