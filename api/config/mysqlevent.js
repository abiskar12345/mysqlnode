// CREATE EVENT IF NOT EXISTS `process.env.MYSQL_DATABASE`.`eventName`
// ON SCHEDULE
// EVERY 1 DAY // or 1 HOUR
// COMMENT 'Description'
// DO
// BEGIN

// DELETE FROM `process.env.MYSQL_DATABASE`.`suscribtion_plan` WHERE `expireAt` > NOW();

// END

// SET GLOBAL event_scheduler = ON;