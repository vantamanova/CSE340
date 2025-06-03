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
    return data.rows[0]
  }  catch (error) {
    console.error("etDataByInvId error " + error)
  }

}

/* ***************************
 *  Add new Classification
 *  W04
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = 'INSERT INTO classification (classification_name) VALUES ($1)'
    const data = await pool.query(sql, [classification_name])
    return data.rowCount
  } catch (error) {
    return null
  }
}

/* ***************************
 *  Add new Inventory
 *  W04
 * ************************** */
async function addInventory(classification_id, inv_make, inv_model, inv_year,
  inv_description, inv_image, inv_thumbnail,
  inv_price, inv_miles, inv_color) {
  try {
    const sql = `INSERT INTO inventory (classification_id, inv_make, inv_model,
    inv_year, inv_description, inv_image, inv_thumbnail, inv_price,
    inv_miles, inv_color)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`

    const data = await pool.query(sql, [classification_id, inv_make, inv_model, inv_year,
      inv_description, inv_image, inv_thumbnail,
      inv_price, inv_miles, inv_color])
      
    return data.rowCount
  } catch (error) {
    return null
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getDataByInvId, addClassification, addInventory}; //exports functions for use elsewhere.
