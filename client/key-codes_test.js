module('keyboard decoding');

test('ignores control keys', function() {
  var key = decodeKey({metaKey: true});
  deepEqual(key, {control: true}, 'meta key combo');
  key = decodeKey({altKey: true});
  deepEqual(key, {control: true}, 'alt key combo');
  key = decodeKey({ctrlKey: true, keyCode: 0});
  deepEqual(key, {control: true}, 'ctrl key combo');
});

test('decodes function keys', function() {
  for (var i = 1; i < 10; i++) {
    var key = decodeKey({ctrlKey: true, keyCode: 48 + i});
    deepEqual(key, {fkey: i}, 'ctrl+' + i + ' maps to f' + i);
    key = decodeKey({keyCode: 111 + i});
    deepEqual(key, {fkey: i}, 'f' + i + ' decoded properly');
  }
});

test('decodes alphanumeric', function() {
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function(character) {
    var key = decodeKey({keyCode: character.charCodeAt(0)});
    deepEqual(key, {ascii: character.toLowerCase()});
  });
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function(character) {
    var key = decodeKey({shiftKey: true, keyCode: character.charCodeAt(0)});
    deepEqual(key, {ascii: character});
  });
  for (var i = 0; i < 10; i++)
    deepEqual(decodeKey({keyCode: 96 + i}), {ascii: i + ''});
});

test('decodes symbols above numbers', function() {
  var syms = '!@#$%^&*()';
  var nums = '1234567890';
  nums.split('').forEach(function(character, i) {
    var key = decodeKey({shiftKey: true, keyCode: character.charCodeAt(0)});
    deepEqual(key, {ascii: syms[i]});
  });
});

test('decodes symbol keys', function() {
  // Following chromium/src/ui/events/keycodes/keyboard_code_conversion.cc
  deepEqual(decodeKey({keyCode: 0x6a}), {ascii: '*'});
  deepEqual(decodeKey({keyCode: 0x6b}), {ascii: '+'});
  deepEqual(decodeKey({keyCode: 0x6d}), {ascii: '-'});
  deepEqual(decodeKey({keyCode: 0x6e}), {ascii: '.'});
  deepEqual(decodeKey({keyCode: 0x6f}), {ascii: '/'});
  deepEqual(decodeKey({keyCode: 0x20}), {ascii: ' '});
  deepEqual(decodeKey({keyCode: 0xba}), {ascii: ';'});
  deepEqual(decodeKey({shiftKey: true, keyCode: 0xba}), {ascii: ':'});
  deepEqual(decodeKey({keyCode: 0xbb}), {ascii: '='});
  deepEqual(decodeKey({shiftKey: true, keyCode: 0xbb}), {ascii: '+'});
  deepEqual(decodeKey({keyCode: 0xbc}), {ascii: ','});
  deepEqual(decodeKey({shiftKey: true, keyCode: 0xbc}), {ascii: '<'});
  deepEqual(decodeKey({keyCode: 0xbd}), {ascii: '-'});
  deepEqual(decodeKey({shiftKey: true, keyCode: 0xbd}), {ascii: '_'});
  deepEqual(decodeKey({keyCode: 0xbe}), {ascii: '.'});
  deepEqual(decodeKey({shiftKey: true, keyCode: 0xbe}), {ascii: '>'});
  deepEqual(decodeKey({keyCode: 0xbf}), {ascii: '/'});
  deepEqual(decodeKey({shiftKey: true, keyCode: 0xbf}), {ascii: '?'});
  deepEqual(decodeKey({keyCode: 0xc0}), {ascii: '`'});
  deepEqual(decodeKey({shiftKey: true, keyCode: 0xc0}), {ascii: '~'});
  deepEqual(decodeKey({keyCode: 0xdb}), {ascii: '['});
  deepEqual(decodeKey({shiftKey: true, keyCode: 0xdb}), {ascii: '{'});
  deepEqual(decodeKey({keyCode: 0xdc}), {ascii: '\\'});
  deepEqual(decodeKey({shiftKey: true, keyCode: 0xdc}), {ascii: '|'});
  deepEqual(decodeKey({keyCode: 0xdd}), {ascii: ']'});
  deepEqual(decodeKey({shiftKey: true, keyCode: 0xdd}), {ascii: '}'});
  deepEqual(decodeKey({keyCode: 0xde}), {ascii: '\''});
  deepEqual(decodeKey({shiftKey: true, keyCode: 0xde}), {ascii: '"'});
});

test('decodes special control keys', function() {
  deepEqual(decodeKey({keyCode: 8}), {backspace: true});
  deepEqual(decodeKey({keyCode: 9}), {tab: true});
  deepEqual(decodeKey({keyCode: 13}), {enter: true});
  deepEqual(decodeKey({keyCode: 16}), {shift: true});
  deepEqual(decodeKey({keyCode: 27}), {esc: true});
  deepEqual(decodeKey({keyCode: 37}), {left: true});
  deepEqual(decodeKey({keyCode: 38}), {up: true});
  deepEqual(decodeKey({keyCode: 39}), {right: true});
  deepEqual(decodeKey({keyCode: 40}), {down: true});
  deepEqual(decodeKey({keyCode: 46}), {del: true});
});

test('ignores unknown keys', function() {
  deepEqual(decodeKey({keyCode: 0}), {unknown: true});
});
