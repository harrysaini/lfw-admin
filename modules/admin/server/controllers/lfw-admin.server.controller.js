'use strict';

/**
 * Module dependencies
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 _ = require('lodash'),
 User = mongoose.model('User'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 babyParse = require('babyparse');


 

 
 /**
 * get properties list
 */
 exports.adminSignUp = function(req, res) {

 	// For security measurement we remove the roles from the req.body object
 	delete req.body.roles;

 	req.body.username = req.body.email;

 	req.body.roles = 'admin';
 	req.body.userRole = 'admin';

  // Init user and add missing fields
  var user = new User(req.body);
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;

  // Then save the user
  user.save(function(err) {
  	if (err) {
  		return res.status(422).send({
  			message: errorHandler.getErrorMessage(err)
  		});
  	} else {
  		
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      res.json({
      	status : 0,
      	message : 'admin added succesfully!!',
      	user : user
      });
  }
});
}