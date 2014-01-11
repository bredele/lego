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

	});
	
	
});
