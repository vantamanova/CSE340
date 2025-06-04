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

// Route to show Add New Inventory View
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Add Inventory Form
router.post("/add-inventory", 
    invValidate.inventoryRules(), // server-side validation middleware 
    invValidate.checkInventoryData, // server-side validation middleware 
    utilities.handleErrors(invController.addInventory)) // go to controller and go to function

// Route works with the URL in the JavaScript file
// W05
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


// Modify
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventory))

// Delete (group assignment)
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteInventory))
    
// Updates/Modify
router.post("/update/",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

// Need to do something for delete/remove inventory as well
router.post("/delete/",
    invValidate.checkRemoveData, // Do I need it?
    utilities.handleErrors(invController.removeInventory))

module.exports = router; // exports the router object for use elsewhere