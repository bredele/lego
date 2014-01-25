build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components assets

run: components
	@NODE_PATH=server NODE_ENV=development ./bin/run.js

.PHONY: clean
