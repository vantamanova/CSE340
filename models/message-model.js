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

/* ***************************
 *  Get inbos messages
 * ************************** */
async function getInboxMessages(account_id) {
    try {
    const data = await pool.query(
      `SELECT m.*, a.account_firstname, a.account_lastname
      FROM public.message AS m
      JOIN public.account AS a
      ON m.message_from = a.account_id
      WHERE m.message_to = $1 AND m.message_archived = false`,
      [account_id]
    )
    return data.rows
  }  catch (error) {
    console.error("getMessageById error " + error)
  }
    
}

/* ***************************
 *  Get message by ID
 * ************************** */
async function getMessageById(message_id) {
  try {
    const data = await pool.query(
      `SELECT m.*, a.account_firstname, a.account_lastname
      FROM public.message AS m
      JOIN public.account AS a
      ON m.message_from = a.account_id
      WHERE m.message_id = $1`,
      [message_id]
    )
    return data.rows[0]
  }  catch (error) {
    console.error("getMessageById error " + error)
    return null
  }
}

/* ***************************
 *  Mark Message as Read
 * ************************** */
async function markMessageAsRead(message_id) {
  try {
    const data = await pool.query(
      `UPDATE public.message
      SET message_read = true
      WHERE message_id = $1`,
      [message_id]
    )
    return data.rowCount
  }  catch (error) {
    console.error("markMessageAsRead error " + error)
  }
}

/* ***************************
 *  Delete Message
 * ************************** */
async function deleteMessage (message_id) {
  try {
    const data = await pool.query(
      `DELETE FROM public.message
      WHERE message_id = $1`,
      [message_id]
    )
    return data.rowCount
  }  catch (error) {
    console.error("deleteMessage error " + error)
  }
}

/* ***************************
 *  Archive Message as Read
 * ************************** */
async function archiveMessage (message_id) {
  try {
    const data = await pool.query(
      `UPDATE public.message
      SET message_archived  = true
      WHERE message_id = $1`,
      [message_id]
    )
    return data.rowCount
  }  catch (error) {
    console.error("archiveMessage error " + error)
  }
}

/* ***************************
 *  Get Archive Messages
 * ************************** */
async function getArchiveMessages(account_id) {
    try {
    const data = await pool.query(
      `SELECT m.*, a.account_firstname, a.account_lastname
      FROM public.message AS m
      JOIN public.account AS a
      ON m.message_from = a.account_id
      WHERE m.message_to = $1 AND m.message_archived = true`,
      [account_id]
    )
    return data.rows
  }  catch (error) {
    console.error("getArchiveMessages error " + error)
  }
    
}

module.exports = { getAccountList, insertMessage, getInboxMessages, 
    getMessageById, markMessageAsRead, archiveMessage, deleteMessage,
    getArchiveMessages }