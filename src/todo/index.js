
//dependencies

var View = require('maple/view'),
    Store = require('maple/store'),
    Events = require('event-plugin'),
    List = require('list'),
    html = require('./todo.html');

//init

var app = new View();
var todos = new List([]);
var store = new Store({
	items: 0,
	pending: 0
}); //second arguments could be compute

store.compute('completed', function() {
	return this.items - this.pending;
});

//temporary
store.compute('number', function() {
  return '' + this.pending; 
});
store.compute('plurial', function() {
 return this.pending !== 1 ? 's' : '';
});


//controller 

function stats(cb) {
	return function(ev) {
		var count = 0,
		    target = ev.target || ev.srcElement;

		cb.call(null, target.parentElement, target); //remove ev when filter submit event
		todos.loop(function(todo) {
			if(todo.get('status') === 'pending') count++;
		});
		store.set('items', todos.store.data.length); //have size
		store.set('pending', count);
	};
}

var controller = {
	//we should have an input plugin
	add: stats(function(parent, target) {
		var val = target.value;
		if(val) {
			todos.add({
				status : 'pending',
				label : val
			});
			target.value = "";
		}
	}),
	
	toggle : stats(function(node, target) {
		todos.set(node, {
			status :  target.checked ? 'completed' : 'pending'
		});
	}),

	toggleAll : stats(function(node, target) {
		var status = target.checked ? 'completed' : 'pending';
		todos.loop(function(todo) {
			todo.set('status', status);
		});
	}),

	delAll : stats(function() {
		todos.del(function(todo) {
			return todo.get('status') === 'completed';
		});
	}),

	del : stats(function(node) {
		todos.del(node);
	}),

	benchmark: function() {
		var start = new Date();
		for(var l = 200; l--;) {
			todos.add({
				status: 'pending',
				label: 'foo'
			});
		}
		console.log(new Date() - start);
	}
};

//bindings
app.html(html, store);
app.plug('todos', todos);
app.plug('events', new Events(controller)); // could be greate to do events(controller) and events.off, etc
app.plug('visible', require('hidden-plugin')); //TODO: do our own
app.alive();
module.exports = app.dom;
