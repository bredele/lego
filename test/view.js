var assert = require('assert'),
		Store = require('maple/store'),
    View = require('maple/view');

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

		it('should emit a rendered event', function() {
			var view = new View(),
			    rendered = false;

			view.on('rendered', function() {
				rendered = true;
			});

			view.html('<button></button>');
			assert.equal(rendered, true);
		});
	});

	describe("HTML insert: .el(parent)", function() {
		it('should insert view.dom into parent element (if exists)', function() {
			var view = new View(),
			    parent = document.createElement('div');

			view.html('<span>maple</span>');

      //parent null
			view.el();
			//it's the div
			//assert.equal(view.dom.parentElement, null);

      //parent dom element
			view.el(parent);
			assert.equal(parent.childNodes[0], view.dom);
		});

		it('should emit an inserted event', function() {
			var view = new View(),
			    inserted = 0;

			view.on('inserted', function() {
				inserted++;
			});

			view.html('<span>maple</span>');
      
			//parent null
			view.el();
			assert.equal(inserted, 1);

			//parent dom element
			view.el(document.createElement('div'));
			assert.equal(inserted, 2);
		});

		it('should emit inserted event with current and previous element');

	});
	

	describe("HTML interpolation: .el()", function() {

		it('should emit a compiled event only once', function() {
			var view = new View(),
			    compiled = 0;

			view.html('<span>{{label}}</span>');
			view.on('compiled', function() {
				compiled++;
			})
			view.el();
			view.el(document.createElement('div'));
			assert.equal(compiled, 1);
		});

		it('should interpolate template variable', function() {
			var view = new View();
			view.html('<span>{{label}}</span>', {
				label: 'maple'
			});

			view.el();
			assert.equal(view.dom.innerHTML, 'maple');
		});

    //spy binding apply
		it('should interpolet template variable only once');

		describe("live-binding", function() {

			it("should update view's dom when store change", function() {
				var view = new View();
				var store = new Store({
					github:'leafs'
				});
				view.html('<span>{{github}}</span>', store);
				view.el(document.createElement('div'));

				assert.equal(view.dom.innerHTML, 'leafs');

				store.set('github', 'maple');
				assert.equal(view.dom.innerHTML, 'maple');
			});
		});

	});
	
	describe("HTML plugin: .plug()", function() {

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

	describe('HTML remove: .remove()', function() {

		it("should emit a removed event", function() {
			var view = new View(),
			    removed = false;

			view.html('<button>maple</button>');
			view.el();
			view.on('removed', function() {
				removed = true;
			});
			view.remove();
			assert.equal(removed, true);
		});

		it('should remove from parent element if exists', function() {
			var view = new View(),
					parent = document.createElement('div');

			view.html('<button>maple</button>');
			view.el(parent);

			view.remove();
			assert.equal(parent.innerHTML, '');
		});

    //use spy
		it('should destroy bindings');

		//view.dom still exist, memory leaks?
		
	});

  //TODO: to refactor
	describe("Constructor Factory", function() {
		it('should return a view without using new', function() {
			var widget = View();
			assert.equal(typeof widget.el, 'function');
			assert.equal(typeof widget.html, 'function');
			assert.equal(typeof widget.plug, 'function');			
		});

		//we should have data as well
		it('should extend the view with an object and call the options (el,plug,html)', function() {
			var parent = document.createElement('div');

			var widget = new View({
				el: parent,
				html: '<button>{{label}}</button>',
				data: {
					label: 'maple'
				},
				plug: {
					'data-event' : function(){}
				},
				custom: function() {
					return this.dom;
				}
			});

			assert.equal(parent.firstChild, widget.dom);
			assert.equal(widget.dom.nodeName, 'BUTTON');
			assert.equal(widget.dom.innerHTML, 'maple');
			assert(widget.binding.plugins['data-event'] !== undefined);			
			assert.equal(widget.custom(), widget.dom);
		});

		//TODO: test for array of options

		// it('should render and compile a view', function() {
		// 	var widget = View('<div>{label}</div>', {label:'maple'});
		// 	assert.equal(widget.dom.innerHTML, 'maple');
		// });

		// it('should render, compile and insert a view', function() {
		// 	var parent = document.createElement('div');
		// 	var widget = View('<div>maple</div>', {}, parent);
		// 	assert.equal(parent.firstChild, widget.dom);
		// });
	});
	
});
        