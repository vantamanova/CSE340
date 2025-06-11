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

// Build Message View
router.get("/view/:id",
    utilities.handleErrors(messageController.viewMessage)
)

// Delete Message
router.post("/delete", 
    utilities.handleErrors(messageController.deleteMessage)
)

// Archive Message
router.post("/archive", 
    utilities.handleErrors(messageController.archiveMessage)
)

// Move to Inbox
router.post("/unarchive", 
    utilities.handleErrors(messageController.moveMessageToInbox)
)
// Build Archive View
router.get("/archive", 
    utilities.handleErrors(messageController.buildArchiveMessage)
)



module.exports = router 