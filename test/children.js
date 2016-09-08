
/**
 * Test dependencies
 */

var brick = require('..')
var tape = require('tape')
var promise = require('promises-a');

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
	var btn = brick('<button>${child}</button>', {
		child: document.createElement('span')
	})
	test.equal(btn.el.outerHTML, '<button><span></span></button>')
})

tape('bind promise returning string', test => {
	test.plan(1)
	var child = async('hello world')
	var btn = brick('<button>${child}</button>', {
		child: child
	})
	child.then(() => test.equal(btn.el.outerHTML, '<button>hello world</button>'))
})

/**
 * Return value after 500ms using promises.
 * 
 * @param  {Any} value
 * @return {Promise}
 * @api private
 */

function async(value) {
  var def = promise()
  setTimeout(function() {
	def.fulfill(value)
  }, 500)
  return def.promise
}

