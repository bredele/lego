var View = require('maple/view'),
    Store = require('maple/store'),
    Events = require('event-plugin');

//do double way binding and advances expression

//PROGRAMATIC
//
var view = new View();
var store = new Store({
	firstName: '',
	lastName: ''
}); //or view.model()? instead view.html(html, data)
store.compute('name',function(){
	return this.firstName + ' ' + this.lastName; 
});

view.html(require('./computed.html'), store); //if html empty there is an error binding and childnodes doesn't exist

view.plug('events', new Events({
	first: function(target){
		store.set('firstName', target.value);
	},
	last: function(target) {
		store.set('lastName', target.value);
	}
}));
view.alive();

module.exports = view.dom;

//DO SECOND EXample declarative