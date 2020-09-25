const express = require("express");
const router = express.Router();
const pool = require("../config/database");

const Auth = require("../auth/authorization");

router.post("/:email", Auth, (req, res, next) => {
  // Personaldetails.find({ email: req.params.email })
  //     .exec()
  //     .then(user => {
  //       if (user.length < 1) {
  //         console.log("hii");
  // console.log(req.body);
  pool.query(
    "SELECT * FROM personal_details WHERE _email = ?",
    [req.params.email],
    (error, user) => {
      if (user.length) {
        res.status(409).json({
          status: "failed",
          message: "Personal details added already",
        });
      } else {
        pool.query(
          "insert into personal_details( _email,_name,_birthdate,_age,_martialstatus,_height,_religion,_gender,_country, _languages)  values(?,?,?,?,?,?,?,?,?,?) ",
          [
            req.params.email,
            req.body.name,
            req.body.birthdate,
            req.body.age,
            req.body.maritalstatus,
            req.body.height,
            req.body.religion,
            req.body.gender,
            req.body.country,
            req.body.languages,
          ],
          function (error, result) {
            if (error) {
              res.status(500).json({
                error: error,
              });
            } else {
              res.status(201).json({
                status: "Success",
                message: "Add personal details successfully",
                result,
              });
            }
          }
        );
      }
    }
  );

  // }else

  //
  // {
});

router.get("/:email", (req, res, next) => {
  pool.query(
    "select *  from personal_details where _email = ?",
    [req.params.email],
    function (error, user, fields) {
      console.log(user);

      if (error) {
        return res.status(401).json({
          message: error,
        });
      }
      return res.status(200).json({
        message: user,
      });
    }
  );
});

router.patch("/:email", (req, res, next) => {
  pool.query(
    "update tbl_user set _username=?, _gender=?,_birthdate=?,_age=?,_height=?,_country=?,_religion=?,_martialstats=?, _langages=?  where _email = ?",
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
      req.params.email,
    ],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({
          error: error,
        });
      } else {
        res.status(201).json({
          message: results,
        });
      }
    }
  );
});

// check if user already setup their details
router.get("/checkSetup/:email",(req, res, next) => {
  console.log("checking")
  console.log(req.params.email)
  pool.query(
    "SELECT * FROM personal_details WHERE _email=?",
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
