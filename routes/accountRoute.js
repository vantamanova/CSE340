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
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

module.exports = router; // exports the router object for use elsewhere