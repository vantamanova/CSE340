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
  const {classification_name} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

module.exports = validate