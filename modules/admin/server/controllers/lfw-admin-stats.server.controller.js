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
 utils = require(path.resolve('./config/utils.js'));



 function getNewPropertiesThisWeek(){
  return new Promise(function(resolve , reject){

    var oneWeekDate = utils.getCurrentMinusDaysDate(7);
    var query = {};
    query.created = {
      $gte : oneWeekDate
    }

    Property.find(query).count().exec(function(err , data){
      if(err){
        return reject(err);
      }else{
        resolve(data);
      }
    });

  });

} 


function getUnverifiedProperties(){

  return new Promise(function(resolve , reject ){

    var query={};
    query.isAdminVerified = false;

    Property.find(query).count().exec(function(err , data){
      if(err){
        return reject(err);
      }else{
        resolve(data);
      }
    })

  });

}

function getTotalPropertiesCount(){
  return new Promise(function(resolve , reject){

    Property.find({}).count().exec(function(err , data){
      if(err){
        return reject(err);
      }else{
        resolve(data);
      }
    });

  });
}


function getPropertyIncrements(){

  return new Promise(function(resolve , reject){

    getNewPropertiesThisWeek().then(function(thisWeekCount){

      var oneWeekDate = utils.getCurrentMinusDaysDate(7);
      var twoWeekDate = utils.getCurrentMinusDaysDate(14);
      var query = {};
      query.created = {
        $lte : oneWeekDate,
        $gte : twoWeekDate
      }

      Property.find(query).count().exec(function(err , prevWeekCount){
        if(err){
          return reject(err);
        }else{
          var increment = Math.ceil(((thisWeekCount-prevWeekCount)/(prevWeekCount+1))*100);
          return resolve(increment);
        }
      });

    }).catch(function(err){
      reject(err);
    });

  });
}


 /*
 * get property statistics
 */
 exports.propertyStats = function(req , res){

  var propertyStats = {};

  getNewPropertiesThisWeek().then(function(count){

    propertyStats.new = count;
    return getUnverifiedProperties();

  }).then(function(count){

    propertyStats.notReviewed = count;
    return getTotalPropertiesCount();

  }).then(function(count){

    propertyStats.total = count;
    return getPropertyIncrements();

  }).then(function(increment){

    propertyStats.increment = increment;
    return res.json({
      propertyStats : propertyStats
    });

  }).catch(function(err){

    return res.status(422).send({
      message: errorHandler.getErrorMessage(error)
    });

  });


}



/*user stats code begin*/

function getNewUsersThisWeek(){
  return new Promise(function(resolve , reject){

    var oneWeekDate = utils.getCurrentMinusDaysDate(7);
    var query = {};
    query.created = {
      $gte : oneWeekDate
    }

    User.find(query).count().exec(function(err , data){
      if(err){
        return reject(err);
      }else{
        resolve(data);
      }
    });

  });

} 


function getUnverifiedUsers(){

  return new Promise(function(resolve , reject ){

    var query={};
    query.isAdminVerified = false;

    User.find(query).count().exec(function(err , data){
      if(err){
        return reject(err);
      }else{
        resolve(data);
      }
    })

  });

}

function getTotalUsersCount(){
  return new Promise(function(resolve , reject){

    User.find({}).count().exec(function(err , data){
      if(err){
        return reject(err);
      }else{
        resolve(data);
      }
    });

  });
}


function getUserIncrements(){

  return new Promise(function(resolve , reject){

    getNewUsersThisWeek().then(function(thisWeekCount){

      var oneWeekDate = utils.getCurrentMinusDaysDate(7);
      var twoWeekDate = utils.getCurrentMinusDaysDate(14);
      var query = {};
      query.created = {
        $lte : oneWeekDate,
        $gte : twoWeekDate
      }

      User.find(query).count().exec(function(err , prevWeekCount){
        if(err){
          return reject(err);
        }else{
          var increment = Math.ceil(((thisWeekCount-prevWeekCount)/(prevWeekCount+1))*100);
          return resolve(increment);
        }
      });

    }).catch(function(err){
      reject(err);
    });

  });
}


 /*
 * get users statistics
 */
 exports.userStats = function(req , res){

  var userStats = {};

  getNewUsersThisWeek().then(function(count){

    userStats.new = count;
    return getUnverifiedUsers();

  }).then(function(count){

    userStats.notReviewed = count;
    return getTotalUsersCount();

  }).then(function(count){

    userStats.total = count;
    return getUserIncrements();

  }).then(function(increment){

    userStats.increment = increment;
    return res.json({
      userStats : userStats
    });

  }).catch(function(err){

    return res.status(422).send({
      message: errorHandler.getErrorMessage(error)
    });

  });


}