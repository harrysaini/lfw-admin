var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PropertyParamsSchema = new Schema({

  propertyType: {
    type: String,
    default: ""
  },
  propertySubType: {
    type: String,
    default: ''
  },
  transitionType: {
    type: String,
    default: ''
  },

  house_slug: {
    type: String,
    default: ''
  },

  location: {
    loc: {
      type: [Number],
      index: '2dsphere'
    },
    city: {
      type: String,
      default: '',
      lowercase : true,
      trim : true
    },

    state: {
      type: String,
      default: '',
      lowercase : true,
      trim : true
    },
    pincode: {
      type: String,
      default: ''
    },
    sub_locality: {
      type: String,
      lowercase : true,
      trim : true
    },
    main_locality: {
      type: String,
      lowercase : true,
      trim : true
    },

    nameOfComplex: {
      type: String
    },
    address: {
      type: String
    },
    buildingName: {
      type: String
    },
    age: {
      type: Number
    }
  },

  propertyFeatures: {
    area: {
      coveredArea: {
        type: String
      },
      plotArea: {
        type: String
      },
      carpetArea: {
        type: String
      }
    },

    washrooms: {
      type: Number
    },

    bedrooms: {
      type: Number
    },
    balconies: {
      type: Number
    },
    bathrooms: {
      type: Number

    },

    floorNumber: {
      type: Number
    },

    furnishingStatus: {
      type: String,
      lowercase : true
    },

    floors: {
      type: Number
    },

    sharedOfficeSpace: {
      type: Boolean,
      default: false
    },

    personalWashroom: {
      type: Boolean,
      default: false
    },

    pantry: {
      type: Boolean,
      default: false
    },

    transactionType: {
      type: String
    },

    possessionType: {
      type: String,
      lowercase : true
    },

    availableFrom: {
      type: Date,
      default: Date.now
    },

    leasedOut: {
      type: Boolean
    }

  },

  priceDetails: {
    expectedPrice: {
      type: Number
    },

    priceIncludes: {
      type: String
    },

    tokenAmount: {
      type: Number
    },

    maintainanceCharges: {
      type: Number
    },

    borkerageAmount: {
      type: Number
    }
  },

  amenities: {
    waterStorage: {
      type: Boolean,
      default: false
    },
    visitorParking: {
      type: Boolean,
      default: false
    },
    vaastu: {
      type: Boolean,
      default: false
    },
    park: {
      type: Boolean,
      default: false
    },
    wasteDisposal: {
      type: Boolean,
      default: false
    },
    waterPurifier: {
      type: Boolean,
      default: false
    },
    maintainanceStaff: {
      type: Boolean,
      default: false
    },
    rainWater: {
      type: Boolean,
      default: false
    },
    pipedGas: {
      type: Boolean,
      default: false
    },



  },

  photos: [{

    location: {
      type: String
    },

    heading: {
      type: String
    }
  }]
})



var PropertySchema = new Schema({

  created: {
    type: Date,
    default: Date.now
  },

  property_params: {
    type: PropertyParamsSchema
  },

  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  postedUserType: {
    type: String
  },

  isVerified : {
    type : Boolean,
    default : false
  },

  isAdminVerified : {
    type : Boolean,
    default : false
  },

  showInListing : {
    type : Boolean,
    default : false
  }


});


var interest_bookmark_user_schema = new Schema({


  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  interested: [{
    _id: false,
    house: {
      type: Schema.Types.ObjectId,
      ref: 'House'
    },
    broker_landlord: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },

    time: {
      type: Date,
      default: Date.now,
    }
  }],


});




mongoose.model('Property', PropertySchema);
mongoose.model('interested_bookmark_user', interest_bookmark_user_schema);
