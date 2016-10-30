/**
 * Dependencies
 */

var store = require('datastore').factory


/**
 *
 */
 
module.exports = function() {
  var brick = store({})
  return brick
}
