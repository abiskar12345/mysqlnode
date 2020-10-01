const express = require("express");
const router = express.Router();
const pool = require('../config/database');
const Auth = require("../auth/authorization");
const isAuthorized = require("../auth/profileathoruize");
const jwt = require("jsonwebtoken");
router.post("", (req, res, next) =>{
  var decodejwt= jwt.decode(req.body.token ,process.env.JWT_KEY, { complete: true });
 
    pool.query(
        'select *  from tbl_user where _id = ?',
        [decodejwt.userId],
        function(error,user, fields) {
          if(error){
            return res.status(200).json({
              status: "Failed",
              message: "incorrect cereedentils",
            });

          }
          if(user==null){
            return res.status(200).json({
              status: "Failed",
              message: "User not fond",
            });

          }
         else {
           
            const token = jwt.sign(
              {
                userId: user[0]._id,
              },
              process.env.JWT_KEY,
              {
                expiresIn: "2d",
              }
            );
            const dat = {
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
              data:user,
            });
         }
        
                    
           
  });
});


 module.exports = router;