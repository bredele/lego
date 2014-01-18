var assert = require('assert'),
    View = require('maple/view');

    describe("View", function() {
    	describe('template', function() {
    		var body = null;
    		beforeEach(function() {
    			body = document.createElement('div');
    		});

    		it('should render simple string html', function() {
    			var view = new View();
    			view.html('<button>template</button>');
    			view.insert(body);

    			assert.equal((view.dom instanceof Element), true);
    		});

    		it('should accept HTML Element', function(){
    			var view = new View();
    			view.html(body);

    			assert.equal((view.dom instanceof Element), true);
    			assert.equal(view.dom, body);
    		});

    		it('should accept other template engine', function(){
    			var view = new View();
    			view.html(function(obj){
    				var div = document.createElement('div');
    				div.className = obj.className;
    				return div;
    			}, {className: 'bredele'});

    			assert.equal(view.dom.tagName,'DIV');
    			assert.equal(view.dom.className,'bredele');
    		});
    	});

    	describe('template binding', function() {
    		var body = null;
    		beforeEach(function() {
    			body = document.createElement('div');
    		});

    		it('should render template from object', function() {
    			var view = new View();
    			view.html('<span>{github}</span>', {
    				github:'leafs'
    			});
    			view.insert(body);

    			assert.equal(view.dom.innerHTML, 'leafs');
    		});

    		describe('store live-binding', function() {
    			it('should update view\'s dom when store change', function() {
    				var view = new View();
    				var store = new Store({
    					github:'leafs'
    				});
    				view.html('<span>{github}</span>', store);
    				view.insert(body);

    				assert.equal(view.dom.innerHTML, 'leafs');

    				store.set('github', 'petrofeed');
    				assert.equal(view.dom.innerHTML, 'petrofeed');
    			});
    		});
    	});

    	describe('plugin', function() {
    		var body = null;
    		beforeEach(function() {
    			body = document.createElement('div');
    		});


    		it('should add attribute binding', function(){
    			var view = new View();
    			var plugin = {};
    			view.attr('class', plugin);

    			assert.equal(view.binding.plugins['class'], plugin);
    		});

    		it('should add data attribute binding', function() {
    			var view = new View();
    			var plugin = {};
    			view.data('test', plugin);

    			assert.equal(view.binding.plugins['data-test'], plugin);
    		});

    	});

    	describe('insert', function() {
    		var body = null;
    		beforeEach(function() {
    			body = document.createElement('div');
    		});

    		it('should insert view\'s dom', function() {
    			var view = new View();
    			view.html('<span>template</span>');
    			view.insert(body);

    			assert.equal(body.firstChild, view.dom);
    		});
    	});


    	describe('destroy', function() {
    		it('should call the destroy function of every regstered plugin', function(){
    			var view = new View(),
    			idx = 0,
    			destroy = function() {
    				++idx;
    			};
    			view.attr('test', {
    				destroy: destroy
    			});
    			view.attr('other', {
    				destroy: destroy
    			});
    			view.data('another', {});
    			view.alive(document.createElement('div'));
    			view.destroy();
    			assert(idx === 2);
    		});
    	});
    });
