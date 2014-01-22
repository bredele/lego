var assert = require('assert'),
    Store = require('maple/store'),
    View = require('maple/view');

describe("View", function() {

	describe("Constructor", function() {

		it('should initialize a new view', function() {
			var view = new View();
			assert.equal(typeof view.html, 'function');
			assert.equal(typeof view.insert, 'function');
		});

		it('should extend an object and return a view from it', function() {
			var view = View({
				html: 'something',
				custom: function(){}
			});

			assert.equal(typeof view.html, 'function');
			assert.equal(typeof view.insert, 'function');			
			assert.equal(typeof view.custom, 'function');
		});

		it('should return a view', function() {
			var view = View();
			assert.equal(typeof view.html, 'function');
			assert.equal(typeof view.insert, 'function');
		});

	});

	describe(".html()", function() {

		it("should render view's dom from string", function() {
			var view = new View();
			view.html('<button>maple</button>');

			assert(view.dom instanceof Element);
			assert.equal(view.dom.nodeName, 'BUTTON');
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

		//should we do query selection on node?
		it(".html('#maple', 'li .test', data)");

	});

	describe("template binding", function() {

		it("should update view's dom from object", function() {
			var view = new View();
		  view.html('<span>{github}</span>', {
				github:'leafs'
			})
			view.insert(document.createElement('div'));

			assert.equal(view.dom.innerHTML, 'leafs');
		});

		describe("live-binding", function() {

			it("should update view's dom when store change", function() {
				var view = new View();
				var store = new Store({
					github:'leafs'
				});
				view.html('<span>{github}</span>', store);
				view.insert(document.createElement('div'));

				assert.equal(view.dom.innerHTML, 'leafs');

				store.set('github', 'petrofeed');
				assert.equal(view.dom.innerHTML, 'petrofeed');
			});
		});
	});
	
	describe('plugin', function() {

		it("should add binding plugin", function() {
			var view = new View();
			var plugin = function(){};
			view.plug('class', plugin);

			assert.equal(view.binding.plugins['class'], plugin);
		});

		it("should add multiple binding's plugins", function() {
			var view = new View();
			view.plug({
				"class" : function(){},
				"other" : function(){}
			});

			assert(view.binding.plugins['class'] !== undefined);
			assert(view.binding.plugins['other'] !== undefined);		

		});

	});
	
});
