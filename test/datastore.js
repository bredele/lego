
/**
 * Test dependencies
 */

var brick = require('..')
var tape = require('tape')


tape('should be a datastore', test => {
	test.plan(7)
	var ui = brick()
	test.equal(typeof ui.set, 'function')
	test.equal(typeof ui.get, 'function')
	test.equal(typeof ui.del, 'function')
	test.equal(typeof ui.reset, 'function')
	test.equal(typeof ui.on, 'function')
	test.equal(typeof ui.emit, 'function')
	test.equal(typeof ui.off, 'function')
})

tape('should create brick element with data', test => {
	test.plan(1)
	var btn = brick('<button>', {
		name: 'olivier'
	})
	test.equal(btn.get('name'), 'olivier')
})