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

 
 /* add search and filter query*/
 function _addSearchAndFilterQuery(searchStr , filters , query , searchType) {
 	var startRegex = new RegExp('^'+searchStr , 'i')

 	if(searchStr){
 		query[searchType]  = { $regex : startRegex };
 	}

 	if(filters.verified && !filters.notVerified){
 		query.isVerified = true ;
 	}

 	

 }

 /*get users count*/
 function  getUserListCount(query){
 	return new Promise(function( resolve , reject ){
 		User.find(query).count().exec(function(error , data ){
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
 * get tenants list
 */
 exports.getTenantsList = function(req, res) {

 	var limit  = req.query.limit ? parseInt(req.query.limit) : 50 ;
 	var skip = req.query.skip ? parseInt(req.query.skip) : 0 ;
 	var searchStr = req.query.search ? req.query.search : '' ;
 	var searchType = req.query.searchType ? req.query.searchType : 'displayName';
 	var filters = req.query.filters ? req.query.filters : {} ;

 	var query = {
 		userRole : 'tenant',
 		roles : 'user'
 	}

 	_addSearchAndFilterQuery(searchStr , filters , query , searchType );


 	
 	

 	User.find(query).limit(limit).skip(skip).lean().exec(function(error, data) {

 		if (error) {
 			return res.status(422).send({
 				status: 1,
 				message: errorHandler.getErrorMessage(error)
 			});

 		} else {

 			if (!data || data.length == 0) {
 				res.json({
 					status: 0,
 					message: 'No users',
 					users: []
 				})
 			}

			//get user count
			getUserListCount(query).then(function(count){
 				//send response to client
 				res.json({
 					status: 0,
 					users: data,
 					totalUsers : count
 				});
 			}).catch(function(error){
 				return res.status(422).send({
 					status: 1,
 					message: errorHandler.getErrorMessage(error)
 				});
 			});
 		}

 	});
 };


 /**
 * get brokers list
 */
 exports.getBrokersList = function(req, res) {

 	var limit  = req.query.limit ? parseInt(req.query.limit) : 50 ;
 	var skip = req.query.skip ? parseInt(req.query.skip) : 0 ;
 	var searchStr = req.query.search ? req.query.search : '' ;
 	var searchType = req.query.searchType ? req.query.searchType : 'displayName';
 	var filters = req.query.filters ? req.query.filters : {} ;

 	var query = {
 		userRole : 'broker',
 		roles : 'user'
 	}

 	_addSearchAndFilterQuery(searchStr , filters , query ,searchType);

 	
 	

 	User.find(query).limit(limit).skip(skip).lean().exec(function(error, data) {

 		if (error) {
 			return res.status(422).send({
 				status: 1,
 				message: errorHandler.getErrorMessage(error)
 			});

 		} else {

 			if (!data || data.length == 0) {
 				res.json({
 					status: 0,
 					message: 'No users',
 					users: [],
 					totalUsers : 0
 				})
 			}

 			//get user count
 			getUserListCount(query).then(function(count){
 				//send response to client
 				res.json({
 					status: 0,
 					users: data,
 					totalUsers : count
 				});
 			}).catch(function(error){
 				return res.status(422).send({
 					status: 1,
 					message: errorHandler.getErrorMessage(error)
 				});
 			});



 		}

 	});
 };


 /**
 * get landlord list
 */
 exports.getLandlordsList = function(req, res) {

 	var limit  = req.query.limit ? parseInt(req.query.limit) : 50 ;
 	var skip = req.query.skip ? parseInt(req.query.skip) : 0 ;
 	var searchStr = req.query.search ? req.query.search : '' ;
 	var searchType = req.query.searchType ? req.query.searchType : 'displayName';
 	var filters = req.query.filters ? req.query.filters : {} ;

 	var query = {
 		userRole : 'landlord',
 		roles : 'user'
 	}

 	_addSearchAndFilterQuery(searchStr , filters , query , searchType );

 	User.find(query).limit(limit).skip(skip).lean().exec(function(error, data) {

 		if (error) {
 			return res.status(422).send({
 				status: 1,
 				message: errorHandler.getErrorMessage(error)
 			});

 		} else {

 			if (!data || data.length == 0) {
 				res.json({
 					status: 0,
 					message: 'No users',
 					users: []
 				})
 			}

			//get user count
			getUserListCount(query).then(function(count){
 				//send response to client
 				res.json({
 					status: 0,
 					users: data,
 					totalUsers : count
 				});
 			}).catch(function(error){
 				return res.status(422).send({
 					status: 1,
 					message: errorHandler.getErrorMessage(error)
 				});
 			});

 		}

 	});
 };


 exports.getUsersCSV = function(req ,  res){
 	var userType = req.query.userType ? req.query.userType : 'tenant';

 	var query = {
 		userRole : userType,
 		roles : 'user'
 	}

 	var filename  = userType+".csv";


 	User.find(query).lean().exec(function(error,data){

 		if (error) {
 			return res.status(422).send({
 				status: 1,
 				message: errorHandler.getErrorMessage(error)
 			});

 		} else {

 			
 			_.each(data , function(user){
 				
 				//delete faltu fields
 				delete user.salt;
 				delete user.password;
 				delete user.resetPasswordToken;
 				delete user.resetPasswordExpires;
 				delete user.updated;
 				delete user.roles;
 				delete user.profileImageURL;
 				delete user.provider;
 				delete user.providerData;
 				delete user.additionalProvidersData;
 				delete user._id;
 				delete user.__v;
 			})

 			var csvFile = babyParse.unparse(data);

 			res.setHeader('Content-disposition', 'attachment; filename='+filename);
 			res.set('Content-Type', 'text/csv');
 			res.status(200).send(csvFile);


 		}

 	});
 }



