var assert = require('assert'),
    View = require('maple/newview');

describe('View', function() {

	describe('API', function() {

		it('should have a html method', function() {
			var view = new View();
			assert.equal(typeof view.html, 'function');
		});

		it('should have a el method', function() {
			var view = new View();
			assert.equal(typeof view.el, 'function');
		});

		it('should have a plug method', function() {
			var view = new View();
			assert.equal(typeof view.plug, 'function');			
		});

		it('should have a remove method', function() {
			var view = new View();
			assert.equal(typeof view.remove, 'function');
		});

		describe("View Emitter", function() {
			it('should be an Emitter', function() {
				var view = new View(),
				    initialized = false;

				assert.equal(typeof view.on, 'function');
				assert.equal(typeof view.emit, 'function');

				view.on('initialized', function() {
					initialized = true;
				});

				view.emit('initialized');
				assert.equal(initialized, true);
			});
			
		});
		
		
	});

	describe("HTML templating: .html()", function() {
		it('should render HTML string into DOM (view.dom)', function() {
			var view = new View();
			view.html('<button>maple</button>');

			assert(view.dom instanceof Element);
			assert.equal(view.dom.nodeName, 'BUTTON');
			assert.equal(view.dom.innerHTML, 'maple');
		});
	});
	
	
});
        