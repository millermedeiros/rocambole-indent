// next
switch (foo) {
  // next
  case bar:
    // next
    baz();
    // this should be aligned with previous line since comment block is
    // followed by an empty line

  // next
  case biz:
    // next
    what();
// next
}
// previous

// next
function empty(
  // > indent
  // > indent
)
// next
// next
{
  // > indent
  // > indent
}
// prev

function empty2() {
  if (foo) {
    // >> indent
  }
}

// prev
