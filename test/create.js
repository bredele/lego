
/**
 * Test dependencies
 */

var brick = require('..')
var tape = require('tape')


tape('should create element from string', test => {
	test.plan(1)
	var btn = brick('<button></button>')
	test.equal(btn.el.outerHTML, '<button></button>')
})


tape('should wrap existing DOM element', test => {
	test.plan(1)
	var el = document.createElement('button')
	var btn = brick(el)
	test.equal(btn.el.outerHTML, '<button></button>')
})