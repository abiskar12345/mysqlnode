const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const Auth = require("../auth/authorization");
const isAuthorized = require("../auth/profileathoruize");
const isPlan = require("../auth/isplan");
router.post("/:email", Auth, isAuthorized, (req, res, next) => {
    pool.query("SELECT * FROM partner_preferred WHERE _email = ?",
    [req.params.email],
    (error,user)=>{
      console.log(`this is user : ${error}`)
      if(user.length){
        res.status(409).json({
          status:"Failed",
          message:"Partner preferred added already",
          error
        })
      }
      else{
        pool.query(
          "insert into partner_preferred ( _email,_lowerAge, _higherAge,_lowerHeight,_higherHeight,_gender,_religion )  values (?,?,?,?,?,?,?) ",
          [
            req.params.email,
            req.body.lowerAge,
            req.body.higherAge,
            req.body.lowerHeight,
            req.body.higherHeight,
            req.body.gender,
            // req.body.country,
            req.body.religion,
            // req.body.languages,
            // req.body.occupation,
          ],
          (error, results, fields) => {
            const data = {
              email: req.params.email,
              lowerage: req.body.lowerage,
              higherage: req.body.higherage,
              lowerheight: req.body.lowerheight,
              higherheight: req.body.higherheight,
              // country: req.body.country,
              religion: req.body.religion,
              // languages: req.body.languages,
              // occupation: req.body.occupation,
            };
      
            if (error) {
              console.log(`this is errror ${error}`);
              return res.status(500).json({
                status: "error",
                message: " partner Perferrred Is not Added",
                error: error,
              });
            } else {
              return res.status(201).json({
                status: "Success",
                message: " partner Perferrred added successfully",
                data,
              });
            }
          }
        );
      }
    }
    )
});
router.get("/:email", Auth, isAuthorized, (req, res, next) => {
  pool.query(
    "select * from  partner_perferred where _email = ?",
    [req.params.email],
    function (error, user, fields) {
      if (error) {
        return res.status(401).json({
          status: "error",
          error: error,
        });
      }
      return res.status(200).json({
        status: "Success",
        message: " partner Perferrred accessed successfully",
        data: user,
      });
    }
  );
});

router.patch("/:email", Auth, isAuthorized, (req, res, next) => {
  pool.query(
    "update partner_perferred set _lowerage =?, _higherage=?,_lowerheight=?,_higherheight=?,_country=?,_religion=?, _languages=? where _email = ?",
    [
      req.body.lowerage,
      req.body.higherage,
      req.body.lowerheight,
      req.body.higherheight,
      req.body.country,
      req.body.religion,
      req.body.languages,
      req.params.email,
    ],
    (error, results, fields) => {
      if (error) {
        return res.status(500).json({
          status: "error",
          message: "cant update partner perferred",
          error: error,
        });
      }
      res.status(201).json({
        status: "Success",
        message: " partner Perferrred updated successfully",
        data: results,
      });
    }
  );
});

// check if user already setup their details
router.get("/checkSetup/:email",(req, res, next) => {
  console.log("checking")
  console.log(req.params.email)
  pool.query(
    "SELECT * FROM partner_preferred WHERE _email=?",
    [req.params.email],
    function (err, result) {
      console.log(err);
      if (result.length) {
        res.status(200).json({
          status: "Found",
          message: "Exists",
        });
      } else {
        res.status(404).json({
          status: "Not Found",
          message: "Not Exist",
        });
      }
    }
  );
});

module.exports = router;
