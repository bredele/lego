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

	describe(".on", function() {
		
	});
	
	
});
