# Brick

  > Compose your own MVVM library.

[![Build Status](https://travis-ci.org/bredele/brick-view.png?branch=master)](https://travis-ci.org/bredele/brick-view)  [![Selenium Test Status](https://saucelabs.com/buildstatus/bredele)](https://saucelabs.com/u/bredele) 
<!-- Remember where you were young, how simple it was to stack few blocks of Lego to create your dream house? -->

Brick makes it easy to create rich yet maintainable web interfaces by providing a set of composable and extensible components. It uses **[cement](http://github.com/bredele/cement)** to sync and update your UI with an underlying data **[store](http://github.com/bredele/datastore)**.


Brick has been built for **[wall](http://github.com/bredele/wall)**, an express-like framework to ease the creation of maintainable and large scale application. Brick is simple, composable and easy to learn. 

Give it a try you won't be disappointed!


## 10 seconds example

```js
var view = brick('<span>{{ name }}</span>', {
  name: 'bredele'
});

view.build(document.body);
```

<a href="http://bredele.github.com/brick-examples/" target="_blank"><img src="https://runnable.com/external/styles/assets/runnablebtn.png" style="width:67px;height:25px;"></a>

or play online

[![view on requirebin](http://requirebin.com/badge.png)](http://requirebin.com/?gist=10794588)

## Browser support

Supporting IE8 is a pain but it's unfortunately still widely used in the industry. This is the reason why brick is fully tested and supports all mainstrean browsers, IE8 included.


[![Selenium Test Status](https://saucelabs.com/browser-matrix/bredele.svg)](https://saucelabs.com/u/bredele)

IE7 requires the use of JSON and querySelector polyfill.    


## Plugins

Brick is also an ecosystem of plugins:

  - [events](http://github.com/bredele/gully) attach event handlers to your dom
  - [repeat](http://github.com/bredele/repeat-brick) repeat dom
  - [toggle and radio](http://github.com/bredele/control-brick) toggle or radio any dom elements
  - [input](http://github.com/bredele/input-brick) double way binding
  - [hidden](http://github.com/bredele/hidden-brick) hide your elements
  - [nodes](http://github.com/bredele/nodes-brick) reference your dom nodes
  - [stack](http://github.com/bredele/stack-brick) stack your dom nodes
  - [html](http://github.com/bredele/html-brick) set inner html
  - [attr](http://github.com/bredele/attr-brick) set html attribute

## Concept

Brick is that tiny piece (2.58kb gzip) that composes well. It follows the UNIX philosophy and provides simply just what you need. Everything else is a module (using [npm and browserify](http://browserify.org) or [component](http://github.com/component/component)) with single responsability that you can reuse at scale.

You can compose your owm framework. The possibilities are limitless and commonjs allows you to reuse functionnalities made by the community ([npm](https://www.npmjs.org/) or [component](http://component.io)) and stop duplicating your effort.

Event if brick is small, it has a fair bit of power under the hood:
  - observer/emitter
  - extendable models and collections
  - computed properties
  - localstorage
  - composable views
  - fast dom rendering
  - interpolation
  - filters
  - composable data bindings (aka plugins)
  - SVG binding
  - IE support
  - etc

Brick is also simple. Just a minute is enough to get into it:

```html
<div class="el">
  <style>
    .brick {
      background: {{ color }};
    }
  </style>
  <div class="brick"> {{ label }} </div>
</div>
```

```js
var view = brick('.el', {
  color: 'red',
  label: 'Hello'
}).build();

// change label
view.set('label', 'World!');
```

Let's be honnest, there is enough MV* libraries out there and some of them are actually really good. It's not brick's intent to replace them. Instead, brick's goal is to create an ecosytem of composable components to create rich and maintainable web applications in a flash.


## Installation

  with [component](http://github.com/component/component):

    $ component install bredele/brick

  with [nodejs/browserify](http://nodejs.org):

    $ npm install brickjs

## Documentation

  We are currently writing a new documentation but you can find the old one in the [wiki](https://github.com/bredele/brick/wiki).

## FAQ

### Is it different from other MVVM libraries?

In Brickjs, each view has its own bindings and set of plugins unlike some libraries where everything is contained in a global scope. This is important in order to avoid conflict, memory leaks and to maintain your code properly.

```js
view.add('repeat', require('repeat-brick'));
```

As shown above, you can give a name to your plugins to avoid name conflicts when different views overlap. Your code is readable and also configurable! You can create your own plugins like jQuery (it's as easy as creating a function) and reuse them multiple times inside or outside of your application.

### Why support IE8?

Supporting IE8 is really not complicated and does not make Brickjs slower.
IE8 doesn't support [`indexOf`]((http://github.com/component/indexof)) and [`trim`]((http://github.com/component/trim)). IE8 has shadow node attributes and doesn't support `data` (we use `nodeValue` in [`binding`]((http://github.com/bredele/binding))).
Thats's pretty much it!

### What is wall?


[Wall](http://github.com/bredele/wall) has an express-like API and is inspired by this [article](http://www.slideshare.net/nzakas/scalable-javascript-application-architecture-2012). It allows you to split your larger application into smaller pieces. Instead having a composite layout where you have a view in a view in a view (and keep references of every views), you have totally independant pieces (with single responsability) that communicate through an event hub. 

The main benefits are:
  * removing/adding or updating an app doesn't break the others
  * easier to test
  * easing to maintain
  * easier to reuse
  * memory safety

You'll see that it'll be easier to get back on your code when your application will become bigger and even a new team member could add, remove or update features in a flash. However. nothing forces you to use it.

## Get in Touch

- If you have a related project, plugin or tool, add it to the [Wiki page](https://github.com/bredele/brick/wiki/contributions)!
- Issues, questions & feature requests: [open an issue](https://github.com/bredele/brick/issues)
- Twitter: [@bredeleca](https://twitter.com/bredeleca)

## Changelog

See [release notes](https://github.com/bredele/brick/releases).    

## License

The MIT License (MIT)

Copyright (c) 2014 Olivier Wietrich <olivier.wietrich@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
