const pool = require("../database/")

/* ***************************
 *  Get all accounts from databave
 * ************************** */
async function getAccountList(){
  const data = await pool.query("SELECT * FROM public.account ORDER BY account_id")
  return data.rows
}

/* ***************************
 *  Get all accounts from databave
 * ************************** */
async function insertMessage(message_from, message_to, message_subject, message_body) {
    try {
        const sql = `INSERT INTO message (message_from, message_to, message_subject, message_body) VALUES ($1, $2, $3, $4)`
        const data = await pool.query(sql, [message_from, message_to, message_subject, message_body])
        
        return data.rowCount
    }
    catch (err) {
        return null
    }
}


module.exports = { getAccountList, insertMessage }