'use strict';

/**
 * Module dependencies
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 _ = require('lodash'),
 Property = mongoose.model('Property'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));



 /*parse bhk filters as they are in boolen obj*/
 var _parseBHKFilters = function(bhkFilters){
 	var bhkFiltersArray =[];
 	_.each(bhkFilters , function(val ,key){
 		if(val){
 			bhkFiltersArray.push(parseInt(key.charAt(0)));
 		}
 	});
 	return bhkFiltersArray;
 };

 /* convert boolean object to array*/
 var _parseBooleanObjectToArray = function(obj){
 	var parsedArray =[];
 	_.each(obj , function(val , key){
 		if(val){
 			parsedArray.push(key.toLowerCase());
 		}
 	});

 	return parsedArray;
 };

 var _parseAmmenitiesFilter = function(ammenitiesFilters){
 	var parseObj = {};
 	_.each(ammenitiesFilters , function(val ,key){
 		if(val){
 			parseObj[key] = val;
 		}
 	});
 	return parseObj;
 };

 /* function to parse filters */
 var _parseFilters= function(query , filters){


	//price filter
	if(filters.priceMinVal  || filters.priceMaxVal){


		var priceMinVal = filters.priceMinVal || 0;
		var priceMaxVal = filters.priceMaxVal || 1000000000;
		query["property_params.priceDetails.expectedPrice"] = {$gte: priceMinVal, $lte: priceMaxVal };
	}
	//area filter
	if(filters.areaMinValue || filters.areaMaxValue){
		var areaMinValue = filters.areaMinValue || 0;
		var areaMaxValue = filters.areaMaxValue || 100000000;
		query["property_params.propertyFeatures.area.plotArea"] = { $gte : areaMinValue , $lte : areaMaxValue };
	}

	//bhk filters
	filters.Bedroom = filters.Bedroom || {};
	var parsedBHKFilters = _parseBHKFilters(filters.Bedroom);
	if(parsedBHKFilters.length>0){
		query["property_params.propertyFeatures.bedrooms"] = { $in : parsedBHKFilters};
	}

	//construction stage/possesion type filter
	filters['Construction Stage'] = filters['Construction Stage'] || {};
	var possessionTypeFilter = _parseBooleanObjectToArray(filters['Construction Stage']);
	if(possessionTypeFilter.length>0){
		query["property_params.propertyFeatures.possessionType"] = { $in : possessionTypeFilter };
	}


	//furnishing filters
	filters.Furnishing = filters.Furnishing || {};
	var furnishingTypeFilters = _parseBooleanObjectToArray(filters.Furnishing);
	if(furnishingTypeFilters.length > 0){
		query["property_params.propertyFeatures.furnishingStatus"] = { $in : furnishingTypeFilters };
	}

	//posted by
	filters['Posted by'] = filters['Posted by'] || {};
	var postedByFilters = _parseBooleanObjectToArray(filters['Posted by']);
	if(postedByFilters.length>0){
		query['postedUserType'] = { $in : postedByFilters};
	}


	//ammenities
	filters.Ammenties = filters.Ammenties || {};
	var parsedAmmenitiesFilter = _parseAmmenitiesFilter(filters.Ammenties);
	if(parsedAmmenitiesFilter.length>0){
		query['property_params.propertyFeatures.ammenities'] = parsedAmmenitiesFilter;
	}




}

var _parseIncomingSearchValue = function(searchQuery, filters) {

	searchQuery = searchQuery || [{}];

	//if empty array 
	if(searchQuery.length===0){
		searchQuery.push({});
	}

	filters= filters || {};
	
	var orQueryArray = [];

	_.each(searchQuery , function(searchObj){
		
		//simple string search
		if(searchObj.sub_locality && searchObj.sub_locality===searchObj.main_locality){
			
			var subLocQuery = {};
			subLocQuery["property_params.location.sub_locality"] = searchObj.sub_locality;
			_parseFilters(subLocQuery , filters);

			var mainLocQuery = {};
			mainLocQuery["property_params.location.main_locality"] = searchObj.main_locality;
			_parseFilters(mainLocQuery , filters);

			orQueryArray.push(subLocQuery);
			orQueryArray.push(mainLocQuery);

		}else if(searchObj.significance==="sub_locality"){

			//based on sub locality
			var subLocQuery = {};
			subLocQuery["property_params.location.sub_locality"] = searchObj.sub_locality;
			subLocQuery["property_params.location.main_locality"] = searchObj.main_locality;
			subLocQuery["property_params.location.city"] = searchObj.city;
			_parseFilters(subLocQuery , filters);
			orQueryArray.push(subLocQuery);

		}else if(searchObj.significance==="main_locality"){

			//based on main loclity
			var mainLocQuery = {};
			mainLocQuery["property_params.location.main_locality"] = searchObj.main_locality;
			mainLocQuery["property_params.location.city"] = searchObj.city;
			_parseFilters(mainLocQuery , filters);
			orQueryArray.push(mainLocQuery);

		}else if(searchObj.significance==='city'){

			//based on city
			var cityQuery = {};
			cityQuery["property_params.location.city"] = searchObj.city;
			_parseFilters(cityQuery ,filters);
			orQueryArray.push(cityQuery);


		}else{

			var defaultQuery = {};
			if(searchObj.sub_locality){
				defaultQuery["property_params.location.sub_locality"] = searchObj.sub_locality;
			}
			if(searchObj.main_locality){
				defaultQuery["property_params.location.main_locality"] = searchObj.main_locality;
			}
			if(searchObj.city){
				defaultQuery["property_params.location.city"] = searchObj.city;
			}
			_parseFilters(defaultQuery , filters);
			orQueryArray.push(defaultQuery);

		}


	});


	return {
		$or : orQueryArray
	};

}


var _parseSortValue = function(sortBy){
	return {};
}

/**
 * Search an listing
 */
 exports.search = function(req, res) {

 	var findQuery,
 	sortQuery;

 	findQuery = _parseIncomingSearchValue(req.body.searchQuery, req.body.filters);
 	sortQuery = _parseSortValue(req.body.sortBy);

 	Property.find(findQuery).sort(sortQuery).exec(function(error, data) {

 		if (error) {
 			return res.status(422).send({
 				status: 1,
 				message: errorHandler.getErrorMessage(error)
 			});

 		} else {

 			if (!data || data.length == 0) {
 				res.json({
 					status: 0,
 					message: 'No results found for your search',
 					properties: []
 				})
 			}

			//send response to client
			res.json({
				status: 0,
				properties: data
			});

		}

	});
 };


/**
 * Article middleware
 */
 exports.fetch_houses = function(req, res) {
 	console.log("dddd");
 	Property.find({}).exec(function(err,houses) {
 		if (err) {
 			res.json({
 				status: '0',
 				message: err

 			})
 		} else {
 			res.json(houses)

 		}
 	});
 }


 /* parse data for search by lat long */
 var _parseLatLongSearchFilters = function(searchQuery , filters){
 	searchQuery = searchQuery || [{}];

 	//if empty array 
	if(searchQuery.length===0){
		searchQuery.push({});
	}
 	filters = filters || {};

 	var orQueryArray = [];

 	_.each(searchQuery , function(searchObj){
 		var query = {};
 		if(searchObj.latitude && searchObj.longitude){
 			var range = searchObj.range!==undefined ? searchObj.range :  0.1;
 			var latMinVal = searchObj.latitude - range;
 			var latMaxVal = searchObj.latitude + range;
 			var longMinVal = searchObj.longitude - range;
 			var longMaxVal = searchObj.longitude + range;

 			query['property_params.location.loc.0'] = {$gte : latMinVal , $lte : latMaxVal};
 			query['property_params.location.loc.1'] = {$gte : longMinVal , $lte : longMaxVal }; 

 			_parseFilters(query , filters);
 			orQueryArray.push(query);
 		}else{
 			_parseFilters(query , filters);
 			orQueryArray.push({});

 		}

 	});

 	return {
 		$or : orQueryArray
 	}
 }

/*
* simple lat long search
*/
 exports.coordinate_search = function(req , res){
 	var findQuery,
 	sortQuery;

 	findQuery = _parseLatLongSearchFilters(req.body.searchQuery , req.body.filters);
 	sortQuery = _parseSortValue(req.body.sortBy);

 	Property.find(findQuery).sort(sortQuery).exec(function(error, data) {

 		if (error) {
 			return res.status(422).send({
 				status: 1,
 				message: errorHandler.getErrorMessage(error)
 			});

 		} else {

 			if (!data || data.length == 0) {
 				res.json({
 					status: 0,
 					message: 'No results found for your search',
 					properties: []
 				})
 			}

			//send response to client
			res.json({
				status: 0,
				properties: data
			});

		}

	});
 }



/*
*Group properties with same lat long together
*/
 var _groupPropertiesWithSameLatLong = function(properties){
 	var groupedProperties = {};

 	_.each(properties , function(property){
 		var latLongString = property.property_params.location.loc[0] + "-" + property.property_params.location.loc[1];

 		if(groupedProperties[latLongString]){
 			//add new proprty to array
 			groupedProperties[latLongString].properties.push(property);
 		}else{
 			//added to object
 			groupedProperties[latLongString] = {};
 			groupedProperties[latLongString].latitude = property.property_params.location.loc[0];
 			groupedProperties[latLongString].longitude = property.property_params.location.loc[1];
 			groupedProperties[latLongString].properties = new Array(property);

 		}
 	});

 	return groupedProperties;
 }


 /**
  * lat long grouped search
  */
 exports.grouped_coordinate_search = function(req , res){

 	var findQuery,
 	sortQuery,
 	groupedProperties;

 	findQuery = _parseLatLongSearchFilters(req.body.searchQuery , req.body.filters);
 	sortQuery = _parseSortValue(req.body.sortBy);

 	Property.find(findQuery).sort(sortQuery).exec(function(error, data) {

 		if (error) {
 			return res.status(422).send({
 				status: 1,
 				message: errorHandler.getErrorMessage(error)
 			});

 		} else {

 			if (!data || data.length == 0) {
 				res.json({
 					status: 0,
 					message: 'No results found for your search',
 					properties: []
 				})
 			}else{
 				groupedProperties = _groupPropertiesWithSameLatLong(data);
 				
 				//send response to client
 				res.json({
 					status: 0,
 					grouped : groupedProperties
 				});
 			}


 		}

 	});
 }



 /**
 * Search an listing reeturn groped by lat long
 */
 exports.group_search_location = function(req, res) {

 	var findQuery,
 	sortQuery;

 	findQuery = _parseIncomingSearchValue(req.body.searchQuery, req.body.filters);
 	sortQuery = _parseSortValue(req.body.sortBy);

 	Property.find(findQuery).sort(sortQuery).exec(function(error, data) {

 		if (error) {
 			return res.status(422).send({
 				status: 1,
 				message: errorHandler.getErrorMessage(error)
 			});

 		} else {

 			if (!data || data.length == 0) {
 				res.json({
 					status: 0,
 					message: 'No results found for your search',
 					properties: []
 				})
 			}

			//send response to client
			res.json({
				status: 0,
				properties: _groupPropertiesWithSameLatLong(data)
			});

		}

	});
 };
