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
