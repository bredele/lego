
/**
 * Dependencies
 */

var View = require('maple/view'),
		Store = require('maple/store'),
    Stack = require('stack'),
    event = require('event'), //do with plugin
    Events = require('event-plugin'),
    List = require('list'),
    scrollTo = require('scroll-to'),
    html = require('./showcase.html'),
    utils = require('maple/lib/utils'),
    apps = require('./examples');


var fragment = document.createDocumentFragment(); //may be have a hide function
//init
var view = new View(); //do factory for view
var examples = new List([]);
var store = new Store(); //should we have a default store in view?
var stack = new Stack();
view.html(html, store);
view.attr('event', new Events({
	close: function() {
		fragment.appendChild(view.dom); //use insert instead
	},
	select : function(ev, node) {
		var target = ev.target,
				selected = node.querySelector('.selected');
		//doesn't work on ie8
		selected && selected.classList.remove('selected');
		target.classList.add('selected');

		//todo: pass target, more convenint and cross browser
		var name = target.getAttribute('href').substring(1);
		stack.show(name);
		store.reset(apps[name]);
	}
}));
view.attr('examples', examples);
view.insert(fragment);
stack.parent = view.dom.querySelector('.stack');

function add(name) {
	examples.add({
		name: name
	});
	stack.add(name, require(name));
}

//do view for click
event.attach(document.querySelector('.btn'), 'click', function() {
	document.body.appendChild(view.dom); //there is an issue with insert it apply again
	//view.insert(document.body);
});

event.attach(document.querySelector('.scroll'), 'click', function() {
	scrollTo(0, 800, {
	  ease: 'in-out-expo',
	  duration: 800
	});
});

utils.each(apps, function(name) {
	add(name);
});

stack.show('todo');