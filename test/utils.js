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
	
});
