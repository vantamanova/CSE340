// Needed Resources 
const express = require("express")
const router = new express.Router() 
const messageController = require("../controllers/messageController")
const utilities = require("../utilities/")
const messageValidate = require("../utilities/message-validation")

// Check if user logged in
router.use(utilities.checkLogin)

// Build Inbox View
router.get("/", utilities.handleErrors(messageController.buildInbox))

// Build new Message View
router.get("/new", utilities.handleErrors(messageController.buildNewMessage))

// Send Message
router.post("/send",
    messageValidate.sendRules(),
    messageValidate.checkSendData,
    utilities.handleErrors(messageController.sendMessage)
)



module.exports = router 