
//dependencies

var view = require('maple/view'),
		Event = require('event-plugin'),
		showcase = require('./showcase'),
		slide = require('scroll-to');


//init

var body = document.body;


//bindings
view()
	.plug('data-event', new Event({
		scroll: function() {
			slide(0, 800, {
				ease: 'in-out-expo',
				duration: 800
			});
		},
		show: function() {
			body.appendChild(showcase);
		}
	}))
	.alive(body,true);