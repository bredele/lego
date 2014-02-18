<h1>
  <a name="maple" class="anchor" href="#maple">
    <span class="octicon octicon-link"></span>
  </a>Maple <small style="color:#7f8c8d;">(3kb min+gzip)</small>
</h1>

MVVM micro library to create large scale and real time web applications in a flash.

[![Build Status](https://travis-ci.org/leafs/maple.png?branch=master)](https://travis-ci.org/leafs/maple)
[![Selenium Test Status](https://saucelabs.com/buildstatus/bredele)](https://saucelabs.com/u/bredele)

Maple.js makes it easy to create rich yet maintainable web interfaces by providing a set of composable and extensible components. It uses **declarative bindings** and **observers** to sync and update your UI with an underlying data model (or **store**). Maple.js has been built with business needs in mind and provides an **architectural pattern** to ease the creation of large scale applications.

<p align="center">
  <a href="http://leafs/github.io/maple" target="_blank" style="text-decoration: none;">
    <img width="100"src="http://leafs.github.io/maple/assets/bootstrap/logo.png">
  </a>
  <span style="color:#2c3e50;font-weight:bold;">Maple.js</span>
</p>


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

Check out all the examples at this [link](http://leafs.github.io/maple).

## Installation

  Install with [component](http://component.io):

    $ component install leafs/maple

## FAQ

### Is it different from other MVVM libraries?

### Why an Architecural pattern?


## License

The MIT License (MIT)

Copyright (c) 2014 Olivier Wietrich <olivier.wietrich@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
