var assert = require('assert'),
    View = require('maple/better-view');

describe("Better View", function() {

	describe("Constructor", function() {

		it('should initialize a new view', function() {
			var view = new View();
			assert.equal(typeof view.html, 'function');
			assert.equal(typeof view.alive, 'function');
		});

		it('should extend an object and return a view from it', function() {
			var view = View({
				html: 'something',
				custom: function(){}
			});

			assert.equal(typeof view.html, 'function');
			assert.equal(typeof view.alive, 'function');			
			assert.equal(typeof view.custom, 'function');
		});

		it('should return a view', function() {
			var view = View();
			assert.equal(typeof view.html, 'function');
			assert.equal(typeof view.alive, 'function');
		});

	});
	
});
