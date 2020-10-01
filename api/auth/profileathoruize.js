const pool = require("../config/database");
const isAuthorized = (req, res, next) => {
  console.log(req.userId);
  pool.query(
    "select _id,_username, _email, _password from tbl_user where _id=?",
    [req.userId],
    function (err, user) {
        console.log(`this is user ${user[0]._email}`)
      if (err) return res.status(500).send("There was a problem.");

      if (!user) {
        return res
          .status(404)
          .send("You must have an account to make this request.");
      }
      if (user[0]._email !== req.headers.email) {
        return res.status(401).send("You are not authorized.");
      }
      req.email = user[0]._email;
      next();
    }
  );
};

module.exports = isAuthorized;
