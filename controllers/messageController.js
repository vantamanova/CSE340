const messageModel = require("../models/message-model")
const utilities = require("../utilities")


const messageCont = {}

/* ***************************
 *  Build Inbox view
 * ************************** */
messageCont.buildInbox = async function (req, res, next) {
  let nav = await utilities.getNav()

  res.render("message/inbox", {
    title: "Inbox",
    nav,
    messagesList: [],
    errors: null
  })
}


/* ***************************
 *  Build New Message view
 * ************************** */
messageCont.buildNewMessage = async function (req, res, next) {
  let nav = await utilities.getNav()
  const recipients = await messageModel.getAccountList()

  res.render("message/new-message", {
    title: "New Message",
    nav,
    recipients,
    errors: null,
    ...req.body
  })
}

/* ***************************
 *  Send Message
 * ************************** */
messageCont.sendMessage = async function (req, res) {
    const {message_to, message_subject, message_body } = req.body
    const message_from = res.locals.accountData.account_id
    const result = await messageModel.insertMessage(message_from, message_to, message_subject, message_body)

    if (result) {
        req.flash("notice", "Message sent successfully!")
    return res.redirect("/message")
  } else {
    req.flash("notice", "Failed to send message.")
    return res.redirect("/message/new")
  }
    }
module.exports = messageCont