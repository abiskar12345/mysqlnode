
  
const express = require("express");
const router = express.Router();
const pool = require('../config/database');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// const User = require("../models/user");
const multer = require('multer'); 
const  checkToken = require("../auth/token_validation");
// const Likedprofile = require("../models/likedprofile");
// const Personaldetails = require("../models/personaldetails");
// const Blockedprofile = require("../models/blockedprofile");
// const Token = require("../models/verificationtoken");
// const Personaldetails = require("../models/personaldetails");
// const Partnerperferred = require("../models/partnerperferred");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};




const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});



router.post("/signup",  (req, res, next) => {
  pool.query(
    'select * from tbl_user where _email = ?',
    [req.body.email],
    function(user, fields) {
      if (user) {
        return res.status(409).json({
          message: "Mail already exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            pool.query(
              'insert into tbl_user(_name, _email,  _password)  values(?,?,?)',
              [ 
                req.body.name,
                req.body.email,
                hash     
              ],
              (error, results, fields) => {
                console.log(results);
                console.log(fields);
        
                if (error) {
                  res.status(500).send({ msg: error });
                } else{ 
                  var token =  crypto.randomBytes(16).toString('hex');
                  pool.query(
                    'insert into tbl_token(_userId, token)  values(?,?)',
                    [ 
                      req.body.email,
                     token      
                    ],
                    (error) => {
              
                      if (error) { return res.status(500).send({ msg: error });}

                    });

                  
    
                  // var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
                  // var mailOptions = { from: 'no-reply@yourwebapplication.com', to: req.body.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token + '.\n' };
                  // transporter.sendMail(mailOptions, function (err) {
                  //     if (err) { return res.status(500).send({ msg: err.message }); }
                  //         res.status(200).send( {message :"'A verification email has been sent to ' + user.email + '.'",
                  //         data:results
                  //       });
                  // });
                  // pool.query(
                  //   'insert into blocked_profile( _email)  values(?) ',
                  //   [ 
          
                  //     req.body.email, 
                  //   ],
                  //   (error, results, fields) => {
              
                  //     if (error) {
                  //       res.status(500).json({
                  //         error:error,
                  //         message:"blockprofile not created"
                  //       });
                  //     } 
                  //   }
                  // );
          
                  // pool.query(
                  //   'insert into liked_profile( _email)  values(?) ',
                  //   [ 
          
                  //     req.body.email, 
                  //   ],
                  //   (error, results, fields) => {
              
                  //     if (error) {
                  //       res.status(500).json({
                  //         error:error,
                  //         message:"likeprofile not created"
                  //       });
                  //     } 
                  //   }
                  // );


                }



                
              
              });

          
              
             
             
        
          }

         
        });
      }
    });
});

router.delete("/:userId", (req, res, next) => {
  pool.query(
    `delete from tbl_user where _id = ?`,
    [data.id],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
});


router.post("/login",(req,res , next)=>{
  pool.query(
    'SELECT * FROM tbl_user WHERE _email = ?',
    [req.body.email],
    function(user, fields) {
    console.log(user)
   
    if (user==null) {
      return res.status(401).json({
        message: "ser dosent exists"
      });
    }
    bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
      if (err){
        return res.status(401).json({
          message: "aexists"
        });
        
      }
      if(result) {
    
       const token = jwt.sign({
          email:user[0].email,
          userId: user[0]._id,
         
        },'hahsh',{
          expiresIn:"1h" 
        });
        return res.status(200).json({
          message:user, 
          token:token
        });
        
      }
      res.status(200).json({
        message: "log in failed"
      });
    })


  })
  

});


router.get("/:email", (req, res, next) => {
  pool.query(
    'select * from tbl_user where _email = ?',
    [req.body,email],
    function(err,users, fields) {
    if (err) {
      console.log(err);
      // res.status(500).json({
      //    err: err
      //  });
  } else {
    console.log( users);
      // res.status(201).json({
      //    data:users
      //  });

  //     Blockedprofile.find({profileiD: users._id})
  //     .exec(function(err, block) {
  //       if (err) {
  //         console.log(err);
          
  //       console.log('tfgftftfvt');
        
  //         // res.status(500).json({
  //         //    err: err
  //         //  });
  //     } else {
  //       console.log('hi');
          
  //         blocked=block[0];
  //         // res.status(201).json({
  //         //    data:users
  //         //  });
    
   
    
  //     User.find(
  //       {"_id": { "$nin":[block[0].blockedusers]} }
  //        )
  //     .populate({
  //      path:'personalDetail',
  //      model : 'Personaldetails',
  //      match: [{age:{ $gte: users.partnerperferred.loweraoge,
  //                $lte: users.partnerperferred.higherage}},
  //              {height:{ $gte: users.partnerperferred.lowerheight ,
  //               $lte: users.partnerperferred.higherheight}}]
  //               ,
      
  //     })
  //    .populate("partnerperferred")
  //    .exec(function(error,success ) {
  //     if (error) {
  //       console.log(error);
  //       res.status(500).json({
  //          error: "error"
  //        });
  //     } else {
  //       // console.log(success);
  //       res.status(201).json({
  //          data:success
  //        });
  //      }
  //    })

  //   }

  // });
  
    }
    });
  });
  
  
router.post("/", upload.single('profileImage/:email'), (req, res, next) => {
  
  User.update({email: req.params.email},{$set: {image: req.path.image}}) 
  .catch(err => {
   console.log(err);
   res.status(500).json({
     error: err
   });
 }); 
  
  
});


router.patch('/:email',(req,res,next)=>{
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err
      });
    } else {
  
    pool.query(
    'update tbl_user set _name=? _password? where _email = ?',
    [
      req.body.name,
      req.body.password,
      req.params.email
    ],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({
             err: error
            });
      }
     else{
      return res.status(200).json({
        message:"updated scessflly" 
        
      });

     }
    }
  );
    }  
  });  
});


router.post('/resetpassword', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        // host: 'smtp.gmail.com',
        // port: 587,
        //   secure: false,
        // requireTLS: true,
         service: "Gmail",
         port: 465,
       
         auth: {
           user: "amazingstudiosab@gmail.com", // generated ethereal user
           pass: "", // generated ethereal password
         }
      });
      var mailOptions = {
        to: user.email,
        from: 'amazingstudiosab@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});





module.exports = router;

