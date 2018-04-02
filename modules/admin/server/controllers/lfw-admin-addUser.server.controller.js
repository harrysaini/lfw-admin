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


 /*
 * a function to add user
 */
 exports.addUser = function(req , res){
 	// For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  req.body.username = req.body.email;

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
      	message : 'User added succesfully',
      	user : user
      })
    }
  });
 }