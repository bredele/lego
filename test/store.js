var assert = require('assert'),
    Store = require('maple/store');

describe("Store", function() {

  describe("access control", function() {

    it('should initialize with an object', function() {
      var other = new Store({
        name : 'olivier'
      });
      assert.equal(other.data['name'], 'olivier');
    });

    it('should initialize with a store', function() {
      var other = new Store({
        name : 'olivier'
      });
      var store = new Store(other);
      assert.equal(store.data['name'], 'olivier');
    });

    it('should set the data', function() {
      var store = new Store();
      store.set('name', 'olivier');
      assert.equal(store.get('name'), 'olivier');
    });

    it('should update an existing store attribute', function(){
      var store = new Store({
        name: 'olivier'
      });
      store.set('name', 'bredele');
      assert.equal(store.get('name'), 'bredele');
    });

    it("should return undefined if attribute doesn't exist", function(){
      var store = new Store();
      assert.equal(store.get('name'), undefined);
     });
  });
  
});
