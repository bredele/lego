# Brick

Brick reduces boilerplate by implementing amongst others, reactive one way binding.

```js
brick('<div>Hello ${ name }</div>', {
  name: 'olivier'
}, document.body);
```
see [live example]()

Brick doesn't stop there though. Despite its small size (2kb) it has a fair bit of power under the hood and a ridiculously small learning curve. 

## Learn BRICK in 5 minutes

<!-- ## Brick is your living data -->

### brick is a datastore

A brick is a datastore, a bloat-free layer to manipulate your data.

```js
var user = brick();
user.set('name','olivier');
user.set('age', 26);
user.get('name'); // => olivier
user.compute('birthday', function() {
  return this.name + 'is ' + this.age;
});
```
see [datastore](http://github.com/bredele/datastore) for full API.

### brick is an emitter

A brick is an observable. it allows you to publish/subscribe events and also to get notified when there has been a change of data or in its [state](#brick-is-a-state-machine).

```js
user.on('change birthday', function(val) { 
  // => olivier is 27
});
user.set('age', 27);
```

This notifications allows the brick to produce updated output and HTML.

see [emitter](http://github.com/component/emitter) for full API.

<!-- ## Brick is your living dom -->

### brick is reactive 

Brick intelligently updates your HTML whenever the underlying data changes.

```js
var user = brick('<div>${name} is ${age}</div>');
user.set('name', 'olivier');
user.set('age', 27);
```

It eliminates DOM manipulation from the list of things you have to worry about. Brick will also work with SVG nodes or even server side!

<!-- 
```html
<div class="twitter ${theme}">
	<p>${text}</p>
	<span>${ text.length } character${text.length > 0 ? 's' : ''}</span>
</div>
```
 -->
### brick is declarative

You also can extend existing DOM attributes or even create new ones with plugins.

```js
var user = brick('<a href="bredele"></a>');
link.attr('href', function(node, content) {
  node.href = 'http://github.com/' + content;
});
```

See [result on live]().

A plugin is as simple as a function but the possibilities are numerous. There is plugins to listen DOM events, synchronize a brick data with a database and more.


### brick is a state machine

Brick will notify you at different step of it's lifecycle.

```js
user.on('mounted', function() {
  // do something on mounted 
})
```

But that's not all! It is also a [finite state machine](http://en.wikipedia.org/wiki/Finite-state_machine), allowing you to create your own states and sequence of actions. 

```js
user.hook('present', 'sick', function() {
	// transition present -> absent on sick condition
}, 'absent');

user.emit('sick');
```

### brick is composable

What if developing an application was as easy as putting pieces of Lego together? With brick you can extend or create your own tags.

```js
var user = brick('<span>${name}</span>', {
	name: 'world'
});

var welcome = brick('<h1>Hello <user></user></h1>');
welcome.tag('user', user);
```

It follows the [web component](http://w3c.github.io/webcomponents/spec/custom/) syntax with the power of a simple and concise API.


### brick is reusable

An application is also made of reusable pieces. It's a bit like assembling Lego bricks of same shapes and colors:

```js
var lego = brick('<span>${color}</span>').mold();

var yellow = lego();
var green = lego();
var blue = lego();
```

No classes. You can create a brick and `mold` it anytime. Calling `mold` freezes a brick as well as its current state and data. 

## License

The MIT License (MIT)

Copyright (c) 2014 Olivier Wietrich <olivier.wietrich@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
