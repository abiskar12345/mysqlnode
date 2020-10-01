
const express = require("express");
const router = express.Router();
const pool = require('../config/database');
const Auth= require("../auth/authorization");
const isAuthorized = require("../auth/profileathoruize");



router.post("", (req, res, next) => {
    pool.query(
        'SELECT count(_email) as count FROM liked_profile WHERE _likedprofiles= ? AND _email=?',
        [ req.body.email, 
          req.body.likedprofiles, 
        ],
        (error, cont, fields) => {
    
          if (error) {
            res.status(500).json({
              error:error,
             
            });
          } 


     if(cont[0].count>0){

    pool.query(
      'update liked_profile set  _matchedprofiles=? where _likedprofiles=? and _email=?',
        [ 
          req.body.email, 
          req.body.email,
          req.body.likedprofiles 
        ],
        (error, resl, fields) => {
    
          if (error) {
             return res.status(500).json({
              error:error,
              message:"blockprofile not created"
            });
          } 
      
          pool.query(
            'insert into liked_profile( _likedprofiles, _matchedprofiles, _email) values(?,?,?) ',
        [ 
          req.body.likedprofiles,
          req.body.likedprofiles, 
          req.body.email
        ],
            (error, results, fields) => {
        
              if (error) {
               return  res.status(500).json({
                  status: "failed",
              
                  error:error,
                  message:"likeprofile not created"
                });
              } 
              res.status(201).json({
                status: "Success",
                message: " likeprofile created successfully",
                message:resl,
                
                data:results
              });
        
            }
          );
    
        }
      );

    }else{
        pool.query(
            'insert into liked_profile ( _likedprofiles, _email)  values(?,?) ',
            [ 
              req.body.likedprofiles,
        
              req.body.email
            ],
            (error, results, fields) => {
        
              if (error) {
                res.status(500).json({
                  status:"error",
                  error:error,
                  message:"likefile not created"
                });
              }else{
              res.status(201).json({
                status: "Success",
                message: " likeprofile created successfully",
              
                data:results
              });
            }
        
            }
          );
    
        }


     });

    
 });

 router.get("/:email",(req,res,next)=>{
  pool.query(
    'select * from liked_profile where _email = ?',
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


 module.exports = router;