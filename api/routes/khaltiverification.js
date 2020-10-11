const express = require("express");
const router = express.Router();
const pool = require('../config/database');
const Auth = require("../auth/authorization");
const isAuthorized = require("../auth/profileathoruize");
const jwt = require("jsonwebtoken");
const axios = require('axios');

router.post('',(req,res,next)=>{
    let data = {
        "token": req.body.token,
        "amount": req.body.amount
    };
    
    let config = {
        headers: {'Authorization':'key' + ' '+ req.headers.authorization}
    };
    
    axios.post("https://khalti.com/api/v2/payment/verify/", data, config)
        .then(response => {
            let payment=response.data
            console.log(response.data)

            pool.query(
                'insert into personal_details(_email, _cardname, _cardnumber, _type, _amount, _paymentId)  values(?,?,?,?,?) ',
                [ 
                  req.params.email,
                  payment.user.name,
                  payment.user.mobile,
                  'khalti', 
                  payment.amount,
                  payment.type.idx
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
           })
             .catch(error => {
             return  res.status(401).json({
               status:"failed",
               message:"faliled to verify khalti payment",
                error: error
              });
            
            });


});
module.exports = router;