module('input filter');

test('allows control codes', function() {
  var filter = new InputFilter({dom: {}, allowNumbers: false, allowDot: false});
  var canceled = false;
  filter.keydown({
    keyCode: 112,
    preventDefault: function() { canceled = true; }
  });
  ok(!canceled);
});
