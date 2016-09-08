
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


tape('bind data primitives', test => {
	test.plan(1)
	var btn = brick('<button>${bool} ${name} is ${age}</button>', {
		name: 'olivier',
		age : 29,
		bool: true
	})
	test.equal(btn.el.outerHTML, '<button>true olivier is 29</button>')
})


tape('bind dom element', test => {
	test.plan(1)
	var btn = brick('<button>${child}</buton>', {
		child: document.createElement('span')
	})
	test.equal(btn.el.outerHTML, '<button><span></span></button>')
})