
/**
 * Test dependencies
 */

var brick = require('..')
var tape = require('tape')


tape('should create brick element with data', test => {
	test.plan(1)
	var btn = brick('<button>', {
		name: 'olivier'
	})
	test.equal(btn.get('name'), 'olivier')
})