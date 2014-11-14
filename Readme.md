# Brick

## Brick is your living data

### brick is a [datastore](http://github.com/bredele/datastore)

```js
var user = brick();
user.set('first','olivier');
user.set('city','calgary');
user.get('first');
user.compute('hello', function() {
  return 'hello ' + this.first;
});
```
see [datastore](http://github.com/bredele/datastore) for full API.

### brick is an [emitter](http://github.com/component/emitter)

A brick is an observable. You can subscribe for any change of data or publish your own events.

```js
user.on('change hello', function(val) { 
  // => hello bredele
});
user.set('first', 'bredele');

user.emit('bruh');
```

## Brick is your living dom

### brick automatically bind your dome


```js

```

## License

The MIT License (MIT)

Copyright (c) 2014 Olivier Wietrich <olivier.wietrich@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
