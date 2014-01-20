var View = require('maple/view');
var view = new View();
view.html(require('./stack.html'));
view.alive();

module.exports = view.dom;