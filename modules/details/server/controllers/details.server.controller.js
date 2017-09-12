'use strict';



var path = require('path');
var mongoose = require('mongoose');
var Property = mongoose.model('Property');






exports.fetch_house = function(req, res) {
  console.log("reqq", req.query);
  Property.findOne({ 'property_params.house_slug': req.query.slug }).exec(function(err, house) {
    if (err) {
      res.json({
        status: 0,
        message: 'House loding Failed' + err
      })
    } else {
      console.log("dddd", house);
      res.json(house);
    }



  })


}
exports.fetchsimilar_properties=function(req,res){
  

}
