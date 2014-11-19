# Brick

Brick reduces boilerplate by implementing amongst others, reactive one way binding.

```js
brick('<button>${ hello }</button>', {
  hello: 'bredele'
}).to(document.body);
```
see [live example]()

Brick doesn't stop there though. Despite its small size (2kb) it has a fair bit of power under the hood and a ridiculously small learning curve. 

## Learn BRICK in 5 minutes

<!-- ## Brick is your living data -->

### brick is a [datastore](http://github.com/bredele/datastore)

```js
var user = brick();
user.set('name','olivier');
user.set('gender','male');
user.get('name'); // => olivier
user.compute('hello', function() {
  return 'hello ' + this.name;
});
```
see [datastore](http://github.com/bredele/datastore) for full API.

### brick is an [emitter](http://github.com/component/emitter)

A brick is an observable and allows to get notified when there has been a change of data or in its [state]().

```js
user.on('change hello', function(val) { 
  // => hello bredele
});
user.set('name', 'bredele');

user.on('bruh', function() {
  // do something
});
user.emit('bruh');
```

This notifications allows the brick to produce updated output and HTML.

see [emitter](http://github.com/component/emitter) for full API.

<!-- ## Brick is your living dom -->

### brick automatically bind your dom

Brick has been built on top of [cement](http://github.com/bredele/cement) and [mouth](http://github.com/bredele/mouth). It substitutes every text node with the brick's data.

```js
user.from('<div class="${gender}">${hello}</div>');

user.set({
  gender: 'female',
  name: 'amy'
})
```
see [live example]()



## License

The MIT License (MIT)

Copyright (c) 2014 Olivier Wietrich <olivier.wietrich@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
