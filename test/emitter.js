var assert = require('assert'),
    Emitter = require('maple/emitter');

describe("Emitter", function() {

	describe("mixin", function() {
		it("should mixin an object with an emitter", function() {
			var obj = {};
			Emitter(obj);
			assert(obj.on !== undefined);
			assert(obj.emit !== undefined);
			assert(obj.once !== undefined);						
			assert(obj.off !== undefined);			
		});
	});

	describe(".on(event, fn)", function() {

		it('should register a listener', function() {
			var emitter = new Emitter(),
					call = "";

			emitter.on('foo', function(val) {
				call = val;
			});

			emitter.emit('foo', 'maple');
			emitter.emit('bar');

			assert.equal(call, 'maple');
		});

		it('should execute listeners in the order', function() {
			var emitter = new Emitter(),
					calls = [];

			emitter.on('foo', function(val) {
				calls.push('one', val);
			});
			emitter.on('foo', function(val) {
				calls.push('two', val);
			});

			emitter.emit('foo', 0);
			emitter.emit('foo', 1);				

			assert.deepEqual(calls, ['one', 0, 'two', 0, 'one', 1, 'two', 1]);
		});

		//NOTE: is scope necessary?
		it('should execute listener in scope', function() {
			var emitter = new Emitter(),
					scope = {label: 'maple'},
			    call = null;

			emitter.on('foo', function(val) {
				call = scope[val];
			}, scope)
			emitter.emit('foo', 'label');
			assert.equal(call, 'maple');
		});

	});

	describe(".off()", function() {
		it("should remove all listeners", function() {
			var emitter = new Emitter();
			emitter.on('foo', function(){});
			emitter.on('bar', function(){});

			emitter.off();
			assert.deepEqual(emitter.listeners, {});
		});

		it('should remove all listeners for an event', function() {
			var emitter = new Emitter();
			emitter.on('foo', function(){});
			emitter.on('foo', function(){});
			emitter.on('bar', function(){});
			emitter.off('foo');
			assert.equal(emitter.listeners['foo'], undefined);
		});

		it('should remove a specific listener for an event', function() {
			var emitter = new Emitter(),
					call = "",
					fn = function(){
						call += 'is awesome'; 
					};

			emitter.on('foo', fn);
			emitter.on('foo', fn);			
			emitter.on('foo', function(val){
				call += 'maple'
			});
			emitter.off('foo', fn);
			emitter.emit('foo');

			assert.equal(call, 'maple');
		});
		
	});
	
	
	describe(".once(event, fn)", function() {
		it("should execute once listener", function() {
			var emitter = new Emitter(),
			    call = 0;

			emitter.once('foo', function() {
				call++;
			});

			emitter.emit('foo');
			emitter.emit('foo');

			assert.equal(call, 1);
		});
		
	});
	
	
});
