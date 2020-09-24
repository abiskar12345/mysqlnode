const express = require("express");
const router = express.Router();
const pool = require('../config/database');
const Auth= require("../auth/authorization");
const isAuthorized = require("../auth/profileathoruize");



router.post("/:email",Auth,isAuthorized,(req, res,next) => {

// Personaldetails.find({ email: req.params.email })
//     .exec()
//     .then(user => {
//       if (user.length < 1) {
//         console.log("hii");
console.log(req.body)
        pool.query(
          'insert into personal_details( _email,_name, _gender,_birthdate,_age,_height,_country,_religion,_martialstats, _langages)  values(?,?,?,?,?,?,?,?,?,?) ',
          [ 
            req.params.email,
            req.body.name,
            req.body.gender, 
            req.body.birthdate,
            req.body.age,
            req.body.height,
            req.body.country,
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

      // 
      // {
    
   });
   

    router.get("/:email", Auth,isAuthorized,(req, res, next) => {
      pool.query(
        'select *  from personal_details where _email = ?',
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
    });


    router.patch("/:email",Auth,(req,res,next)=>{
      pool.query(
          'update tbl_user set _username=?, _gender=?,_birthdate=?,_age=?,_height=?,_country=?,_religion=?,_martialstats=?, _langages=?  where _email = ?',
          [
          
            req.body.name,
            req.body.gender, 
            req.body.birthdate,
            req.body.age,
            req.body.height,
            req.body.country,
            req.body.religion,
            req.body.martialstats,
            req.body.languages,
            req.params.email
          
          ],
          (error, results, fields) => {
            if(error){
              res.status(500).json({
                error: error
              });
  
            }else{
           
              res.status(201).json({
                message: results
               
              });
            }
          });
  
   
       })
   
   





module.exports = router;
