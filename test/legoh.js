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
    name : 'olivier'
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


test('should bind DOM element with simple data expression', assert => {
  assert.plan(2)
  var btn = lego('<button>${name}</button>')
  assert.equal(btn().outerHTML, '<button></button>')
  btn.set('name', 'olivier')
  assert.equal(btn().outerHTML, '<button>olivier</button>')
})


test('should bind once DOM element with simple data expression', assert => {
  assert.plan(2)
  var btn = lego('<button>#{name}</button>')
  assert.equal(btn().outerHTML, '<button></button>')
  btn.set('name', 'olivier')
  assert.equal(btn().outerHTML, '<button></button>')
})


test('should bind DOM element with complex expression', assert => {
  assert.plan(2)
  var btn = lego('<button>${first + " " + last}</button>')
  btn.set('first', 'olivier')
  assert.equal(btn().outerHTML, '<button>olivier </button>')
  btn.set('last', 'wietrich')
  assert.equal(btn().outerHTML, '<button>olivier wietrich</button>')
})


// test('should bind DOM attribute with simple data expression', assert => {
//   assert.plan(2)
//   var link = lego('<a href="${domain}">link</a>')
//   link.set('domain', 'http://www.google.com')
//   assert.equal(link().getAttribute('href'), 'http://www.google.com')
//   link.set('domain', 'http://github.com/bredele')
//   assert.equal(link().getAttribute('href'), 'http://github.com/bredele')
// })
