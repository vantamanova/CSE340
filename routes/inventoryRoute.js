// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build specific inventory item detail view
// 1. an appropriate route as part of the inventory route file
router.get("/detail/:invId", invController.buildByInvId);

// Management view
router.get("/", utilities.handleErrors(invController.buildManagementView)) // W04

// Route to show Add New Classification View
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Add Classification Form
router.post("/add-classification", 
    invValidate.classificationRules(), // server-side validation middleware 
    invValidate.checkClassificationData, // server-side validation middleware 
    utilities.handleErrors(invController.addClassification)) // go to controller and go to function

module.exports = router; // exports the router object for use elsewhere