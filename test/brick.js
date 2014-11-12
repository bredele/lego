
/**
 * Test dependencies.
 */

var assert = require('assert');
var brick = require('..');


describe("API", function() {

  var obj;
  beforeEach(function() {
    obj = brick();
  });
  

  it("should be a component/emitter", function() {
    assert(obj.emit);
    assert(obj.on);
    assert(obj.once);
    assert(obj.off);
  });
  
  it('should be a bredele/datastore', function() {
    assert(obj.set);
    assert(obj.get);
    assert(obj.del);
    assert(obj.reset);
    assert(obj.compute);
  });

  it("should have the following API", function() {
    assert(obj.from);
    assert(obj.freeze);
    assert(obj.tag);
    assert(obj.build);
    assert(obj.attr);
    assert(obj.use);
  });
  
});

describe("Basic rendering", function() {

  var obj;
  beforeEach(function() {
    obj = brick();
  });


  it("should render string into dom", function() {
    obj.from('<button>hello</button>');
    assert.equal(obj.el.innerHTML, 'hello');
    assert.equal(obj.el.nodeName, 'BUTTON');
  });

  it("should render from existing dom", function() {
    var div = document.createElement('ul');
    obj.from(div);
    
    assert.equal(obj.el.nodeName, 'UL');
  });

  it('should render from query selection', function() {
    document.body.insertAdjacentHTML('beforeend', '<section class="brick-test">');
    obj.from('.brick-test');

    assert.equal(obj.el.nodeName, 'SECTION');
    assert.equal(obj.el.getAttribute('class'), 'brick-test');
  });

});

describe("Attribute bindings", function() {
  
  var obj;
  beforeEach(function() {
    obj = brick();
    obj.from('<section class="section" data-test="hello">content</section>');
  });

  it("should apply binding", function(done) {
    obj.attr('data-test', function(node, content) {
      if(content === 'hello') done();
    });
    obj.build();
  });

  it('should scope binding with itself', function(done) {
    obj.set('name', 'olivier');
    obj.attr('data-test', function(node, content) {
      if(this.get('name') === 'olivier') done();
    });
    obj.build();
  });

  it('should apply multiple bindings', function() {
    var result = '';
    obj.attr({
      'data-test' : function(node, content) {
        result += content;
      },
      'class' : function(node, content) {
        result += content;
      }
    });
    obj.build();
    assert.equal(result, 'sectionhello');
  });

});

describe("Constructor", function() {

  it("should set template", function() {
    var obj = brick('<button>hello</button>');
    assert.equal(obj.el.innerHTML, 'hello');
    assert.equal(obj.el.nodeName, 'BUTTON');
  });
  
  it("should set model", function() {
    var obj = brick('<button>hello</button>', {
      name: 'olivier'
    });
    assert.equal(obj.get('name'), 'olivier');

  });
});

describe("Interpolation", function() {

  it("should substitute single expression", function() {
    var obj = brick('<button>${label}</button>', {
      label: 'olivier'
    });
    obj.build();

    assert.equal(obj.el.innerHTML, 'olivier');
  });

  it("should substitue multiple expressions in the same node", function() {
    var obj = brick('<button>${label} from ${country}</button>', {
      label: 'olivier',
      country: 'france'
    });
    obj.build();

    assert.equal(obj.el.innerHTML, 'olivier from france');
  });
  
  it("should substitue every text node", function() {
    var obj = brick('<button class="${country}">${label}</button>', {
      label: 'olivier',
      country: 'france'
    });
    obj.build();

    assert.equal(obj.el.className, 'france');
    assert.equal(obj.el.innerHTML, 'olivier');
  });

  describe('live interpolation', function() {

    it("should update text node on model change", function() {
      var obj = brick('<button>${label}</button>', {
        label: 'olivier'
      });
      obj.build();
      obj.set('label', 'bredele');
      assert.equal(obj.el.innerHTML, 'bredele');
    });
    
  });
  
});


describe("Freeze", function() {
  
  it("should return a new brick", function() {
    var obj = brick('<section class="section">')
      .attr('class', function(node, content) {
        node.innerHTML = content;
      }).freeze();


    var other = obj().build();
    assert.equal(other.el.innerHTML ,'section');
  });
  
});

describe('element handler', function() {

});

describe('custom element', function() {

  it("should replace custom tag with brick", function() {
    var list = brick('<ul><user></user></ul>');
    var user = brick('<h1>user</h1>');

    list.tag('user', user);
    list.build();

    assert.equal(list.el.innerHTML, '<h1>user</h1>');
  });

  // note: une brick peut elle etre un custom element?
  // dans ce cas on doit verifier le this.el (c pk il faudrait
  // peut etre mettre la brick dans unf ragment par defaut)
  //var list = brick('<user><span>hello world!</span></user>');

  it('should replace the content of a custom element with 1 node', function() {
    var list = brick('<div><user>  <button>hello</button></user></div>');
    var user = brick('<div><content></content></div>');

    list.tag('user', user);
    list.build();

    // note on doit utiliser un fragment 
    // ce sera plus rapide
    assert.equal(user.el.innerHTML, '  <button>hello</button>');
  });


  it('should replace the content of a custom element with multiple nodes', function() {
    var list = brick('<div><user>  <h1>hello</h1><button>world</button></user></div>');
    var user = brick('<div><h2>brick</h2><content></content></div>');

    list.tag('user', user);
    list.build();

    // note on doit utiliser un fragment 
    // ce sera plus rapide
    assert.equal(user.el.innerHTML, '<h2>brick</h2>  <h1>hello</h1><button>world</button>');
  });

  it('should replace the content of a custom element with query selection', function() {
    var list = brick('<div><user><h1>hello</h1><button>world</button></user></div>');
    var user = brick('<div><content select="button"></content></div>');

    list.tag('user', user);
    list.build();

    // note on doit utiliser un fragment 
    // ce sera plus rapide
    assert.equal(user.el.innerHTML, '<button>world</button>');
  });

  it('should bind a custom element inner content', function() {
    var list = brick('<div><user>${name}</user></div>', {
      name: 'olivier'
    });
    var user = brick('<div>${name} and <content></content></div>', {
      name: 'bruno'
    });

    list.tag('user', user);

    list.build();

    assert.equal(user.el.innerHTML, 'bruno and olivier');

    list.set('name', 'bredele');

    assert.equal(user.el.innerHTML, 'bruno and bredele');

    user.set('name', 'amy');
    assert.equal(user.el.innerHTML, 'amy and bredele');

  });

  // @note faire ca une fois qu'on est sur du templat eengine
  // it('shoud bind the model of a brick and its custom element', function() {
  //   var list = brick('<div><user title="${name}"></user></div>', {
  //     name: 'olivier'
  //   });
  //   var user = brick('<div>${title}</div>');

  //   list.tag('user', user);

  //   list.build();

  //   assert.equal(user.el.innerHTML, 'olivier');
  // });
  
});


// function benchmark() {
//   var result = 0;
//   function bench() {
//     var obj = brick('<section class="${test}"><ul class="${label}"><li class="ola"></li></ul></section>', {
//       label: 'olivier'
//     });

//     var to = performance.now();
//     obj.build();
//     result += performance.now() - to;
//   }

//   for(var l = 1000; l--;) {
//     bench();
//   }
//   console.log(result/ 1000);
// }



//   benchmark();
//   benchmark();
//   benchmark();
//   benchmark();
//   benchmark();
//   benchmark();
//   benchmark();
//   benchmark();
//   benchmark();



var section = brick('<section>this is a test:<user><h1>${name}</h1><address>${address}</address></user></section>', {
  name: 'olivier',
  address: 'calgary'
});

var user = brick('<div><button>${title}</button><content select="h1"></content></div>', {
  title: 'send'
});

section.tag('user', user);
section.build();
document.body.appendChild(section.el);

setTimeout(function() {
  section.set('name', 'amy');
  user.set('title', 'send');
}, 4000);
