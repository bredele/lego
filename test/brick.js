
/**
 * Test dependencies.
 */

var assert = require('assert');
var brick = require('..');



describe('constructor', function() {

  describe('template', function() {

    it('should accept html element', function() {
      var lego = brick(document.body);
      assert.equal(lego.el, document.body);
    });

    it('should accept html string', function() {
      var lego = brick('<button>hello world</button>');
      assert.equal(lego.el.outerHTML, '<button>hello world</button>');
    });

    it('should accept html query selector', function() {
      var lego = brick('body');
      assert.equal(lego.el, document.body);
    });

  });

  describe('datastore', function() {

    it('should pass optional data', function() {
      var lego = brick(document.body, {
        name: 'olivier'
      });
      assert.equal(lego.get('name'), 'olivier');
    });

  });

  describe('insert', function() {

    it('should insert brick element without data', function() {
      var div = document.createElement('div');
      brick('<button>hello world</button>', div);
      assert.equal(div.innerHTML, '<button>hello world</button>');
    });

    it('should insert brick element with data', function() {
      var div = document.createElement('div');
      brick('<button>hello world</button>', {}, div);
      assert.equal(div.innerHTML, '<button>hello world</button>');
    });

  });

});


describe('data binding', function() {

  describe('node type 2', function() {

    var lego;
    beforeEach(function() {
      lego = brick(document.body, {
        label: 'hello world'
      });
    });

    it('should bind one dom node with data', function() {
      var node = document.createTextNode('${label}');
      lego.bind(node);
      assert.equal(node.nodeValue, 'hello world');
    });

    it('should update node when data changes', function() {
      var node = document.createTextNode('${label}');
      lego.bind(node);
      lego.set('label', 'olivier');
      assert.equal(node.nodeValue, 'olivier');
    });

    it('should update node only once when data changes', function() {
      var node = document.createTextNode('#{label}');
      lego.bind(node);
      lego.set('label', 'olivier');
      assert.equal(node.nodeValue, 'hello world');
    });

  });

  describe('node type 1', function() {

    it('should bind node and all its children with data', function() {
      var lego = brick('<button class="btn ${label}">hello ${label}</button>', {
        label: 'world'
      }).build();

      assert.equal(lego.el.outerHTML, '<button class="btn world">hello world</button>');
    });

    it('should mix one time binding and real time binding', function() {
      var lego = brick('<button class="btn #{label}">hello ${label}</button>', {
        label: 'world'
      }).build();
      lego.set('label', 'olivier');

      assert.equal(lego.el.outerHTML, '<button class="btn world">hello olivier</button>');
    });

  })

});

describe('attribute binding', function() {

  it('should apply attribute binding on root element', function() {
    var lego = brick('<button class="hello"></button>');
    lego.attr('class', function(node, content) {
      node.innerHTML = content;
    });
    assert.equal(lego.el.outerHTML, '<button class="hello">hello</button>');
  });

  it('should apply attribute binding to all children', function() {
    var lego = brick('<ul><li class="item"></li><li class="item"></li></ul>');
    lego.attr('class', function(node, value) {
      node.innerHTML = value;
    });
    assert.equal(lego.el.outerHTML, '<ul><li class="item">item</li><li class="item">item</li></ul>');
  });

});


describe('from', function() {

  it('should accept html element', function() {
    var lego = brick();
    lego.from(document.body);
    assert.equal(lego.el, document.body);
  });

  it('should clone html element', function() {
    var btn = document.createElement('button');
    var lego = brick().from(btn, true);
    assert.equal(lego.el.outerHTML, '<button></button>');
    assert.notEqual(btn, lego.el);
  });

  it('should accept html string', function() {
    var lego = brick();
    lego.from('<button>hello world</button>');
    assert.equal(lego.el.outerHTML, '<button>hello world</button>');
  });

  it('should accept html query selector', function() {
    var lego = brick();
    lego.from('body');
    assert.equal(lego.el, document.body);
  });

});

describe('to', function() {

  it('should append brick to html element', function() {
    var anchor = document.createElement('div');
    var lego = brick('<button></button>');
    lego.to(anchor);
    assert.equal(anchor.innerHTML, '<button></button>');
  });

  it('should append brick to html element using query selector', function() {
    var lego = brick('<button class="btn"></button>');
    lego.to('body');
    assert(document.querySelector('button.btn'));
  });


});


describe('mold', function() {

  it("should replace custom tag with brick", function() {
    var list = brick('<ul><user></user></ul>');
    var user = brick('<h1>user</h1>');
    list.mold('user', user);
    assert.equal(list.el.innerHTML, '<h1>user</h1>');
  });

  it('should replace the content of a custom element', function() {
    var list = brick('<div><user>  <button>hello</button></user></div>');
    var user = brick('<div><content></content></div>');
    list.mold('user', user);
    assert.equal(user.el.innerHTML, '  <button>hello</button>');
  });

  it('should replace the content of a custom element with multiple nodes', function() {
    var list = brick('<div><user>  <h1>hello</h1><button>world</button></user></div>');
    var user = brick('<div><h2>brick</h2><content></content></div>');
    list.mold('user', user);
    assert.equal(user.el.innerHTML, '<h2>brick</h2>  <h1>hello</h1><button>world</button>');
  });

  it('should replace the content of a custom element with query selection', function() {
    var list = brick('<div><user><h1>hello</h1><button>world</button></user></div>');
    var user = brick('<div><content select="button"></content></div>');
    list.mold('user', user);
    assert.equal(user.el.innerHTML, '<button>world</button>');
  });

  it('should bind a custom element inner content', function() {
    var list = brick('<div><user>${name}</user></div>', {
      name: 'olivier'
    }).build();
    var user = brick('<div>${name} and <content></content></div>', {
      name: 'bruno'
    }).build();
    list.mold('user', user);

    assert.equal(user.el.innerHTML, 'bruno and olivier');
    list.set('name', 'bredele');
    assert.equal(user.el.innerHTML, 'bruno and bredele');
    user.set('name', 'amy');
    assert.equal(user.el.innerHTML, 'amy and bredele');
  });

});

describe("state machine", function() {

  var obj;
  beforeEach(function() {
    obj = brick();
  });

  it('should have an initial state', function() {
    assert.equal(obj.state, 'created');
  });

  it("should add transition", function(done) {
    obj.hook('created', 'lock', function() {
      done();
    }, 'locked');
    obj.emit('lock');
  });

  it("should set current state", function() {
    obj.hook('created', 'lock', function(){}, 'locked');
    obj.emit('lock');
    assert.equal(obj.state, 'locked');
  });

  it('should not change current state', function() {
    obj.hook('created', 'lock', function(){});
    obj.emit('lock');
    assert.equal(obj.state, 'created');
  });

  it('should always change state', function() {
    obj.hook('created', 'lock', null, 'locked');
    obj.emit('lock');
    assert.equal(obj.state, 'locked');
  });

  it('should perform transition without callback', function() {
    obj.hook('created', 'lock', 'locked');
    obj.emit('lock');
    assert.equal(obj.state, 'locked');
  });

  it('should pass arguments', function(done) {
    obj.hook('created', 'lock', function(hello, world){
      if(hello === 'hello') done();
    });
    obj.emit('lock', 'hello');
  });

});

