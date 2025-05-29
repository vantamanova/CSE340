const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
* Build specific inventory item detail view
2. a controller function, which is part of the inventory controller
* *************************** */

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getDataByInvId(inv_id) // Create in models
  const grid = await utilities.buildVehicleGrid(data) // Create in Utilities
  let nav = await utilities.getNav()
  const inv_Name = data[0].inv_make
  const inv_Model = data[0].inv_model
  res.render("./inventory/vehicle", {
    title: inv_Name + " " + inv_Model,
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory management view
 *  W04
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Managment",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build Add New Classification view
 *  W04
 * ************************** */
invCont.buildAddClassification = async function (req, res,next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Form Submission
 *  W04
 * ************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const {classification_name} = req.body
  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "Classification was successfully added")
    nav = await utilities.getNav()
    return res.status(201).render("inventory/management", 
      {
        title: "Inventory Management",
        nav,
        errors: null,
      }
    )
  } else {
    req.flash("notice", "Classification was not added")
    return res.status(501).render("inventory/add-classification",
      {
        title: "Add New Classification",
        nav,
        errors: null,
      }
    )
  }
}

  module.exports = invCont