var assert = require('assert'),
		mixin = require('maple/lib/utils').mixin;

describe("mixin", function() {
	it("merge two objects", function() {
		var from = {label: 'utils'},
		    to = {};
		    
		mixin(from, to);
		assert.equal(to.label, 'utils');
	});
	
});