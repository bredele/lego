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
	
});
