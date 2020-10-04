const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const partnerperferredRoutes = require("./api/routes/partnerperferred");
const personaldetailsRoutes = require("./api/routes/personaldetails");
const userRoutes = require('./api/routes/user');
const blockRoutes= require('./api/routes/blockcontroller');
const likeRoutes= require('./api/routes/likedprofile');
const verificationRoutes = require('./api/auth/token_validation');
const planRoutes= require('./api/routes/plan');
const locationRoutes= require('./api/routes/locationcontroller');
const pool = require("./api/config/database");
const jwtLogin =require('./api/routes/jwtlogin');
app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});


function intervalFunc() {
  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() - days);
   return date;
}
var date = new Date();
console.log(date.addDays(-1))


  pool.query('select _gender, count(*)  as singlecont FROM  personal_details WHERE createdAt >= ? group by _gender ',
  [date.addDays(1)],
  function(error,reslt){
    if(error){
      console.log(error);
    } else{
      console.log(reslt);
    pool.query('insert into new_profiles (addedprofile,male,female) values(?,?,?)',
    [
      reslt[0].singlecont+reslt[1].singlecont,
      reslt[0].singlecont,
      reslt[1].singlecont
     ],function(error,relt){
      if(error){
        console.log(error);
      }

    
  });
  }

  }
  );

  pool.query('delete from tbl_plan where _expireAt >= ?',
  [
    date.addDays(0)
  ]
  ,function(error,relt){
    if(error){
      console.log(error);
    }

  
});
  

 
  
};

setInterval(intervalFunc, 8640000);



//////////////////////////////////////////////////////// Routes which should handle requests////////////////////////////////////////////////////////////////////////
app.use("/user/partnerperferred", partnerperferredRoutes);
app.use("/user/personaldetails", personaldetailsRoutes);
app.use("/user", userRoutes);
app.use("/block", blockRoutes);
app.use("/like", likeRoutes);
app.use("/validate",verificationRoutes);
app.use("/user/plan", planRoutes);
app.use("/jwtlogin", jwtLogin);
app.use("/khaltiverify", khaltiVerify);
// app.use("/location", locationRoutes);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});






module.exports = app;
