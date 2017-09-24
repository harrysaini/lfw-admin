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
