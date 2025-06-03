const { body, validationResult } = require("express-validator")
const utilities = require(".")
const validate = {}

/*  **********************************
*  New Classification Validation Rules
* ********************************* */
  validate.classificationRules = () => {
    return [
      // classification
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Classification can not be empty")
        .bail()
        .matches(/^[A-Za-z0-9]+$/)
        .withMessage("Classification name must not contain spaces or special characters"),
    ]
  }

 /* ******************************
 * Check data and return errors or continue to add new classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      ...req.body,
    })
    return
  }
  next()
}

/*  **********************************
*  New Inventory Validation Rules
* ********************************* */
  validate.inventoryRules = () => {
    return [
      // classification
      body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Classification can not be empty"),
      
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Make can not be empty"),

      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Model can not be empty"),

      body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Make can not be empty")
        .isInt()
        .withMessage("Please enter the correct year"),

      body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Description can not be empty"),

      body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Image can not be empty"),

      body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Thumbnail can not be empty"),

      body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Price can not be empty")
        .isInt()
        .withMessage("Please enter the correct year"),

      body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Miles can not be empty")
        .isInt()
        .withMessage("Please enter the correct miles"),

      body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Color can not be empty"),

    ]
  }

 /* ******************************
 * Check data and return errors or continue to add new inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      classificationList,
      ...req.body,
    })
    return
  }
  next()
}

 /* ******************************
 * Check data and return errors or continue to edit inventory view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    const inv_id = req.body.inv_id
    const invName = `${req.body.inv_make} ${req.body.inv_model}`
    
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + invName,
      nav,
      classificationList,
      ...req.body,
      inv_id,
    })
    return
  }
  next()
}

 /* ******************************
 * Check data and return errors or continue to delete inventory view
 * ***************************** */
validate.checkRemoveData = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    const inv_id = req.body.inv_id
    const invName = `${req.body.inv_make} ${req.body.inv_model}`
    
    res.render("inventory/delete-inventory", {
      errors,
      title: "Delete " + invName,
      nav,
      classificationList,
      ...req.body,
      inv_id,
    })
    return
  }
  next()
}
module.exports = validate