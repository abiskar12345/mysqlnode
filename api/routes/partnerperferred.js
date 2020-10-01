const express = require("express");
const router = express.Router();
const pool = require('../config/database');
const Auth= require("../auth/authorization");
const isAuthorized = require("../auth/profileathoruize");
const isPlan = require("../auth/isplan");
router.post("/:email",Auth, isAuthorized,(req, res, next) => {
        pool.query(
          'insert into partner_perferred ( _email,_lowerage, _higherage,_lowerheight,_higherheight,_country,_religion, _languages,_occupation )  values (?,?,?,?,?,?,?,?,?) ',
          [ req.params.email,   
            req.body.lowerage, 
            req.body.higherage,
            req.body.lowerheight,
            req.body.higherheight,
            req.body.country,
            req.body.religion,
            req.body.languages,
            req.body.occupation
            
          ],
          (error, results, fields) => {
    
            if (error) {
              return  res.status(500).json({
                status: "error",          
              message: " partner Perferrred Is not Added",
                error: error
              });
            } 
           else{
            return  res.status(201).json({
              status: "Success",
             message: " partner Perferrred added successfully",
              data: results
            });
      }
    });     
    });
    router.get("/:email",Auth,isAuthorized,(req, res, next) => {
      pool.query(
        'select * from  partner_perferred where _email = ?',
        [req.params.email],
        function(error,user, fields) {
        
       
        if (error) {
          return res.status(401).json({
            status: "error",
              error: error
             
          });
        }
            return res.status(200).json({
              status: "Success",
             message: " partner Perferrred accessed successfully",
              data: user
             
            });
            
        
      });   
    });

  router.patch("/:email",Auth,isAuthorized,(req,res,next)=>{
   pool.query(
          'update partner_perferred set _lowerage =?, _higherage=?,_lowerheight=?,_higherheight=?,_country=?,_religion=?, _languages=? where _email = ?',
          [
            req.body.lowerage, 
            req.body.higherage,
            req.body.lowerheight,
            req.body.higherheight,
            req.body.country,
            req.body.religion,
            req.body.languages,
            req.params.email 
          ],
          (error, results, fields) => {
            if (error) {
              
              return res.status(500).json({
                status: "error",
                message:"cant update partner perferred",
                error: error
            });
            }
            res.status(201).json({
              status: "Success",
             message: " partner Perferrred updated successfully",
              data: results
             
            });
          }
        );
      
    })


module.exports = router;
