var mongoose = require('mongoose');
var plm= require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/practice');

var userSchema= mongoose.Schema({
  username: String,
  name: String,
  password: String,
  email: String,
  proimg:{
    type:String,
    default: '../images/uploads/def.jpg'
  },
  newcars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:'car'
  }]
});

userSchema.plugin(plm);

module.exports= mongoose.model('user',userSchema);