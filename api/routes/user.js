
  
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
                    'insert into tbl_token(_userId, token)  dhhggdf@ail.com(?,?)',
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
    'select _id,_name, _email, _password from tbl_user where _email = ?',
    [req.body.email],
    function(error,user, fields) {
    console.log(user[0])
   
    if (user==null) {
      return res.status(401).json({
        message: "ser dosent exists"
      });
    }
    bcrypt.compare(req.body.password,user[0]._password,(err,result)=>{
      if (err){
        return res.status(401).json({
          message: "aexists"
        });
        
      }
      if(result) {
    
       const token = jwt.sign({
          email:user[0]._email,
          userId: user[0]._id,
         
        },process.env.JWT_KEY,{
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


// router.get("/:email", (req, res, next) => {
//   pool.query(
//     'select * from tbl_user where _email = ?',
//     [req.body,email],
//     function(err,users, fields) {
//     if (err) {
//       console.log(err);
//       // res.status(500).json({
//       //    err: err
//       //  });
//   } else {
//     console.log( users);
//       // res.status(201).json({
//       //    data:users
//       //  });

//   //     Blockedprofile.find({profileiD: users._id})
//   //     .exec(function(err, block) {
//   //       if (err) {
//   //         console.log(err);
          
//   //       console.log('tfgftftfvt');
        
//   //         // res.status(500).json({
//   //         //    err: err
//   //         //  });
//   //     } else {
//   //       console.log('hi');
          
//   //         blocked=block[0];
//   //         // res.status(201).json({
//   //         //    data:users
//   //         //  });
    
   
    
//   //     User.find(
//   //       {"_id": { "$nin":[block[0].blockedusers]} }
//   //        )
//   //     .populate({
//   //      path:'personalDetail',
//   //      model : 'Personaldetails',
//   //      match: [{age:{ $gte: users.partnerperferred.loweraoge,
//   //                $lte: users.partnerperferred.higherage}},
//   //              {height:{ $gte: users.partnerperferred.lowerheight ,
//   //               $lte: users.partnerperferred.higherheight}}]
//   //               ,
      
//   //     })
//   //    .populate("partnerperferred")
//   //    .exec(function(error,success ) {
//   //     if (error) {
//   //       console.log(error);
//   //       res.status(500).json({
//   //          error: "error"
//   //        });
//   //     } else {
//   //       // console.log(success);
//   //       res.status(201).json({
//   //          data:success
//   //        });
//   //      }
//   //    })

//   //   }

//   // });
  
//     }
//     });
//   });
  
  
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

router.get("/:email",(req,res,next)=>{
  pool.query(
    'select * from blocked_profile where _email = ?',
    [req.body.email],
    function(error, userBLOCKED, fields) {
      if (error) {
        return res.status(409).json({
          message:error
        });
      } 
        pool.query(
          'SELECT * FROM tbl_user WHERE _email NOT IN (SELECT _blockedprofiles FROM blocked_profile WHERE  _email = ?  IS NOT NULL )',
          [req.params.email],
          function(error, user, fields) {
            if (error) {
              return res.status(409).json({
                message:error
              });
            } 
            res.status(201).json({
              data:user
            });
  
          });
      });
       

      
    
});







module.exports = router;

