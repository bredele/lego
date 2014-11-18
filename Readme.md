# Brick

Brick reduces boilerplate and implement amongst others, reactive one way binding.

```js
brick('<button>{{ hello }}</button>', {
  name: 'bredele'
}).to(document.body);
```

Brick doesn't stop there though. 

<!--Despite its small size (3kb) Brick allows you to create or extend attributes, create or extend elements and way more.-->



<!--It put aside the concept of MVC-->

<!--What if MVC is not the right solution? It's more an architectural pattern and a UI library should not force you-->

## Brick is your living data

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

A brick is an observable. You can subscribe for any change of data or publish your own events.

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

## Brick is your living dom

### brick automatically bind your dom

Brick has been built on top of [cement](http://github.com/bredele/cement) and substite every text node with the brick's data.

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
