const utilities = require("../utilities/")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", { //Note: the view is inside a folder, which should be within the "views" folder. This folder doesn't exist and must be created.
    title: "Login",
    nav,
  })
}

module.exports = { buildLogin }