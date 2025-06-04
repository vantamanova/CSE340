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
  const classificationSelect = await utilities.buildClassificationList() // W05
  res.render("inventory/management", {
    title: "Inventory Managment",
    nav,
    errors: null,
    classificationSelect, // W05
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
 *  Build Add New Inventory view
 *  W04
 * ************************** */
invCont.buildAddInventory = async function (req, res,next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null,
  })
}

/* ***************************
 *  Form Submission for classification
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

/* ***************************
 *  Form Submission for Inventory
 *  W04
 * ************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()

  const {classification_id, inv_make, inv_model, inv_year, inv_description, 
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body
  
  const result = await invModel.addInventory(classification_id, inv_make, inv_model, inv_year, inv_description, 
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)

  if (result) {
    req.flash("notice", "Inventory was successfully added")
    res.redirect("/inv")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Inventory was not added")
    return res.status(501).render("inventory/add-inventory",
      {
        title: "Add New Inventory",
        nav,
        classificationList,
        ...req.body,
        errors: null,
      }
    )
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build the "edit inventory" view
 * ************************** */
invCont.editInventory = async function (req, res,next) {
  let inventory_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const invData = await invModel.getDataByInvId(inventory_id)
  let classificationList = await utilities.buildClassificationList(invData.classification_id)

  const invName = `${invData.inv_make} ${invData.inv_model}`

  res.render("inventory/edit-inventory", {
    title: "Edit " + invName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: invData.inv_id,
    inv_make: invData.inv_make,
    inv_model: invData.inv_model,
    inv_year: invData.inv_year,
    inv_description: invData.inv_description,
    inv_image: invData.inv_image,
    inv_thumbnail: invData.inv_thumbnail,
    inv_price: invData.inv_price,
    inv_miles: invData.inv_miles,
    inv_color: invData.inv_color,
    classification_id: invData.classification_id
  })
}

/* ***************************
 *  Update inventory Data
 *  W05
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()

  const {inv_id, inv_make, inv_model, inv_year, inv_description, 
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body
  
  const result = await invModel.updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, 
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

  if (result) {
    const itemName = result.inv_make + " " + result.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed")
    res.status(501).render("inventory/edit-inventory",
      {
        title: "Edit " + itemName,
        nav,
        classificationList,
        ...req.body,
        errors: null,
      }
    )
  }
}


/* ***************************
 *  Build the "delete inventory" view
 * ************************** */
invCont.deleteInventory = async function (req, res) {
  let inventory_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const invData = await invModel.getDataByInvId(inventory_id)

  const invName = `${invData.inv_make} ${invData.inv_model}`

  res.render("inventory/delete-inventory", {
    title: "Delete " + invName,
    nav,
    errors: null,
    inv_id: invData.inv_id,
    inv_make: invData.inv_make,
    inv_model: invData.inv_model,
    inv_year: invData.inv_year,
    inv_price: invData.inv_price,
  })
}

/* ***************************
 *  Removes inventory
 *  W05
 * ************************** */
invCont.removeInventory = async function (req, res) {
  let nav = await utilities.getNav()

  const {inv_id} = req.body
  
  const result = await invModel.removeInventory(inv_id)
  const itemName = `${req.body.inv_make} ${req.body.inv_model}`

  if (result) {
    req.flash("notice", `The ${itemName} was successfully removed.`)
    res.redirect("/inv")
  } else {
    req.flash("notice", "Sorry, the remove failed")
    res.status(501).render("inventory/delete-inventory",
      {
        title: "Delete " + itemName,
        nav,
        ...req.body,
        errors: null,
      }
    )
  }
}

  module.exports = invCont