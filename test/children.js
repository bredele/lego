
/**
 * Test dependencies
 */

var brick = require('..')
var tape = require('tape')


tape('bind data string', test => {
	test.plan(1)
	var btn = brick('<button>hello ${name}</button>', {
		name: 'olivier'
	})
	test.equal(btn.el.outerHTML, '<button>hello olivier</button>')
})