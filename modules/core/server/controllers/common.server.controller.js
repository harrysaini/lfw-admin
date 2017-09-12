'use strict';
var mongoose = require('mongoose');
var User = mongoose.model('User');
var interest_bookmark = mongoose.model('interested_bookmark_user');
var path = require('path');
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));



exports.toggle_interest = function(req, res) {

  interest_bookmark.findOne({ user: req.user._id, 'interested.house': req.body.house_id }).lean().exec(function(err, response) {

    console.log("shortlist status", response);

    if (response != null) { // house is shortlisted by user
      console.log("is shortlisted");
      interest_bookmark.findOneAndUpdate({ user: req.user._id }, { $pull: { interested: { house: req.body.house_id } } }, { new: true, safe: true, upsert: true, setDefaultsOnInsert: true }).lean().exec(function(err, response) {

        res.json(response);


      });
    } else { // house is not shortlisted by user
      console.log("is not shortlisted", req.user._id);

      var shortlist_obj = { house: req.body.house_id, time: Date.now() };
      interest_bookmark.findOne({ user: req.user._id }).exec(function(data) {
        console.log("ssss", data);
        if (!data) {
          var new_interest = new interest_bookmark({
            user: req.user._id

          })
          console.log("hh", new_interest);
          new_interest.save(function(err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });

            } else {
              interest_bookmark.findOneAndUpdate({ user: req.user._id }, { $addToSet: { interested: shortlist_obj } }, { new: true, safe: true, upsert: true, setDefaultsOnInsert: true }).lean().exec(function(err, response) {

                console.log("res", response);
                res.json(response);

                // res.json(response.interested);

              });

            }

          })


        } else {
          interest_bookmark.findOneAndUpdate({ user: req.user._id }, { $addToSet: { interested: shortlist_obj } }, { new: true, safe: true, upsert: true, setDefaultsOnInsert: true }).lean().exec(function(err, response) {

            console.log("res", response);
            res.json(response);

            // res.json(response.interested);

          });

        }



      })



    }

  });





}

exports.fetch_all_interest_bookmark = function(req, res) {


  interest_bookmark.findOne({ user: req.user._id }).lean().exec(function(err, data) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });

    } else {
      console.log("data", data);
      if (data == null) {


        res.json({
          data: data,
          status: 0
        });
        return
      }
      res.json({
        data: data,
        status: 1
      });

    }




  })



}
