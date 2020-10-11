const express = require("express");
const router = express.Router();
const pool = require('../config/database');
const Auth= require("../auth/authorization");
const isAuthorized = require("../auth/profileathoruize");



router.post("", (req, res, next) => {
    pool.query(
        'select *  from tbl_plan where _email = ?',
        [req.params.email],
        function(error,plan, fields) {
        if (plan==null) {
          console.log(plan);
          return res.status(409).json({
            message: "plan already exists"
          });
        } else {

            Date.prototype.addDays = function(days) {
                var date = new Date(this.valueOf());
                date.setDate(date.getDate() + days);
               return date;
            }
            var date = new Date();
            
           


            pool.query(
                'insert into tbl_plan( _email,_subscriptionplan, _user_id,_card_id,_expireAt )  values(?,?,?,?,?) ',
                [  
                req.body.email,
                req.body.plan,
                req.body.userid,
                req.body.card_id,
                date.addDays(5) //according to plan
                ],
                (error, results, fields) => {
        
                    if (error) {
                      return  res.status(500).json({
                        error:error,
                        message:"plan not sbscribed"
                      });
                    } 
                  
                    pool.query(
                      'update tbl_user set planExpire=?  where _email = ?',
                        [
                        date.addDays(5),
                        req.body.email
                      ]
                        ,(err,result)=>{
                          if(err){
                            return  res.status(500).json({
                            error:err
                            
                          });

                         }
                         
                        });
                        const plan ={
                          email:req.body.email,
                          planSuSCRIBED:req.body.plan,
                        }


                        res.status(201).json({
                          status:"Success",
                          message:"PLAN SSCRIBED",
                          data:results  ,
                          PLAN:plan   
          
                        
                  
                      });  
                    
                  });
    }
  });
});


 module.exports = router;