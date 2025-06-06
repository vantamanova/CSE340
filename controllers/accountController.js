const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", { //Note: the view is inside a folder, which should be within the "views" folder. This folder doesn't exist and must be created.
    title: "Login",
    nav,
    errors: null // MUST BE HERE.... 
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegisteration(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 *  W05
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", { 
      title: "Login",  //Note that the password is NOT part of the clientData object
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

// Account Management View
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  const accoundData = res.locals.accountData
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    accoundData,
  })
}

// Deliver the account update view
async function buildUpdateAccount(req, res) {
  let nav = await utilities.getNav()
  const accoundData = res.locals.accountData
  res.render("account/update", {
    title: "Account Update",
    nav,
    errors: null,
    accoundData,
  })
}

// "Account update" process
async function accountUpdate(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let accountData = await accountModel.getAccountById(account_id)
  
  try {
    const updateResult = await accountModel.updateAccount(
      account_firstname, account_lastname, account_email, account_id
    )

    if (updateResult) {
      req.flash("notice", "Account information updated successfully.")
      accountData = await accountModel.getAccountById(account_id)

      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

      return res.redirect("/account")
    }
    else {
      req.flash("notice", "Update failed.")
      res.status(400).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        accountData,
      })
    }
  } catch (error) {
    throw new Error('Update Failed')
  }
}

// "Password update" process
async function passwordUpdate(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  let accountData = await accountModel.getAccountById(account_id)
  
  try {
    const hashedPassword = await bcrypt.hashSync(account_password, 10)

    const updateResult = await accountModel.updatePassword(
      hashedPassword, account_id
    )

    if (updateResult) {
      req.flash("notice", "Password updated successfully.")
      accountData = await accountModel.getAccountById(account_id)

      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

      return res.redirect("/account")
    }
    else {
      req.flash("notice", "Update failed.")
      res.status(400).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        accountData,
      })
    }
  } catch (error) {
    throw new Error('Update Failed')
  }
}

// Logout
function accountLogout (req, res) {
 res.clearCookie("jwt", { httpOnly: true, secure: true })
 req.flash("notice", "You have been logged out")
 return res.redirect("/")
}


module.exports = { buildLogin, buildRegisteration, registerAccount,
  accountLogin, buildAccountManagement, buildUpdateAccount, accountUpdate,
  passwordUpdate, accountLogout }