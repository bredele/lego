# Lego

  > Put the fun back into building web applications

[![Build Status](https://travis-ci.org/bredele/brick.png?branch=master)](https://travis-ci.org/bredele/brick)  [![Selenium Test Status](https://saucelabs.com/buildstatus/bredele)](https://saucelabs.com/u/bredele)
<!-- Remember where you were young, how simple it was to stack few blocks of Lego to create your dream house? -->

Lego.js makes it easy to create rich yet maintainable web interfaces by providing a set of composable and extensible components. It uses **declarative bindings** and **observers** to sync and update your UI with an underlying data model (or lego **store**).

Lego.js has been built with business needs in mind and provides an **architectural pattern** (or lego box) to ease the creation of large scale applications.


## 10 seconds example

```js
var view = lego('<span>{{name}}</span>', {
  name: 'bredele'
});

view.build(document.body);
```

## Browser support

Lego is fully tested and supports all mainstream browsers from IE8+.

[![Selenium Test Status](https://saucelabs.com/browser-matrix/bredele.svg)](https://saucelabs.com/u/bredele)

IE7 requires the use of JSON and querySelector polyfill.    


## Concept

## Installation

  with [component](http://github.com/component/component):

    $ component install bredele/lego

  with [nodejs](http://nodejs.org):

    $ npm install lego

## FAQ

### Is it different from other MVVM libraries?

In Lego.js, each view has its own bindings and set of plugins unlike some libraries where everything is contained in a global scope. This is important in order to avoid conflict, memory leaks and to maintain your code properly.

```js
view.add('repeat', require('repeat-brick'));
```

As shown above, you can give a name to your plugins to avoid name conflicts when different views overlap. Your code is readable and also configurable! You can create your own plugins like jQuery (it's as easy as creating a function) and reuse them multiple times inside or outside of your application.

### Why support IE8?

Supporting IE8 is really not complicated and does not make Lego.js slower.
IE8 doesn't support `[indexOf](http://github.com/component/indexof)` and `[trim](http://github.com/component/trim)`. IE8 has shadow node attributes and doesn't support `data` (we use `nodeValue` in `[binding](http://github.com/bredele/binding)`).
Thats's pretty much it!

### Why a Lego box?

The pattern has an express-like API and is inspired by this [article](http://www.slideshare.net/nzakas/scalable-javascript-application-architecture-2012). Iallows you to split your larger application into smaller pieces. Instead having a composite layout where you have a view in a view in a view (and keep references of every views), you have totally independant pieces (with single responsability) that communicate through an event hub. 

The main benefits are:
  * removing/adding or updating an app doesn't break the others
  * easier to test
  * easing to maintain
  * easier to reuse
  * memory safety

You'll see that it'll be easier to get back on your code when your application will become bigger and even a new team member could add, remove or update features in a flash. However. nothing forces you to use it.

## Get in Touch

- If you have a related project, plugin or tool, add it to the [Wiki page](https://github.com/bredele/lego/wiki/contributions)!
- Issues, questions & feature requests: [open an issue](https://github.com/bredele/lego/issues)
- Twitter: [@bredeleca](https://twitter.com/bredeleca)

## Changelog

See [release notes](https://github.com/bredele/lego/releases).    

## License

The MIT License (MIT)

Copyright (c) 2014 Olivier Wietrich <olivier.wietrich@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.