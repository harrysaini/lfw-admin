'use strict';


exports.getCurrentMinusDaysDate = function(days) {
	var d = new Date();
	return( new Date(Math.abs(d) - days*24*60*60*1000 ));
}