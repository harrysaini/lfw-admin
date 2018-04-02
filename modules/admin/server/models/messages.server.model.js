var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
	to : {
		type : String,
		required : 'Please provide users email'
	},
	from:{

		name : {
			type : String,
			required : 'Please provide senders name'
		},

		email : {
			type : String,
			required : 'Please provide senders email'
		}
	},
	message : {
		type: String,
		required : 'Please provide message'
	},
	subject : {
		type : String,
		required : 'Please provide subject'
	},
	created : {
		type : Date,
		default : Date.now
	}
});



mongoose.model('Message' , messageSchema);