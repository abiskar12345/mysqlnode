const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports =(req, res, next) => {
        let token = req.headers.authorization;
        if (token) {
          // Remove Bearer from string
          token = token.slice(7);
          console.log(token);
          jwt.verify(token,process.env.JWT_KEY, (err, decoded) => {
            if (err) {
              return res.json({
                success: 0,
                message: "Invalid Token..."
              });  
            } else {
             
              req.userId = decoded.id;
              next();
    
            }
          });
        } else {
          return res.json({
            success: 0,
            message: "Access Denied! Unauthorized User"
          });
        }
      }
    