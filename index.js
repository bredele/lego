/**
 * Dependencies
 */

var store = require('datastore').factory
var walk = require('domwalk')


/**
 *
 */

module.exports = function(tmpl, target) {

  target = target || {}

  var el = domify(tmpl)

  var brick = store(function() {
    return el
  }, target.data)

  bind(brick, el)

  return brick
}


function bind(brick, el) {
  walk(el, function(node) {
    if(node.nodeType == 1) {
      var attrs = node.attributes
      for(var i = 0, l = attrs.length; i < l; i++) {
        var attr = attrs[i]
        var name = attr.nodeName
        if(name.substring(0,2) == 'on') {
          var content = attr.nodeValue
          attr.nodeValue = ''
          listen(brick, node, name.substring(2), content)
        }
      }
    } else text(brick, node)
  })
}


var expressions = /(\$|\#)\{([^{}]*)\}/g

function text(brick, node) {
  var str = node.nodeValue
  str.replace(expressions, function(_, type, expr, i) {
    brick.pull(expr).then(function(value) {
      node.nodeValue = value
    })
    brick.on('changed ' + expr, function(value) {
      node.nodeValue = value
    })
  });
}

function update() {

}

function listen(brick, node, type, topic) {
  node.addEventListener(type, function(event) {
    brick.emit(type + (topic ? ' ' + topic : ''))
  })
}


function domify(tmpl) {
  var div = document.createElement('div')
  div.innerHTML = tmpl
  return div.children[0]
}
