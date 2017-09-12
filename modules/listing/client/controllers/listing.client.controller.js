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
