var View = require('maple/view'),
    Store = require('maple/store'),
    Events = require('event-plugin');

/*
 * Get a Point X value.
 * degress. Angle's degrees.
 * r. Circle's radio.
 * adjust. Percent of length.
 * x. Start of X point.
 */

function getX(degrees, r, adjust, x) {
    var x = x || r, 
    adj = adjust || 1;
    return x + r * adj * Math.cos(getRad(degrees));
}

/*
 * Get a Point Y value.
 * degress. Angle's degrees.
 * r. Circle's radio.
 * adjust. Percent of length.
 * x. Start of Y point.
 */   

function getY(degrees, r, adjust, y) {
    var y = y || r,
    adj = adjust || 1;
    return y + r * adj * Math.sin(getRad(degrees));
}

// Convert from degrees to radians.
function getRad(degrees) {
    var adjust = Math.PI / 2;
    return (degrees * Math.PI / 180) - adjust;
}

var view = new View();
var store = new Store(); //or view.model()? instead view.html(html, data)

view.html(require('./svg.html'), store); //if html empty there is an error binding and childnodes doesn't exist

view.plug('events', new Events({
	range: function(target) {
		store.set('range', target.value);
	}
}));
view.plug('data-range', function(node) {
	store.on('change range', function(value) {
		var deg = 6 * value;
		x2 = getX(deg, 100, 0.95, 100), //100 is circle r
		y2 = getY(deg, 100, 0.95, 100);
		
		node.setAttribute('x1', 100);
		node.setAttribute('y1', 100); 
		node.setAttribute('x2', x2);
		node.setAttribute('y2', y2); 
	});
});
view.alive();

module.exports = view.dom;