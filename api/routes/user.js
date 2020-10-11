const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const Auth = require("../auth/authorization");
const isAuthorized = require("../auth/profileathoruize");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
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
                if (error) {
                  console.log(`error is here ${error}`);
                  res.status(500).send({
                    status: "failed",
                    msg: "Registration failed",
                    error: err,
                  });
                } else {
                  var token = crypto.randomBytes(16).toString("hex");
                  console.log(token);
                  pool.query(
                    "insert into tbl_token(_userId, token) values (?,?)",
                    [req.body.email, token],
                    (error) => {
                      console.log(error);
                      if (error) {
                        return res.status(500).send({
                          status: "failed",
                          message: "Can't insert into table ",
                          error,
                        });
                      }
                    }
                  );

                  var transporter = nodemailer.createTransport({
                    name: "mail.mahajodi.space",
                    host: "mail.mahajodi.space",
                    port: 465,
                    secure: true,
                    auth: {
                      user: process.env.DOMAIN_EMAIL,
                      pass: process.env.EMAIL_PASSWORD,
                      // user: "admin@mahajodi.space",
                      // pass: "!!mahajodi!!",
                    },
                  });
                  var mailOptions = {
                    // from: process.env.MAIL_USERNAME,
                    from: process.env.DOMAIN_EMAIL,
                    to: req.body.email,
                    subject: "Account Verification Token",
                    text:
                      "Hello,\n\n" +
                      "Please verify your account by clicking the link: \nhttp://" +
                      req.headers.host +
                      "/confirmation/" +
                      token +
                      ".\n",
                  };
                  transporter.sendMail(mailOptions, function (err) {
                    console.log(req.body.email);
                    if (err) {
                      return res
                        .status(500)
                        .send({ status: "failed", msg: err.message });
                    } else {
                      pool.query(
                        "SELECT * FROM tbl_user WHERE _email = ?",
                        [req.body.email],
                        function (error, user) {
                          console.log(`last check ${req.body.email}`);
                          if (err) {
                            res.status(404).json({
                              status: "failed",
                              error,
                            });
                          }
                          const data = {
                            username: user[0]._username,
                            email: user[0]._email,
                            password: user[0]._password,
                          };

                          res.status(200).send({
                            status: "Success",
                            message: `a verification email sent to : ${req.body.email}`,
                            user: {
                              email: user[0]._email,
                              password: user[0]._password,
                            },
                            data,
                          });
                        }
                      );
                    }
                  });
                  // pool.query(
                  //   'insert into blocked_profile( _email) values(?) ',
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

router.delete("/:userId", Auth, (req, res, next) => {
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
          status: "Failed",
          message: "User email doesn't exist",
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

router.post(
  "/profileimage/:email",
  upload.single("profileImage"),
  Auth,
  isAuthorized,
  (req, res, next) => {
    console.log(req.file.path);
    pool.query(
      "update tbl_user set _profileImage=? where _email = ?",
      [req.file.path, req.params.email],
      (error, results, fields) => {
        if (error) {
          res.status(500).json({
            err: error,
          });
        } else {
          pool.query(
            "insert into profile_images( _email,_profileid, _image) values(?,?,?)",
            [req.params.email, req.body.userId, req.file.path],
            (error, result, fields) => {
              if (error) {
                res.status(500).json({
                  err: error,
                });
              } else {
                return res.status(200).json({
                  message: results,
                  message: result,
                });
              }
            }
          );
        }
      }
    );
  }
);

router.patch("/:email", Auth, isAuthorized, (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      pool.query(
        "update tbl_user set _name=? _password? where _email = ?",
        [req.body.name, req.body.password, req.params.email],
        (error, results, fields) => {
          if (error) {
            res.status(500).json({
              err: error,
            });
          } else {
            return res.status(200).json({
              message: "updated scessflly",
            });
          }
        }
      );
    }
  });
});

router.get("/:email", Auth, isAuthorized, (req, res, next) => {
  pool.query(
    "select * from  partner_preferred where _email = ?",
    [req.params.email],
    (error, perferance, fields) => {
      console.log(`this is error: ${error}`)
      if (error) {
        return res.status(409).json({
          error: error,
        });
      }
      console.log(`this is preferred: ${perferance[0]._religion}`);
      pool.query(
        // "SELECT  a._username,a._email ,b._gender,b._birthdate,b._age,b._height,b._country,b._religion,b._martialstatus, b._languages ,b._occupation FROM tbl_user as a JOIN personal_details as b ON a._email = b._email WHERE  ( b._age BETWEEN ? AND ? OR b._height BETWEEN ? AND ? OR b._country = ? OR b._religion = ? OR b._languages = ? OR b._occupation = ? ) And a._email NOT IN (SELECT _blockedprofiles FROM blocked_profile WHERE  _email = ?  IS NOT NULL )",
        // "SELECT  a._username,a._email ,b._gender,b._birthdate,b._height,b._country,b._religion,b._martialstatus,b._profession FROM tbl_user as a JOIN personal_details as b ON a._email = b._email WHERE  ( b._height BETWEEN ? AND ? OR b._country = ? OR b._religion = ? OR b._profession = ? )",
        "SELECT a._id, a._username,a._email ,b._gender,b._birthdate,b._height,b._country,b._religion,b._martialstatus,b._profession FROM tbl_user as a JOIN personal_details as b ON a._email = b._email WHERE  b._height=  ? ",
        [
          // perferance[0]._lowerAge,
          // perferance[0]._higherAge,
          perferance[0]._lowerHeight,
          // perferance[0]._higherHeight,
          // perferance[0]._country,
          // perferance[0]._religion,
          // perferance[0]._languages,
          // perferance[0]._profession,
          // req.params.email,
        ],
        function (error, user, fields) {
          if (error) {
            return res.status(409).json({
              status: "error",
              message: " can't get profiles",
              error: error,
            });
          }
          res.status(201).json({
            status: "Success",
            messsage:"Successfully got partners",
            data: user,
          });
        }
      );
    }
  );
});
module.exports = router;
