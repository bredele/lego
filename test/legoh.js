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
