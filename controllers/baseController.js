const utilities = require("../utilities/") //imports an index.js file from a utilities folder
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  //req.flash("notice", "This is a flash message.") Was needed for testing
  res.render("index", {title: "Home", nav})
}

baseController.throwError = async function (req, res, next) {
  throw new Error("Intentional 500 error for testing.")
}

module.exports = baseController // exports the baseController object for use elsewhere.
