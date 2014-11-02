
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
    assert(obj.html);
    assert(obj.freeze);
    assert(obj.register);
    assert(obj.build);
    assert(obj.attr);
  });
  
});

describe("Basic rendering", function() {

  it("should render string into dom", function() {
    var obj = brick();
    obj.html('<button>hello</button>');

    assert.equal(obj.el.innerHTML, 'hello');
    assert.equal(obj.el.nodeName, 'BUTTON');
  });

  it("should accept dom", function() {
    var obj = brick();
    var div = document.createElement('ul');
    obj.html(div);
    
    assert.equal(obj.el.nodeName, 'UL');
  });

});

