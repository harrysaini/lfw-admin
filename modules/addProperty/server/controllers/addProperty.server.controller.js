'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Property = mongoose.model('Property'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var multer = require('multer');
var filessystem = require('fs');
var crypto = require('crypto');
var mime = require('mime');
var gm = require('gm');


var _parsePOSTPropertyDataToDbJSON = function(req) {

  var propertyData = req.body.post_details;
  req.body.post_details.photos = [];
  if (req.body.post_details.house_images) {
    req.body.post_details.house_images.forEach(function(data) {
      var obj = {}
      obj.location = data;
      req.body.post_details.photos.push(obj);


    })


  }
  req.body.post_details.main_locality=req.body.post_details.main_locality.toLowerCase(); 
  req.body.post_details.city=req.body.post_details.city.toLowerCase();
  var res = req.body.post_details.propertySubType.split(" ");
  console.log("ddddd",res);
  var subtypeString = '';
  res.forEach(function(data) {
    subtypeString += data + '-'



  })
  req.body.post_details.house_slug = req.body.post_details.bedrooms + '-bhk-bedroom-' + subtypeString.trim() + 'for-' + req.body.post_details.transitionType + '-in-' + req.body.post_details.main_locality.trim() + '-' + req.body.post_details.city.trim() + "-" + crypto.pseudoRandomBytes(10).toString('hex');







  var propertyDbJSON = {

    property_params: {

      propertyType: propertyData.propertyType,
      propertySubType: propertyData.propertySubType,
      transitionType: propertyData.transitionType,
      house_slug: propertyData.house_slug,


      location: {
        loc: propertyData.loc,
        city: propertyData.city,
        state: propertyData.state,
        pincode: propertyData.pincode,

        sub_locality: propertyData.sub_locality,
        main_locality: propertyData.main_locality,
        nameOfComplex: propertyData.nameOfComplex,
        address: propertyData.address,
        buildingName: propertyData.buildingName
      },

      propertyFeatures: {
        area: {
          coveredArea: propertyData.coveredArea,
          plotArea: propertyData.plotArea,
          carpetArea: propertyData.carpetArea
        },

        washrooms: propertyData.washrooms,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        balconies: propertyData.balconies,

        floorNumber: propertyData.floorNumber,

        furnishingStatus: propertyData.furnishingStatus,

        floors: propertyData.floors,

        sharedOfficeSpace: propertyData.sharedOfficeSpace,

        personalWashroom: propertyData.personalWashroom,

        pantry: propertyData.pantry,

        transactionType: propertyData.transactionType,

        possessionType: propertyData.possessionType,

        availableFrom: propertyData.availableFrom,

        leasedOut: propertyData.leasedOut

      },

      priceDetails: {
        expectedPrice: propertyData.expectedPrice,

        priceIncludes: propertyData.priceIncludes,

        tokenAmount: propertyData.tokenAmount,

        maintainanceCharges: propertyData.maintainanceCharges,


        borkerageAmount: propertyData.borkerageAmount
      },
      amenities: {
        waterStorage: propertyData.waterStorage,
        visitorParking: propertyData.visitorParking,
        vaastu: propertyData.vaastu,
        park: propertyData.park,
        wasteDisposal: propertyData.wasteDisposal,
        pipedGas: propertyData.pipedGas,
        waterPurifier: propertyData.waterPurifier,
        maintainanceStaff: propertyData.maintainanceStaff



      },

      photos: propertyData.photos,
    },

    // postedBy: req.user._id,

    // postedUserType: req.user.roles
  }

  return propertyDbJSON;
}


/**
 * post property
 */
exports.addProperty = function(req, res) {

  var propertyDbJSON = _parsePOSTPropertyDataToDbJSON(req);
  var property = new Property(propertyDbJSON);
  console.log("ddd", property);

  property.save(function(err, data) {
    if (err) {
      console.log("ddddwwwdd1", err);

      return res.status(422).send({
        status: 1,
        message: errorHandler.getErrorMessage(err)
      });


    } else {
      console.log("ddddww2dd", data);

      return res.json({
        status: 0,
        message: "Added property successfully "
      });
    }
  });

};
exports.uploadPhotos = function(req, res) {


  console.log(req);
  console.log("data", req.data);

  var house_images = [];

  var file_name;
  var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function(req, file, cb) {
      crypto.pseudoRandomBytes(16, function(err, raw) {
        file_name = raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype);
        house_images.push(file_name);



        cb(null, file_name);

      });
    }
  });

  var upload = multer({ storage: storage });
  var cpUpload = upload.any();
  cpUpload(req, res, function(uploadError) {
    if (uploadError) {
      console.log(uploadError);
    } else {

      console.log("uploaded");
      console.log("house images", house_images);
      res.json(house_images);



      ///////////////////////////watermarkstart///////////////////
      module.exports.watermarker(file_name, house_images);

    }
  });





}
exports.watermarker = function(file_name, house_images) {


  var i;
  for (i = 0; i < house_images.length; i++) {

    gm(path.resolve('./public/uploads/' + file_name))
      .resize(640, 640)
      .write(path.resolve('./public/uploads/' + file_name), function(err) {
        if (!err) {
          console.log('resizing done');

        } else
          console.log(err);
      });



  }

};
