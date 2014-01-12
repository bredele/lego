var assert = require('assert'),
		utils = require('maple/lib/utils');

describe("Utils", function() {
	describe("mixin", function() {
		var mixin = utils.mixin;
		it("merge two objects", function() {
			var from = {label: 'utils'},
			    to = {};

			mixin(from, to);
			assert.equal(to.label, 'utils');
		});
		
	});

	describe("trim", function() {
		var trim = utils.trim;
		it('should trim string', function() {
			assert.equal('maple is awesome', trim('    maple is awesome   '));
		});
	});


	describe("indexOf", function() {
		var indexOf = utils.indexOf;
		it('arrays', function () {
		  var array = ['maple','canada'];
		  assert.equal(indexOf(array, 'canada'), 1);
		});
	});
	

	describe("to array", function() {
		var toArray = utils.toArray;
		it("transform an array-like into an array", function() {
			var arr = null;
			var fn = function() {
				arr = toArray(arguments);
			};
			fn('maple', 'canada');
			assert(arr instanceof Array);
			assert.deepEqual(arr, ['maple', 'canada']);
		});
		
	});

	describe('clone', function(){
		var clone = utils.clone;
	  it("should clone an Array", function() {
	    var copy = clone(['olivier', 'bredele']);
	    assert.equal('olivier', copy[0]);
	    assert.equal('bredele', copy[1]);
	  });

	  it("should clone an Object", function() {
	    var copy = clone({
	      name : 'olivier',
	      github : {
	        name : 'olivier'
	      }
	    });
	    assert.equal('olivier', copy.name);
	    assert.equal('olivier', copy.github.name);    
	  });
	});

	describe("each", function() {
		var each = utils.each;
		describe('object', function(){
			it('should iterate through each key/value pair', function(){
				var obj = {
					name : 'olivier',
					github : 'bredele'
				};
				var results = {};
				each(obj, function(key, val){
					results[key] = val;
				});

				assert.deepEqual(obj, results);
			});
		});

		describe('array', function(){
			it('should iterate through each values', function(){
				var obj = ['olivier', 'bredele'];
				var results = [];
		    //keys are array index
		    each(obj, function(key, val){
		    	results[key] = val;
		    });
		    assert.deepEqual(obj, results);
		  });
		});


		describe('scope', function(){
			it('should apply callback in passed scope', function(){
				var obj = ['olivier', 'wietrich'];

				var scope = {
					names : []
				};

				each(obj, function(key, val){
					this.names.push(val);
				}, scope);

				assert.deepEqual(scope.names, obj);
			});
		});

	});
	
	
});
