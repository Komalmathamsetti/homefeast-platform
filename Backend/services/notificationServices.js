const pool = require("../db");
const createNotification = async({
    userId,
    title,
    message,
    type = null,
    relatedId = null
})=>{
    try{
        const result = await pool.query(
            `INSERT INTO notifications
            (
              user_id,
              title,
              message,
              type,
              related_id
            )
              VALUES
            (
              $1,$2,$3,$4,$5
            )
              RETURNING*`,
            [userId,title,message,type,relatedId]
        );
        return result.rows[0];
    }catch(error){
        console.log(error);
        throw error;
    }
};
module.exports = {
    createNotification
};