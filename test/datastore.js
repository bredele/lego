
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


tape('should create brick with data', test => {
	test.plan(2)
	var btn = brick('<button>', {
		name: 'olivier'
	})
	test.equal(btn.get('name'), 'olivier')
	btn.set('name', 'benjamin')
	test.equal(btn.get('name'), 'benjamin')
})

tape('should update brick element when data changes', test => {
	test.plan(2)
	var btn = brick('<button>${name}</button>', {
		name: 'olivier'
	})
	test.equal(btn.el.outerHTML, '<button>olivier</button>')
	btn.set('name', 'benjamin')
	test.equal(btn.el.outerHTML, '<button>benjamin</button>')
})

tape('should update brick element with complex expressions', test => {
	test.plan(2)
	var btn = brick('<button>${first + " " + last}</button>', {
		first: 'olivier',
		last: 'wietrich'
	})
	test.equal(btn.el.outerHTML, '<button>olivier wietrich</button>')
	btn.set('first', 'benjamin')
	test.equal(btn.el.outerHTML, '<button>benjamin wietrich</button>')
})

