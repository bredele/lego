/**
 * Test dependencies
 */

var brick = require('..')
var tape = require('tape')


tape('should bind attribute with a function', test => {
  test.plan(1)
  var a = brick('<a href="name"></a>')
  a.attr('href', function(el, content) {
  	el.setAttribute('href', '/some/path/' + content)
  })
  test.equal(a.el.outerHTML, '<a href="/some/path/name"></a>')
})


tape('should bind multiple attributes with a function', test => {
  test.plan(1)
  var list = brick('<button id="btn"><span id="span"></span></button>')
    .attr('id', function(el, content) {
    	el.setAttribute('id', 'prefix-' + content)
    })
  test.equal(list.el.outerHTML, '<button id="prefix-btn"><span id="prefix-span"></span></button>')
})