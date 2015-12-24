
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
