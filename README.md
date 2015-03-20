# rocambole-whitespace

Helpers to manipulate [rocambole](https://github.com/millermedeiros/rocambole)
`Indent` tokens.

Used mainly by [esformatter](https://github.com/millermedeiros/esformatter/) and its plugins.


## API

```js
var indent = require('rocambole-indent');
```

### setOptions(opts)

`setOptions` used to set the indent value.

```js
setOptions({
  // sets "value" used by `Indent` tokens (defaults to two spaces)
  value: '  '
});
```

### inBetween(startToken, endToken, level)

Increase/Decrease the indent level in between the `startToken` and `endToken`.

```js
// increase the indent level by 1
inBetween(node.startToken, node.endToken, 1);
// decrease the indent level by 1
inBetween(node.startToken, node.endToken, -1);
// zero does nothing
inBetween(node.endToken, 0);
```

**Important:** negative values only work if original `Indent` token contains
a `level` property since there is no reliable way to infer this value (probably
will only work if indent was added by this lib).

### line(token, level)

Increases/decreases the indent level at the begining of the line that includes
the given `token`.

```js
// adds 2 indents
line(node.startToken, 2);
// decrease indent level in 1 step
line(node.endToken, -1);
// zero does nothing
line(node.endToken, 0);
```

**Important:** negative values only work if original `Indent` token contains
a `level` property since there is no reliable way to infer this value (probably
will only work if indent was added by this lib).

### sanitize(astOrNode)

Removes any `Indent` tokens that doesn't have a `level` property (this is
usually the original indentation of the program parsed by rocambole) or that
are not at the begining of the line. It also updates all the `BlockComment` to
align the multiple lines.

```js
// sanitize a single node
sanitize(node);
// sanitize whole AST
sanitize(ast);
```

## Debug

This module uses [debug](https://www.npmjs.com/package/debug) internally. To
make it easier to identify what is wrong we sometimes run the esformatter tests
with a `DEBUG` flag, like:

```sh
DEBUG=rocambole:indent npm test
```

## License

Released under the MIT License

