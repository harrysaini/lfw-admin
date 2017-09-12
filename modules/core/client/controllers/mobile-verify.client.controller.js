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
