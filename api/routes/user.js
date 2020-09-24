
  
const express = require("express");
const router = express.Router();
const pool = require('../config/database');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer'); 
const  checkToken = require("../auth/token_validation");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
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



router.post("/signup", (req, res, next) => {
  pool.query(
    "select * from tbl_user where _email = ?",
    [req.body.email],
    // function (user, fields) {
    function (err, user) {
      if (user.length) {
        return res.status(409).json({
          status: "failed",
          message: "Mail already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            pool.query(
              "insert into tbl_user(_username, _email,  _password)  values(?,?,?)",
              [req.body.username, req.body.email, hash],
              (error, results, fields) => {
                // console.log(results);
                // console.log(fields);
                if (error) {
                  console.log(`error is here ${error}`)
                  res.status(500).send({
                    status: "failed",
                    msg: "Registration failed",
                    error:err
                  });
                } else {
                  var token = crypto.randomBytes(16).toString("hex");
                  console.log(token);
                  pool.query(
                    "insert into tbl_token(_userId, token)  values(?,?)",
                    [req.body.email, token],
                    (error, results, fields) => {
                      if (error) {
                        return res
                          .status(500)
                          .send({ status: "failed", msg: error });
                      }
                      if (results) {
                        pool.query(
                          "select _id,_username, _email, _password from tbl_user where _email = ?",
                          [req.body.email],
                          function (error, user) {
                            pool.query(
                              "select * from tbl_token where _userId=?",
                              [req.body.email],
                              function (err, token) {
                                console.log(err);
                                if (token != null) {
                                  const accessToken = token[0].token;
                                  if (user != null) {
                                    const data = {
                                      id: user[0]._id,
                                      name: user[0]._name,
                                      email: user[0]._email,
                                      password: user[0]._password,
                                      accessToken: accessToken,
                                    };
                                    return res.status(201).json({
                                      status: "Success",
                                      msg: "User Registration Successful",
                                      user: {
                                        email: user[0]._email,
                                        password: user[0]._password,
                                      },
                                      data,
                                    });
                                  }
                                }
                              }
                            );
                          }
                        );
                      }
                    }
                  );

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
              }
            );
          }
        });
      }
    }
  );
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


router.post("/login", (req, res, next) => {
  pool.query(
    "select _id,_username, _email, _password from tbl_user where _email = ?",
    [req.body.email],
    function (error, user, fields) {
      // console.log(user[0]);
      // console.log(user[0] == null);
      if (user[0] == null) {
        return res.status(401).json({
          status: "failed",
          message: "user dosent exists",
        });
      }
      bcrypt.compare(req.body.password, user[0]._password, (err, result) => {
        console.log(result);
        // if (err) {
        //   return res.status(401).json({
        //     message: "aexists",
        //   });
        // }
        if (result) {
          console.log("Inside matching");
          const token = jwt.sign(
            {
              // email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "2d",
            }
          );
          const data = {
            id: user[0]._id,
            name: user[0]._name,
            email: user[0]._email,
            password: user[0]._password,
            accessToken: token,
          };
          return res.status(200).json({
            status: "Success",
            message: "User login successfully",
            user: {
              name: user[0]._name,
              email: user[0]._email,
              password: user[0]._password,
            },
            data,
          });
        } else {
          res.status(401).json({
            status: "failed",
            message: "Incorrect Password",
          });
        }
        // res.status(200).json({
        //   status: "Failed",
        //   message: "log in failed",
        // });
      });
    }
  );
});


router.post("/profileimage/:email", upload.single('profileImage'), (req, res, next) => {
  console.log(req.file.path)
 pool.query(
  
  'update tbl_user set _profileImage=? where _email = ?',
  [
    req.file.path ,
    req.params.email
  ],
  (error, results, fields) => {
    if (error) {
      res.status(500).json({
           err: error
          });
    }
   else{
 ;

    pool.query(
  
      'insert into profile_image( _email,_profileid, _image) values(?,?,?)',
      [
       
        req.params.email,
        req.body.userId.userId,
         req.file.path 
      ],
      (error, result, fields) => {
        if (error) {
          res.status(500).json({
               err: error
              });
        }
       else{
        return res.status(200).json({
          message:results, 
          message:result
          
        });
    
       }
      }
    ); 

   }
  }
); 
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

