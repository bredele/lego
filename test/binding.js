var assert = require('assert'),
domify = require('domify'),
Store = require('../store'),
Binding = require('../lib/binding');


describe("Binding", function() {

	describe("factory", function() {

		it("binding()", function() {
			var obj = Binding();
			assert.equal(typeof obj.add, 'function');
			assert.equal(typeof obj.scan, 'function');
		});

		it("new Binding()", function() {
			var obj = new Binding();
			assert.equal(typeof obj.add, 'function');
			assert.equal(typeof obj.scan, 'function');
		});
	});

	describe('single node data binding', function() {

		describe('Attribute and Dataset binding', function() {

			it('should add attribute binding', function() {
				var el = domify('<a link></a>');
				var binding = new Binding();
				binding.add('link', function(el){
					el.setAttribute('href', 'http://github.com/bredele');
				});
				binding.scan(el);

				assert('http://github.com/bredele' === el.getAttribute('href'));
			});

			it('should add dataset binding', function() {
				var el = domify('<a data-text="olivier"></a>');
				var binding = new Binding();
				binding.add('data-text', function(el, value){
					el.innerText = value;
				});
				binding.scan(el);

				assert('olivier' === el.innerText);
			});
		});

		describe('function binding', function() {

			var plugin = null;

			beforeEach(function(){
				plugin = {
					test : function(el){
						el.innerText = 'awesome';
					},
					other : function(el){
						el.className = 'beauty';
					}
				};

			});

			it('should apply function as binding', function(){
				var el = domify('<a data-test="something"></a>');
				var binding = new Binding();
				binding.add('data-test', plugin.test);
				binding.scan(el);

				assert('awesome' === el.innerText);
			});

			it('should apply multiple function bindings', function(){
				var el = domify('<a data-test="something" data-other="">link</a>');
				var binding = new Binding();
				binding.add('data-test', plugin.test);
				binding.add('data-other', plugin.other);
				binding.scan(el);

				assert('beauty' === el.className);
				assert('awesome' === el.innerText);
			});

			it('should apply the binding model as the scope of the function binding', function(){
				var el = domify('<a data-scope="name"></a>');
				var store = new Store({
					name : 'Wietrich'
				});
				var binding = new Binding(store);
				binding.add('data-scope', function(el){
	        el.innerText = this.get('name'); //TODO: should pass the model attribute's name
	      });
				binding.scan(el);

				assert('Wietrich' === el.innerText);
			});

			it('should binding and interpolation', function(){
				var el = domify('<a href="{{ link }}" data-other>{{    title}}</a>');

				var store = new Store({
					link : 'http://github.com/bredele',
					title : 'bredele'
				});

				var binding = new Binding(store);
				binding.add('data-other', plugin.other);
				binding.scan(el);

				assert('beauty' === el.className);
				assert('http://github.com/bredele' === el.getAttribute('href'));
				assert('bredele' === el.innerHTML);
			});

		});

		describe('Object binding', function() {

			it('shoud apply Object as binding', function() {
				var el = domify('<a data-model="bind:innerHTML,prop"></a>');

				var binding = new Binding();
				var Plugin = function(model){
					this.bind = function(el, attr, prop){
						el[attr] = model.prop;
					};
				};

				binding.add('data-model', new Plugin({
					prop : 'http://github.com/bredele'
				}));

				binding.scan(el);
				assert('http://github.com/bredele' === el.innerHTML);
			});

			it('should apply nested bindings', function() {

				var el = domify('<ul><li class="first" data-model="bind:innerHTML,firstname"></li>' + 
					'<li class="last" data-model="bind:innerHTML,lastname"></li>' +
					'</ul>');

				var binding = new Binding();
				var Plugin = function(model){
					this.bind = function(el, attr, prop){
						el[attr] = model[prop];
					};
				};

				binding.add('data-model', new Plugin({
					firstname : 'Olivier',
					lastname : 'Wietrich'
				}));

				binding.scan(el);
				assert('Olivier' === el.querySelector('.first').innerHTML);
				assert('Wietrich' === el.querySelector('.last').innerHTML);
			});

			it('should apply bindings and inteprolation', function() {
				var el = domify('<a class="{{className}}" data-model="bind:innerHTML,prop"></a>');
				var store = new Store({
					prop : 'http://github.com/bredele',
					className : 'bredele'
				});
				var binding = new Binding(store);

				var Plugin = function(model){
					this.bind = function(el, attr, prop){
						el[attr] = model.get(prop);
					};
				};

				binding.add('data-model', new Plugin(store));

				binding.scan(el);
				assert('http://github.com/bredele' === el.innerHTML);
				assert('bredele' === el.className);
			});

			it('should call default binding method', function() {
				var el = domify('<input required>');

				var binding = new Binding();
				var Plugin = function(){
					this.main = function(el){
						el.value = 'bredele';
					};
				};

				binding.add('required', new Plugin());

				binding.scan(el);
				assert('bredele' === el.value);
			});
		});
});


	describe('nested node dataset binding', function() {

		it('shoud apply bindings on different dom nodes', function() {
			var el = domify('<a data-plug1><span data-plug2>test</span></a>');
			var binding = new Binding();
			binding.add('data-plug1', function(node){
				node.setAttribute('href', 'http://github.com/bredele');
			});
			binding.add('data-plug2', function(node){
				node.innerText = 'bredele';
			});
			binding.scan(el);
			assert('http://github.com/bredele' === el.getAttribute('href'));
			assert('bredele' === el.firstChild.innerText);
		});

		it('shoud apply bindings on different dom nodes with interpolation', function() {
			var el = domify('<a data-plug1>{link}<span data-plug2>{label}</span></a>');
			var binding = new Binding(new Store({
				link : 'Click to go on',
				label : 'bredele website'
			}));
			binding.add('data-plug1', function(node){
				node.setAttribute('href', 'http://github.com/bredele');
			});
			binding.add('data-plug2', function(node){
				node.innerText = 'bredele';
			});
			binding.scan(el);
			assert('http://github.com/bredele' === el.getAttribute('href'));
			assert('bredele' === el.querySelector('span').innerText);
		});
	});

	describe('data-set plugin', function() {

		it('should call data set plugin and pass the node and its content', function() {
			var el = domify('<span data-bind="name"></span>');
			var store = new Store({
				name : 'olivier'
			});
			var value = null;
			var node = null;
			var binding = new Binding(store);
			binding.add('data-bind', function(el, val){
				value = val;
				node = el;
			});
			binding.scan(el);
			assert('name' === value);
			assert.equal(node, el);
		});
	});


	describe('live binding', function() {

		it('single attribute', function() {
			var el = domify('<span>{{name}}</span>');
			var store = new Store({
				name : 'olivier'
			});
			var binding = new Binding(store);
			binding.scan(el);
			assert('olivier' === el.innerHTML);

			store.set('name', 'bruno');
			assert('bruno' === el.innerHTML);
		});

		it('multiple attributes on different nodes', function() {
			var el = domify('<a href={{link}}>{{label}}</a>');
			var store = new Store({
				label : 'bredele'
			});

			var binding = new Binding(store);
			binding.scan(el);
			assert('bredele' === el.innerHTML);
			assert('' === el.getAttribute('href'));

			store.set('link', 'http://github.com/bredele');
			assert('http://github.com/bredele' === el.getAttribute('href'));

		});

		it('multiple attributes on the same node', function() {
			var el = domify('<a href={{link}}/repo/{{name}}></a>');
			var store = new Store({
				link : 'http://github.com/bredele',
				name:'store'
			});

			var binding = new Binding(store);
			binding.scan(el);
			assert('http://github.com/bredele/repo/store' === el.getAttribute('href'));
			store.set('link', 'http://github.com');
			assert('http://github.com/repo/store' === el.getAttribute('href'));
			store.set('name', 'bredele');
			assert('http://github.com/repo/bredele' === el.getAttribute('href'));
		});

		it('nested attributes', function() {
			var el = domify('<a href="{{link}}"><span>{{label}}</span></a>');
			var store = new Store({
				link: 'http://github.com/bredele',
				label : 'bredele'
			});
			var binding = new Binding(store);
			binding.scan(el);
			assert('bredele' === el.firstChild.innerHTML);
			assert('http://github.com/bredele' === el.getAttribute('href'));
			store.set('link', 'http://www.google.com');
			assert('http://www.google.com' === el.getAttribute('href'));
			store.set('label', 'olivier');
			assert('olivier' === el.firstChild.innerHTML);
		});

	});

	describe("Query", function() {

		it('should only query select the plugins (no interpolation)', function() {
			var el = domify('<span data-query1="hello world" data-query2="test:hello">{{label}}</span>'),
			query1 = false,
			query2 = false;

			Binding()
			.add('data-query1', function(el, str) {
				query1 = true;
			})
			.add('data-query2', {
				test: function(el, arg) {
					query2 = true;
				}
			})
			.scan(el, true);

			assert.equal(query1, true);
			assert.equal(query2, true);
			assert.equal(el.innerHTML, '{{label}}');
		});
	});

	describe("remove", function() {

		it("should destroy plugins", function() {
			var el = document.createElement('div'),
			plugin = {
				called:false,
				destroy:function() {
					this.called = true;
				}
			};

			var binding = Binding()
			.add('plug', plugin)
			.scan(el);

			binding.remove();
			assert.equal(plugin.called, true);
		});

		it("should unsubscribe to store", function() {
			var el = domify('<span>{{label}}</span>'),
			store = new Store({
				label: 'maple'
			}),
			changed = false;

			store.on('change github', function() {
				changed = true;
			});

			Binding(store)
			.scan(el)
			.remove();

			store.set('label', 'bredele');
			assert.equal(el.innerHTML, 'maple');

			store.set('github', 'http://github.com/leafs');
			assert.equal(changed, true);
		});

	});

  describe("issues fixes", function() {

  	// it("displays empty string for undefined store attributes #12", function() {
  	// 	var el = domify('<span>my name is {name}</span>');
  	// 	Binding()
  	// 	  .apply(el);

  	// 	assert.equal(el.innerHTML, 'my name is ');
  	// });
  	
  	
  });
  

});
