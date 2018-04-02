'use strict';

/**
 * Module dependencies
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 _ = require('lodash'),
 Property = mongoose.model('Property'),
 User = mongoose.model('User'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 babyParse = require('babyparse');


 

 /*get properties count*/
 function getPropertiesCount(query){
 	return new Promise(function(resolve , reject){

 		Property.find(query).count().exec(function(error , data ){
 			if(error){
 				reject(error);
 			}
 			else{
 				resolve(data);
 			}
 		});

 	});
 }

/*add user details for particular*/
 function addUserDetailForProperty(property){
 	return new Promise(function(resolve,reject){
 		var projection = {
 			firstName : 1,
 			lastName : 1,
 			displayName : 1,
 			email : 1,
 			username : 1,
 			phone : 1,
 			phoneCode : 1,
 			phoneNumber : 1
 		};

 		User.findById(property.postedBy , projection ).lean().exec(function(error , data){
 			if(error){
 				reject(error);
 			}
 			else{
 				resolve({
 					email : 'bob@gmail.com',
 					phone : '+91-9874563210',
 					displayName : 'Bob Alex'
 				});
 			}
 		})
 	})
 }


 /*add user details*/
 function addUserDetails(properties){
 	return new Promise(function(resolve , reject){
 		var promiseMap = properties.map(function(property){
 			return addUserDetailForProperty(property);
 		});

 		Promise.all(promiseMap).then(function(userDetails){
 			userDetails.forEach(function(value , index) {
 				properties[index].userDetails = value;
 			});
 			resolve(properties);
 		}).catch(function(err){
 			reject(err);
 		});

 	})
 }


 /**
 * get properties list
 */
 exports.getPropertiesList = function(req, res) {

 	var limit  = req.query.limit ? parseInt(req.query.limit) : 50 ;
 	var skip = req.query.skip ? parseInt(req.query.skip) : 0 ;


 	Property.find({}).limit(limit).skip(skip).lean().exec(function(error, data) {

 		if (error) {
 			return res.status(422).send({
 				status: 1,
 				message: errorHandler.getErrorMessage(error)
 			});

 		} else {

 			if (!data || data.length == 0) {
 				res.json({
 					status: 0,
 					message: 'No properties',
 					properties: [],
 					count : 0
 				})
 			}

 			_.each(data , function(property){
 				if( !(property.isAdminVerified===true || property.isAdminVerified===false)){
 					property.isAdminVerified = 'pending';
 				}else if(property.isAdminVerified===true){
 					property.isAdminVerified = 'verified';
 				}else if(property.isAdminVerified===false){
 					property.isAdminVerified = 'rejected';
 				}
 				property.displayDate = property.created.toDateString();
 			});

 			addUserDetails(data).then(function(){
 				
 				return getPropertiesCount({});

 			}).then(function(count){
 					//send response to client
 					return res.json({
 						status: 0,
 						properties : data,
 						count : count
 					});

 				}).catch(function(error){
 					
 					return res.status(422).send({
 						status: 1,
 						message: errorHandler.getErrorMessage(error)
 					});
 				})
 				

 			}

 		});
 };


 /*get unverified properties*/
 exports.getUnverifiedPropertiesList = function(req , res){
 	var limit  = req.query.limit ? parseInt(req.query.limit) : 50 ;
 	var skip = req.query.skip ? parseInt(req.query.skip) : 0 ;


 	var query = {
 		isVerified : false
 	}
 	
 	

 	Property.find(query).limit(limit).skip(skip).lean().exec(function(error, data) {

 		if (error) {
 			return res.status(422).send({
 				status: 1,
 				message: errorHandler.getErrorMessage(error)
 			});

 		} else {

 			if (!data || data.length == 0) {
 				res.json({
 					status: 0,
 					message: 'No properties',
 					properties: [],
 					count : 0
 				})
 			}

 			_.each(data , function(property){
 				if( !(property.isAdminVerified===true || property.isAdminVerified===false)){
 					property.isAdminVerified = 'pending';
 				}else if(property.isAdminVerified===true){
 					property.isAdminVerified = 'verified';
 				}else if(property.isAdminVerified===false){
 					property.isAdminVerified = 'rejected';
 				}
 				property.displayDate = property.created.toDateString();
 			});

 			addUserDetails(data).then(function(){
 				
 				return getPropertiesCount({});

 			}).then(function(count){
 					//send response to client
 					return res.json({
 						status: 0,
 						properties : data,
 						count : count
 					});

 				}).catch(function(error){
 					
 					return res.status(422).send({
 						status: 1,
 						message: errorHandler.getErrorMessage(error)
 					});
 				})
 				

 			}

 		});
 }



 /**
 * get properties list
 */
 exports.getPropertiesListInArea = function(req, res) {

 	var limit  = req.query.limit ? parseInt(req.query.limit) : 50 ;
 	var skip = req.query.skip ? parseInt(req.query.skip) : 0 ;
 	var main_locality = req.query.main_locality ? req.query.main_locality : undefined;
 	var city = req.query.city ? req.query.city : undefined;

 	var query = {};

 	if(main_locality){
 		query['property_params.location.main_locality'] = main_locality ;
 	}
 	if(city){
	 	query['property_params.location.city'] = city;
 	}

 	Property.find(query).limit(limit).skip(skip).lean().exec(function(error, data) {

 		if (error) {
 			return res.status(422).send({
 				status: 1,
 				message: errorHandler.getErrorMessage(error)
 			});

 		} else {

 			if (!data || data.length == 0) {
 				res.json({
 					status: 0,
 					message: 'No properties',
 					properties: [],
 					count : 0
 				})
 			}

 			_.each(data , function(property){
 				if( !(property.isAdminVerified===true || property.isAdminVerified===false)){
 					property.isAdminVerified = 'pending';
 				}else if(property.isAdminVerified===true){
 					property.isAdminVerified = 'verified';
 				}else if(property.isAdminVerified===false){
 					property.isAdminVerified = 'rejected';
 				}
 				property.displayDate = property.created.toDateString();
 			});

 			addUserDetails(data).then(function(){
 				
 				return getPropertiesCount(query);

 			}).then(function(count){
 					//send response to client
 					return res.json({
 						status: 0,
 						properties : data,
 						count : count
 					});

 				}).catch(function(error){
 					
 					return res.status(422).send({
 						status: 1,
 						message: errorHandler.getErrorMessage(error)
 					});
 				})
 				

 			}

 		});
 };
