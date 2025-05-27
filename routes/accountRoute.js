// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController") // Need to build


// Route to display the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin)); // Attention to the pass

// Route to display the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegisteration));

// Registration Route
router.post('/register', utilities.handleErrors(accountController.registerAccount)) // need to build

module.exports = router; // exports the router object for use elsewhere