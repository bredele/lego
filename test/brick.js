var brick = require('..');
var assert = require('assert');

describe('Utils', function() {

  var dom;
  beforeEach(function() {
    dom = brick.dom;
  });

  it('should render html from string', function() {
    var result = dom('<span>content</span>');
    assert.equal(result.innerHTML, 'content');
    assert.equal(result.nodeName, 'SPAN');
  });

  it('should return html', function() {
    var span = document.createElement('span');
    span.innerHTML = 'content';
    var result = dom(span);
    assert.equal(result.innerHTML, 'content');
    assert.equal(result.nodeName, 'SPAN');
  });

  it('should select html from document', function() {
    var span = document.createElement('span');
    span.innerHTML = 'content';
    span.className = 'myspan';
    document.body.appendChild(span);

    var result = dom('.myspan');
    assert.equal(result.innerHTML, 'content');
    assert.equal(result.nodeName, 'SPAN');
  });

});

describe("Constructor", function() {

  it("#new", function() {
    var view = brick();
    assert.equal(typeof view.add, 'function');
    assert.equal(typeof view.build, 'function');
    assert.equal(typeof view.remove, 'function');

  });

  //TODO: and inversion of controls?
  it("#store", function() {
    var view = brick();
    assert.equal(typeof view.set, 'function');
    assert.equal(typeof view.get, 'function');
    assert.equal(typeof view.reset, 'function');
    assert.equal(typeof view.compute, 'function');
    assert.equal(typeof view.use, 'function');
    //formatters?
  });

  it("#emitter", function() {
    var view = brick();
    assert.equal(typeof view.on, 'function');
    assert.equal(typeof view.emit, 'function');
    assert.equal(typeof view.off, 'function');
  });

  it("#inherit");
  
});

describe("Store", function() {
  it('should behave as a store', function() {
    var view = brick();
    view.set('color', 'red');

    assert.equal(view.get('color'), 'red');
  });

  it("should behave as an emitter", function(done) {
    var view = brick();
    view.on('lifecycle', function(val) {
      if(val === 'hook') done();
    });

    view.emit('lifecycle', 'hook');
  });
});


describe("Render", function() {

  describe("Basic", function() {

    it("should render regular html", function() {
      //NOTE: may be we should do brick() and brick.extend 
      var view =  brick('<button>brick</button>');
      assert.equal(view.el instanceof Element, true);
      assert.equal(view.el.innerHTML, 'brick');
      assert.equal(view.el.nodeName, 'BUTTON');
    });

    it("should set existing dom element", function() {
      var div = document.createElement('div');
      assert.equal(brick(div).el, div);
    });

    // it("should place into document", function() {
    //  var anchor = document.createElement('div');
    //  var view = brick('<button>brick</button>');
    //  view.build(anchor);
    // });
  });
  
  describe("Interpolation", function() {

    describe("variable", function() {

      it("should substitute variable with data", function() {
        //refactor binding
        var view = brick('<button>{{ label }}</button>');
        view.set('label', 'brick');

        assert.equal(view.el.innerHTML, '{{ label }}');
        view.build();
        assert.equal(view.el.innerHTML, 'brick');
      });

      it('should initialize dom with data', function() {
        var view = brick('<button>{{ label }}</button>', {
          label: 'brick'
        });
        view.build();
        assert.equal(view.el.innerHTML, 'brick');
      });

      it("should update dom when data changes", function() {
        var view = brick('<button>{{ label }}</button>');
        view.set('label', 'brick');
        view.build();

        view.set('label', 'bredele');
        assert.equal(view.el.innerHTML, 'bredele');     
      });
    });

    describe("computed", function() {
      it("should substitute variable with computed property", function() {
        //refactor binding
        var view = brick('<button>{{ name }}</button>', {
          firstName: 'Olivier',
          lastName : 'Wietrich'
        });

        view.compute('name', function() {
          return this.firstName + ' ' + this.lastName;
        });

        view.build();

        assert.equal(view.el.innerHTML, 'Olivier Wietrich');
      });

      it("should update dom when data changes", function() {  
        var view = brick('<button>{{ name }}</button>', {
          firstName: 'Olivier',
          lastName : 'Wietrich'
        });

        view.compute('name', function() {
          return this.firstName + ' ' + this.lastName;
        });

        view.build();

        view.set('firstName', 'Bredele');
        assert.equal(view.el.innerHTML, 'Bredele Wietrich');
      });
    });

    describe("update", function() {

      it("should update dom when view is reseted", function() {
        //refactor binding
        var view = brick('<a class="{{className}}" href="{{link}}">{{ github }}</a>', {
          github: 'bredele',
          className: 'github'
        });

        view.build();

        view.set({
          github: 'brick',
          link: 'http://github.com/bredele/brick'
        });

        assert.equal(view.el.innerHTML, 'brick');
        assert.equal(view.el.className, 'github');
        assert.equal(view.el.getAttribute('href'), 'http://github.com/bredele/brick');
      });
    });
    
    describe("Filters", function() {
      var view;
      beforeEach(function() {
        view = brick('<button>{{ label } | uppercase | hello}</button>', {
          label: 'brick'
        });
      });

      it("should filter variables", function() {
        view.filter('hello', function(str) {
          return 'hello ' + str + '!';
        });
        view.build();
        assert.equal(view.el.innerHTML, 'hello brick!');
      });

      it('should add multiple filters', function() {
        view.filter({
          hello: function(str) {
            return 'hello ' + str + '!';
          },
          uppercase : function(str) {
            return str.toUpperCase();
          }
        });
        view.build();
        assert.equal(view.el.innerHTML, 'hello BRICK!');
      });

    });
    
    
    // describe("reset", function() {

    //  it("should update dom when view is reseted", function() {
    //    //refactor binding
    //    var view = brick('<a class="{{className}}" href="{{link}}">{{ github }}</a>', {
    //      github: 'bredele',
    //      className: 'github'
    //    });

    //    view.build();

    //    view.reset({
    //      github: 'brick',
    //      link: 'http://github.com/bredele/brick'
    //    });

    //    assert.equal(view.el.innerHTML, 'brick');
    //    assert.equal(view.el.className, '');
    //    assert.equal(view.el.getAttribute('href'), 'http://github.com/bredele/brick');
    //  });

    // });

  });

});

describe("Build", function() {
  it('should only apply attribute binding', function() {
    var view = brick('<a data-href="link">{{link}}</a>', {link: 'github'});
    //TODO: we should pass view
    view.add('data-href', function(node, str) {
      node.setAttribute('href', str);
    });
    //NOTE: get better api, what if parent undefined?
    view.build(document.createElement('div'), true);
    assert.equal(view.el.innerHTML, '{{link}}');
    assert.equal(view.el.getAttribute('href'), 'link');
  });
});


describe("Insert", function() {

  it('should insert into parent element (if exists)', function() {
        var parent = document.createElement('div');

        var view = brick('<span>maple</span>');
        view.build();
        //it's the div
        //assert.equal(view.el.parentElement, null);

        //parent dom element
        view.build(parent);
        assert.equal(parent.childNodes[0], view.el);
      });
});

describe("Bricks (aka plugins)", function() {

  it("should add plugin", function() {
    var plugin = function() {};
    var view = brick().add('class', plugin);
    assert.equal(view.bindings.plugins['class'], plugin);
  });

  // it("should execute plugin.init if exists and pass its context", function(done) {
  //   var view = brick();
  //   var plugin = function() {};
  //   plugin.init = function(ctx) {
  //     if(ctx === view) done();
  //   };

  //   view.add('something', plugin);
  // });

  it("should add multiple binding's plugins", function() {
    var view = brick().add({
      "foo" : function(){},
      "bar" : function(){}
    });

    assert.notEqual(view.bindings.plugins['foo'],undefined);
    assert.notEqual(view.bindings.plugins['bar'],undefined);

  });
});

describe('Remove', function() {

  it('should remove from parent element if exists', function() {
    var parent = document.createElement('div');

    var view = brick('<button>maple</button>');
    view.build(parent);
    view.remove();
    assert.equal(parent.innerHTML, '');
  });

  //use spy
  it('should remove bindings');

  //view.el still exist, memory leaks?

});

describe("Lifecycle hooks", function() {

  describe("@rendered", function() {
    it("emits 'rendered' when el is rendered", function(done) {
      var view = brick();
      view.on('rendered', function() {
        done();
      });
      view.dom('<span>brick</span>');
    });
    
  });
  

  describe("@inserted", function() {
    
    it("emits 'before inserted' everytine on build only if el is defined", function() {
      var view = brick(),
          defined = false;
      //TODO: should we test the arguments?
      view.on('before inserted', function() {
        defined = true;
      });

      //el null
      view.build();
      assert.equal(defined, false);

      //el span
      view.dom('<span>brick</span>');
      view.build();
      assert.equal(defined, true);
    });
    
    it("emits 'inserted' on build only if parent is defined", function(done) {
      var view = brick('<span>brick</span>');

      view.on('inserted', function() {
        done();
      });

      view.build(document.createElement('div'));  
    });
  });

  describe("@ready", function() {

    it("emits 'before ready' just before compilation", function(done) {
      var view = brick('<span>{{brick}}</span>');
      view.on('before ready', function() {
        if(view.el.innerHTML === '{{brick}}') done();
      });
      view.build();
    });

    it("emits 'ready' on build only once", function() {
      var view = brick('<span>brick</span>'),
          idx = 0;

      view.on('ready', function() {
        idx++;
      });

      view.build(document.createElement('div'));
      view.build(document.createElement('div'));
      assert.equal(idx, 1);
    });
  });

  describe("@removed", function() {
    it("emits 'before removed' before removing el", function(done) {
      var view = brick('<span>brick</span>');
      view.on('before removed', function() {
        if(view.el.parentElement) done();
      });
      view.remove();
    });

    it("emits 'removed' on remove", function(done) {
      var view = brick('<span>brick</span>');
      view.on('removed', function() {
        done();
      });
      view.remove();
    });
    
  });
});

describe('factory/extend', function() {

  it('should return a brick factory', function() {
    var span = brick.extend('<span>brick</span>');
    //we should do new as well
    var view = span();
    var other = span();
    assert.equal(view.el.innerHTML, 'brick');
    assert.equal(view.el.nodeName, 'SPAN');
    assert.notEqual(view, other);
  });

  it('should use plugins', function() {
    var span = brick.extend('<span>brick</span>')
      .use(function(ctx) {
        ctx.foo = 'bar';
      });

    var view = span();
    assert.equal(view.foo, 'bar');
  });

  it('should add bindings', function() {
    var span = brick.extend('<span data-test="hello">brick</span>')
      .add('data-test', function(el, content) {
        el.innerHTML = content;
      });

    var view = span().build();
    assert.equal(view.el.innerHTML, 'hello');
  });

  it('should override brick Constructor', function() {
    var span = brick.extend('<span>{{label}}</span>');
    var view = span({
      label: 'brick'
    }).dom('<button>{{label}}</button>')
      .build();
    assert.equal(view.el.innerHTML, 'brick');
    assert.equal(view.el.nodeName, 'BUTTON');
  });

});