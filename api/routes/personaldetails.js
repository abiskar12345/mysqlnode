const express = require("express");
const router = express.Router();
const pool = require('../config/database');
 
const User = require("../models/user");
const Auth= require("../auth/authorization");

const Personaldetails = require("../models/personaldetails");

router.post("/:email",(req, res,next) => {

// Personaldetails.find({ email: req.params.email })
//     .exec()
//     .then(user => {
//       if (user.length < 1) {
//         console.log("hii");
        pool.query(
          'insert into personal_details( _email,_name, _gender,_birthdate,_age,_height,_country,_religion,_martialstats, _langages)  values(?,?,?,?,?,?,?,?,?,?) ',
          [ 
            req.params.email,
            req.body.name,,
            req.body.gender, 
            req.body.birthdate,
            req.body.age,
            req.body.height,
            req.bodycountry,
            req.body.religion,
            
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

     
      

       
      // }else

      // pool.query(
      //   'update tbl_user set _username=?, _gender=?,_birthdate=?,_age=?,_height=?,_country=?,_religion=?,_martialstats=?, _langages=?  where _email = ?',
      //   [
        
      //     req.body.name,,
      //     req.body.gender, 
      //     req.body.birthdate,
      //     req.body.age,
      //     req.body.height,
      //     req.bodycountry,
      //     req.body.religion,
      //     req.body.martialstats,
      //     req.body.languages,
      //     req.params.email,
        
      //   ],
      //   (error, results, fields) => {
      //     if(error){
      //       res.status(500).json({
      //         error: error
      //       });

      //     }else{
         
      //       res.status(201).json({
      //         message: result
             
      //       });
      //     }
      //   });

      // {
    
   });
   

    router.put("/:email", (req, res, next) => {
      
    })





module.exports = router;
