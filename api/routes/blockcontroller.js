const express = require("express");
const router = express.Router();
const pool = require('../config/database');
const Auth= require("../auth/authorization");
const isAuthorized = require("../auth/profileathoruize");


router.post("",Auth,isAuthorized, (req, res, next) => {
  pool.query(
    'insert into blocked_profile( _blockedprofiles, _email)  values (?,?) ',
    [ 
      req.body.blockedprofile,

      req.body.email, 
    ],
    (error, results, fields) => {

      if (error) {
        res.status(500).json({
          status: "error",
          message:"blockprofile not created",  
          error: error,
        });
      } 
      res.status(201).json({
        status: "Success",
        message: " blockprofile added successfully",
      
        data:results
      });

    }
  );
  });

 router.get("/:email",Auth,isAuthorized,(req,res,next)=>{
      pool.query(
        'select * from blocked_profile where _email = ?',
        [req.body.email],
        function(error, user, fields) {
          if (error) {
            return res.status(409).json({
              status: "error",
              error:error
            });
          } 
          res.status(201).json({
            status: "Success",
            data:user
          });

        });
    });


 

 module.exports = router;
