// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController") // Need to build


// Route to display the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin)); // Attention to the pass

module.exports = router; // exports the router object for use elsewhere