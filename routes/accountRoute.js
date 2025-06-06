// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController") // Need to build
const regValidate = require('../utilities/account-validation')
const loginValidate = require("../utilities/account-validation")

// Route to display the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin)); // Attention to the pass

// Route to display the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegisteration));

// Registration Route
router.post('/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)) // need to build

// Process the login attempt
router.post(
  "/login",
  loginValidate.loginRules(),
  loginValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Add the new default route for accounts to the accountRoute file
router.get("/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement))

// delivery of the account update view
router.get("/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount))

// process the update of the account information
router.post("/update",
  utilities.checkLogin,
  regValidate.checkRegData,
  utilities.handleErrors(accountController.accountUpdate))

// process password update request
router.post("/update-password",
  utilities.checkLogin,
  regValidate.checkRegData,
  utilities.handleErrors(accountController.passwordUpdate))


// process logout request
router.get("/logout",
  accountController.accountLogout 
)

module.exports = router; // exports the router object for use elsewhere