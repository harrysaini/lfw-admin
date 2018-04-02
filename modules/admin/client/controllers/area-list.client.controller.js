(function() {
	'use strict';

	angular
	.module('admin')
	.controller('AreaListController', AreaListController);

	AreaListController.$inject = ['$scope', '$state'  ,'AreaService' , '$timeout' , 'Notification' ,'$rootScope' ,'OverridesService'];


	function AreaListController($scope, $state , AreaService , $timeout ,Notification , $rootScope, OverridesService) {

		$rootScope.setNavBarActive('areas');
		$scope.areaList = [];
		$scope.selectedAreaMap = {};
		$scope.areaTOEdit = {};
		$scope.areaToAdd={
			city : '',
			main_locality : '',
			sub_localities : []
		}
		$scope.editPopupShown = false;
		$scope.addAreaPopupShown = false;
		$scope.sortBy = 'main_locality';


		function getEditAreaObject(area){
			var obj = angular.copy(area);
			delete obj.sub_localities;

			obj.sub_localities = [];
			area.sub_localities.forEach(function(value, index){
				obj.sub_localities.push({
					name : value
				})
			});
			return obj;
		}

		function apiFailureHandler(response) {
			Notification.error({ 
				message: 'api failure' , 
				title: 'Request Failed!!', 
				delay: 6000 }
				);
		}


		function fetchAreasList(){
			AreaService.listAreas().then(function(response){
				$scope.areaList = response.locations;
			}).catch(apiFailureHandler);
		}
		fetchAreasList();


		function findAreaByID(id){
			for(var i =0 ; i<$scope.areaList.length ; i++){
				if($scope.areaList[i]._id==id){
					return $scope.areaList[i];
				}
			}
		}


		function getLocalitiesArray(sub_localitiesArray){
			var sub_localities = [];
			sub_localitiesArray.forEach(function(obj){
				if(obj.name){
					sub_localities.push(obj.name);
				}
			});
			return sub_localities;
		}

		$scope.openEditPopup = function(id){
			$scope.editPopupShown = true;
			$scope.areaTOEdit = getEditAreaObject(findAreaByID(id));
		}

		$scope.addNewLocality = function(){
			$scope.areaTOEdit.sub_localities.push({name : ""});
		}

		$scope.removeLocality = function(locality){
			$scope.areaTOEdit.sub_localities.removeFromArray(locality);
		}

		$scope.saveArea = function(){
			var reqData = {};
			var id = $scope.areaTOEdit._id;
			reqData.main_locality = $scope.areaTOEdit.main_locality;
			reqData.city = $scope.areaTOEdit.city;
			reqData.sub_localities = getLocalitiesArray($scope.areaTOEdit.sub_localities);

			AreaService.updateArea(id , reqData).then(function(){
				$scope.editPopupShown = false;
				fetchAreasList();
				Notification.success({ 
					message: "Area updated successfully", 
					title: 'Area updated', 
					delay: 6000 }
					);
			});
		}


		$scope.deleteArea = function(){
			var id = $scope.areaTOEdit._id;

			AreaService.deleteArea(id).then(function(){
				$scope.editPopupShown = false;
				fetchAreasList();
				Notification.success({ 
					message: "Area deleted successfully", 
					title: 'Area deleted', 
					delay: 6000 }
					);
			});
		}


		$scope.removeLocalityInNewArea = function(locality){
			$scope.areaToAdd.sub_localities.removeFromArray(locality);
		}

		$scope.addNewLocalityInNewArea = function(){
			$scope.areaToAdd.sub_localities.push({name : ""});
		}


		$scope.saveNewArea = function(){
			var reqData = {};
			reqData.main_locality = $scope.areaToAdd.main_locality;
			reqData.city = $scope.areaToAdd.city;
			reqData.sub_localities = getLocalitiesArray($scope.areaToAdd.sub_localities);

			AreaService.addArea(reqData).then(function(){
				$scope.addAreaPopupShown = false;
				fetchAreasList();
				Notification.success({ 
					message: "Area added successfully", 
					title: 'Area added', 
					delay: 6000 }
					);
			});
		}


	}
}());
