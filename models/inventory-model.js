const pool = require("../database/") //imports index.js from database folder

/* ***************************
 *  Get all classification data (returns a promise)
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications} //exports the function for use elsewhere.
