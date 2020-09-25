const express = require("express");
const router = express.Router();
const pool = require('../config/database');
const Auth= require("../auth/authorization");
const isAuthorized = require("../auth/profileathoruize");



router.post("",Auth,isAuthorized, (req, res, next) => {
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
            console.log(date.addDays(5))


            pool.query(
                'insert into tbl_plan( _email,_subscriptionplan, _user_id,_card_id,_expireAt )  values(?,?,?,?,?) ',
                [  
                req.body.email,
                req.body.plan,
                req.body.userid,
                req.body.card_id,
                Date.now() //according to plan
                ],
                (error, results, fields) => {
        
                    if (error) {
                      res.status(500).json({
                        error:error,
                        message:"plan not sbscribed"
                      });
                    } 
                    res.status(201).json({
                      data:results
                    });
              
                  }
                );       
        }
      });
  });



 module.exports = router;