# rocambole-indent changelog

## v1.1.1 (2015-03-25)

 - fix `WhiteSpace` conversion into `Indent` inside `alignComments()`

## v1.1.0 (2015-03-25)

 - update `alignComments()` to consider `WhiteSpace` tokens at the begining of
   the line as `Indent` tokens as well
 - add `whiteSpaceToIndent()`

## v1.0.0 (2015-03-24)

 - add `alignComments()`
 - expose `updateBlockComment()`

## v0.2.0 (2015-03-20)

 - rename `line()` as `addLevel()`
 - change the way `inBetween()` loops through the `start` and `end` tokens
   (not inclusive)
 - `sanitize()` won't call `updateBlockComment()` since this is already handled
   by `addLevel()`

## v0.1.0 (2015-03-20)

 - initial release

