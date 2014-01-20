var View = require('maple/view'),
    Store = require('maple/store'),
    Events = require('event-plugin');

var view = new View();
var store = new Store(); //or view.model()? instead view.html(html, data)

view.html(require('./hello.html'), store); //if html empty there is an error binding and childnodes doesn't exist

for(var l = 500; l--;) {
	//create a component like domify or domify('span', 'text');
	var span = document.createElement('span');
	var val = Math.random() + Math.round(Math.random());
	//we should do a random style
	span.innerHTML = '{value} ';
	span.setAttribute('style', 'font-size:' + val + 'em');
	view.dom.appendChild(span);
}

view.attr('events', new Events({
	text: function(ev){
		store.set('value', ev.target.value);
	}
}));
view.alive();

module.exports = view.dom;