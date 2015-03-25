//jshint node:true, eqnull:true
'use strict';

var fs = require('fs');
var path = require('path');
var diff = require('diff');
var rocambole = require('rocambole');
var indent = require('../rocambole-indent');

formatAndCompare('align_comment-input.js', 'align_comment-output.js', function(ast) {
  // need to convert WhiteSpace tokens to Indent first so we can use the `level`
  var token = ast.startToken;
  while (token) {
    if (token.type === 'WhiteSpace') {
      indent.whiteSpaceToIndent(token, '  ');
    }
    token = token.next;
  }
  indent.alignComments(ast);
});

function formatAndCompare(inputFile, expectedFile, method) {
  var input = getFile(inputFile);
  var expected = getFile(expectedFile);
  var ast = rocambole.parse(input);
  method.call(indent, ast);
  var output = ast.toString();

  if (output !== expected) {
    process.stderr.write(diff.createPatch(expectedFile, expected, output));
    process.exit(1);
  } else {
    console.error('ok %s', inputFile);
  }
}

function getFile(name) {
  return fs.readFileSync(path.join(__dirname, name)).toString();
}
