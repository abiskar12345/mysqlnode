const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const Auth = require("../auth/authorization");

console.log("hey this is message route")


router.post("/sendMessage/:email", (req, res, next) => {
  pool.query(
    "INSERT INTO chat_table (_email) values(?)",
    [req.params.email],
    function (err, result) {
      if (err) {
        res.status(500).json({
          status: "Failed",
          message: "Failed to send message to db",
        });
      } else {
        res.status(201).json({
          status: "Success",
          message: "Successfully added to db",
        });
      }
    }
  );
});

module.exports = router;
