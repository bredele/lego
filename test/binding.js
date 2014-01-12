var assert = require('assert'),
    Binding = require('maple/binding');


describe("Binding", function() {

	describe("factory", function() {
		it("binding()", function() {
			var obj = Binding();
			assert.equal(typeof obj.add, 'function');
			assert.equal(typeof obj.apply, 'function');
		});

		it("new Binding()", function() {
			var obj = new Binding();
			assert.equal(typeof obj.add, 'function');
			assert.equal(typeof obj.apply, 'function');
		});


	});
});
