'use strict';

 /**
 * Module dependencies
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 _ = require('lodash'),
 Property = mongoose.model('Property'),
 Location = mongoose.model('Location'),
 Area = mongoose.model('Area'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));



 function getAllLocationsList(){
 	return new Promise(function(resolve , reject){
 		
 		Area.find({}).lean().exec(function(err , data){
 			if(err){
 				return reject(err);
 			}
 			return resolve(data);

 		});
 	});
 }




 function addPropertiesCountInLocation(location){

 	return new Promise(function(resolve , reject){

 		var query = {};
 		query['property_params.location.city'] = location.city;
 		query['property_params.location.main_locality'] = location.main_locality;

 		Property.find(query).count().exec(function(err , data){
 			if(err){
 				return reject(err);
 			}
 			resolve(data);
 		})

 	})
 }


 function addPropertiesCountInMainLocality(locations){

 	return new Promise(function(resolve , reject){

 		var promiseMap = locations.map(function(location){
 			return addPropertiesCountInLocation(location);
 		});

 		Promise.all(promiseMap).then(function(counts){
 			counts.forEach(function(value , index) {
 				locations[index].count = value;
 			});
 			resolve(locations);
 		}).catch(function(err){
 			reject(err);
 		});

 	});
 }
 

 /*get areas list with properties count*/
 exports.getAreasList = function(req , res){

 	getAllLocationsList().then(function(locations){	

 		return addPropertiesCountInMainLocality(locations);

 	}).then(function(locations){

 		res.json({
 			locations : locations
 		});

 	}).catch(function(err){
 		return res.status(422).send({
 			message: errorHandler.getErrorMessage(err)
 		});
 	});
 }


 function _isMainLocalityPresent(location){

 	var query = {
 		main_locality : location.main_locality,
 		city : location.city
 	}

 	return new Promise(function(resolve , reject){

 		if(!location.main_locality){
 			reject(new Error('missing field main_locality'));
 		}

 		if(!location.city){
 			reject(new Error('missing field city'));
 		}

 		Area.findOne(query).exec(function(err , area){
 			if(err){
 				return reject(err);
 			}
 			resolve(area);
 		});
 	});
 }




 function _addNewSubLocalityToArea(area , location){
 	return new Promise(function(resolve , reject){
 		
 		if(_.isArray(location.sub_localities)){
 			_.each(location.sub_localities , function(sub_locality){
 				if(area.sub_localities.indexOf(sub_locality.trim().toLowerCase())===-1){
 					area.sub_localities.push(sub_locality.trim().toLowerCase());
 				}
 			});
 			area.save(function(err , data){
 				if(err){
 					return reject(err);
 				}
 				return resolve(data);
 			});
 		}else{
 			reject(new Error('sub localities must be array'));
 		}
 	});
 }



 function _addNewArea(location){
 	return new Promise(function(resolve , reject){
 		
 		if(!_.isArray(location.sub_localities)){
 			return reject(new Error('sub localities must be array'));
 		}

 		var area = new Area(location);
 		area.save(function(err , data){
 			if(err){
 				return reject(err);
 			}
 			return resolve(data);
 		});
 	});
 }



 /* add new area/locality */

 exports.addNewArea = function(req , res){

 	var location = {};
 	location.main_locality = req.body.main_locality ? req.body.main_locality.trim().toLowerCase() : undefined;
 	location.city = req.body.city ? req.body.city.trim().toLowerCase() : undefined;
 	location.sub_localities = req.body.sub_localities ? req.body.sub_localities : undefined;

 	_isMainLocalityPresent(location).then(function(area){
 		if(area){
 			return _addNewSubLocalityToArea(area , location);
 		}else{
 			return _addNewArea(location);
 		}
 	}).then(function(){
 		res.json({
 			status : 0,
 			message : 'Area added successfully'
 		});
 	}).catch(function(err){
 		return res.status(422).send({
 			message: errorHandler.getErrorMessage(err)
 		});
 	});
 	

 }




 function _findAreaByID(id){
 	return new Promise(function(resolve , reject ){
 		
 		if (!mongoose.Types.ObjectId.isValid(id)) {
 			reject(new Error('Area id is not valid'));
 		}

 		Area.findById(id).exec(function (err, area) {
 			
 			if (err) {
 				reject(err);
 			} else{

 				if(!area){
 					return reject(new Error('Failed to load area ' + id));
 				}else{
 					resolve(area);
 				}
 			}
 			
 		});
 	});
 }


 function _updateArea(area , location){

 	return new Promise(function(resolve , reject){
 		
 		if(location.sub_localities && !_.isArray(location.sub_localities)){
 			return reject(new Error('sub localities must be array'));
 		}
 		area.main_locality = location.main_locality || area.main_locality;
 		area.city = location.city || area.city;
 		area.sub_localities = location.sub_localities || area.sub_localities;

 		area.save(function(err , data){
 			if(err){
 				return reject(err);
 			}
 			return resolve(data);
 		});

 	});
 	
 }

 /* add new area/locality */
 exports.updateArea = function(req , res){

 	var location = {};
 	location.main_locality = req.body.main_locality ? req.body.main_locality.trim().toLowerCase() : undefined;
 	location.city = req.body.city ? req.body.city.trim().toLowerCase() : undefined;
 	location.sub_localities = req.body.sub_localities ? req.body.sub_localities : undefined;



 	_findAreaByID(req.params.areaId).then(function(area){
 		
 		return _updateArea(area , location);
 	}).then(function(){
 		res.json({
 			status : 0,
 			message : 'Area updated successfully'
 		});
 	}).catch(function(err){
 		return res.status(422).send({
 			message: errorHandler.getErrorMessage(err)
 		});
 	});
 	

 }


 function _deleteArea(area){
 	return new Promise(function(resolve , reject){
 		
 		area.remove(function(err){
 			if(err){
 				return reject(err);
 			}
 			return resolve();
 		});

 	});
 }



 /* add new area/locality */
 exports.deleteArea = function(req , res){

 	
 	_findAreaByID(req.params.areaId).then(function(area){
 		
 		return _deleteArea(area);

 	}).then(function(){
 		
 		res.json({
 			status : 0,
 			message : 'Area deleted successfully'
 		});

 	}).catch(function(err){
 		return res.status(422).send({
 			message: errorHandler.getErrorMessage(err)
 		});
 	});
 	

 }