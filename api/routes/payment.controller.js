const express = require("express");
const router = express.Router();
const pool = require('../config/database');
const Auth= require("../auth/authorization");
const isAuthorized = require("../auth/profileathoruize");



router.post("/:email",Auth,isAuthorized,(req, res, next) => {
   
          bcrypt.hash(req.body.cardnumber, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              });
            } else {
          

              pool.query(
                'insert into personal_details(_email, _cardname, _cardnmber,_type)  values(?,?,?,?) ',
                [ 
                  req.params.email,
                  req.body.cardname,
                  hash,
                  req.body.cardtype,  
                  req.body.martialstats,
                  req.body.languages
              ],function(error,result ){
                if(error){
                  res.status(500).json({
                    error: error
                  });
      
                }else{
                  res.status(201).json({
                    message: result
                   
                  });
                }
            });
        }
          });


  
           
        

  });


  module.exports = router;
 