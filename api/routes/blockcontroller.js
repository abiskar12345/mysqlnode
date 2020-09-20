const express = require("express");
const router = express.Router();
const pool = require('../config/database');


router.post("", (req, res, next) => {
  pool.query(
    'insert into blocked_profile( _blockedprofiles,_email) where(?,?) ',
    [ 
      req.body.blockedprofiles,

      req.body.email, 
    ],
    (error, results, fields) => {

      if (error) {
        res.status(500).json({
          error:error,
          message:"blockprofile not created"
        });
      } 
      res.status(201).json({
        data:results
      });

    }
  );
  });


    router.get("/:email",(req,res,next)=>{
      pool.query(
        'select * from blocked_profile where _email = ?',
        [req.body.email],
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


 

 module.exports = router;