
/**
 * Expressions to parse and compile placeholders from string.
 * A placeholder is an expression enclosed into `${}` or `#{}`
 */

var expressions =/(\$|\#)\{([^{}]*)\}/g
var parser = /\.\w+|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g
var forbidden = ['"', '.', "'"];


/**
 * Bind node with lego data.
 *
 * @api private
 */

module.exports = function(brick, node, data) {
  var parent = node.parentElement
  var str = node.nodeValue
  var idx = 0
  var fragment
  str.replace(expressions, function(_, type, expr, i) {
    var child = document.createTextNode(str.substring(idx, i))
    fragment = fragment || document.createDocumentFragment()
    fragment.appendChild(child)
    update(brick, child, expr, type == '$', data)
    idx = i + _.length
  })
  if(fragment) parent.replaceChild(fragment, node)
}



/**
 * Update node whenever model data changes.
 *
 * @note the node value of a text node when the data changes
 * should be transformed (stream, promises, etc)
 *
 * @param {Node} node
 * @param {Store} model
 * @param {String} expr
 * @param {Boolean} bool
 * @api private
 */

function update(brick, node, expr, bool, data) {
  var list = []
  var cb = compile(expr, list)
  // we should use regurgitate
  node.nodeValue = cb(data)
  if(bool) list.map(function(name) {
    brick.on('changed ' + name, function() {
      node.nodeValue = cb(data)
    })
  })
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
    if(forbidden.indexOf(expr[0]) > -1) return expr
    if(!~arr.indexOf(expr)) arr.push(expr)
    return '(model.' + expr + ' || "")'
  }))
}
