
/**
 * Dependencies
 */

var View = require('maple/view'),
    event = require('event'), //do with plugin
    Plugin = require('event-plugin'),
    html = require('./showcase.html');

var fragment = document.createDocumentFragment(); //may be have a hide function

//init
var view = new View(); //do factory for view
view.html(html);
view.attr('event', new Plugin({
	close: function() {
		fragment.appendChild(view.dom); //use insert instead
	}
}));
view.insert(fragment);

//do view for click
event.attach(document.querySelector('.btn'), 'click', function() {
	view.insert(document.body);
});