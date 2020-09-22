const express = require("express");
const router = express.Router();
const pool = require('../config/database');
const {checkToken} = require("../auth/token_validation");



router.post("/:email", (req, res, next) => {




        pool.query(
          'insert into partner_perferred( _email,_lowerage, _higherage,_lowerheight,_higherheight,_country,_religion, _languages )  values(?,?,?,?,?,?) ',
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
              res.status(500).json({
                error: error
              });
            } 
           else{
            res.status(201).json({
              message: "partnerdetails added"
            });
      }
    });

      
      // else{


      //   pool.query(
      //     'update tbl_user set _lowerage=?, _higherage=?,_lowerheight=?,_higherheight=?,_country=?,_religion=?, _languages=? where _email = ?',
      //     [
      //       req.body.lowerage, 
            // req.body.higherage,
            // req.body.lowerheight,
            // req.body.higherheight,
            // req.body.country,
            // req.body.religion,
            // req.body.languages,
            // req.params.email 
      //     ],
      //     (error, results, fields) => {
      //       if (error) {
      //         console.log(err);
      //         res.status(500).json({
      //           error: error
      //       });
      //       }
      //       res.status(201).json({
      //         message: results
             
      //       });
      //     }
      //   );
      // }
    

  
     
    });
    router.get("/:email", (req, res, next) => {
      pool.query(
        'select * from  partner_perferred where _email = ?',
        [req.params.email],
        function(error,user, fields) {
        console.log(user)
       
        if (error) {
          return res.status(401).json({
            message: error
          });
        }
            return res.status(200).json({
              message:user, 
            });
            
        
      });   
    })








module.exports = router;
