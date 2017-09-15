'use strict';

/**
 * Module dependencies
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 _ = require('lodash'),
 Property = mongoose.model('Property'),
 User = mongoose.model('User'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));



 /**
 * get tenants list
 */
 exports.getTenantsList = function(req, res) {

 	var limit  = req.query.limit ? parseInt(req.query.limit) : 50 ;
 	var skip = req.query.skip ? parseInt(req.query.skip) : 0 ;

 	var query = {
 		userRole : 'tenant',
 		roles : 'user'
 	}
 	

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

			//send response to client
			res.json({
				status: 0,
				users: data
			});

		}

	});
 };


 /**
 * get brokers list
 */
 exports.getBrokersList = function(req, res) {

 	var limit  = req.query.limit ? req.query.limit : 50 ;
 	var skip = req.query.skip ? req.query.skip : 0 ;

 	var query = {
 		userRole : 'broker',
 		roles : 'user'
 	}
 	

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

			//send response to client
			res.json({
				status: 0,
				users: data
			});

		}

	});
 };


 /**
 * get landlord list
 */
 exports.getLandlordsList = function(req, res) {

 	var limit  = req.query.limit ? req.query.limit : 50 ;
 	var skip = req.query.skip ? req.query.skip : 0 ;

 	var query = {
 		userRole : 'landlord',
 		roles : 'user'
 	}
 	

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

			//send response to client
			res.json({
				status: 0,
				users: data
			});

		}

	});
 };




