angular.module('details').controller('detailsController', ['$rootScope', '$scope', '$state', 'detailsService', 'commonService', 'propertiesCRUDService', 'Notification', '$timeout',
  function($rootScope, $scope, $state, detailsService, commonService , propertiesCRUDService ,Notification  , $timeout){

    var map;
    $scope.fetch_house = function() {

      detailsService.fetch_house({ slug: $state.params.slug }, function(data) {
        if (!data) {
          alert("error loading page");

        } else {
          $scope.house = data;
          $scope.house_list = data.property_params;
          $scope.house_list.current_image_index = 0;
          $rootScope.house_lat = data.property_params.location.loc[1];
          $rootScope.house_lng = data.property_params.location.loc[0];


          //set control valus
          updateControlData();
        }
      })
    }

    

    function update_interest_house() {
      // console.log("yes here");
      // create_array

      console.log("yes", $rootScope.user_compare_list, $scope.house._id);
      if ($rootScope.user_compare_list) {
        if ($rootScope.user_compare_list.interested.length > 0) {


          $rootScope.user_compare_list.interested.forEach(function(elem, index) {


            if (elem.house == $scope.house._id) {
              $scope.house_list.is_interested = true;


            } else {
              $scope.house_list.is_interested = false;
            }

          });
        } else {
          $scope.house_list.is_interested = false;

        }
      } else {
        $scope.house_list.is_interested = false;


      }
    };

    $scope.prev_image = function() {

      if ($scope.house_list.current_image_index > 0) {
        $scope.house_list.current_image_index--;


      } else {

        $scope.house_list.current_image_index = 0;
      }





    };

    $scope.next_image = function() {


      if ($scope.house_list.current_image_index < $scope.house_list.photos.length - 1) {
        $scope.house_list.current_image_index++;

      } else

      $scope.house_list.current_image_index = $scope.house_list.photos.length - 1;



    };
    $scope.current_index=1
    var esp_event = function(event) {
      if (event.keyCode == 27) {
        // console.log("escape key pressed")
        $scope.close_photo_gallery();
        $scope.$apply();
      }

    };
    var left_right_nav = function(event) {
      if (event.keyCode == 37) { //left key
        $scope.photo_prev();
        $scope.$apply();
      }
      if (event.keyCode == 39) {
        $scope.photo_next();
        $scope.$apply();
      }

    };

    $scope.close_photo_gallery = function() {
      $scope.photos_full_screen = false;
      // $scope.full_screen_same_height = 1;
      // $scope.$apply();
      window.removeEventListener("keydown", esp_event);
      window.removeEventListener("keydown", left_right_nav);

    };


    $scope.open_photo_gallery = function() {
      $scope.photos_full_screen = true;


      window.addEventListener("keydown", esp_event);
      window.addEventListener("keyup", left_right_nav);

    };


    $scope.photo_prev = function() {

      // console.log("prev");

      $scope.current_index--;
      if ($scope.current_index < 1) {
        $scope.current_index = 1;

      }
      // angular.element(document.querySelector( '.image-gallery')).style.left=$scope.current_index*20+"%";
      document.querySelector('.image-gallery').style.left = (2 - $scope.current_index) * 20 + "%";


    };

    $scope.photo_next = function() {



      // console.log("next");
      $scope.current_index++;
      if ($scope.current_index > $scope.photo_length) {
        $scope.current_index = $scope.photo_length;

      }
      // angular.element(document.querySelector( '.image-gallery')).style.left=$scope.current_index*20+"%";
      document.querySelector('.image-gallery').style.left = (2 - $scope.current_index) * 20 + "%";

    };



    /*admin control code*/
    $scope.controls = {};
    $scope.controls.showInListing = false;
    $scope.controls.isAdminVerified = true ;
    $scope.controls.verifyBtnText = 'Verify';
    $scope.controls.showDeletePopup = false;

    function apiFailureHandler(response) {
      Notification.error({ 
        message: 'api failure' , 
        title: 'Request Failed!!', 
        delay: 6000 }
        );

      updateControlData();
    }


    function updatePropertyData(response){
      $scope.house = response.property;
      updateControlData();
    }

    function updateControlData(){
      $scope.controls.showInListing = $scope.house.showInListing;
      $scope.controls.isAdminVerified = $scope.house.isAdminVerified ;
      $scope.controls.verifyBtnText = $scope.house.isAdminVerified ? 'Unverify' : 'Verify' ;
    }

    

    


    $scope.toggleShowInListing = function(){
      var propertyID = $scope.house._id;
      var obj = {
        showInListing : $scope.controls.showInListing
      };

      propertiesCRUDService.toggleShowInListing(propertyID , obj).then(function(response){
        updatePropertyData(response);
        Notification.success({ 
          message: 'Show on listing is set as '+response.property.showInListing , 
          title: 'Updated succesfully', 
          delay: 6000 
        });

      }).catch(apiFailureHandler);

    }

    $scope.toggleAdminVerified = function(){

      var propertyID = $scope.house._id;
      var obj = {
        isAdminVerified : !$scope.controls.isAdminVerified
      };

      propertiesCRUDService.toggleAdminVerified(propertyID , obj).then(function(response){
        updatePropertyData(response);
        Notification.success({ 
          message: 'Property verification status is '+response.property.isAdminVerified, 
          title: 'Updated succesfully', 
          delay: 6000 
        });


      }).catch(apiFailureHandler);
    }

    $scope.deleteProperty = function(){
      var propertyID = $scope.house._id;
      propertiesCRUDService.deleteProperty(propertyID).then(function(response){

        Notification.success({ 
          message: 'Property is deleted succesfully', 
          title: 'Delete succesfully', 
          delay: 6000 
        });

        $timeout(function() {
          $state.go('properties');
        }, 1000);

      }).catch(apiFailureHandler);
    }



  }
  ]);
