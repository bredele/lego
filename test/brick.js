
/**
 * Test dependencies.
 */

var assert = require('assert');
var brick = require('..');


describe('basic', function() {

  it('should render node', function() {
    var lego = brick(function(dom) {
      test= dom;
      return dom('h1', 'hello')
    });

    assert.equal(lego.el.outerHTML, '<h1>hello</h1>');
  });

  it('should encapsulate bricks', function() {
    var user = brick(function(dom) {
      return dom('span', 'olivier');
    });

    var profile = brick(function(dom) {
      return dom('section', [
        dom(user),
      ]);
    });

    assert.equal(profile.el.outerHTML, '<section><span>olivier</span></section>');
  });

});
