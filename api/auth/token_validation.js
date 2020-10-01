
const express = require("express");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();


const pool = require("../config/database");



router.get("/confirmation/:token",(req,res,next)=>{
  // Find a matching token
  pool.query('select * from tbl_token where token = ?',[req.params.token ], function (err, token) {
      if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

    
      pool.query('select * from tbl_user where _email = ?', [ 
         token[0]._userId,
        
        ], function (error, user,fields) {
          if (error) {
            return res.status(401).json({
              message: error
            });
          }
          console.log(user)
          if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
          if (user[0].isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

          // Verify and save the user
         pool.query('update tbl_user set isVerified=? where _email = ?',
         [ "yes",
          user[0]._email
        ],function (error, data){
          if (error) {
            return res.status(401).json({
              message: error
            });
          }
          res.status(200).send( {message :data        
           });

         }
         )
      });
  })

});
router.post('/resendtoken',(req,res,next)=>{
   pool.query('select _id,_name,_email,isVerified from tbl_user where _email = ?',
    [ req.body.email], 
     function(error,user, fields) {
        console.log(user)
        if(user==null){
          return res.status(401).json({
            message:"profile not fond"
          });

        }
       
        if (error) {
          return res.status(401).json({
            message: error
          });
        }
       if (user.isVerified){
        return res.status(400).send({
           msg: 'This account has already been verified. Please log in.'
           });
       } 
       else
           var token = crypto.randomBytes(16).toString('hex') ;
          pool.query('insert into tbl_token( _userId,token)  values(?,?) ',[
            user[0]._email, 
            token 
       ], function(error,tokn, fields) {
        
           
            if (error) {
              return res.status(401).json({
                message: error
              });
            }
            console.log(token);

           
            var transporter = nodemailer.createTransport({
               name:'mail.mahajodi.space',
                host: 'mail.mahajodi.space',
                port:  465,
                secure: true,
                auth: { 
                      user: 'admin@mahajodi.space',
                      pass: '!!mahajodi!!' 
                      }         
                      });
            var mailOptions = { 
              
              from: process.env.MAIL_USERNAME, 
              to: user[0]._email, 
              subject: 'Account Verification Token',
               text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/validate/confirmation\/' + token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                    res.status(200).send( {message :'A verification email has been sent to ' + user[0]._email + '.',
                  
                  });
            });
        })
           
            
        })
});

 module.exports = router;