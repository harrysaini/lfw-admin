(function() {
	'use strict';

	angular
	.module('core')
	.controller('SignupLoginController', SignupLoginController);

	SignupLoginController.$inject = ['$scope', '$state', '$rootScope', 'UsersService', 'MyUtilityService', 'Authentication', '$timeout','$window','Notification'];

	function SignupLoginController($scope, $state, $rootScope, UsersService, MyUtilityService, Authentication, $timeout,$window , Notification) {

		var utils = MyUtilityService;

		$scope.displayPopup = false;
		$scope.hidePopup = false;
		$scope.mobileComponentDisplayed = 'signup';
		$scope.displayViewPassword = true;
		$scope.showPassword = false;

		function reInitScopeVariables(){

			$scope.signUpData = {
				email: "",
				password: "",
				phoneCode: '+91',
				phoneNumber: null,
				userRole: ""
			};

			$scope.loginData = {
				usernameOrEmail: "",
				password: ""
			};

			$scope.signUpValidations = {
				isEmailvalid: true,
				isMobileVaild: true,
				isCodeValid: true,
				allValid: false,
				isUserRoleSet: true,
				isPasswordSet: true
			}
		}
		
		reInitScopeVariables();
		

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

		$rootScope.displayLoginSignupPopup = function() {
			reInitScopeVariables();
			$scope.displayPopup = true;
			$scope.hidePopup = false;
		}

		$scope.changeMobileDisplayed = function(displayedComponent) {
			$scope.mobileComponentDisplayed = displayedComponent;
		}

		$scope.closeSignupLoginPopup = function() {
			$scope.displayPopup = false;
			$scope.hidePopup = true;
		}

		function validateSignUpData() {

			var isEmailvalid = utils.isValidEmail($scope.signUpData.email);
			var isMobileVaild = utils.isValidMobile($scope.signUpData.phoneNumber);
			var isCodeValid = utils.isMobileCodeValid($scope.signUpData.phoneCode);
			var isUserRoleSet = $scope.signUpData.userRole === "" ? false : true;
			var isPasswordSet = $scope.signUpData.password === "" ? false : true;

			$scope.signUpValidations.isEmailvalid = isEmailvalid;
			$scope.signUpValidations.isMobileVaild = isMobileVaild;
			$scope.signUpValidations.isCodeValid = isCodeValid;
			$scope.signUpValidations.isUserRoleSet = isUserRoleSet;
			$scope.signUpValidations.isPasswordSet = isPasswordSet;

			$scope.signUpValidations.allValid = isEmailvalid && isMobileVaild && isCodeValid && isUserRoleSet && isPasswordSet;

			return $scope.signUpValidations.allValid;
		}


		$scope.signUpClick = function() {
			var isValid = validateSignUpData();
			if (isValid) {
				UsersService.userSignup($scope.signUpData).then(signUpSucess).catch(signUpFailed);
			}
		}


		function signUpSucess(user) {
			Authentication.user = user;
			$scope.displayPopup = false;
			$window.location.reload();
		}

		function signUpFailed(response) {
			Notification.error({ 
				message: response.data.message, 
				title: 'Signup Error!', 
				delay: 6000 }
				);
		}


		$scope.loginClick = function() {
			UsersService.userSignin($scope.loginData).then(loginInSucess).catch(loginInFailed);
		}

		function loginInSucess(user){
			Authentication.user = user;
			$scope.displayPopup = false;
			$window.location.reload();
		}

		function loginInFailed(){
			Notification.error({ 
				message: "Incorrect username or password", 
				title: 'Login Failed!', 
				delay: 6000 }
				);
		}

		$scope.displayPasswordField = function() {

			$scope.displayViewPassword = !$scope.displayViewPassword;
			$scope.showPassword = !$scope.showPassword;
			if ($scope.showPassword) {
				document.getElementById('password-input-desktop').setAttribute('type', 'text');
				document.getElementById('password-input-mobile').setAttribute('type', 'text');

			} else {
				document.getElementById('password-input-desktop').setAttribute('type', 'password');
				document.getElementById('password-input-mobile').setAttribute('type', 'password');
			}
		}



	}
}());
