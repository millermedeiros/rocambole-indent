'use strict';

var debug = require('debug')('rocambole:indent');
var tk = require('rocambole-token');
var escapeRegExp = require('mout/string/escapeRegExp');
var repeat = require('mout/string/repeat');


// ---

var _opts = {
  value: '  '
};

// ---


exports.setOptions = function(opts) {
  _opts = opts;
};


exports.inBetween = indentInBetween;
function indentInBetween(startToken, endToken, level) {
  level = level != null ? level : 1;

  if (!level || (!startToken || !endToken) || startToken === endToken) {
    debug(
      '[inBetween] not going to indent. start: %s, end: %s, level: %s',
      startToken && startToken.value,
      endToken && endToken.value,
      level
    );
    return;
  }

  var token = startToken && startToken.next;
  while (token && token !== endToken) {
    if (tk.isBr(token.prev)) {
      line(token, level);
    }
    token = token.next;
  }
}


exports.line = line;
function line(token, level) {
  if (!level) {
    // zero is a noop
    return;
  }

  token = findStartOfLine(token);

  if (!token) {
    // we never indent empty lines!
    debug('[indent.before] can\'t find start of line');
    return;
  }

  var value = repeat(_opts.value, Math.abs(level));

  if (tk.isIndent(token)) {
    if (level > 0) {
      // if it's already an Indent we just bump the value & level
      token.value += value;
      token.level += level;
    } else {
      if (token.level + level <= 0) {
        tk.remove(token);
      } else {
        token.value = token.value.replace(value, '');
        token.level += level;
      }
    }
    return;
  }

  if (level < 1) {
    // we can't remove indent if previous token isn't an indent
    debug(
      '[before] we can\'t decrement if line doesn\'t start with Indent. token: %s, level: %s',
      token && token.value,
      level
    );
    return;
  }

  if (tk.isWs(token)) {
    // convert WhiteSpace token into Indent
    token.type = 'Indent';
    token.value = value;
    token.level = level;
    return;
  }

  // if regular token we add a new Indent before it
  tk.before(token, {
    type: 'Indent',
    value: value,
    level: level
  });

  if (token.type === 'BlockComment') {
    updateBlockComment(token);
  }
}

function findStartOfLine(token) {
  if (tk.isBr(token) && tk.isBr(token.prev)) {
    return null;
  }
  var prev = token.prev;
  while(true) {
    if (!prev || tk.isBr(prev)) {
      return token;
    }
    token = prev;
    prev = token.prev;
  }
}


exports.sanitize = sanitize;
function sanitize(astOrNode) {
  var token = astOrNode.startToken;
  var end = astOrNode.endToken && astOrNode.endToken.next;
  while (token && token !== end) {
    var next = token.next;
    if (isOriginalIndent(token)) {
      tk.remove(token);
    } else if (token.type === 'BlockComment') {
      updateBlockComment(token);
    }
    token = next;
  }
}


function isOriginalIndent(token) {
  // original indent don't have a "level" value
  // we also need to remove any indent that happens after a token that
  // isn't a line break (just in case these are added by mistake)
  return (token.type === 'WhiteSpace' && (!token.prev || tk.isBr(token.prev)) && !tk.isBr(token.next)) ||
    (token.type === 'Indent' && (token.level == null || !tk.isBr(token.prev)));
}


function updateBlockComment(comment) {
  var orig = new RegExp('([\\n\\r]+)' + escapeRegExp(comment.originalIndent || ''), 'gm');
  var update = comment.prev && comment.prev.type === 'Indent'? comment.prev.value : '';
  comment.raw = comment.raw.replace(orig, '$1' + update);
  // override the originalIndent so multiple consecutive calls still work as
  // expected
  comment.originalIndent = update;
}

