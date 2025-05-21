const pool = require("../database/") //imports index.js from database folder

/* ***************************
 *  Get all classification data (returns a promise)
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}



/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`, // $1 is a placeholder
      [classification_id]
    )
    return data.rows // sends the data, as an array of all the rows, back to where the function was called (in the controller)
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get data for a specific vehicle in inventory by inv_id
3. a function to retrieve the data for a specific vehicle in inventory, based on the inventory id
 * ************************** */

async function getDataByInvId(inv_id) {
  try {
    const data = await pool.query(
      'SELECT * FROM public.inventory WHERE inv_id = $1',
      [inv_id]
    )
    return data.rows
  }  catch (error) {
    console.error("etDataByInvId error " + error)
  }

}

module.exports = {getClassifications, getInventoryByClassificationId, getDataByInvId}; //exports functions for use elsewhere.
