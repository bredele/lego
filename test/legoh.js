/**
 * Tests dependencies
 */

var test = require('tape')
var lego = require('..')


test('should be a datastore', assert => {
  assert.plan(1)
  var brick = lego()
  brick.set('name', 'olivier')
  assert.equal(brick.get('name'), 'olivier')
})


test('should initialize datastore with data', assert => {
  assert.plan(1)
  var brick = lego('', {
    data : {
      name : 'olivier'
    }
  })
  assert.equal(brick.get('name'), 'olivier')
})

test('should create a DOM element from a string', assert => {
  assert.plan(1)
  var btn = lego('<button>hello</button>')
  assert.equal(btn.el.outerHTML, '<button>hello</button>')
})
