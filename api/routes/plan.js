const express = require("express");
const router = express.Router();



router.post("", (req, res, next) => {
    pool.query(
        'select *  from personal_details where _email = ?',
        [req.params.email],
        function(error,plan, fields) {
        if (plan) {
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
                'insert into partner_perferred( _email,_subscriptionplan, _user_id,_card_id,_expireAt )  values(?,?,?,?,?) ',
                [ 
               
                req.body.email,
                req.body.plan,
                req.body.userid,
                req.body.card_id,
                Date.now()//according to plan
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