'use strict';

 /**
 * Module dependencies
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 _ = require('lodash'),
 Property = mongoose.model('Property'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));




 function findPropertyByID(id){
 	return new Promise(function(resolve , reject ){
 		
 		if (!mongoose.Types.ObjectId.isValid(id)) {
 			reject(new Error('Property id is not valid'));
 		}

 		Property.findById(id).exec(function (err, property) {
 			
 			if (err) {
 				reject(err);
 			} else{

 				if(!property){
 					return reject(new Error('Failed to load property ' + id));
 				}else{
 					resolve(property);
 				}
 			}
 			
 		});
 	});
 }


 exports.getProperty = function(req , res){

 	findPropertyByID(req.params.propertyId).then(function(property){

 		res.json({
 				property : property
 			});

 	}).catch(function(err){
 		return res.status(422).send({
 			message: errorHandler.getErrorMessage(err)
 		});
 	})
 }



 /**
 * delete property
 */
 exports.deleteProperty = function(req, res) {

 	findPropertyByID(req.params.propertyId).then(function(property){
 		property.remove(function(err){
 			if (err) {
 				return res.status(422).send({
 					message: errorHandler.getErrorMessage(err)
 				});
 			}

 			res.json({
 				message : 'Property deleted succesfully.',
 				property : property
 			});
 		})
 	}).catch(function(err){
 		return res.status(422).send({
 			message: errorHandler.getErrorMessage(err)
 		});
 	});
 };

 /**
 * toogle show in listing
 */
 exports.toggleShowInListing = function(req,res) {
 	findPropertyByID(req.params.propertyId).then(function(property){
 		property.showInListing = req.body.showInListing ? req.body.showInListing : false;

 		property.save(function(err){
 			if(err){
 				return res.status(422).send({
 					message: errorHandler.getErrorMessage(err)
 				});
 			}else{
 				res.json({
 					message : 'Updated succesfully.',
 					property : property
 				});
 			}
 		});


 	}).catch(function(err){
 		return res.status(422).send({
 			message: errorHandler.getErrorMessage(err)
 		});
 	})
 }


 /**
 * toggle admin verified
 */
 exports.toggleAdminVerified = function(req , res){

 	findPropertyByID(req.params.propertyId).then(function(property){
 		property.isAdminVerified = req.body.isAdminVerified ? req.body.isAdminVerified : false;

 		property.save(function(err){
 			if(err){
 				return res.status(422).send({
 					message: errorHandler.getErrorMessage(err)
 				});
 			}else{
 				res.json({
 					message : 'Updated succesfully.',
 					property : property
 				});
 			}
 		});


 	}).catch(function(err){
 		return res.status(422).send({
 			message: errorHandler.getErrorMessage(err)
 		});
 	})
 }


 

