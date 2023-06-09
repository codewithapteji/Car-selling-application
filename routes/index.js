var express = require('express');
var router = express.Router();
var User=require('./users');
var Carmodel=require('./cars');
var passport= require('passport');
var localStratgy= require('passport-local');
var multer = require('multer');

passport.use(new localStratgy(User.authenticate()));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    var filename= Math.floor(Math.random()*1000000);
    filename= filename + Date.now()
    filename=filename+ file.originalname
    cb(null, filename)
  }
})
 
var upload = multer({ storage: storage, filefilter:filefilter})

function filefilter(req,file,cb){
  if(file.minetype === 'image/png' ||file.minetype === 'image/jpg'||file.minetype === 'image/jpeg')cb(null, true)
  else cb(null, false)
};


router.get('/',function(req,res){
  res.render('index');
});

router.get('/find',function(req,res){
  User.find()
  .then(function(u){
    res.send(u);
  })
})
router.get('/profile',isloggedin,function(req,res){
  User.findOne({username: req.session.passport.user})
  .populate('newcars')
  .exec(function(err, adeatils){
    res.render('profile',{adeatils:adeatils});
  })
})

router.post('/login',passport.authenticate('local',{
  successRedirect: '/profile',
  failureRedirect: '/'
}),function(req,res,next){})

router.post('/reg', function(req, res){
  var newUser= new User({
    username: req.body.username,
    name: req.body.name
  })
 User.register(newUser,req.body.password)
  .then(function(registereduser){
   passport.authenticate('local')(req,res,function(){
     res.redirect('/profile');
   })
  })  
 });

 router.post('/uploadit', upload.single('proimg'),function(req,res){
    User.findOne({username: req.session.passport.user})
    .then(function(founduser){
      founduser.proimg= `../images/uploads/${req.file.filename}`;
      founduser.save()
      .then(function(savedata){
        res.redirect('/profile');
      })
    })
 })

 router.post('/newcar',upload.single('carimg'),function(req,res){
  User.findOne({username: req.session.passport.user})
    .then(function(loggedinuser){
      var imgadd = `../images/uploads/${req.file.filename}`
      Carmodel.create({
        carsid: loggedinuser._id,
        carprice: req.body.carprice,
        carname: req.body.carname,
        contact: req.body.contact,
        carimg: imgadd
      })
      .then(function(createdcar){
        loggedinuser.newcars.push(createdcar);
        loggedinuser.save()
        .then(function(alldetails){
          res.redirect('/profile');
        })
      })
    })
 });

 router.get('/deleteit/:det',function(req,res){
  Carmodel.findOneAndDelete({_id:req.params.det})
  .then(function(z){
    res.redirect('/profile');
  })
}) 


 router.get('/logout',function(req,res){
   req.logOut();
   res.redirect('/');
 })

 function isloggedin(req,res,next){
   if(req.isAuthenticated()){
     return next();
   }
   else{
    res.redirect('/');
   }
 }
module.exports = router;
