var View = require('maple/view');

var view = new View();
view.html(require('./events.html')); 
view.alive();

module.exports = view.dom;