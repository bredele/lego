/**
 * Dependencies
 */

var store = require('datastore').factory
var walk = require('domwalk')


var expressions = /(\$|\#)\{([^{}]*)\}/g
var parser = /\.\w+|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g
var forbidden = ['"', '.', "'"];


/**
 *
 */

module.exports = function(tmpl, target) {

  target = target || {}

  var el = domify(tmpl)

  var data = target.data || {}

  var brick = store(function() {
    return el
  }, data)

  walk(el, function(node) {
    if(node.nodeType == 1) attribute(brick, node)
    else text(brick, node, data)
  })

  return brick
}


function attribute(brick, node) {
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
}


function text(brick, node, data) {
  var str = node.nodeValue
  str.replace(expressions, function(_, type, expr, i) {
    var properties = []
    var cb = compile(expr, properties)
    if(type == '$') {
      properties.map(function(prop) {
        brick.on('changed ' + prop, function() {
          node.nodeValue = cb(data)
        })
      })
    }
    node.nodeValue = cb(data)
  });
}


function listen(brick, node, type, topic) {
  node.addEventListener(type, function(event) {
    brick.emit(type + (topic ? ' ' + topic : ''))
  })
  //brick.on('removed',)
}


function domify(tmpl) {
  var div = document.createElement('div')
  div.innerHTML = tmpl
  return div.children[0]
}



/**
 * Compile expression by replacing identifiers.
 *
 * Examples:
 *
 *   compile('name + last');
 *   // => model.name + model.last
 *
 *   compile('name[0]');
 *   // => model.name[0]
 *
 * @param  {String} str
 * @param  {Array} arr
 * @return {String}
 * @api private
 */

function compile(str, arr) {
  return new Function('model', 'return ' + str.replace(parser, function(expr) {
    if(forbidden.indexOf(expr[0]) > -1) return expr;
    if(!~arr.indexOf(expr)) arr.push(expr);
    return '(model.' + expr + ' || "")';
  }));
}
