'use strict';

/**
 * Module dependencies
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 _ = require('lodash'),
 Property = mongoose.model('Property'),
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

 			getPropertiesCount({}).then(function(count){
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

 			getPropertiesCount(query).then(function(count){
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

