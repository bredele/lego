

module.exports = function(tmpl) {
  return new Brick(tmpl)
}


function Brick(tmpl) {
  var div = document.createElement('div')
  div.innerHTML = tmpl
  this.el = div.children[0]
}