const express = require("express");
const router = express.Router();
const pool = require("../config/database");

const Auth = require("../auth/authorization");
const isAuthorized = require("../auth/profileathoruize");

router.post("/:email", Auth, isAuthorized, (req, res, next) => {
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
        // pool.query(
        //   "insert into personal_details( _email,_name,_birthdate,_age,_martialstatus,_height,_religion,_gender,_country, _languages)  values(?,?,?,?,?,?,?,?,?,?) ",
        //   [
        //     req.params.email,
        //     req.body.name,
        //     req.body.birthdate,
        //     req.body.age,
        //     req.body.maritalstatus,
        //     req.body.height,
        //     req.body.religion,
        //     req.body.gender,
        //     req.body.country,
        //     req.body.languages,
        //   ],
        pool.query(
          "insert into personal_details( _email,_firstName,_lastName,_martialstatus,_height,_weight,_religion,_gender,_country, _city,_qualification,_profession,_bio)  values(?,?,?,?,?,?,?,?,?,?,?,?,?) ",
          [
            req.params.email,
            req.body.firstName,
            req.body.lastName,
            // req.body.birthdate,
            // req.body.age,
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
            // req.body.languages,
          ],
          function (error, result) {
            console.log(`this is detail error : ${error}`);
            if (error) {
              res.status(500).json({
                error: error,
              });
            } else {
              pool.query(
                "SELECT * FROM tbl_user WHERE _email = ?",
                [req.params.email],
                function (error, user) {
                  console.log(`last check ${req.body.email}`);
                  if (error) {
                    res.status(404).json({
                      status: "failed",
                      error,
                    });
                  }
                  const data = {
                    username: user[0]._username,
                    email: user[0]._email,
                    password: user[0]._password,
                  };
                  res.status(201).json({
                    status: "Success",
                    message: "Add personal details successfully",
                    data,
                  });
                }
              );
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

// router.get("/:email",Auth, isAuthorized,  (req, res, next) => {
// //   pool.query(
// //     "select *  from personal_details where _email = ?",
// //     [req.params.email],
// //     function (error, user, fields) {
// //       console.log(user);

// //       if (error) {
// //         return res.status(401).json({
// //           status: "error",
// //           error: error,
// //         });
// //       }
// //       return res.status(200).json({
// //         status: "Success",
// //         message: " personal details updated successfully",
// //          data: user,
// //       });
// //     }
// //   );
// // }

// )

// get logged in user data
router.get("/:email", Auth, isAuthorized, (req, res, next) => {
  pool.query(
    "SELECT a._username,a._email ,b._firstName,b._lastName,b._gender,b._birthdate,b._height,b._country,b._religion,b._martialstatus FROM tbl_user as a JOIN personal_details as b ON a._email = b._email WHERE a._email = ?",
    [req.params.email],
    function (error, user) {
      if (error) {
      } else {
        const data = {
          username:user[0]._username,
          email:user[0]._email,
          firstName:user[0]._firstName,
          lastName:user[0]._lastName,
          gender:user[0]._gender,
          birthdate:user[0]._birthdate,
          height:user[0]._height,
          country:user[0]._country,
          religion:user[0]._religion,
          maritalStatus:user[0]._martialstatus
        }
        res.status(200).json({
          status: "success",
          message: "Successfully get data",
          data,
        });
      }
    }
  );
});

router.patch("/:email", Auth, isAuthorized, (req, res, next) => {
  pool.query(
    "update personal_details set _name=?, _gender=?,_birthdate=?,_age=?,_height=?,_country=?,_religion=?,_martialstatus=?, _languages=?  where _email = ?",
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
          status: "error",
          message: " Cant Add personal details  successfully",
          error: error,
        });
      } else {
        res.status(201).json({
          status: "Success",
          message: " personal details updated successfully",
          data: results,
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
