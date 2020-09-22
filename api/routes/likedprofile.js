const e = require("express");
const express = require("express");
const router = express.Router();
const pool = require('../config/database');

router.post("", (req, res, next) => {
    pool.query(
        'select * from liked_profile where _email =? ',
        [ 
          req.body.likedprofiles, 
        ],
        (error, results, fields) => {
    
          if (error) {
            res.status(500).json({
              error:error,
             
            });
          } 


          if(results._likedprofiles==req.body.email){

    pool.query(
      'insert into liked_profile( _likedprofile ,_matchedprofile, _email) values(?,?,?) ',
        [ 
          req.body.email, 
          req.body.email,
          req.body.likedprofiles 
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
          pool.query(
            'insert into liked_profile( _likedprofile ,_matchedprofile, _email) values(?,?,?) ',
        [ 
          req.body.likedprofiles,
    
          req.body.likededprofiles, 
          req.body.emai
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
    
        }
      );

    }else{
        pool.query(
            'insert into liked_profile( _likedprofiles,_email)  values(?,?) ',
            [ 
              req.body.likedprofiles,
        
              req.body.email
            ],
            (error, results, fields) => {
        
              if (error) {
                res.status(500).json({
                  error:error,
                  message:"blockprofile not created"
                });
              }else{
              res.status(201).json({
                data:results
              });
            }
        
            }
          );
    
        }


     });

    
 });

 router.get("/:id",(req,res,next)=>{
  pool.query(
    'select * from liked_profile where _email = ?',
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