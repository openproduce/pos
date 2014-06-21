function assert(condition, message) {
  if (!condition) {
    console.error('assertion failed', message);
    throw message || 'Assertion failed.';
  }
}

function logError(err) {
  console.error(err.message);
}
