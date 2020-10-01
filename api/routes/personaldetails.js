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
          "insert into personal_details( _email,_firstName,_lastName,_birthdate,_martialstatus,_height,_weight,_religion,_gender,_country, _city,_qualification,_profession,_bio,_profilePhoto)  values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ",
          [
            req.params.email,
            req.body.firstName,
            req.body.lastName,
            req.body.birthdate,
            req.body.maritalStatus,
            req.body.height,
            req.body.weight,
            req.body.religion,
            req.body.gender,
            req.body.country,
            req.body.city,
            req.body.qualification,
            req.body.profession,
            req.body.bio,
            req.body.profilePhoto,
          ],
          function (error, result) {
            if (error) {
              res.status(500).json({
                error: error,
              });
            }
            console.log(req.params.email);
            pool.query(
              "select _email,_password from tbl_user where _email = ?",
              [req.params.email],
              function (err, user, fields) {
                console.log(req.params.email);
                console.log(user[0]);
                console.log(user[1]);
                console.log(err);
                console.log(fields);
                if (err) {
                  console.log("Here");
                  res.status(404).json({
                    message: "Not found",
                  });
                } else {
                  const data = {
                    email: user[0]._email,
                    password: user[0]._password,
                  };
                  res.status(201).json({
                    status: "Success",
                    message: "Add personal details successfully",
                    data,
                  });
                }
              }
            );
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
router.get("/checkSetup/:email", (req, res, next) => {
  console.log("checking");
  console.log(req.params.email);
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
