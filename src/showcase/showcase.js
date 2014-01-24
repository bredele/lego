
//dependencies

var View = require('maple/view'),
    Store = require('maple/store'),
    Event = require('event-plugin'),
    Stack = require('stack'),
		List = require('list'),
		utils = require('maple/lib/utils'),
		examples = require('./examples');


//init

var view = new View(),
    store = new Store(),
    stack = new Stack();
		list = new List([]),
    frag = document.createDocumentFragment();

//bindings

view.plug({
	'examples': list,
	'event' : new Event({
			select: function(target, ev, node) {
				var name = target.getAttribute('href').substring(1),
				    selected = node.querySelector('.selected');

		    //doesn't work on ie8
		    selected && selected.classList.remove('selected');
		    target.classList.add('selected');

				stack.show(name);
				store.reset(examples[name]);
			},
			close: function() {
				frag.appendChild(view.dom);
			}
	})
});

view.html(require('./showcase.html'), store);
console.time('showcase');
view.insert(frag);
console.timeEnd('showcase');
stack.parent = view.dom.querySelector('.stack');


//exports

module.exports = view.dom;


//add examples

utils.each(examples, function(name) {
	list.add({
		name: name
	});
	stack.add(name, require(name));
});

stack.show('todo');
