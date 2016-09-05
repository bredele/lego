
/**
 * Test dependencies
 */

var brick = require('..')
var tape = require('tape')


tape('should create element', test => {
	test.plan(1)
	var btn = brick('<button>hello</button>')
	test.equal(btn.el.outerHTML, '<button>hello</button>')
})