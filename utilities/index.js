const invModel = require("../models/inventory-model") //requires the inventory-model file
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid // declares a variable to hold a string.
  if(data.length > 0){ // an "if" to see if the array is not empty.
    grid = '<ul id="inv-display">' // creates an unordered list element and adds it to the grid variable.
    data.forEach(vehicle => { // break each element of the data array into a vehicle object
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid // returns the variable to the calling location.
}

/* **************************************
* Build the classification view HTML
4. specific vehicle's information and wrap it up in HTML to deliver to the view
* ************************************ */
Util.buildVehicleGrid = async function(data){
  let grid
  if (data.length > 0) {
    const vehicle = data[0] // Expecting one vehicle object
    grid = '<div id="vehicle-detail">'
    grid += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">`
    grid += '<div id="vehicle-info">'
    grid += `<h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>`
    grid += `<p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`
    grid += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`
    grid += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`
    grid += `<p><strong>Miles:</strong> ${vehicle.inv_miles.toLocaleString()}</p>`
    grid += '</div>'
    grid += '</div>'
  } else {
    grid = '<p class="notice">Sorry, vehicle details are not available.</p>'
  }
  return grid
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" class="classification-dropdown" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util