
/**
 * Test dependencies
 */

var brick = require('..')
var tape = require('tape')


tape('should create brick element from string', test => {
	test.plan(1)
	var btn = brick('<button></button>')
	test.equal(btn.el.outerHTML, '<button></button>')
})


tape('should create brick element from query', test => {
	test.plan(1)
	button('btn')
	var btn = brick('.btn')
	test.equal(btn.el.outerHTML, '<button class="btn"></button>')
})


tape('should create brick element existing DOM node', test => {
	test.plan(1)
	var el = document.createElement('button')
	var btn = brick(el)
	test.equal(btn.el.outerHTML, '<button></button>')
})


/**
 * Create and append button in document.
 * 
 * @api private
 */

function button(name) {
  var btn = document.createElement('button')
  btn.className = name
  document.body.appendChild(btn)
}