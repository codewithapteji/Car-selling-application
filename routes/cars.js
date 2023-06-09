var mongoose = require('mongoose');

var carSchema= mongoose.Schema({
  carprice: Number,
  contact: Number,
    carname: String,
  carsid: {
    type: mongoose.Schema.Types.ObjectId,
  },
  carimg:{
    type:String,
    default: '../images/uploads/def.jpg'
  }
});


module.exports= mongoose.model('car',carSchema);