var assert = require('assert'),
maple = require('maple');

describe("Architecture", function() {
	describe("config", function() {
		var app = null;

		beforeEach(function(){
			app = maple();
		});

		it("shoud set config object: .config(obj)", function() {
			app.config({
				domain: 'github',
				async: false
			});
			assert.equal(app.config('domain'), 'github');
			assert.equal(app.config('async'), false);
		});

		it("should set config property: .config(key,value)", function() {
			app.config({
				domain: 'github',
				async: false
			});
			app.config('async', true);
			assert.equal(app.config('domain'), 'github');
			assert.equal(app.config('async'), true);
		});

		it('should return app config: .config()', function() {
			var config = {
				domain: 'github',
				async: false
			};
			assert.deepEqual(app.config(), {});
			app.config(config);
			assert.equal(app.config(), config);
		});

		describe("Config emitter", function() {

			it("should listen changes in config prop", function() {
				var val = false;
	                        //to refactor with app.on
	                        app.sandbox.on('change type', function() {
	                        	val = true;
	                        });
	                        app.config('type', 'worker');
	                        assert.equal(val, true);
	                      });

			it("should listen reset in config", function() {
				var added = false,
				deleted = false;
				app.config({
					type:'worker'
				});

	                        //to refactor with app.on
	                        app.sandbox.on('change environment', function() {
	                        	added = true;
	                        });

	                        //to refactor with app.on
	                        app.sandbox.on('deleted type', function() {
	                        	deleted = true;
	                        });

	                        app.config({
	                        	environment : 'prod'
	                        });
	                        assert.equal(added, true);
	                        assert.equal(deleted, true);
	                      });


		});


});

describe("communication bus", function() {
	var app = null;

	beforeEach(function(){
		app = maple();
	});

	it("should prefix events with app's name", function() {
		var r = false;
		app.name = 'bredele';
		app.on('bredele/test', function(val){
			r = val;
		});
		app.emit('test', true);
		assert.equal(r, true);
	});

	it("should remove event listener", function() {
		var idx = 0,
		fn = function(){
			idx++;
		};
		app.name = 'bredele';
		app.on('bredele/test', fn);
		app.emit('test');
		app.off('bredele/test', fn);
		app.emit('test');
		assert.equal(idx, 1);
	});

	it("should emit event once", function() {
		var idx = 0;
		app.name = 'bredele';
		app.once('bredele/test', function(){
			idx++;
		});
		app.emit('test');
		app.emit('test');
		assert.equal(idx, 1);
	});

});

describe("hooks", function() {

	var app = null,
	hub = null;

	beforeEach(function(){
		app = maple();
		hub = maple();
	});

	describe("init and .use(app)", function() {

		it("should emit an init event in sandbox", function() {
			var called = false;
                        //TODO: should we merge app.on and app.sandbox.on?
                        app.sandbox.on('init', function(){
                        	called = true;
                        });
                        hub.use('app', app);
                        assert.equal(called, true);                
                      });

		it('should emit an init event in hub app', function() {
			var called = false;
			hub.sandbox.on('init app', function() {
				called = true;
			});
			hub.use('app', app);
			assert.equal(called, true);
		});

		describe("init handler", function() {
			it('should define init callback', function() {
				var called = false;
				app.init(function() {
					called = true;
				});
				hub.use('app', app);
				assert.equal(called, true);
			});

			it('should emit an init event', function() {
				var called = false;
				app.init(function() {
					called = true;
				});
				app.init();
				assert.equal(called, true);
			});
		});
		
	});

describe("app stop", function() {
	it("should emit a stop event");
	
});

describe("destroy", function() {
	it("should emit a destroy event");
});
});

describe("middleware/hub", function() {
	var app = null,
	child = null;

	beforeEach(function(){
		app = maple();
		child = maple();
	});

	it("should initialize an app by name", function() {
		app.use('mail', child);
		assert.equal(child.name, 'mail');
	});

	it("should initialize an app", function() {
		child.name = 'test';
		app.use(child);
		assert.equal(child.name, 'test');                
	});

	it("should pass app to function middleware", function() {
		var ref = null;
		app.use(function(param) {
			ref = param;
		});
		assert.equal(app, ref);
	});
	
	
	
});
});
