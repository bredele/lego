
/**
 * Dependencies
 */

var View = require('maple/view'),
    event = require('event'), //do with plugin
    html = require('./showcase.html');

//init
var view = new View(); //do factory for view
view.html(html);

//do view for click
event.attach(document.querySelector('.btn'), 'click', function() {
	view.insert(document.body);
});