/**
 * Tests dependencies
 */

var test = require('tape')
var lego = require('..')


test('should be a datastore', assert => {
  assert.plan(1)
  var brick = lego('<button>hello</button>')
  brick.set('name', 'olivier')
  assert.equal(brick.get('name'), 'olivier')
})


test('should initialize datastore with data', assert => {
  assert.plan(1)
  var brick = lego('<button>hello</button>', {
    data : {
      name : 'olivier'
    }
  })
  assert.equal(brick.get('name'), 'olivier')
})


test('should create a DOM element from a string', assert => {
  assert.plan(1)
  var btn = lego('<button>hello</button>')
  assert.equal(btn().outerHTML, '<button>hello</button>')
})


test('should listen DOM events and trigger event in emitter', assert => {
  assert.plan(1)
  var btn = lego('<buttbon onclick="something">hello</button>')
  btn.on('click something', function() {
    assert.pass('button has been clicked')
  })
  btn().click()
})
