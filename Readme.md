# Maple :maple_leaf:

<!-- <h1>
  <a name="maple" class="anchor" href="#maple">
    <span class="octicon octicon-link"></span>
  </a>Maple <small style="color:#7f8c8d;">(3kb min+gzip)</small>
</h1> -->

MVVM micro library to create large scale and real time web applications in a flash.

> [![Build Status](https://travis-ci.org/leafs/maple.png?branch=master)](https://travis-ci.org/leafs/maple)
[![Selenium Test Status](https://saucelabs.com/buildstatus/bredele)](https://saucelabs.com/u/bredele) <small style="color:#7f8c8d;">(3kb min+gzip)</small>

Maple.js makes it easy to create rich yet maintainable web interfaces by providing a set of composable and extensible components. It uses **declarative bindings** and **observers** to sync and update your UI with an underlying data model (or **store**). Maple.js has been built with business needs in mind and provides an **architectural pattern** to ease the creation of large scale applications.

See [documentation](https://github.com/leafs/maple/wiki) for more information.

## Browser Support

Maple.js has no dependencies, is fully tested and support all mainstream browsers from IE8+.

[![Selenium Test Status](https://saucelabs.com/browser-matrix/bredele.svg)](https://saucelabs.com/u/bredele)

IE7 requires the use of JSON and querySelector polyfill.


## Concept and Features

Maple.js is not a framework and follows the node.js spirit by providing tiny modules with single responsability. They do one thing and do it well! They are the minimal amount of glue you need to create the web application you want.

  > Why go into debt to buy an expensive car with high fuel-cost when you can easily afford and **only need** a smaller and budget friendly car with superior performance.

With equivalent features...

  * Observers
  * Models and Collections
  * Composable Views
  * Batched and Fast DOM rendering
  * Extendable Interpolation (filters, partials, etc)
  * Automatic DOM Binding
  * Extendable data-bindings (via jQuery-like plugins)
  * Event-bus Architectural pattern (lifecycle hooks, configs, debug, etc)
  * Loose coupling of modules
  * Composable and Reusable components
  * SVG binding
  * IE support

...Maple.js is probably one of the smallest (3kb) and fastest implementation.

Performance matters, really, but we also think you should be able to test, maintain and reuse your code in other projects. That's why Maple.js is based on Commonjs components and offers an ecosystem of independant [plugins]() and [modules](http://component.io/). 

You can reuse its components outside of Maple.js itself, use them on server side with node.js or mix other components to get what you really need.

<!-- 
You should easily debug your code and if something goes wrong with it, it should not break your application. -->

Last but not least, Maple.js API is really simple and just few minutes are enough to get into it.

```html
<div class="todo">
  <input type="text" on-input="addTask">
  <ul list>
    <li class="{{ done ? 'crossed' : '' }}">{{ task }}</li>
  </ul>
</div>
```

```js
view()
  .data([{
    task: 'first todo task',
    done: false
  }])
  .plug('list', require('list-plug'))
  .el('.todo');
```

<a href="http://leafs.github.io/maple" target="_blank"><img src="https://runnable.com/external/styles/assets/runnablebtn.png" style="max-width:100%;"></a>

## Installation

  Install with [component](http://component.io):

    $ component install leafs/maple

## FAQ

### Is it different from other MVVM libraries?

In Maple.js, each view has its own bindings and set of plugins unlike some libraries where everything is contained in a global scope. This is important in order to avoid conflict, memory leaks and to maintain your code properly.

```js
view.plug('list', require('list-plug'));
```

As shown above, you can give a name to your plugins to avoid name conflicts when different views overlap. Your code is readable and also configurable! You can create your own plugins like jQuery (it's as easy as creating a function) and reuse them multiple times inside or outside of your application.

**[Inversion of controls](http://en.wikipedia.org/wiki/Inversion_of_control)** is one of the fundamental concepts of Maple.js. Some libraries tend to abstract everything under a single wrapper for the sake of simplicity : you have a view with built-in data bindings that creates a model layer from an object, etc. So what happens if you want to create an application that only processes data (no view)? How can you create a model and share it between multiple views? How can you have multiple models for a single view? etc.
Inversion of controls allows you to reuse every Maple.js component independently, to extend them and to control the lifecycle of everything in your application. That's what makes Maple.js easy and fast.

### Why support IE8?

Supporting IE8 is really not complicated and does not make Maple.js slower.
IE8 doesn't support `indexOf` and `trim` for example (see `lib/utils`). IE8 has shadow node attributes and doesn't support `data` (we use `nodeValue` in `lib/binding`).
Thats's pretty much it!

### Why an Architecural pattern?

The pattern has an express-like API and is inspired by this [article](http://www.slideshare.net/nzakas/scalable-javascript-application-architecture-2012). Iallows you to split your larger application into smaller pieces. Instead having a composite layout where you have a view in a view in a view (and keep references of every views), you have totally independant pieces (with single responsability) that communicate through an event hub. 

The main benefits are:
  * removing/adding or updating an app doesn't break the others
  * easier to test
  * easing to maintain
  * easier to reuse
  * memory safety

You'll see that it'll be easier to get back on your code when your application will become bigger and even a new team member could add, remove or update features in a flash. However. nothing forces you to use it.

## Get in Touch

- If you have a related project, plugin or tool, add it to the [Wiki page](https://github.com/leafs/maple/wiki/contributions)!
- Issues, questions & feature requests: [open an issue](https://github.com/leafs/maple/issues)
- Twitter: [@bredeleca](https://twitter.com/bredeleca)

## Changelog

See [release notes](https://github.com/leafs/maple/releases).

## License

The MIT License (MIT)

Copyright (c) 2014 Olivier Wietrich <olivier.wietrich@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
