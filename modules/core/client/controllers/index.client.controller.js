(function() {
	'use strict';

	angular
	.module('core')
	.controller('IndexController', IndexController);

	IndexController.$inject = ['$scope', '$state', '$rootScope', 'UsersService', 'MyUtilityService', 'Authentication', '$timeout','$window','Notification'];

	function IndexController($scope, $state, $rootScope, UsersService, MyUtilityService, Authentication, $timeout,$window , Notification) {

		var utils = MyUtilityService;
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
			$state.go('overview');
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
