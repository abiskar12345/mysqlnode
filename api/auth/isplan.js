const pool = require("../config/database");
const isPlan = (req, res, next) => {

    var date = Date.now();  
   pool.query('select _id,_name, _email ,planExpire from tbl_user where _id=?',
   [ req.userId ],
    function(err, user) {

        planExpire=Date.parse(user[0].planExpire);

        console.log(user);
        if (err) return res.status(500).send("There was a problem.");

        if (!user){
            return res.status(404).send("You must have an account to make this request.");
        }
        if ( planExpire< date ) {
            
            return res.status(401).send("You have not any plan");
        }
        req.email = user[0]._email;
        next();
    });
    
}
module.exports = isPlan;
