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




 function findUserByID(id){
 	return new Promise(function(resolve , reject ){
 		
 		if (!mongoose.Types.ObjectId.isValid(id)) {
 			reject(new Error('User id is not valid'));
 		}

 		User.findById(id).exec(function (err, user) {
 			
 			if (err) {
 				reject(err);
 			} else{

 				if(!user){
 					return reject(new Error('Failed to load user ' + id));
 				}else{
 					resolve(user);
 				}
 			}
 			
 		});
 	});
 }




 /**
 * delete user
 */
 exports.deleteUser = function(req, res) {

 	findUserByID(req.params.userId).then(function(user){

 		if(user.roles.indexOf('admin')!=-1){
 			return res.status(422).send({
	 			message: "Can't delete admin account"	 		
	 		});
 		}

 		user.remove(function(err){
 			if (err) {
 				return res.status(422).send({
 					message: errorHandler.getErrorMessage(err)
 				});
 			}

 			res.json({
 				message : 'User deleted succesfully.',
 				user : user
 			});
 		})
 	}).catch(function(err){
 		return res.status(422).send({
 			message: errorHandler.getErrorMessage(err)
 		});
 	});
 };

 

 /**
 * toggle admin verified
 */
 exports.toggleAdminVerified = function(req , res){

 	findUserByID(req.params.userId).then(function(user){
 		user.isAdminVerified = req.body.isAdminVerified ? req.body.isAdminVerified : false;

 		user.save(function(err){
 			if(err){
 				return res.status(422).send({
 					message: errorHandler.getErrorMessage(err)
 				});
 			}else{
 				res.json({
 					message : 'Updated succesfully.',
 					user : user
 				});
 			}
 		});


 	}).catch(function(err){
 		return res.status(422).send({
 			message: errorHandler.getErrorMessage(err)
 		});
 	})
 }


 

