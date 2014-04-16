# Brick

  > Build your web application like a pro.

[![Build Status](https://travis-ci.org/bredele/brick-view.png?branch=master)](https://travis-ci.org/bredele/brick-view)  [![Selenium Test Status](https://saucelabs.com/buildstatus/bredele)](https://saucelabs.com/u/bredele)
<!-- Remember where you were young, how simple it was to stack few blocks of Lego to create your dream house? -->

Brick makes it easy to create rich yet maintainable web interfaces by providing a set of composable and extensible components. It uses [cement](http://github.com/bredele/cement) to sync and update your UI with an underlying data [store](http://github.com/bredele/datastore).


Brick has been built for [wall](http://github.com/bredele/wall), an express-like framework to ease the creation of maintainable and large scale application. Brick is simple, composable and easy to learn. 

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

  > Brick is still in an experimental stage and some improvement and new features are coming.

## Browser support

Let's face it, supporting IE8 is a pain but it's unfortunately still widely used in the industry. This is the reason why brick is fully tested and supports all mainstrean browsers, IE8 included.


<a class="requirebin-link" target="_blank" href="http://requirebin.com/?gist=10794588"><img src="http://requirebin.com/badge.png"></a>

IE7 requires the use of JSON and querySelector polyfill.    


## Concept

Let's be honnest, there is enough MV* libraries out there and some of them are actually really good. It's not brick's intent to replace them. Instead, it follows the UNIX spirit and provides tiny modules (or bricks) with single responsability. They do one thing and do it well! They are the minimal amount of glue you need to create the web application you want.

With equivalent features...

  * Observers
  * Models and Collections
  * Composable Views
  * Fast DOM rendering
  * Extendable Interpolation
  * Automatic DOM Binding
  * Extendable data-bindings (via jQuery-like plugins)
  * Event-bus Architectural pattern (lifecycle hooks, configs, debug, etc)
  * Loose coupling of modules
  * Composable and Reusable components
  * SVG binding
  * IE support

...Brickjs is probably one of the smallest (4kb gzip with require, 3kb without) and fastest implementation.

Performance matters, really, but we also think you should be able to test, maintain and reuse your code in other projects. That's why Brickjs is based on Commonjs components and offers an ecosystem of independant [bricks](https://github.com/bredele/brick/wiki) and [modules](http://component.io/). 

You can reuse its components outside of Brickjs itself, use them on server side with node.js or mix other components to get what you really need.

<!-- 
You should easily debug your code and if something goes wrong with it, it should not break your application. -->

Last but not least, Brick API is really simple and just few minutes are enough to get into it.

```html
<div>
  <style>
    .brick {
      background: {{ color }};
    }
  </style>
  <div class="brick"> {{ label }} </div>
</div>
```

```js
var view = brick(el, {
  color: 'red',
  label: 'Hello'
}).build();

//change label
view.set('label', 'World!');
```


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
