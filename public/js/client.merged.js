(function (window) {
  'use strict';

  var applicationModuleName = 'mean';

  var service = {
    applicationEnvironment: window.env,
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: ['ngResource', 'ngAnimate','720kb.datepicker','ngSanitize', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ngFileUpload', 'ui-notification'],
    registerModule: registerModule
  };

  window.ApplicationConfiguration = service;

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }

  // Angular-ui-notification configuration
  angular.module('ui-notification').config(function(NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 2000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'bottom'
    });
  });
}(window));

(function (app) {
  'use strict';

  // Start by defining the main module and adding the module dependencies
  angular
    .module(app.applicationModuleName, app.applicationModuleVendorDependencies);

  // Setting HTML5 Location Mode
  angular
    .module(app.applicationModuleName)
    .config(bootstrapConfig);

  bootstrapConfig.$inject = ['$compileProvider', '$locationProvider', '$httpProvider', '$logProvider'];

  function bootstrapConfig($compileProvider, $locationProvider, $httpProvider, $logProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    }).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');

    // Disable debug data for production environment
    // @link https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(app.applicationEnvironment !== 'production');
    $logProvider.debugEnabled(app.applicationEnvironment !== 'production');
  }


  // Then define the init function for starting up the application
  angular.element(document).ready(init);

  function init() {
    // Fixing facebook bug with redirect
    if (window.location.hash && window.location.hash === '#_=_') {
      if (window.history && history.pushState) {
        window.history.pushState('', document.title, window.location.pathname);
      } else {
        // Prevent scrolling by storing the page's current scroll offset
        var scroll = {
          top: document.body.scrollTop,
          left: document.body.scrollLeft
        };
        window.location.hash = '';
        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scroll.top;
        document.body.scrollLeft = scroll.left;
      }
    }

    // Then init the app
    angular.bootstrap(document, [app.applicationModuleName]);
  }
}(ApplicationConfiguration));

(function (app) {
  'use strict';

  app.registerModule('addProperty', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('addProperty.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));

(function (app) {
  'use strict';

  app.registerModule('admin', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('admin.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));

(function (app) {
  'use strict';

  app.registerModule('core',['rzModule']);
  app.registerModule('core.routes', ['ui.router']);
  app.registerModule('core.admin', ['core']);
  app.registerModule('core.admin.routes', ['ui.router']);
}(ApplicationConfiguration));

(function(app) {
  'use strict';

  app.registerModule('details', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('details.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));

(function (app) {
  'use strict';

  app.registerModule('listing', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('listing.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));

(function (app) {
  'use strict';

  app.registerModule('users');
  // app.registerModule('users.admin');
  // app.registerModule('users.admin.routes', ['ui.router', 'core.routes', 'users.admin.services']);
  // app.registerModule('users.admin.services');
  // app.registerModule('users.routes', ['ui.router', 'core.routes']);
  app.registerModule('users.services');
}(ApplicationConfiguration));

(function () {
  'use strict';

  angular
  .module('addProperty.routes')
  .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });


    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    
    $stateProvider
    .state('add_property', {
      url: '/add-property',
      templateUrl: '/modules/addProperty/client/views/addProperty.client.view.html'
    });
  }


}());

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
    $scope.house_furnishing = ['Not Furnished', 'Semi-Furnished', 'Furnished','Fully-Furnished'];
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

(function () {
  'use strict';

  angular
  .module('admin.routes')
  .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });


    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    
    $stateProvider
    .state('users',{
        url : '/users',
        templateUrl : '/modules/admin/client/views/users-list.client.view.html',
        data : {
          roles : ['admin']
        }
      }).state('add-user',{
        url : '/users/addUser',
        templateUrl : '/modules/admin/client/views/user-add.client.view.html',
        data : {
          roles : ['admin']
        }
      }).state('properties',{
        url : '/properties',
        templateUrl : '/modules/admin/client/views/properties-list.client.view.html',
        data : {
          roles : ['admin']
        }
      }).state('verify_properties',{
        url : '/verify-properties',
        templateUrl : '/modules/admin/client/views/properties-list.client.view.html',
        data : {
          roles : ['admin']
        }
      }).state('verify_users',{
        url : '/verify-users',
        templateUrl : '/modules/admin/client/views/verify-users-list.client.view.html',
        data : {
          roles : ['admin']
        }
      }).state('add-admin',{
        url : '/add-admin',
        templateUrl : '/modules/admin/client/views/add-admin.client.view.html',
        data : {
          roles : ['admin']
        }
      }).state('admins_list',{
        url : '/admins',
        templateUrl : '/modules/admin/client/views/admins-list.client.view.html',
        data : {
          roles : ['admin']
        }
      });
  }


}());

(function() {
  'use strict';

  angular
  .module('admin')
  .controller('AdminAddController', AdminAddController);

  AdminAddController.$inject = ['$scope', '$state', 'Authentication', '$rootScope' , 'MyUtilityService' , 'AdminService' ,'Notification'];


  function AdminAddController($scope, $state, Authentication, $rootScope , MyUtilityService , AdminService ,Notification) {

    var utils = MyUtilityService;

    $rootScope.setNavBarActive('users');


    $scope.displayViewPassword = true;
    $scope.showPassword = false;


    function initFormData(){
      $scope.userObj = {
        firstName : "",
        lastName : "",
        email: "",
        password: "",
        phoneCode: '+91',
        phoneNumber: null,
      };

      $scope.isValid = true;
      $scope.isEmailvalid = true;
      $scope.isMobileVaild = true;
      $scope.isCodeValid = true;
    }
    initFormData();
    


    $scope.displayPasswordField = function() {

      $scope.displayViewPassword = !$scope.displayViewPassword;
      $scope.showPassword = !$scope.showPassword;
      if ($scope.showPassword) {
        document.getElementById('user-passsword').setAttribute('type', 'text');

      } else {
        document.getElementById('user-passsword').setAttribute('type', 'password');
      }
    }



    function validateSignUpData() {

      var isEmailvalid = utils.isValidEmail($scope.userObj.email);
      var isMobileVaild = utils.isValidMobile($scope.userObj.phoneNumber);
      var isCodeValid = utils.isMobileCodeValid($scope.userObj.phoneCode);
      var isPasswordSet = $scope.userObj.password === "" ? false : true;
      var isFirstNameSet = $scope.userObj.firstName === "" ? false : true ;
      var isLastNameSet  = $scope.userObj.lastName === "" ? false : true ;


      $scope.isEmailvalid = isEmailvalid;
      $scope.isMobileVaild = isMobileVaild;
      $scope.isCodeValid = isCodeValid;


      $scope.isValid = isEmailvalid && isMobileVaild && isCodeValid  && isPasswordSet && isFirstNameSet && isLastNameSet;

      return $scope.isValid;
    }


    $scope.saveUserData = function(){
      var isValid = validateSignUpData();
      if(isValid){
        AdminService.addAdmin($scope.userObj)
        .then(addUserSucess)
        .catch(addUserFailed);

      }
    }


    function addUserSucess(response){
      initFormData();
      Notification.success({ 
        message: "Admin added successfully", 
        title: 'Admin added', 
        delay: 6000 }
        );
    }

    function addUserFailed(response){
      Notification.error({ 
        message: response.data.message, 
        title: 'Failed!', 
        delay: 6000 }
        );
    }

    $scope.resetFormData = function(){
      initFormData();
    }

  }
}());

(function() {
  'use strict';

  angular
  .module('admin')
  .controller('AdminListController', AdminListController);

  AdminListController.$inject = ['$scope', '$state', 'Authentication', '$rootScope', '$window', 'commonService' ,'usersListService' , '$timeout' , 'Notification'];


  function AdminListController($scope, $state, Authentication, $rootScope, $window, commonService , usersListService , $timeout ,Notification) {


    var fetched = {
      tenant : true,
      broker : false,
      landlord :  false
    };
    var perPageCount = 50 ;


    $scope.showLoader = true;
    $scope.displayFilters = false;
    $scope.isLoading = false;
    $scope.adminsData = {};
    $scope.searchQuery = "";
    $scope.searchType = "";
    $scope.pageNumber = 1;




    function initFilterVariable(){
      $scope.filters = {
        verified : false,
        notVerified : false
      }
      $scope.displayFilters = false;

    }

    initFilterVariable();

    $rootScope.setNavBarActive('users');

    

    function toggleLoader(show){
      $timeout(function() {
        $scope.$apply(function() {
          $scope.isLoading = show;
        });
      }, 100);
    }


    /*get tenants list*/
    function getAdminsList(isSearch){
      toggleLoader(true);

      var query = isSearch ? $scope.searchQuery : "" ;
      var searchObj = {};
      searchObj.search = query ? query : '';
      searchObj.searchType = $scope.searchType ;

        //todo get filters for tenants only
        searchObj.filters = $scope.filters;

        searchObj.skip = 50 * ($scope.pageNumber -1);

        usersListService.getAdminsList(searchObj).then(function(response){

          toggleLoader(false);
          $scope.adminsData.list = response.users ; 
          $scope.adminsData.total = response.totalUsers;

          $scope.setPaginationVariable({
            count : response.totalUsers,
            currentPage : $scope.pageNumber
          });

        }).catch(apiFailureHandler);
      }

      getAdminsList();


      
     
      function apiFailureHandler(response) {
        Notification.error({ 
          message: 'api failure' , 
          title: 'Request Failed!!', 
          delay: 6000 }
          );
      }



      $scope.showFilters = function(){
        $scope.displayFilters = true;
      }


     


      $scope.applyFilters = function(){
        $scope.displayFilters = false;
        fetchUsersList();

      }


      $scope.searchBtnClick = function(){
        getAdminsList(true);
      }

     

      /* update page */
      function updatePage(page){
        $scope.pageNumber = page;
        fetchUsersList(false , true );
      }



      /* pagination */
      $scope.currentPage = 1;
      $scope.frontCount = [];
      $scope.lastCount = [];
      $scope.showEclipses = true;
      $scope.lastPage = 0;


      $scope.setPaginationVariable = function(options){
        $scope.currentPage = options.currentPage;
        $scope.lastPage = Math.ceil(options.count/perPageCount);
        $scope.showPagination = options.showPagination;
        $scope.renderPagination();
      }

      function getFrontCount(current , lastPage){
        var frontCount = [];
        for(var i = current-1 ; i<current+3;i++){
          if(i>0 && i <= lastPage){
            frontCount.push(i);
          }
        }
        return frontCount;
      }

      function getLastCount(last , current){
        var lastCount = [];
        for(var i = last-2 ; i <= last ;i++){
          if(i > 0 && i > current+2){
            lastCount.push(i);
          }
        }

        return lastCount;
      }

      $scope.renderPagination = function(){
        if($scope.currentPage>$scope.lastPage){
          $scope.currentPage = $scope.lastPage;
        }
        $scope.frontCount = getFrontCount($scope.currentPage , $scope.lastPage);
        $scope.lastCount = getLastCount($scope.lastPage , $scope.currentPage);
        $scope.showEclipses = ( ($scope.lastPage-3) > ($scope.currentPage+2)) ? true : false;
      }

      $scope.setPageAs = function(page){
        $scope.currentPage = page;
        updatePage(page);
      }
      /*pagination ends*/





    }
  }());

(function() {
  'use strict';

  angular
  .module('admin')
  .controller('PropertiesListController', PropertiesListController);

  PropertiesListController.$inject = ['$scope', '$state'  ,'propertiesListService' , '$timeout' , 'Notification' ,'$rootScope'];


  function PropertiesListController($scope, $state , propertiesListService , $timeout ,Notification , $rootScope) {

    $rootScope.setNavBarActive('properties');

    var perPageCount = 20;
    var isVerifiedPage = $state.current.name==="verify_properties" ? true : false;

    $scope.isVerifiedPage = isVerifiedPage;

    $scope.pageNumber = 1 ;
    $scope.propertiesData = {};
    $scope.isLoading = false;
    $scope.noResultsFound = true;

    
    function fetchPropertiesList(){
      toggleLoader(true);
      var obj={
        limit : perPageCount,
        skip : (perPageCount*($scope.pageNumber-1))
      }

      propertiesListService.fetchProperties(obj)
      .then(function(response){
        toggleLoader(false);
        $scope.house_list = response.properties;
        $scope.propertiesData.total = response.count;

        if(response.properties.length>0){
          $scope.noResultsFound = false;
        }else{
          $scope.noResultsFound = true;
        }

        $scope.setPaginationVariable({
         count : response.count,
         currentPage : $scope.pageNumber
       })

      }).catch(apiFailureHandler);
    }


    function fetchUnverifiedProperties(){
      toggleLoader(true);
      var obj={
        limit : perPageCount,
        skip : (perPageCount*($scope.pageNumber-1))
      }

      propertiesListService.fetchUnverifiedProperties(obj)
      .then(function(response){
        toggleLoader(false);
        $scope.house_list = response.properties;
        $scope.propertiesData.total = response.count;
        
        if(response.properties.length>0){
          $scope.noResultsFound = false;
        }else{
          $scope.noResultsFound = true;
        }

        $scope.setPaginationVariable({
         count : response.count,
         currentPage : $scope.pageNumber
       })

      }).catch(apiFailureHandler);
    }

    function fetchProperties(){
      if(isVerifiedPage){
        fetchUnverifiedProperties();
      }else{
        fetchPropertiesList();
      }
    }

    fetchProperties();


    function toggleLoader(show){
      $timeout(function() {
        $scope.$apply(function() {
          $scope.isLoading = show;
        });
      }, 100);
    }



    function apiFailureHandler(response) {
      Notification.error({ 
        message: 'api failure' , 
        title: 'Request Failed!!', 
        delay: 6000 }
        );
    }


    function updatePage(page){
      $scope.pageNumber = page;
      fetchProperties();
    }



    /* pagination */
    $scope.currentPage = 1;
    $scope.frontCount = [];
    $scope.lastCount = [];
    $scope.showEclipses = true;
    $scope.lastPage = 0;


    $scope.setPaginationVariable = function(options){
      $scope.currentPage = options.currentPage;
      $scope.lastPage = Math.ceil(options.count/perPageCount);
      $scope.showPagination = options.showPagination;
      $scope.renderPagination();
    }

    function getFrontCount(current , lastPage){
      var frontCount = [];
      for(var i = current-1 ; i<current+3;i++){
        if(i>0 && i <= lastPage){
          frontCount.push(i);
        }
      }
      return frontCount;
    }

    function getLastCount(last , current){
      var lastCount = [];
      for(var i = last-2 ; i <= last ;i++){
        if(i > 0 && i > current+2){
          lastCount.push(i);
        }
      }

      return lastCount;
    }

    $scope.renderPagination = function(){
      if($scope.currentPage>$scope.lastPage){
        $scope.currentPage = $scope.lastPage;
      }
      $scope.frontCount = getFrontCount($scope.currentPage , $scope.lastPage);
      $scope.lastCount = getLastCount($scope.lastPage , $scope.currentPage);
      $scope.showEclipses = ( ($scope.lastPage-3) > ($scope.currentPage+2)) ? true : false;
    }

    $scope.setPageAs = function(page){
      $scope.currentPage = page;
      updatePage(page);
    }
    /*pagination ends*/




  }
}());

(function() {
  'use strict';

  angular
  .module('admin')
  .controller('UserAddController', UserAddController);

  UserAddController.$inject = ['$scope', '$state', 'Authentication', '$rootScope' , 'MyUtilityService' , 'AdminService' ,'Notification'];


  function UserAddController($scope, $state, Authentication, $rootScope , MyUtilityService , AdminService ,Notification) {

    var utils = MyUtilityService;

    $rootScope.setNavBarActive('users');


    $scope.displayViewPassword = true;
    $scope.showPassword = false;


    function initFormData(){
      $scope.userObj = {
        firstName : "",
        lastName : "",
        email: "",
        password: "",
        phoneCode: '+91',
        phoneNumber: null,
        userRole: ""
      };

      $scope.isValid = true;
      $scope.isEmailvalid = true;
      $scope.isMobileVaild = true;
      $scope.isCodeValid = true;
    }
    initFormData();
    


    $scope.displayPasswordField = function() {

      $scope.displayViewPassword = !$scope.displayViewPassword;
      $scope.showPassword = !$scope.showPassword;
      if ($scope.showPassword) {
        document.getElementById('user-passsword').setAttribute('type', 'text');

      } else {
        document.getElementById('user-passsword').setAttribute('type', 'password');
      }
    }



    function validateSignUpData() {

      var isEmailvalid = utils.isValidEmail($scope.userObj.email);
      var isMobileVaild = utils.isValidMobile($scope.userObj.phoneNumber);
      var isCodeValid = utils.isMobileCodeValid($scope.userObj.phoneCode);
      var isUserRoleSet = $scope.userObj.userRole === "" ? false : true;
      var isPasswordSet = $scope.userObj.password === "" ? false : true;
      var isFirstNameSet = $scope.userObj.firstName === "" ? false : true ;
      var isLastNameSet  = $scope.userObj.lastName === "" ? false : true ;


      $scope.isEmailvalid = isEmailvalid;
      $scope.isMobileVaild = isMobileVaild;
      $scope.isCodeValid = isCodeValid;


      $scope.isValid = isEmailvalid && isMobileVaild && isCodeValid && isUserRoleSet && isPasswordSet && isFirstNameSet && isLastNameSet;

      return $scope.isValid;
    }


    $scope.saveUserData = function(){
      var isValid = validateSignUpData();
      if(isValid){
        AdminService.addUser($scope.userObj)
        .then(addUserSucess)
        .catch(addUserFailed);

      }
    }


    function addUserSucess(response){
      initFormData();
      Notification.success({ 
        message: "User added successfully", 
        title: 'User added', 
        delay: 6000 }
        );
    }

    function addUserFailed(response){
      Notification.error({ 
        message: response.data.message, 
        title: 'Failed!', 
        delay: 6000 }
        );
    }

    $scope.resetFormData = function(){
      initFormData();
    }

  }
}());

(function() {
  'use strict';

  angular
  .module('admin')
  .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', '$state', 'Authentication', '$rootScope', '$window', 'commonService' ,'usersListService' , '$timeout' , 'Notification'];


  function UserListController($scope, $state, Authentication, $rootScope, $window, commonService , usersListService , $timeout ,Notification) {


    var fetched = {
      tenant : true,
      broker : false,
      landlord :  false
    };
    var perPageCount = 50 ;


    $scope.displayedTable= 'tenant';
    $scope.showLoader = true;
    $scope.displayFilters = false;
    $scope.isLoading = false;
    $scope.tenantsData = {};
    $scope.brokersData = {};
    $scope.landlordsData = {};
    $scope.searchQuery = "";
    $scope.displayExportPopup = false;
    $scope.searchType = "";
    $scope.pageNumber = 1;




    function initFilterVariable(){
      $scope.filters = {
        verified : false,
        notVerified : false
      }
      $scope.displayFilters = false;

    }

    initFilterVariable();

    $rootScope.setNavBarActive('users');

    $scope.changeDisplayedTable = function(table){
      $scope.displayedTable = table;
      fetchUsersOnTabSwitch(table);
      initFilterVariable();
    }


    function fetchUsersOnTabSwitch(table) {
      if(!fetched[table]){
        fetchUsersList();
        fetched[table]  = true ;
      }else{
        setPaginationInformationOnTabSwitch();
      }
    }




    function toggleLoader(show){
      $timeout(function() {
        $scope.$apply(function() {
          $scope.isLoading = show;
        });
      }, 100);
    }


    /*get tenants list*/
    function getTenantsList(isSearch){
      toggleLoader(true);

      var query = isSearch ? $scope.searchQuery : "" ;
      var searchObj = {};
      searchObj.search = query ? query : '';
      searchObj.searchType = $scope.searchType ;

        //todo get filters for tenants only
        searchObj.filters = $scope.filters;

        searchObj.skip = 50 * ($scope.pageNumber -1);

        usersListService.getTenantsList(searchObj).then(function(response){

          toggleLoader(false);
          $scope.tenantsData.list = response.users ; 
          $scope.tenantsData.total = response.totalUsers;

          $scope.setPaginationVariable({
            count : response.totalUsers,
            currentPage : $scope.pageNumber
          });

        }).catch(apiFailureHandler);
      }



      /*get brokers list*/
      function getBrokersList(isSearch){
        toggleLoader(true);

        var query = isSearch ? $scope.searchQuery : "";
        var searchObj = {};
        searchObj.search = query ? query : '';
        searchObj.searchType = $scope.searchType ;

        //todo get filters for tenants only
        searchObj.filters = $scope.filters;

        //searchObj.limit = 50;
        searchObj.skip = 50 * ($scope.pageNumber-1);

        usersListService.getBrokersList(searchObj).then(function(response){

          toggleLoader(false);
          $scope.brokersData.list = response.users ; 
          $scope.brokersData.total = response.totalUsers;

          $scope.setPaginationVariable({
            count : response.totalUsers,
            currentPage : $scope.pageNumber
          });

        }).catch(apiFailureHandler);
      }

      /*get landlords list*/
      function getLandlordsList(isSearch){
        toggleLoader(true);

        var query = isSearch ? $scope.searchQuery : "" ;
        var searchObj = {};
        searchObj.search = query ? query : '';
        searchObj.searchType = $scope.searchType ;

        //todo get filters for tenants only
        searchObj.filters = $scope.filters;

        //searchObj.limit = 50;
        searchObj.skip = 50 * ($scope.pageNumber-1);

        usersListService.getLandlordsList(searchObj).then(function(response){

          toggleLoader(false);
          $scope.landlordsData.list = response.users ; 
          $scope.landlordsData.total = response.totalUsers;

          $scope.setPaginationVariable({
            count : response.totalUsers,
            currentPage : $scope.pageNumber
          });

        }).catch(apiFailureHandler);
      }

      getTenantsList();


      /*reset pagination variabllels*/
      function setPaginationInformationOnTabSwitch(){
       
        var displayedTable = $scope.displayedTable;

        $scope.pageNumber = 1;

        if(displayedTable==='tenant'){
          $scope.setPaginationVariable({
            count : $scope.tenantsData.total,
            currentPage : $scope.pageNumber
          });
        }
        if(displayedTable==='broker'){
          $scope.setPaginationVariable({
            count : $scope.brokersData.total,
            currentPage : $scope.pageNumber
          });
        }
        if(displayedTable==='landlord'){
          $scope.setPaginationVariable({
            count : $scope.landlordsData.total,
            currentPage : $scope.pageNumber
          });
        }
      }

      function fetchUsersList(isSearch , isPageChange ){

        //if not page change
        if(!isPageChange){
          $scope.pageNumber = 1 ;
        }

        var displayedTable = $scope.displayedTable;

        if(displayedTable==='tenant'){
          return getTenantsList(isSearch);
        }
        if(displayedTable==='broker'){
          return getBrokersList(isSearch);
        }
        if(displayedTable==='landlord'){
          return getLandlordsList(isSearch);
        }
      }


      function apiFailureHandler(response) {
        Notification.error({ 
          message: 'api failure' , 
          title: 'Request Failed!!', 
          delay: 6000 }
          );
      }



      $scope.showFilters = function(){
        $scope.displayFilters = true;
      }


      $scope.showExportsPopup = function(show){
        $scope.displayExportPopup = show;
      }


      $scope.applyFilters = function(){
        $scope.displayFilters = false;
        fetchUsersList();

      }


      $scope.searchBtnClick = function(){
        //initPageNumber();
        fetchUsersList(true);
      }

      $scope.fetchUserCsv = function(userType){
        var getObj = {
          userType : userType
        };
        usersListService.getUsersCSV(getObj).then(function(data){
          console.log(data);
        }).catch(apiFailureHandler);
      }     
      

      /* update page */
      function updatePage(page){
        $scope.pageNumber = page;
        fetchUsersList(false , true );
      }



      /* pagination */
      $scope.currentPage = 1;
      $scope.frontCount = [];
      $scope.lastCount = [];
      $scope.showEclipses = true;
      $scope.lastPage = 0;


      $scope.setPaginationVariable = function(options){
        $scope.currentPage = options.currentPage;
        $scope.lastPage = Math.ceil(options.count/perPageCount);
        $scope.showPagination = options.showPagination;
        $scope.renderPagination();
      }

      function getFrontCount(current , lastPage){
        var frontCount = [];
        for(var i = current-1 ; i<current+3;i++){
          if(i>0 && i <= lastPage){
            frontCount.push(i);
          }
        }
        return frontCount;
      }

      function getLastCount(last , current){
        var lastCount = [];
        for(var i = last-2 ; i <= last ;i++){
          if(i > 0 && i > current+2){
            lastCount.push(i);
          }
        }

        return lastCount;
      }

      $scope.renderPagination = function(){
        if($scope.currentPage>$scope.lastPage){
          $scope.currentPage = $scope.lastPage;
        }
        $scope.frontCount = getFrontCount($scope.currentPage , $scope.lastPage);
        $scope.lastCount = getLastCount($scope.lastPage , $scope.currentPage);
        $scope.showEclipses = ( ($scope.lastPage-3) > ($scope.currentPage+2)) ? true : false;
      }

      $scope.setPageAs = function(page){
        $scope.currentPage = page;
        updatePage(page);
      }
      /*pagination ends*/





    }
  }());

(function() {
  'use strict';

  angular
  .module('admin')
  .controller('UserListUnverifiedController', UserListUnverifiedController);

  UserListUnverifiedController.$inject = ['$scope', '$state', 'Authentication', '$rootScope', '$window', 'commonService' ,'usersListService' , '$timeout' , 'Notification'];


  function UserListUnverifiedController($scope, $state, Authentication, $rootScope, $window, commonService , usersListService , $timeout ,Notification) {



    var perPageCount = 50 ;


    $scope.showLoader = true;
    $scope.isLoading = false;
    $scope.usersData = {};
    $scope.pageNumber = 1;





   


    function toggleLoader(show){
      $timeout(function() {
        $scope.$apply(function() {
          $scope.isLoading = show;
        });
      }, 100);
    }


    /*get userss list*/
    function getUsersList(){
      toggleLoader(true);

      var searchObj = {};


        searchObj.skip = 50 * ($scope.pageNumber -1);

        usersListService.getUnverifiedUsersList(searchObj).then(function(response){

          toggleLoader(false);
          $scope.usersData.list = response.users ; 
          $scope.usersData.total = response.totalUsers;

          $scope.setPaginationVariable({
            count : response.totalUsers,
            currentPage : $scope.pageNumber
          });

        }).catch(apiFailureHandler);
      }


      getUsersList();


      
      function apiFailureHandler(response) {
        Notification.error({ 
          message: 'api failure' , 
          title: 'Request Failed!!', 
          delay: 6000 }
          );
      }





     

      /* update page */
      function updatePage(page){
        $scope.pageNumber = page;
        getUsersList();
      }



      /* pagination */
      $scope.currentPage = 1;
      $scope.frontCount = [];
      $scope.lastCount = [];
      $scope.showEclipses = true;
      $scope.lastPage = 0;


      $scope.setPaginationVariable = function(options){
        $scope.currentPage = options.currentPage;
        $scope.lastPage = Math.ceil(options.count/perPageCount);
        $scope.showPagination = options.showPagination;
        $scope.renderPagination();
      }

      function getFrontCount(current , lastPage){
        var frontCount = [];
        for(var i = current-1 ; i<current+3;i++){
          if(i>0 && i <= lastPage){
            frontCount.push(i);
          }
        }
        return frontCount;
      }

      function getLastCount(last , current){
        var lastCount = [];
        for(var i = last-2 ; i <= last ;i++){
          if(i > 0 && i > current+2){
            lastCount.push(i);
          }
        }

        return lastCount;
      }

      $scope.renderPagination = function(){
        if($scope.currentPage>$scope.lastPage){
          $scope.currentPage = $scope.lastPage;
        }
        $scope.frontCount = getFrontCount($scope.currentPage , $scope.lastPage);
        $scope.lastCount = getLastCount($scope.lastPage , $scope.currentPage);
        $scope.showEclipses = ( ($scope.lastPage-3) > ($scope.currentPage+2)) ? true : false;
      }

      $scope.setPageAs = function(page){
        $scope.currentPage = page;
        updatePage(page);
      }
      /*pagination ends*/





    }
  }());

(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
  .module('admin')
  .factory('AdminService', AdminService);

  AdminService.$inject = ['$resource'];

  function AdminService($resource) {
   

    var AdminApi = $resource('/api/admin', {}, {
      add_user : {
        method : 'POST',
        url : '/api/admin/addUser'
      },
      add_admin : {
        method : 'POST',
        url : '/api/admin/auth/add-admin'
      }
    });

    angular.extend(AdminApi, {
      addUser : function(user){
        return this.add_user(user).$promise;
      },
      addAdmin : function(user){
        return this.add_admin(user).$promise;
      }
    });

    return AdminApi;
  }


}());

(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
  .module('admin')
  .factory('propertiesListService', propertiesListService);

  propertiesListService.$inject = ['$resource'];

  function propertiesListService($resource) {
   

    var propertyApi = $resource('/api/admin', {propertyId : '@id' }, {
      fetch_properties : {
        method : 'GET',
        url : '/api/admin/properties/list'
      },
      fetch_unverified : {
        method : 'GET',
        url : '/api/admin/properties/verify-list'
      }

      
    });

    angular.extend(propertyApi, {
     
      fetchProperties : function(data){
        return this.fetch_properties(data).$promise;
      },
      fetchUnverifiedProperties : function(data){
        return this.fetch_unverified(data).$promise;
      }
    });

    return propertyApi;
  }


}());

(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
  .module('admin')
  .factory('lfwStatsService', lfwStatsService);

  lfwStatsService.$inject = ['$resource'];

  function lfwStatsService($resource) {
   

    var propertyApi = $resource('/api/admin/stats', {}, {
      
      fetch_properties_stats : {
        method : 'GET',
        url : '/api/admin/stats/propertyData'
      },

      fetch_users_stats : {
        method : 'GET',
        url : '/api/admin/stats/userData'
      }
      
    });

    angular.extend(propertyApi, {
     
      fetchPropertiesStats : function(data){
        return this.fetch_properties_stats(data).$promise;
      },

      fetchUsersStats : function(data){
        return this.fetch_users_stats(data).$promise;
      } 

      
    });

    return propertyApi;
  }


}());

(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
  .module('admin')
  .factory('propertiesCRUDService', propertiesCRUDService);

  propertiesCRUDService.$inject = ['$resource'];

  function propertiesCRUDService($resource) {
   

    var propertyApi = $resource('/api/admin/property/:propertyId', {propertyId : '@propertyId' }, {
      

      toggle_show_in_listing : {
        method : 'PUT',
        url : '/api/admin/property/:propertyId/toggleShowInListing'
      },

      toggle_admin_verified : {
        method : 'PUT',
        url : '/api/admin/property/:propertyId/toggleAdminVerified'
      },

      delete_property : {
        method : 'DELETE',
        url : '/api/admin/property/:propertyId'
      }

    });

    angular.extend(propertyApi, {
     
      
      toggleShowInListing : function(id  , data){
        return this.toggle_show_in_listing({
          propertyId : id
        },data).$promise;
      },
      toggleAdminVerified : function(id ,data){
        return this.toggle_admin_verified({
          propertyId : id
        },data).$promise;
      },
      deleteProperty : function(id){
        return this.delete_property({
          propertyId : id
        }).$promise;

        
      }
    });

    return propertyApi;
  }


}());

'use strict';



angular.module('admin').factory('usersListService', ['$resource',
	function($resource) {

		var List =  $resource('/api/admin/usersList', {}, {

			getTenants: {
				method: 'GET',
				url: '/api/admin/usersList/tenants'
			},
			getBrokers: { 
				method: 'GET', 
				url: '/api/admin/usersList/brokers'
			},
			getLandlords: { 
				method: 'GET', 
				url: '/api/admin/usersList/landlords'
			},
			get_users_CSV : {
				method : 'GET',
				url : '/api/admin/getCSV'
			},
			get_unverified_users : {
				method : 'GET',
				url : '/api/admin/usersList/unverified-users'
			},
			getAdmins : {
				method : 'GET',
				url : '/api/admin/usersList/admins'
			}
		});

		angular.extend(List , {
			getTenantsList : function(searchObj){
				return this.getTenants(searchObj).$promise;
			},
			getBrokersList : function(searchObj){
				return this.getBrokers(searchObj).$promise;
			},
			getLandlordsList : function(searchObj){
				return this.getLandlords(searchObj).$promise;
			},
			getUsersCSV : function(dataObj){
				return this.get_users_CSV(dataObj).$promise;
			},
			getUnverifiedUsersList : function(data){
				return this.get_unverified_users(data).$promise;
			},
			getAdminsList : function(data){
				return this.getAdmins(data).$promise;
			}

		});

		return List;




	}
	]);

(function () {
  'use strict';

  angular
    .module('core.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('core.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenu('account', {
      roles: ['user']
    });

    menuService.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile',
      state: 'settings.profile'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile Picture',
      state: 'settings.picture'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Change Password',
      state: 'settings.password'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Manage Social Accounts',
      state: 'settings.accounts'
    });
  }
}());

(function () {
  'use strict';

  angular
  .module('core')
  .run(routeFilter);

  routeFilter.$inject = ['$rootScope', '$state', 'Authentication'];

  function routeFilter($rootScope, $state, Authentication) {
    $rootScope.$on('$stateChangeStart', stateChangeStart);
    $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeStart(event, toState, toParams, fromState, fromParams) {
      // Check authentication before changing state
      if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
        var allowed = false;

        for (var i = 0, roles = toState.data.roles; i < roles.length; i++) {
          if ((roles[i] === 'guest') || (Authentication.user && Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(roles[i]) !== -1)) {
            allowed = true;
            break;
          }
        }

        if (!allowed) {
          event.preventDefault();
          if (Authentication.user !== null && typeof Authentication.user === 'object') {
            $state.transitionTo('forbidden');
          } else {
            $state.go('index');
            
          }
        }
      }
    }

    function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
      // Record previous state
      storePreviousState(fromState, fromParams);
    }

    // Store previous state
    function storePreviousState(state, params) {
      // only store this state if it shouldn't be ignored
      if (!state.data || !state.data.ignoreState) {
        $state.previous = {
          state: state,
          params: params,
          href: $state.href(state, params)
        };
      }
    }
  }
}());

(function() {
  'use strict';

  angular
    .module('core.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.rule(function($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    $stateProvider
      .state('overview', {
        url: '/overview',
        templateUrl: '/modules/core/client/views/home.client.view.html',
        controller: 'HomeController',
      })
      .state('index', {
        url: '/',
        templateUrl: '/modules/core/client/views/index.client.view.html',
      })
      .state('not-found', {
        url: '/not-found',
        templateUrl: '/modules/core/client/views/404.client.view.html',
        controller: 'ErrorController',
        controllerAs: 'vm',
        params: {
          message: function($stateParams) {
            return $stateParams.message;
          }
        },
        data: {
          ignoreState: true,
          pageTitle: 'Not Found'
        }
      })
      .state('bad-request', {
        url: '/bad-request',
        templateUrl: '/modules/core/client/views/400.client.view.html',
        controller: 'ErrorController',
        controllerAs: 'vm',
        params: {
          message: function($stateParams) {
            return $stateParams.message;
          }
        },
        data: {
          ignoreState: true,
          pageTitle: 'Bad Request'
        }
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: '/modules/core/client/views/403.client.view.html',
        data: {
          ignoreState: true,
          pageTitle: 'Forbidden'
        }
      }).state('profile', {
        url: '/profile',
        templateUrl: '/modules/core/client/views/profile.client.view.html',
        params : {
          userId : null
        },
        controller : 'ProfileController',
        data : {
          roles : ['user' , 'admin']
        }
      });
  }
}());

(function() {
	'use strict';

	angular
	.module('core')
	.controller('EmailVerifyController', EmailVerifyController);

	EmailVerifyController.$inject = ['$scope', '$state', '$rootScope','Notification','Authentication','$timeout'];

	function EmailVerifyController($scope, $state, $rootScope,  Notification , Authentication ,$timeout) {
		
		var user = Authentication.user;
		if(!user || !user.email){
			return;
		}

		$scope.registeredEmail = user.email;
		$scope.displayPopup = false;
		$scope.hidePopup = false;
		$scope.isLoading = false;
		$scope.otpIncorrect = false;
		$scope.shownDiv = 'phone-shown';
		
				

		function addHideListenersForHidingPopup() {

			document.addEventListener('keydown', function(e) {
				if (e.key === "Escape") {
					if ($scope.displayPopup === true) {
						$scope.$apply(function() {
							$scope.displayPopup = false;
						});
					}
				}
			});
		}
		addHideListenersForHidingPopup();


		$rootScope.displayEmailVerifyPopup = function() {
			$scope.shownDiv = 'email-shown';
			$scope.otpIncorrect = false;
			$scope.displayPopup = true;
			$scope.hidePopup = false;
		}


		$scope.closeEmailVerifyPopup = function() {
			$scope.displayPopup = false;
			$scope.hidePopup = true;
		}


		$scope.onOTPVerifyClick = function(){
			if(!$scope.enteredOTP){
				return;
			}
			var otp = $scope.enteredOTP;
			$scope.otpIncorrect = false;
			$scope.isLoading = true;
			$timeout(function() {
				$scope.isLoading = false;
				if(otp==='123456'){
					$scope.shownDiv = 'correct-otp';
				}else{
					$scope.otpIncorrect = true;
				}
			}, 2000);

		}

		$scope.onOTPResendClick = function(){

		}

		


	}
}());

(function () {
  'use strict';

  angular
    .module('core')
    .controller('ErrorController', ErrorController);

  ErrorController.$inject = ['$stateParams'];

  function ErrorController($stateParams) {
    var vm = this;
    vm.errorMessage = null;

    // Display custom message if it was set
    if ($stateParams.message) vm.errorMessage = $stateParams.message;
  }
}());


(function() {
  'use strict';

  angular
  .module('core')
  .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', '$rootScope', '$window', 'commonService'];


  function HeaderController($scope, $state, Authentication, $rootScope, $window, commonService) {


    $rootScope.setNavBarActive = function(name){
      $scope.navBarHeading = name ;
    }

    $scope.isUserSignedIn = Authentication.user && Authentication.user.email ? true : false ;

    if($scope.isUserSignedIn){
      $scope.userName = Authentication.user.displayName ;
    }
    

    
    

    



  }
}());


(function() {
  'use strict';

  angular
  .module('core')
  .controller('HomeController', HomeController);

  HomeController.$inject = ['$rootScope', '$scope', '$state' , 'lfwStatsService' , 'Notification'];


  function HomeController($rootScope, $scope , $state , lfwStatsService , Notification) {

    $rootScope.setNavBarActive('overview');

    $scope.isPropertyDataLoading = true;
    $scope.isUserDataLoading = true;
    $scope.propertiesInfo = {};
    $scope.usersInfo = {};

    // $scope.propertiesInfo = {
    //   new : 14,
    //   total : 220,
    //   notReviewed : 15,
    //   increment : 7
    // }  

    // $scope.usersInfo = {
    //   new : 14,
    //   total : 220,
    //   notReviewed : 15,
    //   increment : 7
    // }    


    $scope.interestInfo = {
      clicksNew : 35,
      increment : 2
    }

    function apiFailureHandler(response) {
      Notification.error({ 
        message: 'api failure' , 
        title: 'Request Failed!!', 
        delay: 6000 }
        );
    }

    function fetchPropertiesStats(){
      lfwStatsService.fetchPropertiesStats().then(function(response){

        $scope.propertiesInfo = response.propertyStats;   
        

        $scope.isPropertyDataLoading = false;
      }).catch(apiFailureHandler);
    }

    function fetchUsersStats(){
      lfwStatsService.fetchUsersStats().then(function(response){
        $scope.usersInfo = response.userStats;
        $scope.isUserDataLoading = false;
      }).catch(apiFailureHandler);
    }

    fetchPropertiesStats();
    fetchUsersStats();

  }

  
}());




(function() {
	'use strict';

	angular
	.module('core')
	.controller('IndexController', IndexController);

	IndexController.$inject = ['$scope', '$state', '$rootScope', 'UsersService', 'MyUtilityService', 'Authentication', '$timeout','$window','Notification'];

	function IndexController($scope, $state, $rootScope, UsersService, MyUtilityService, Authentication, $timeout,$window , Notification) {

		var utils = MyUtilityService;

		if(Authentication.user && Authentication.user.email){
			$state.go('overview');
		}
		
		$scope.isLoading = false;

		$scope.loginData = {
			usernameOrEmail: "",
			password: ""
		};

		function setValidationVariables(){
			$scope.loginValidations = {
				isEmailPresent : true,
				isPasswordPresent : true
			}
		}
		setValidationVariables();

		function toggleLoader(show){
			$timeout(function() {
				$scope.$apply(function() {
					$scope.isLoading = show;
				});
			}, 100);
		}

		function loginValidations(){
			
			var isEmailPresent = $scope.loginData.usernameOrEmail !=="" ? true : false;
			var isPasswordPresent = $scope.loginData.password !== "" ? true : false ;


			$scope.loginValidations.isEmailPresent = isEmailPresent;
			$scope.loginValidations.isPasswordPresent = isPasswordPresent;

			return isEmailPresent && isPasswordPresent;
		}


		$scope.loginClick = function() {
			
			setValidationVariables();

			var isValid = loginValidations();
			if(isValid){
				toggleLoader(true);
				UsersService.userSignin($scope.loginData).then(loginInSucess).catch(loginInFailed);
			}
		}

		function loginInSucess(user){
			toggleLoader(false);
			Authentication.user = user;
			$scope.displayPopup = false;
			$window.location.reload();
		}

		function loginInFailed(){
			toggleLoader(false);
			Notification.error({ 
				message: "Incorrect username or password", 
				title: 'Login Failed!', 
				delay: 6000 }
				);
		}

		


	}
}());

(function() {
	'use strict';

	angular
	.module('core')
	.controller('MobileVerifyController', MobileVerifyController);

	MobileVerifyController.$inject = ['$scope', '$state', '$rootScope','Notification','Authentication','$timeout'];

	function MobileVerifyController($scope, $state, $rootScope,  Notification , Authentication ,$timeout) {
		
		var user = Authentication.user;
		if(!user || !user.email){
			return;
		}

		$scope.registeredNumber = user.phone;
		$scope.displayPopup = false;
		$scope.hidePopup = false;
		$scope.isLoading = false;
		$scope.otpIncorrect = false;
		$scope.shownDiv = 'phone-shown';
		
				

		function addHideListenersForHidingPopup() {

			document.addEventListener('keydown', function(e) {
				if (e.key === "Escape") {
					if ($scope.displayPopup === true) {
						$scope.$apply(function() {
							$scope.displayPopup = false;
						});
					}
				}
			});
		}
		addHideListenersForHidingPopup();


		$rootScope.displayMobileVerifyPopup = function() {
			$scope.shownDiv = 'phone-shown';
			$scope.otpIncorrect = false;
			$scope.displayPopup = true;
			$scope.hidePopup = false;
		}


		$scope.closeMobileVerifyPopup = function() {
			$scope.displayPopup = false;
			$scope.hidePopup = true;
		}


		$scope.onOTPVerifyClick = function(){
			if(!$scope.enteredOTP){
				return;
			}
			var otp = $scope.enteredOTP;
			$scope.otpIncorrect = false;
			$scope.isLoading = true;
			$timeout(function() {
				$scope.isLoading = false;
				if(otp==='123456'){
					$scope.shownDiv = 'correct-otp';
				}else{
					$scope.otpIncorrect = true;
				}
			}, 2000);

		}

		$scope.onOTPResendClick = function(){

		}

		


	}
}());

(function () {
	'use strict';

	angular
	.module('core')
	.controller('ProfileController', ProfileController);

	ProfileController.$inject = ['$scope', '$state', 'Authentication','$rootScope' , 'UsersService' , 'MyUtilityService' ,'$timeout'];


	function ProfileController($scope, $state, Authentication,$rootScope , UsersService , MyUtilityService , $timeout) {

		var user = Authentication.user;
		var utils = MyUtilityService;
		
		if(!user || !user.email){
			window.location.href = "/";
		}
		
		$scope.displayedTab = "Dashboard";
		$scope.isInEdit = {};
		$scope.editInformation ={};
		$scope.basicSaveBtnText = "Save" ;
		$scope.contactSaveBtnText = "Save" ;
		
		$scope.contactValidations = {
			isEmailvalid: true,
			isPhoneValid: true,
			isCodeValid: true,
			allValid : true
		}

		$scope.changeDisplayedTab = function(tab){
			$scope.displayedTab = tab;
		}

		

		function updateUserInformation(user){
			$scope.profile = user;

			$scope.basicInformation = {
				first_name : user.firstName,
				last_name : user.lastName
			}

			$scope.contactInformation = {
				phone : user.phone,
				email : user.email
			}

			$scope.editInformation= {

				basicInformation : {
					first_name : user.firstName,
					last_name : user.lastName
				},
				contactInformation : {
					phoneCode : user.phoneCode,
					phoneNumber : user.phoneNumber,
					email : user.email
				}

			}
		}

		updateUserInformation(user);


		$scope.editBlock = function(field){
			$scope.isInEdit[field] = true;
			
			//reset
			$scope.contactSaveBtnText = "Save" ;
			$scope.basicSaveBtnText = "Save" ;
			$timeout(function(){
				$scope.$apply(function(){
					$scope.contactValidations = {
						isEmailvalid: true,
						isPhoneValid: true,
						isCodeValid: true,
						allValid : true
					}
				});
			},100);

			
		}

		$scope.cancelEditField = function(field){
			$scope.isInEdit[field] = false;
		}

		$scope.showMobileVerifyPopup= function(){
			$rootScope.displayMobileVerifyPopup();
		}

		$scope.showEmailVerifyPopup= function(){
			$rootScope.displayEmailVerifyPopup();
		}

		function parseBasicEditInformation (basicInformation) {
			return {
				firstName : basicInformation.first_name,
				lastName :basicInformation.last_name
			}
		}

		$scope.saveBasicProfile = function(){
			$scope.basicSaveBtnText = "Saving" ;
			var parsedInfo = parseBasicEditInformation($scope.editInformation.basicInformation);
			UsersService.userUpdate(parsedInfo)
			.then(basicUpdateSuccess)
			.catch(basicUpdateFail);
		}

		function basicUpdateSuccess(response){
			updateUserInformation(response);
			$scope.basicSaveBtnText = "Saved" ;
			$timeout(function() {
				$scope.isInEdit['basic-info'] = false; 
			}, 500);
		}

		function basicUpdateFail(response){
			console.log('failed');
			// Notification.error({ 
			// 	message: response.data.message, 
			// 	title: 'Update Failed!', 
			// 	delay: 6000 }
			// 	);
		}

		function validateContactData(){

			var isEmailvalid = utils.isValidEmail($scope.editInformation.contactInformation.email);
			var isPhoneValid = utils.isValidMobile($scope.editInformation.contactInformation.phoneNumber);
			var isCodeValid = utils.isMobileCodeValid($scope.editInformation.contactInformation.phoneCode);

			$scope.contactValidations.isEmailvalid = isEmailvalid;
			$scope.contactValidations.isCodeValid = isCodeValid;
			$scope.contactValidations.isPhoneValid = isPhoneValid;

			$scope.contactValidations.allValid = isEmailvalid && isCodeValid && isPhoneValid;

			return isEmailvalid && isCodeValid && isPhoneValid ;

		}

		$scope.saveContactData = function(){
			var isvalid = validateContactData();
			if(isvalid){
				$scope.contactSaveBtnText = "Saving" ;
				UsersService.userUpdate($scope.editInformation.contactInformation)
				.then(contactUpdateSucess)
				.catch(basicUpdateFail);
			}
		}


		function contactUpdateSucess(response){
			updateUserInformation(response);
			$scope.contactSaveBtnText = "Saved" ;
			$timeout(function() {
				$scope.isInEdit['contact-info'] = false; 
			}, 500);
		}

		

	}



	//filter
	angular
	.module('core')
	.filter('underScoreSplit', function() {
		return function(x) {
			return x.split('_').join(' ');

		};
	});

}());

(function () {
	'use strict';

	angular
	.module('core')
	.controller('SearchController', SearchController);

	SearchController.$inject = ['$scope', '$state', '$rootScope' ,'$timeout' , 'OverridesService'];


	function SearchController($scope, $state, $rootScope , $timeout) {

		var filterURLMap = {
			'bhkFilters' : 'f-bhk',
			'constructionFilters' : 'f-construction',
			'furnishingFilters' : 'f-furnish',
			'ammenitiesFilters' : 'f-ammenities',
			'ownerFilters' : 'f-postedBy'
		};

		$scope.displaySearchPopup = false;
		$scope.hideSearchPopup = false;
		$scope.searchVal = '';
		$scope.searchDisabled = true;

		$scope.initScopeVariables = function(){
			
			$scope.filtersApplied = {
				bhkFilters : [],
				ownerFilters : [],
				constructionFilters : [],
				furnishingFilters : [],
				ammenitiesFilters : []
			}

			$scope.localitySearched = [];

			$scope.priceSlider = {
				minValue: 0,
				maxValue: 100,
				options: {
					floor: 0,
					ceil: 100,
					step: 1,
					translate: function(value) {
						return '₹' + value + ' K' ;
					}
				}
			};

			$scope.areaSlider = {
				minValue: 0,
				maxValue: 10000,
				options: {
					floor: 0,
					ceil: 10000,
					step: 10,
					translate: function(value) {
						return  value + ' sq ft' ;
					}
				}
			};
		}

		$scope.initScopeVariables();

		/*filter options*/
		$scope.bhkFilters = ['1 RK', '1 BHK' ,'2 BHK', '3 BHK', '4 BHK','5 BHK','6 BHK','7 BHK','8 BHK','9 BHK'];
		$scope.listedByFilters = ['Agent' , 'Owner'];
		$scope.constructionFilters  = ['Under Construction', 'Ready to move' ];
		$scope.furnishingFilters = ['Not Furnished', 'Semi-Furnished',  'Furnished','Fully-Furnished' ];
		$scope.ammenitiesFilters = [ 'Gas Pipeline', 'StoveWashing' ,'MachineFridge','Pets Allowed'];

		$scope.resetAllFilters = function(){
			$scope.initScopeVariables();
		}

		$rootScope.showSearchPopup = function(){
			$scope.refreshSlider();
			$scope.displaySearchPopup = true;
			$scope.hideSearchPopup = false;
		}

		$scope.closeSearchPopup = function(){
			$scope.refreshSlider();
			$scope.displaySearchPopup = false;
			$scope.hideSearchPopup = true;
		}


		$scope.removeSearchLocation =  function(location){
			$scope.localitySearched.removeFromArray(location);
			/*disable search btn if field empty */
			if($scope.localitySearched.length>0){
				$scope.searchDisabled = false;
			}else{
				$scope.searchDisabled = true;
			}
		}

		$scope.refreshSlider = function () {
			$timeout(function () {
				$scope.$broadcast('rzSliderForceRender');
			});
		};

		
		


		

		$scope.addFilterFromTags = function(type , value){
			switch (type) {

				case 'bhk-filter':{
					if($scope.filtersApplied.bhkFilters.indexOf(value)!==-1){
						$scope.filtersApplied.bhkFilters.removeFromArray(value);
					}else{
						$scope.filtersApplied.bhkFilters.push(value);
					}
					break;
				}

				case 'owner-filter':{
					if($scope.filtersApplied.ownerFilters.indexOf(value)!==-1){
						$scope.filtersApplied.ownerFilters.removeFromArray(value);
					}else{
						$scope.filtersApplied.ownerFilters.push(value);
					}
					break;
				}

				case 'construction-filter':{
					if($scope.filtersApplied.constructionFilters.indexOf(value)!==-1){
						$scope.filtersApplied.constructionFilters.removeFromArray(value);
					}else{
						$scope.filtersApplied.constructionFilters.push(value);
					}
					break;
				}

				case 'furnishing-filter':{
					if($scope.filtersApplied.furnishingFilters.indexOf(value)!==-1){
						$scope.filtersApplied.furnishingFilters.removeFromArray(value);
					}else{
						$scope.filtersApplied.furnishingFilters.push(value);
					}
					break;
				}

				case 'ammenities-filter':{
					if($scope.filtersApplied.ammenitiesFilters.indexOf(value)!==-1){
						$scope.filtersApplied.ammenitiesFilters.removeFromArray(value);
					}else{
						$scope.filtersApplied.ammenitiesFilters.push(value);
					}
					break;
				}


			}
		}



		$scope.searchFieldInputChange = function($e){		

			if($e.key==="Enter"){
				if($e.target.value!==""){

					if($scope.localitySearched.indexOf($e.target.value)===-1){
						$scope.localitySearched.push($e.target.value);
					}

					$e.target.value="";
				}
			}

			if($e.key==="Backspace"){
				if($scope.searchVal===''){
					$scope.localitySearched.splice($scope.localitySearched.length-1 , 1);
				}
			}

			$scope.searchVal = $e.target.value;
			
			/*disable search btn if field empty */
			if($scope.localitySearched.length>0){
				$scope.searchDisabled = false;
			}else{
				$scope.searchDisabled = true;
			}
		}


		$scope.onSearchClick = function(){

			if($scope.searchDisabled){
				return;
			}

			var searchUrl = "/listing?";
			var localityString = "search="+$scope.localitySearched.join(',');
			var filtersString = "";
			Object.keys($scope.filtersApplied).forEach(function(filterName){
				filtersString += ($scope.filtersApplied[filterName].join(',') ? "&"+filterURLMap[filterName]+"="+$scope.filtersApplied[filterName].join(',') : "" );
			});
			var priceFilter = '&f-price-min='+$scope.priceSlider.minValue+"&f-price-max="+$scope.priceSlider.maxValue;
			var areaFilter = '&f-area-min='+$scope.areaSlider.minValue+"&f-area-max="+$scope.areaSlider.maxValue;
			var searchUrl = searchUrl + localityString + filtersString +priceFilter + areaFilter;
			window.location.href = searchUrl;
		}


	}

}());

(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('core')
    .directive('autofocus', autofocus);

  autofocus.$inject = ['$timeout', '$window'];

  function autofocus($timeout, $window) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      if ($window.innerWidth >= 800) {
        $timeout(function() {
          var el = element[0];
          el.focus();
          el.selectionStart = el.selectionEnd = el.value.length;
        }, 100);
      }
    }
  }
}());

(function () {
  'use strict';

  angular.module('core')
    .directive('pageTitle', pageTitle);

  pageTitle.$inject = ['$rootScope', '$interpolate', '$state'];

  function pageTitle($rootScope, $interpolate, $state) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element) {
      $rootScope.$on('$stateChangeSuccess', listener);

      function listener(event, toState) {
        var applicationCoreTitle = 'MEAN.js',
          separeteBy = ' - ';
        if (toState.data && toState.data.pageTitle) {
          var stateTitle = $interpolate(toState.data.pageTitle)($state.$current.locals.globals);
          element.html(applicationCoreTitle + separeteBy + stateTitle);
        } else {
          element.html(applicationCoreTitle);
        }
      }
    }
  }
}());

(function () {
  'use strict';

  // https://gist.github.com/rhutchison/c8c14946e88a1c8f9216

  angular
    .module('core')
    .directive('showErrors', showErrors);

  showErrors.$inject = ['$timeout', '$interpolate'];

  function showErrors($timeout, $interpolate) {
    var directive = {
      restrict: 'A',
      require: '^form',
      compile: compile
    };

    return directive;

    function compile(elem, attrs) {
      if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
        if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
          throw new Error('show-errors element does not have the \'form-group\' or \'input-group\' class');
        }
      }

      return linkFn;

      function linkFn(scope, el, attrs, formCtrl) {
        var inputEl,
          inputName,
          inputNgEl,
          options,
          showSuccess,
          initCheck = false,
          showValidationMessages = false;

        options = scope.$eval(attrs.showErrors) || {};
        showSuccess = options.showSuccess || false;
        inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
        inputNgEl = angular.element(inputEl);
        inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

        if (!inputName) {
          throw new Error('show-errors element has no child input elements with a \'name\' attribute class');
        }

        scope.$watch(function () {
          return formCtrl[inputName] && formCtrl[inputName].$invalid;
        }, toggleClasses);

        scope.$on('show-errors-check-validity', checkValidity);
        scope.$on('show-errors-reset', reset);

        function checkValidity(event, name) {
          if (angular.isUndefined(name) || formCtrl.$name === name) {
            initCheck = true;
            showValidationMessages = true;

            return toggleClasses(formCtrl[inputName].$invalid);
          }
        }

        function reset(event, name) {
          if (angular.isUndefined(name) || formCtrl.$name === name) {
            return $timeout(function () {
              el.removeClass('has-error');
              el.removeClass('has-success');
              showValidationMessages = false;
            }, 0, false);
          }
        }

        function toggleClasses(invalid) {
          el.toggleClass('has-error', showValidationMessages && invalid);

          if (showSuccess) {
            return el.toggleClass('has-success', showValidationMessages && !invalid);
          }
        }
      }
    }
  }
}());

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

(function () {
  'use strict';

  angular
    .module('core')
    .factory('authInterceptor', authInterceptor);

  authInterceptor.$inject = ['$q', '$injector', 'Authentication'];

  function authInterceptor($q, $injector, Authentication) {
    var service = {
      responseError: responseError
    };

    return service;

    function responseError(rejection) {
      if (!rejection.config.ignoreAuthModule) {
        switch (rejection.status) {
          case 400:
            $injector.get('$state').go('bad-request', { message: rejection.data.message });
            break;
          case 401:
            // Deauthenticate the global user
            Authentication.user = null;
            $injector.get('$state').transitionTo('authentication.signin');
            break;
          case 403:
            $injector.get('$state').transitionTo('forbidden');
            break;
          case 404:
            $injector.get('$state').go('not-found', { message: rejection.data.message });
            break;
          case -1:  // Handle error if no response from server(Network Lost or Server not responding)
            var Notification = $injector.get('Notification');
            Notification.error({ message: 'No response received from server. Please try again later.', title: 'Error processing request!', delay: 5000 });
            break;
        }
      }
      // otherwise, default behaviour
      return $q.reject(rejection);
    }
  }
}());

(function () {
  'use strict';

  angular
    .module('core')
    .factory('menuService', menuService);

  function menuService () {
    var shouldRender;
    var service = {
      addMenu: addMenu,
      addMenuItem: addMenuItem,
      addSubMenuItem: addSubMenuItem,
      defaultRoles: ['user', 'admin'],
      getMenu: getMenu,
      menus: {},
      removeMenu: removeMenu,
      removeMenuItem: removeMenuItem,
      removeSubMenuItem: removeSubMenuItem,
      validateMenuExistence: validateMenuExistence
    };

    init();

    return service;

    // Add new menu object by menu id
    function addMenu (menuId, options) {
      options = options || {};

      // Create the new menu
      service.menus[menuId] = {
        roles: options.roles || service.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return service.menus[menuId];
    }

    // Add menu item object
    function addMenuItem (menuId, options) {
      // Validate that the menu exists
      service.validateMenuExistence(menuId);

      options = options || {};

      // Push new menu item
      service.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? service.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        options.items.forEach(function (subMenuItem) {
          service.addSubMenuItem(menuId, options.state, subMenuItem);
        });
      }

      // Return the menu object
      return service.menus[menuId];
    }

    // Add submenu item object
    function addSubMenuItem (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      service.validateMenuExistence(menuId);

      // Search for menu item
      service.menus[menuId].items.filter(function (item) {
        return item.state === parentItemState;
      }).forEach(function (item) {
        item.items.push({
          title: options.title || '',
          state: options.state || '',
          params: options.params || {},
          roles: ((options.roles === null || typeof options.roles === 'undefined') ? item.roles : options.roles),
          position: options.position || 0,
          shouldRender: shouldRender
        });
      });

      // Return the menu object
      return service.menus[menuId];
    }

    // Get the menu object by menu id
    function getMenu (menuId) {
      // Validate that the menu exists
      service.validateMenuExistence(menuId);

      // Return the menu object
      return service.menus[menuId];
    }

    function init () {
      // A private function for rendering decision
      shouldRender = function (user) {
        if (this.roles.indexOf('*') !== -1) {
          return true;
        }

        if (!user) {
          return false;
        }

        var matchingRoles = user.roles.filter(function (userRole) {
          return this.roles.indexOf(userRole) !== -1;
        }, this);

        return matchingRoles.length > 0;
      };

      // Adding the topbar menu
      addMenu('topbar', {
        roles: ['*']
      });
    }

    // Remove existing menu object by menu id
    function removeMenu (menuId) {
      // Validate that the menu exists
      service.validateMenuExistence(menuId);

      delete service.menus[menuId];
    }

    // Remove existing menu object by menu id
    function removeMenuItem (menuId, menuItemState) {
      // Validate that the menu exists
      service.validateMenuExistence(menuId);

      // Filter out menu items that do not match the current menu item state.
      service.menus[menuId].items = service.menus[menuId].items.filter(function (item) {
        return item.state !== menuItemState;
      });

      // Return the menu object
      return service.menus[menuId];
    }

    // Remove existing menu object by menu id
    function removeSubMenuItem (menuId, subMenuItemState) {
      // Validate that the menu exists
      service.validateMenuExistence(menuId);

      // Filter out sub-menu items that do not match the current subMenuItemState
      service.menus[menuId].items.forEach(function (parentMenuItem) {
        parentMenuItem.items = parentMenuItem.items.filter(function (subMenuItem) {
          return subMenuItem.state !== subMenuItemState;
        });
      });

      // Return the menu object
      return service.menus[menuId];
    }

    // Validate menu existence
    function validateMenuExistence (menuId) {
      if (!(menuId && menuId.length)) {
        throw new Error('MenuId was not provided');
      }
      if (!service.menus[menuId]) {
        throw new Error('Menu does not exist');
      }
      return true;
    }
  }
}());

(function () {
    'use strict';

    angular
    .module('core')
    .factory('OverridesService', OverridesService);

    OverridesService.$inject = [];


    function OverridesService() {

        Array.prototype.removeFromArray = function(val){
            var index = this.indexOf(val);
            if(index!==-1){
                this.splice(index,1);
            }
        };

        return null;

    }

}());

(function () {
  'use strict';

  // Create the Socket.io wrapper service
  angular
    .module('core')
    .factory('Socket', Socket);

  Socket.$inject = ['Authentication', '$state', '$timeout'];

  function Socket(Authentication, $state, $timeout) {
    var service = {
      connect: connect,
      emit: emit,
      on: on,
      removeListener: removeListener,
      socket: null
    };

    connect();

    return service;

    // Connect to Socket.io server
    function connect() {
      // Connect only when authenticated
      if (Authentication.user) {
        service.socket = io();
      }
    }

    // Wrap the Socket.io 'emit' method
    function emit(eventName, data) {
      if (service.socket) {
        service.socket.emit(eventName, data);
      }
    }

    // Wrap the Socket.io 'on' method
    function on(eventName, callback) {
      if (service.socket) {
        service.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    }

    // Wrap the Socket.io 'removeListener' method
    function removeListener(eventName) {
      if (service.socket) {
        service.socket.removeListener(eventName);
      }
    }
  }
}());

(function() {
  'use strict';

  angular
    .module('core')
    .factory('MyUtilityService', MyUtilityService);

  MyUtilityService.$inject = ['$location'];


  function MyUtilityService($location) {

    function getURIParameter(param) {
      return $location.$$search[param] || null;
    }

    function isValidEmail(email) {
      var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegex.test(email);
    }

    function isValidMobile(mobile) {
      var mobileRegex = /^[0-9]{10}$/;
      return mobileRegex.test(mobile);
    }

    function isMobileCodeValid(code) {
      var codeRegex = /^[+]{1}[0-9]{1,4}$/;
      return codeRegex.test(code);
    }


    function animatedScrollTo(y, duration) {
      var initial = document.body.scrollTop || document.documentElement.scrollTop;
      var initialDiff = Math.abs(y - initial);
      var scrolledCount = 0;


      var interval = setInterval(function() {
        var current = document.body.scrollTop || document.documentElement.scrollTop;

        if (duration < 0) {
          clearInterval(interval);
        }
        if (scrolledCount > initialDiff) {
          return;
        }
        duration = duration - 10;
        var difference = y - current;
        var scrollIncrement = Math.abs(difference / duration * 10);

        if (difference < 0) {
          window.scroll(0, current - scrollIncrement);
        } else {
          window.scroll(0, current + scrollIncrement);
        }
        scrolledCount = scrolledCount + scrollIncrement;

      }, 10);
    }
    var utils = {
      getURIParameter: getURIParameter,
      animatedScrollTo: animatedScrollTo,
      isValidMobile: isValidMobile,
      isValidEmail: isValidEmail,
      isMobileCodeValid: isMobileCodeValid

    };

    return utils;


  }





}());

(function() {
  'use strict';

  angular
    .module('details.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.rule(function($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });


    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });


    $stateProvider
      .state('details-property', {
        url: '/details/:slug',
        templateUrl: '/modules/details/client/views/details.client.view.html'
      });

  }


}());

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

(function () {
  'use strict';

  angular
    .module('listing.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    $stateProvider
      .state('listing', {
        url: '/listing',
        templateUrl: '/modules/listing/client/views/listing.client.view.html',

      });
  }
}());

(function() {
  'use strict';

  angular
    .module('core')
    .controller('ListingController', ListingController);

  ListingController.$inject = ['$scope', '$rootScope', 'MyUtilityService', '$location', 'OverridesService', '$timeout', 'ListingService'];


  function ListingController($scope, $rootScope, MyUtilityService, $location, OverridesService, $timeout, ListingService) {
    
    $scope.fetch_houses = function() {
     
    }



    var utils = MyUtilityService;


    var filterURLMap = {
      'Bedroom': 'f-bhk',
      'Construction Stage': 'f-construction',
      'Furnishing': 'f-furnish',
      'Ammenties': 'f-ammenities',
      'Posted by': 'f-postedBy'
    };
    var perPageCount = 10;




    /*init scope variable*/
    function initScopeVariables() {
      $scope.filtersApplied = {
        'Bedroom': {},
        'Construction Stage': {},
        'Furnishing': {},
        'Ammenties': {},
        'Posted by': {}
      }

      $scope.localitySearched = [];
      $scope.inputLocalitySearched = [];
      $scope.searchResultsFetched = false;
      $scope.searchDisabled = true;
      $scope.sortBy = "Relevance";
      $scope.noResultsFound = false;

    }

    /*init constant variables*/
    function initScopeConstantVariables() {
      //init filters list
      $scope.filtersList = {
        'Bedroom': ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK', '7 BHK', '8 BHK', '9 BHK'],
        'Construction Stage': ['Under Construction', 'Ready to move'],
        'Furnishing': ['Not Furnished', 'Semi-Furnished',  'Furnished','Fully-Furnished'],
        'Ammenties': ['loda', 'lehsun'],
        'Posted by': ['Owner', 'Agent']
      };

      $scope.allSortOptions = ['Relevance', 'Price L to H', 'Price H to L'];


      $scope.priceSlider = {
        minValue: 0,
        maxValue: 1000000,
        options: {
          floor: 0,
          ceil: 1000000,
          step: 1,
          translate: function(value) {
            return '₹' + value + ' K';
          }
        }
      };

      $scope.areaSlider = {
        minValue: 0,
        maxValue: 1000000,
        options: {
          floor: 0,
          ceil: 1000000,
          step: 10,
          translate: function(value) {
            return value + ' sq ft';
          }
        }
      };

    }

    $scope.refreshSlider = function() {
      $timeout(function() {
        $scope.$broadcast('rzSliderForceRender');
      });
    };

    initScopeVariables();
    initScopeConstantVariables();

    function getFiltersAndSearchSetInURI() {

      var bhkFilters = utils.getURIParameter('f-bhk'),
        constructionFilters = utils.getURIParameter('f-construction'),
        furnishingFilters = utils.getURIParameter('f-furnish'),
        ammenitiesFilters = utils.getURIParameter('f-ammenities'),
        postedFilters = utils.getURIParameter('f-postedBy'),
        priceMinVal = utils.getURIParameter('f-price-min'),
        priceMaxVal = utils.getURIParameter('f-price-max'),
        areaMinValue = utils.getURIParameter('f-area-min'),
        areaMaxValue = utils.getURIParameter('f-area-max'),
        pageNumber = utils.getURIParameter('f-page');

      $scope.filtersApplied = {
        'Bedroom': parseFiltersString(bhkFilters),
        'Construction Stage': parseFiltersString(constructionFilters),
        'Furnishing': parseFiltersString(furnishingFilters),
        'Ammenties': parseFiltersString(ammenitiesFilters),
        'Posted by': parseFiltersString(postedFilters)
      };

      $scope.priceSlider.minValue = priceMinVal ? priceMinVal : 0;
      $scope.priceSlider.maxValue = priceMaxVal ? priceMaxVal : 1000000;
      $scope.areaSlider.minValue = areaMinValue ? areaMinValue : 0;
      $scope.areaSlider.maxValue = areaMaxValue ? areaMaxValue : 1000000;

      $scope.localitySearched = utils.getURIParameter('search') ? utils.getURIParameter('search').split(',') : [];
      $scope.inputLocalitySearched = utils.getURIParameter('search') ? utils.getURIParameter('search').split(',') : [];
      $scope.pageNumber = pageNumber ? pageNumber : 1;

    }

    getFiltersAndSearchSetInURI();
    fetchListingDataForFilters();
    toggleSearchDisbale();


    $scope.applyCheckboxFilters = function(filterName) {
      applyFilters(filterName);
    }

    $scope.removeSearchLocation = function(location) {
      $scope.inputLocalitySearched.removeFromArray(location);
      toggleSearchDisbale();
    }

    /* apply filters as in actual */
    function applyFilters(filterName) {
      saveFiltersInURI(filterName);
      fetchListingDataForFilters();
    }

    function toggleSearchDisbale() {

      /*disable search btn if field empty */
      if ($scope.inputLocalitySearched.length > 0) {
        $scope.searchDisabled = false;
      } else {
        $scope.searchDisabled = false;
      }
    }

    /*save saerch in uri*/
    function saveSearchInURI() {
      $location.search('search', $scope.inputLocalitySearched.join(','));
    }


    /* update filters in url */
    function saveFiltersInURI(filterName) {

      if (filterName === "slider") {
        $location.search('f-price-min', $scope.priceSlider.minValue);
        $location.search('f-price-max', $scope.priceSlider.maxValue);
        $location.search('f-area-min', $scope.areaSlider.minValue);
        $location.search('f-area-max', $scope.areaSlider.maxValue);
        return;
      }

      var filterStringArray = [];
      Object.keys($scope.filtersApplied[filterName]).forEach(function(key) {
        if ($scope.filtersApplied[filterName][key]) {
          filterStringArray.push(key);
        }
      });
      $location.search(filterURLMap[filterName], filterStringArray.join(','));

    }


    /*parse filters string*/
    function parseFiltersString(filterString) {
      if (!filterString) {
        return {};
      }
      var filters = filterString.split(','),
        filterObj = {};

      filters.forEach(function(filter) {
        filterObj[filter] = true;
      });

      return filterObj;
    }


    /**/
    function scrollToTop() {
      utils.animatedScrollTo(0, 500);
    }


    function toggleLoader(show){
      $timeout(function() {
        $scope.$apply(function() {
          $scope.searchResultsFetched = !show;
        });
      }, 100);

    }   

    /* fetch listing data for filters */
    function fetchListingDataForFilters() {

      //scroll to top on applying filter
      scrollToTop();

      toggleLoader(true);

      var searchObj = {};
      searchObj.searchQuery = $scope.localitySearched;
      searchObj.filters = angular.extend({},$scope.filtersApplied);

      /*extend filters obj*/
      searchObj.filters.priceMinVal = $scope.priceSlider.minValue;
      searchObj.filters.priceMaxVal = $scope.priceSlider.maxValue;
      searchObj.filters.areaMinVal = $scope.areaSlider.minValue;
      searchObj.filters.areaMaxVal = $scope.areaSlider.maxValue;

      searchObj.sortBy = $scope.sortBy;

      searchObj.skip = perPageCount * ($scope.pageNumber - 1);
      searchObj.limit = perPageCount;
      searchObj.page = $scope.pageNumber;

      ListingService.searchHouse(searchObj)
        .then(searchFetchSucess);

      console.log(searchObj);

    }


    /*handel api sucess*/
    function searchFetchSucess(data){
        console.log(data);
        if(data.properties.length===0){
          $scope.noResultsFound = true;
        }else{
          $scope.noResultsFound = false;
        }
        $scope.house_list = data.properties;
        toggleLoader(false);
    }

    
    /*earch input chnag*/
    $scope.searchFieldInputChange = function($e) {

      if ($e.key === "Enter") {
        if ($e.target.value !== "") {

          if ($scope.inputLocalitySearched.indexOf($e.target.value) === -1) {
            $scope.inputLocalitySearched.push($e.target.value);
          }

          $e.target.value = "";
        }
      }

      if ($e.key === "Backspace") {
        if ($scope.searchVal === '') {
          $scope.inputLocalitySearched.splice($scope.inputLocalitySearched.length - 1, 1);
        }
      }

      $scope.searchVal = $e.target.value;
      toggleSearchDisbale();
    }


    /*on search click*/
    $scope.onSearchClick = function() {

      if ($scope.searchDisabled) {
        return;
      }
      angular.copy($scope.inputLocalitySearched,$scope.localitySearched);

      saveSearchInURI();
      fetchListingDataForFilters();
    }

    $scope.$on("slideEnded", function() {
      //on slide end
      applyFilters('slider');
    });


    /* function to remove filters */
    $scope.removeAppliedFilter = function(filterName , filter ){
      $scope.filtersApplied[filterName][filter] = false;
      applyFilters(filterName);
    }

    $scope.removeSearchApplied = function(search){
      $scope.localitySearched.removeFromArray(search);
      fetchListingDataForFilters();
    }

  }

}());

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

// (function () {
//   'use strict';

//   angular
//     .module('users.admin')
//     .run(menuConfig);

//   menuConfig.$inject = ['menuService'];

//   // Configuring the Users module
//   function menuConfig(menuService) {
//     menuService.addSubMenuItem('topbar', 'admin', {
//       title: 'Manage Users',
//       state: 'admin.users'
//     });
//   }
// }());

// (function () {
//   'use strict';

//   // Setting up route
//   angular
//     .module('users.admin.routes')
//     .config(routeConfig);

//   routeConfig.$inject = ['$stateProvider'];

//   function routeConfig($stateProvider) {
//     $stateProvider
//       .state('admin.users', {
//         url: '/users',
//         templateUrl: '/modules/users/client/views/admin/list-users.client.view.html',
//         controller: 'UserListController',
//         controllerAs: 'vm',
//         data: {
//           pageTitle: 'Users List'
//         }
//       })
//       .state('admin.user', {
//         url: '/users/:userId',
//         templateUrl: '/modules/users/client/views/admin/view-user.client.view.html',
//         controller: 'UserController',
//         controllerAs: 'vm',
//         resolve: {
//           userResolve: getUser
//         },
//         data: {
//           pageTitle: 'Edit {{ userResolve.displayName }}'
//         }
//       })
//       .state('admin.user-edit', {
//         url: '/users/:userId/edit',
//         templateUrl: '/modules/users/client/views/admin/edit-user.client.view.html',
//         controller: 'UserController',
//         controllerAs: 'vm',
//         resolve: {
//           userResolve: getUser
//         },
//         data: {
//           pageTitle: 'Edit User {{ userResolve.displayName }}'
//         }
//       });

//     getUser.$inject = ['$stateParams', 'AdminService'];

//     function getUser($stateParams, AdminService) {
//       return AdminService.get({
//         userId: $stateParams.userId
//       }).$promise;
//     }
//   }
// }());

// (function () {
//   'use strict';

//   // Setting up route
//   angular
//     .module('users.routes')
//     .config(routeConfig);

//   routeConfig.$inject = ['$stateProvider'];

//   function routeConfig($stateProvider) {
//     // Users state routing
//     $stateProvider
//       .state('settings', {
//         abstract: true,
//         url: '/settings',
//         templateUrl: '/modules/users/client/views/settings/settings.client.view.html',
//         controller: 'SettingsController',
//         controllerAs: 'vm',
//         data: {
//           roles: ['user', 'admin']
//         }
//       })
//       .state('settings.profile', {
//         url: '/profile',
//         templateUrl: '/modules/users/client/views/settings/edit-profile.client.view.html',
//         controller: 'EditProfileController',
//         controllerAs: 'vm',
//         data: {
//           pageTitle: 'Settings'
//         }
//       })
//       .state('settings.password', {
//         url: '/password',
//         templateUrl: '/modules/users/client/views/settings/change-password.client.view.html',
//         controller: 'ChangePasswordController',
//         controllerAs: 'vm',
//         data: {
//           pageTitle: 'Settings password'
//         }
//       })
//       .state('settings.accounts', {
//         url: '/accounts',
//         templateUrl: '/modules/users/client/views/settings/manage-social-accounts.client.view.html',
//         controller: 'SocialAccountsController',
//         controllerAs: 'vm',
//         data: {
//           pageTitle: 'Settings accounts'
//         }
//       })
//       .state('settings.picture', {
//         url: '/picture',
//         templateUrl: '/modules/users/client/views/settings/change-profile-picture.client.view.html',
//         controller: 'ChangeProfilePictureController',
//         controllerAs: 'vm',
//         data: {
//           pageTitle: 'Settings picture'
//         }
//       })
//       .state('authentication', {
//         abstract: true,
//         url: '/authentication',
//         templateUrl: '/modules/users/client/views/authentication/authentication.client.view.html',
//         controller: 'AuthenticationController',
//         controllerAs: 'vm'
//       })
//       .state('authentication.signup', {
//         url: '/signup',
//         templateUrl: '/modules/users/client/views/authentication/signup.client.view.html',
//         controller: 'AuthenticationController',
//         controllerAs: 'vm',
//         data: {
//           pageTitle: 'Signup'
//         }
//       })
//       .state('authentication.signin', {
//         url: '/signin?err',
//         templateUrl: '/modules/users/client/views/authentication/signin.client.view.html',
//         controller: 'AuthenticationController',
//         controllerAs: 'vm',
//         data: {
//           pageTitle: 'Signin'
//         }
//       })
//       .state('password', {
//         abstract: true,
//         url: '/password',
//         template: '<ui-view/>'
//       })
//       .state('password.forgot', {
//         url: '/forgot',
//         templateUrl: '/modules/users/client/views/password/forgot-password.client.view.html',
//         controller: 'PasswordController',
//         controllerAs: 'vm',
//         data: {
//           pageTitle: 'Password forgot'
//         }
//       })
//       .state('password.reset', {
//         abstract: true,
//         url: '/reset',
//         template: '<ui-view/>'
//       })
//       .state('password.reset.invalid', {
//         url: '/invalid',
//         templateUrl: '/modules/users/client/views/password/reset-password-invalid.client.view.html',
//         data: {
//           pageTitle: 'Password reset invalid'
//         }
//       })
//       .state('password.reset.success', {
//         url: '/success',
//         templateUrl: '/modules/users/client/views/password/reset-password-success.client.view.html',
//         data: {
//           pageTitle: 'Password reset success'
//         }
//       })
//       .state('password.reset.form', {
//         url: '/:token',
//         templateUrl: '/modules/users/client/views/password/reset-password.client.view.html',
//         controller: 'PasswordController',
//         controllerAs: 'vm',
//         data: {
//           pageTitle: 'Password reset form'
//         }
//       });
//   }
// }());

// (function () {
//   'use strict';

//   angular
//     .module('users.admin')
//     .controller('UserListController', UserListController);

//   UserListController.$inject = ['$scope', '$filter', 'AdminService'];

//   function UserListController($scope, $filter, AdminService) {
//     var vm = this;
//     vm.buildPager = buildPager;
//     vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
//     vm.pageChanged = pageChanged;

//     AdminService.query(function (data) {
//       vm.users = data;
//       vm.buildPager();
//     });

//     function buildPager() {
//       vm.pagedItems = [];
//       vm.itemsPerPage = 15;
//       vm.currentPage = 1;
//       vm.figureOutItemsToDisplay();
//     }

//     function figureOutItemsToDisplay() {
//       vm.filteredItems = $filter('filter')(vm.users, {
//         $: vm.search
//       });
//       vm.filterLength = vm.filteredItems.length;
//       var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
//       var end = begin + vm.itemsPerPage;
//       vm.pagedItems = vm.filteredItems.slice(begin, end);
//     }

//     function pageChanged() {
//       vm.figureOutItemsToDisplay();
//     }
//   }
// }());

// (function () {
//   'use strict';

//   angular
//     .module('users.admin')
//     .controller('UserController', UserController);

//   UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', 'Notification'];

//   function UserController($scope, $state, $window, Authentication, user, Notification) {
//     var vm = this;

//     vm.authentication = Authentication;
//     vm.user = user;
//     vm.remove = remove;
//     vm.update = update;
//     vm.isContextUserSelf = isContextUserSelf;

//     function remove(user) {
//       if ($window.confirm('Are you sure you want to delete this user?')) {
//         if (user) {
//           user.$remove();

//           vm.users.splice(vm.users.indexOf(user), 1);
//           Notification.success('User deleted successfully!');
//         } else {
//           vm.user.$remove(function () {
//             $state.go('admin.users');
//             Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
//           });
//         }
//       }
//     }

//     function update(isValid) {
//       if (!isValid) {
//         $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

//         return false;
//       }

//       var user = vm.user;

//       user.$update(function () {
//         $state.go('admin.user', {
//           userId: user._id
//         });
//         Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
//       }, function (errorResponse) {
//         Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
//       });
//     }

//     function isContextUserSelf() {
//       return vm.user.username === vm.authentication.user.username;
//     }
//   }
// }());

/*(function () {
  'use strict';

  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['$scope', '$state', 'UsersService', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification'];

  function AuthenticationController($scope, $state, UsersService, $location, $window, Authentication, PasswordValidator, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.signup = signup;
    vm.signin = signin;
    vm.callOauthProvider = callOauthProvider;
    vm.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;

    // Get an eventual error defined in the URL query string:
    if ($location.search().err) {
      Notification.error({ message: $location.search().err });
    }

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    function signup(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      UsersService.userSignup(vm.credentials)
        .then(onUserSignupSuccess)
        .catch(onUserSignupError);
    }

    function signin(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      UsersService.userSignin(vm.credentials)
        .then(onUserSigninSuccess)
        .catch(onUserSigninError);
    }

    // OAuth provider request
    function callOauthProvider(url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }

    // Authentication Callbacks

    function onUserSignupSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.user = response;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!' });
      // And redirect to the previous or home page
      $state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onUserSignupError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!', delay: 6000 });
    }

    function onUserSigninSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.user = response;
      Notification.info({ message: 'Welcome ' + response.firstName });
      // And redirect to the previous or home page
      $state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onUserSigninError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signin Error!', delay: 6000 });
    }
  }
}());
*/
/*(function () {
  'use strict';

  angular
    .module('users')
    .controller('PasswordController', PasswordController);

  PasswordController.$inject = ['$scope', '$stateParams', 'UsersService', '$location', 'Authentication', 'PasswordValidator', 'Notification'];

  function PasswordController($scope, $stateParams, UsersService, $location, Authentication, PasswordValidator, Notification) {
    var vm = this;

    vm.resetUserPassword = resetUserPassword;
    vm.askForPasswordReset = askForPasswordReset;
    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    function askForPasswordReset(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.forgotPasswordForm');

        return false;
      }

      UsersService.requestPasswordReset(vm.credentials)
        .then(onRequestPasswordResetSuccess)
        .catch(onRequestPasswordResetError);
    }

    // Change user password
    function resetUserPassword(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.resetPasswordForm');

        return false;
      }

      UsersService.resetPassword($stateParams.token, vm.passwordDetails)
        .then(onResetPasswordSuccess)
        .catch(onResetPasswordError);
    }

    // Password Reset Callbacks

    function onRequestPasswordResetSuccess(response) {
      // Show user success message and clear form
      vm.credentials = null;
      Notification.success({ message: response.message, title: '<i class="glyphicon glyphicon-ok"></i> Password reset email sent successfully!' });
    }

    function onRequestPasswordResetError(response) {
      // Show user error message and clear form
      vm.credentials = null;
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Failed to send password reset email!', delay: 4000 });
    }

    function onResetPasswordSuccess(response) {
      // If successful show success message and clear form
      vm.passwordDetails = null;

      // Attach user profile
      Authentication.user = response;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Password reset successful!' });
      // And redirect to the index page
      $location.path('/password/reset/success');
    }

    function onResetPasswordError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Password reset failed!', delay: 4000 });
    }
  }
}());
*/
// (function () {
//   'use strict';

//   angular
//     .module('users')
//     .controller('ChangePasswordController', ChangePasswordController);

//   ChangePasswordController.$inject = ['$scope', '$http', 'Authentication', 'UsersService', 'PasswordValidator', 'Notification'];

//   function ChangePasswordController($scope, $http, Authentication, UsersService, PasswordValidator, Notification) {
//     var vm = this;

//     vm.user = Authentication.user;
//     vm.changeUserPassword = changeUserPassword;
//     vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

//     // Change user password
//     function changeUserPassword(isValid) {

//       if (!isValid) {
//         $scope.$broadcast('show-errors-check-validity', 'vm.passwordForm');

//         return false;
//       }

//       UsersService.changePassword(vm.passwordDetails)
//         .then(onChangePasswordSuccess)
//         .catch(onChangePasswordError);
//     }

//     function onChangePasswordSuccess(response) {
//       // If successful show success message and clear form
//       Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Password Changed Successfully' });
//       vm.passwordDetails = null;
//     }

//     function onChangePasswordError(response) {
//       Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Password change failed!' });
//     }
//   }
// }());

/*(function () {
  'use strict';

  angular
    .module('users')
    .controller('ChangeProfilePictureController', ChangeProfilePictureController);

  ChangeProfilePictureController.$inject = ['$timeout', 'Authentication', 'Upload', 'Notification'];

  function ChangeProfilePictureController($timeout, Authentication, Upload, Notification) {
    var vm = this;

    vm.user = Authentication.user;
    vm.progress = 0;

    vm.upload = function (dataUrl) {

      Upload.upload({
        url: '/api/users/picture',
        data: {
          newProfilePicture: dataUrl
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response.data);
        });
      }, function (response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show success message
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Successfully changed profile picture' });

      // Populate user object
      vm.user = Authentication.user = response;

      // Reset form
      vm.fileSelected = false;
      vm.progress = 0;
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.progress = 0;

      // Show error message
      Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Failed to change profile picture' });
    }
  }
}());
*/
/*(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$scope', '$http', '$location', 'UsersService', 'Authentication', 'Notification'];

  function EditProfileController($scope, $http, $location, UsersService, Authentication, Notification) {
    var vm = this;

    vm.user = Authentication.user;
    vm.updateUserProfile = updateUserProfile;

    // Update a user profile
    function updateUserProfile(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = new UsersService(vm.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'vm.userForm');

        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Edit profile successful!' });
        Authentication.user = response;
      }, function (response) {
        Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Edit profile failed!' });
      });
    }
  }
}());
*/
/*(function () {
  'use strict';

  angular
    .module('users')
    .controller('SocialAccountsController', SocialAccountsController);

  SocialAccountsController.$inject = ['$state', '$window', 'UsersService', 'Authentication', 'Notification'];

  function SocialAccountsController($state, $window, UsersService, Authentication, Notification) {
    var vm = this;

    vm.user = Authentication.user;
    vm.hasConnectedAdditionalSocialAccounts = hasConnectedAdditionalSocialAccounts;
    vm.isConnectedSocialAccount = isConnectedSocialAccount;
    vm.removeUserSocialAccount = removeUserSocialAccount;
    vm.callOauthProvider = callOauthProvider;

    // Check if there are additional accounts
    function hasConnectedAdditionalSocialAccounts() {
      return (vm.user.additionalProvidersData && Object.keys(vm.user.additionalProvidersData).length);
    }

    // Check if provider is already in use with current user
    function isConnectedSocialAccount(provider) {
      return vm.user.provider === provider || (vm.user.additionalProvidersData && vm.user.additionalProvidersData[provider]);
    }

    // Remove a user social account
    function removeUserSocialAccount(provider) {

      UsersService.removeSocialAccount(provider)
        .then(onRemoveSocialAccountSuccess)
        .catch(onRemoveSocialAccountError);
    }

    function onRemoveSocialAccountSuccess(response) {
      // If successful show success message and clear form
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Removed successfully!' });
      vm.user = Authentication.user = response;
    }

    function onRemoveSocialAccountError(response) {
      Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Remove failed!' });
    }

    // OAuth provider request
    function callOauthProvider(url) {
      url += '?redirect_to=' + encodeURIComponent($state.$current.url.prefix);

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }
  }
}());
*/
/*(function () {
  'use strict';

  angular
    .module('users')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$scope', 'Authentication'];

  function SettingsController($scope, Authentication) {
    var vm = this;

    vm.user = Authentication.user;
  }
}());
*/
// (function () {
//   'use strict';

//   angular
//     .module('users')
//     .directive('passwordValidator', passwordValidator);

//   passwordValidator.$inject = ['PasswordValidator'];

//   function passwordValidator(PasswordValidator) {
//     var directive = {
//       require: 'ngModel',
//       link: link
//     };

//     return directive;

//     function link(scope, element, attrs, ngModel) {
//       ngModel.$validators.requirements = function (password) {
//         var status = true;
//         if (password) {
//           var result = PasswordValidator.getResult(password);
//           var requirementsIdx = 0;

//           // Requirements Meter - visual indicator for users
//           var requirementsMeter = [{
//             color: 'danger',
//             progress: '20'
//           }, {
//             color: 'warning',
//             progress: '40'
//           }, {
//             color: 'info',
//             progress: '60'
//           }, {
//             color: 'primary',
//             progress: '80'
//           }, {
//             color: 'success',
//             progress: '100'
//           }];

//           if (result.errors.length < requirementsMeter.length) {
//             requirementsIdx = requirementsMeter.length - result.errors.length - 1;
//           }

//           scope.requirementsColor = requirementsMeter[requirementsIdx].color;
//           scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

//           if (result.errors.length) {
//             scope.getPopoverMsg = PasswordValidator.getPopoverMsg();
//             scope.passwordErrors = result.errors;
//             status = false;
//           } else {
//             scope.getPopoverMsg = '';
//             scope.passwordErrors = [];
//             status = true;
//           }
//         }
//         return status;
//       };
//     }
//   }
// }());

// (function () {
//   'use strict';

//   angular
//     .module('users')
//     .directive('passwordVerify', passwordVerify);

//   function passwordVerify() {
//     var directive = {
//       require: 'ngModel',
//       scope: {
//         passwordVerify: '='
//       },
//       link: link
//     };

//     return directive;

//     function link(scope, element, attrs, ngModel) {
//       var status = true;
//       scope.$watch(function () {
//         var combined;
//         if (scope.passwordVerify || ngModel) {
//           combined = scope.passwordVerify + '_' + ngModel;
//         }
//         return combined;
//       }, function (value) {
//         if (value) {
//           ngModel.$validators.passwordVerify = function (password) {
//             var origin = scope.passwordVerify;
//             return (origin === password);
//           };
//         }
//       });
//     }
//   }
// }());

// (function () {
//   'use strict';

//   // Users directive used to force lowercase input
//   angular
//     .module('users')
//     .directive('lowercase', lowercase);

//   function lowercase() {
//     var directive = {
//       require: 'ngModel',
//       link: link
//     };

//     return directive;

//     function link(scope, element, attrs, modelCtrl) {
//       modelCtrl.$parsers.push(function (input) {
//         return input ? input.toLowerCase() : '';
//       });
//       element.css('text-transform', 'lowercase');
//     }
//   }
// }());

(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('users.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$window'];

  function Authentication($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
}());

// (function () {
//   'use strict';

//   // PasswordValidator service used for testing the password strength
//   angular
//     .module('users.services')
//     .factory('PasswordValidator', PasswordValidator);

//   PasswordValidator.$inject = ['$window'];

//   function PasswordValidator($window) {
//     var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

//     var service = {
//       getResult: getResult,
//       getPopoverMsg: getPopoverMsg
//     };

//     return service;

//     function getResult(password) {
//       var result = owaspPasswordStrengthTest.test(password);
//       return result;
//     }

//     function getPopoverMsg() {
//       var popoverMsg = 'Please enter a passphrase or password with ' + owaspPasswordStrengthTest.configs.minLength + ' or more characters, numbers, lowercase, uppercase, and special characters.';

//       return popoverMsg;
//     }
//   }

// }());

(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('users.services')
    .factory('UsersService', UsersService);

  UsersService.$inject = ['$resource'];

  function UsersService($resource) {
    var Users = $resource('/api/users', {}, {
      update: {
        method: 'PUT'
      },
      updatePassword: {
        method: 'POST',
        url: '/api/users/password'
      },
      deleteProvider: {
        method: 'DELETE',
        url: '/api/users/accounts',
        params: {
          provider: '@provider'
        }
      },
      sendPasswordResetToken: {
        method: 'POST',
        url: '/api/auth/forgot'
      },
      resetPasswordWithToken: {
        method: 'POST',
        url: '/api/auth/reset/:token'
      },
      signup: {
        method: 'POST',
        url: '/api/auth/signup'
      },
      signin: {
        method: 'POST',
        url: '/api/auth/signin'
      }
    });

    angular.extend(Users, {
      changePassword: function (passwordDetails) {
        return this.updatePassword(passwordDetails).$promise;
      },
      removeSocialAccount: function (provider) {
        return this.deleteProvider({
          provider: provider // api expects provider as a querystring parameter
        }).$promise;
      },
      requestPasswordReset: function (credentials) {
        return this.sendPasswordResetToken(credentials).$promise;
      },
      resetPassword: function (token, passwordDetails) {
        return this.resetPasswordWithToken({
          token: token // api expects token as a parameter (i.e. /:token)
        }, passwordDetails).$promise;
      },
      userSignup: function (credentials) {
        return this.signup(credentials).$promise;
      },
      userSignin: function (credentials) {
        return this.signin(credentials).$promise;
      },
      userUpdate : function(data){
        return this.update(data).$promise;
      }
    });

    return Users;
  }

  // // TODO this should be Users service
  // angular
  //   .module('users.admin.services')
  //   .factory('AdminService', AdminService);

  // AdminService.$inject = ['$resource'];

  // function AdminService($resource) {
  //   return $resource('/api/users/:userId', {
  //     userId: '@_id'
  //   }, {
  //     update: {
  //       method: 'PUT'
  //     }
  //   });
  // }
}());
