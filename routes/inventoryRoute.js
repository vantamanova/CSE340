// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build specific inventory item detail view
// 1. an appropriate route as part of the inventory route file
router.get("/detail/:invId", invController.buildByInvId);

// Management view
router.get("/", utilities.handleErrors(invController.buildManagementView)) // W04

module.exports = router; // exports the router object for use elsewhere