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

	describe(".html()", function() {

		it("should render view's dom from string", function() {
			var view = new View();
			view.html('<button>maple</button>');

			assert(view.dom instanceof Element);
			assert.equal(view.dom.nodeType, 'BUTTON');
			assert.equal(view.dom.innerHTML, 'maple');
		});

		it("should set a document element as the view's dom", function() {
			var el = document.createElement('div'),
			    view = new View();
			view.html(el);

			assert.equal(view.dom, el);
		});

		it("should select view's domt from document", function() {
			document.body.insertAdjacentHTML('beforeend', '<div class="view-select"></div>');
			var view = new View();
			view.html('.view-select');

			assert(view.dom instanceof Element);
			assert.equal(view.dom.className, 'view-select');
		});

	});
	
	
});
