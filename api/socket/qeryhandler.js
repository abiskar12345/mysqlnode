const pool = require("../config/database");

class Helper {
  constructor(app) {
    this.db = pool;
  }

  // async userSessionCheck(userId){
  // 	try {
  // 		const result = await this.db.query(`SELECT online,username FROM user WHERE id = ? AND online = ?`, [userId,'Y']);
  // 		if(result !== null){
  // 			return result[0]['username'];
  // 		}else{
  // 			return null;
  // 		}
  // 	} catch (error) {
  // 		return null;
  // 	}
  // }

  async addSocketId(userEmail, userSocketId) {
    try {
      console.log(`>>>>>>>>>${userEmail} ${userSocketId}`);
      return await this.db.query(
        `UPDATE tbl_user SET socketid = ?, online= ? WHERE _email = ?`,
        [userSocketId, "Y", userEmail]
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async isUserLoggedOut(userSocketId) {
    try {
      return await this.db.query(`SELECT online FROM user WHERE socketid = ?`, [
        userSocketId,
      ]);
    } catch (error) {
      return null;
    }
  }

  async logoutUser(userSocketId) {
    return await this.db.query(
      `UPDATE user SET socketid = ?, online= ? WHERE socketid = ?`,
      ["", "N", userSocketId]
    );
  }

  getChatList(userId, userSocketId) {
    try {
      return Promise.all([
        this.db.query(
          `SELECT id,username,online,socketid FROM user WHERE id = ?`,
          [userId]
        ),
        this.db.query(
          `SELECT id,username,online,socketid FROM user WHERE online = ? and socketid != ?`,
          ["Y", userSocketId]
        ),
      ])
        .then((response) => {
          return {
            userinfo: response[0].length > 0 ? response[0][0] : response[0],
            chatlist: response[1],
          };
        })
        .catch((error) => {
          console.warn(error);
          return null;
        });
    } catch (error) {
      console.warn(error);
      return null;
    }
  }

  async insertMessages(params) {
    try {
      console.log(
        `<>>>>>>>>>>>>>>>inserting message : ${params.message} ${params.senderEmail}`
      );
      return await this.db.query(
        "INSERT INTO tbl_message (`sender`,`receiver`,`message`) values (?,?,?)",
        [params.senderEmail, params.receiverEmail, params.message],
        (error, result) => {
          if (!error) {
            console.log("succcessfully insert");
          } else {
            console.log("Failed to insert message", error);
          }
        }
      );
    } catch (error) {
      console.warn(error);
      return null;
    }
  }

  async getMessages(userId, toUserId) {
    try {
      return await this.db.query(
        "SELECT _id,sender as fromUserId,reciver as toUserId,message FROM message WHERE (sender = ? AND receiver = ? ) OR (sender = ? AND to receiver = ? )	ORDER BY id ASC",
        [userId, toUserId, toUserId, userId]
      );
    } catch (error) {
      console.warn(error);
      return null;
    }
  }
}
module.exports = new Helper();
