const { body, validationResult } = require("express-validator")
const utilities = require(".")
const messageModel = require("../models/message-model")

const validate = {}

/* **********************************
*  Send Message Rules
* ********************************* */
  validate.sendRules = () => {
    return [
        body("message_to")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Recipient can not be empty"),

        body("message_subject")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Subject can not be empty"),
        
        body("message_body")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Body can not be empty"),
    ]
  }

/* ******************************
 * Check data and return errors (send message process)
 * ***************************** */
validate.checkSendData = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const recipients = await messageModel.getAccountList(req.body.classification_id)
    res.render("message/new-message", {
      errors,
      title: "New Message",
      nav,
      recipients,
      ...req.body,
    })
    return
  }
  next()
}

module.exports = validate

