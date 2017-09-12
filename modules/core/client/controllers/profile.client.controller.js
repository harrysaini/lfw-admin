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
