const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const Auth = require("../auth/authorization");
const isAuthorized = require("../auth/profileathoruize");

router.post("/:email", Auth, isAuthorized, (req, res, next) => {
  pool.query(
    "SELECT * FROM partner_preferred WHERE _email=?",
    [req.params.email],
    function (err, result) {
      console.log(result);
      console.log(err);
      if (result.length) {
        res.status(409).json({
          status: "Failed",
          message: "You Already set your partner preference",
          
        });
      }else {
        pool.query(
          "insert into partner_preferred ( _email,_lowerAge, _higherAge,_lowerHeight,_higherHeight,_gender,_religion)  values (?,?,?,?,?,?,?) ",
          [
            req.params.email,
            req.body.lowerAge,
            req.body.higherAge,
            req.body.lowerHeight,
            req.body.higherHeight,
            // req.body.country,
            req.body.gender,
            req.body.religion,
            // req.body.languages,
            // req.body.occupation,
          ],
          (error, results, fields) => {
            console.log(results);
            console.log(`this is error ${error}`);
            if (error) {
              res.status(500).json({
                status: "Failed",
                message: "Failed to added partner preferred",
                error,
              });
            } else {
              pool.query(
                "SELECT * FROM tbl_user WHERE _email = ?",
                [req.params.email],
                function (err, user) {
                  console.log(`user : ${user[0]._email}`);
                  console.log(`user : ${err}`);
                  if (user) {
                    const data = {
                      email: user[0]._email,
                      password: user[0]._password,
                    };
                    res.status(201).json({
                      status: "Success",
                      message: "Partner Preferred added successfully",
                      data,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});
router.get("/:email", Auth, isAuthorized, (req, res, next) => {
  console.log(req.params.email);
  pool.query(
    "select * from  partner_preferred where _email = ?",
    [req.params.email],

    function (error, user, fields) {
      console.log(user[0]);
      console.log(error);
      if (error) {
        return res.status(401).json({
          status: "Failed",
          message: "Failed to get partner preferred",
          error,
        });
      }
      return res.status(200).json({
        status: "Success",
        message: "Successfully got partner preferred",
        user,
      });
    }
  );
});

router.patch("/:email", Auth, isAuthorized, (req, res, next) => {
  pool.query(
    "update partner_perferred set _lowerage=?, _higherage=?,_lowerheight=?,_higherheight=?,_country=?,_religion=?, _languages=? where _email = ?",
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
        console.log(error);
        res.status(500).json({
          status: "Failed",
          message: "Failed to update partner preferred",
          error,
        });
      }
      res.status(201).json({
        status: "Success",
        message: "successfully updated partner preferred",
        results,
      });
    }
  );
});

// check if user already setup their partnerpreferred
router.get("/checkSetup/:email", (req, res, next) => {
  console.log("checking");
  console.log(req.params.email);
  pool.query(
    "SELECT * FROM partner_preferred WHERE _email=?",
    [req.params.email],
    function (err, result) {
      console.log(result);
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
