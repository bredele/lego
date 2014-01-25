var View = require('maple/view');
var view = new View();
view.html(require('./list.html'));
view.alive();

module.exports = view.dom;