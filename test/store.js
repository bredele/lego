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

    it("should delete a store attribute", function() {
      var store = new Store();
      store.set('name', 'olivier');
      store.del('name');
      assert.equal(store.get('name'), undefined);
    });

    it("should not delete a model attribute that doesn't exist", function() {
      var store = new Store();
      store.del('name');
      assert.equal(store.get('name'), undefined);
    });
  });

  describe("emitter", function() {

    describe("on set", function() {

      it("emits a 'change' event", function() {
        var store = new Store(),
            event = {};

         store.on('change', function(name, value){
           event[name] = value;
         });
         store.set('name', 'olivier');

         assert.equal(event.name,'olivier');
       });

       it("emits a 'change' event only if attribute has changed", function() {
         var store = new Store(),
             changed = false;

         store.set('name', 'olivier');
         store.on('change', function(name, value){
           changed = true;
         });
         store.set('name', 'olivier');
         assert.equal(changed, false);
       });

       it("emits a 'change' event with the current and previous value", function() {
         var store = new Store(),
             event = {};

         store.set('name', 'olivier');
         store.on('change', function(name, value, prev){
           event[name] = [value, prev];
         });
         store.set('name', 'bredele');

         assert.equal(event.name[0], 'bredele');
         assert.equal(event.name[1], 'olivier');    
       });
    });
    
    describe("on delete", function() {

      it("emits a 'deleted' event", function() {
        var store = new Store(),
            isDeleted = false,
            deletedAttr = '';

        store.set('name', 'olivier');
        store.on('deleted', function(name){
          isDeleted = true;
          deletedAttr = name;
        });
        store.del('name');
        assert.equal(isDeleted, true);
        assert.equal(deletedAttr, 'name');
      });

      it("doesn't emit a 'deleted' event if attribute doesn't exist", function() {
        var store = new Store(),
            isDeleted = false,
            deletedAttr = '';

        store.on('deleted', function(name){
          isDeleted = true;
          deletedAttr = name;
        });
        store.del('name');
        assert.equal(isDeleted, false);
        assert.equal(deletedAttr, '');
      });
    });
    
  });
  
});
