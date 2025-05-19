const utilities = require("../utilities/") //imports an index.js file from a utilities folder
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

module.exports = baseController // exports the baseController object for use elsewhere.
