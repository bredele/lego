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

		it('should set a document element as view.dom', function() {
			var el = document.createElement('div'),
					view = new View();
			view.html(el);

			assert.equal(view.dom, el);
		});

		it('should emit a created event', function() {
			var view = new View(),
			    created = false;

			view.on('created', function() {
				created = true;
			});

			view.html('<button></button>');
			assert.equal(created, true);
		});
	});

	describe("HTML insert: .el()", function() {
		it('should insert view.dom into document', function() {
			var view = new View(),
			    parent = document.createElement('div');

			view.html('<span>maple</span>');
			view.el(parent);
			assert.equal(parent.childNodes[0], view.dom);
		});

		it('should emit a compiled event', function() {
			var view = new View(),
			    compiled = false;
			view.on('compiled', function() {
				compiled = true;
			});

			view.html('<span>maple</span>');
			view.el(document.createElement('div'));

			assert.equal(compiled, true);
		});
	});
	

	describe("HTML interpolation: .el()", function() {
		it('should interpolate template variable on ready', function() {
			var view = new View();
			view.html('<span>{label}</span>', {
				label: 'maple'
			});

			view.el();
			assert.equal(view.dom.innerHTML, 'maple');
		});
	});
	
	
	
});
        