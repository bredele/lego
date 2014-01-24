#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander'),
    app = require('..');

// options

program
  .option('-p, --port <n>', 'set port number [8000]', parseInt)
  .parse(process.argv);

// title

process.title = 'skeleton';

// listen

var port = program.port || 3000;
app.listen(port);
console.log('application listening on port %d', port);