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
