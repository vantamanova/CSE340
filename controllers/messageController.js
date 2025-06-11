const messageModel = require("../models/message-model")
const utilities = require("../utilities")


const messageCont = {}

/* ***************************
 *  Build Inbox view
 * ************************** */
messageCont.buildInbox = async function (req, res, next) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const messagesList = await messageModel.getInboxMessages(account_id)

  res.render("message/inbox", {
    title: "Inbox",
    nav,
    messagesList,
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

/* ***************************
 *  Build View Message
 * ************************** */
messageCont.viewMessage = async function (req, res) {
  let message_id = parseInt(req.params.id)
  let nav = await utilities.getNav()
  const message = await messageModel.getMessageById(message_id)
  console.log("Viewing message:", message)

  // Shold I check if the message is for this account?

  if (message) {
    res.render("message/view-message", {
    title: "View Message",
    nav,
    errors: null,
    message,
    })
  } else {
    req.flash("notice", "Message not found")
    res.redirect("/message")
  }
}

/* ***************************
 *  Delete Message
 * ************************** */
messageCont.deleteMessage = async function (req, res) {
  const message_id = req.body.message_id
  await messageModel.deleteMessage(message_id)

  req.flash("notice", "Message deleted")
  res.redirect("/message")
}

/* ***************************
 *  Archive Message
 * ************************** */
messageCont.archiveMessage = async function (req, res) {
  const message_id = parseInt(req.body.message_id)
  await messageModel.archiveMessage(message_id)

  req.flash("notice", "Message archived")
  res.redirect("/message")
}

/* ***************************
 *  Build Archive view
 * ************************** */
messageCont.buildArchiveMessage = async function (req, res, next) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const messagesList = await messageModel.getArchiveMessages(account_id)

  res.render("message/archive", {
    title: "Archived Messages",
    nav,
    messagesList,
    errors: null,
  })
}


module.exports = messageCont