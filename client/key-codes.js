var SpecialKeys = {
  8: 'backspace',
  9: 'tab',
  13: 'enter',
  16: 'shift',  // Sent by magstripe reader before shifted characters.
  27: 'esc',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  46: 'del'
};

// decodeKey divines from a keydown KeyboardEvent what key the user has down.
// This is harder than you might think. See http://unixpapa.com/js/key.html or
// the source code of your favorite open source browser.
function decodeKey(e) {
  // Don't even try to decode control keys.
  if (e.metaKey || e.altKey)
    return {control: true};
  if (e.ctrlKey) {
    // Map ctrl+1..ctrl+9 to function keys since some keyboards lack them.
    if (e.keyCode > 48 && e.keyCode <= 57)
      return {fkey: e.keyCode - 48};
    return {control: true};
  }

  // Decode the normal printable ASCII characters you can easily type on a
  // standard US keyboard (or might get from a magstripe reader).
  if (e.keyCode == 32)
    return {ascii: ' '};
  if (e.keyCode >= 48 && e.keyCode <= 57) {
    // Digits and the symbols that share their keys.
    if (e.shiftKey)
      return {ascii: ')!@#$%^&*('[e.keyCode - 48]};
    return {ascii: String.fromCharCode(e.keyCode)};
  }
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    // Letters.
    // Assume shift means uppercase. That's backwards if caps lock is on, but
    // Javascript has no idea about caps lock.
    return {ascii: String.fromCharCode(e.shiftKey ? e.keyCode : e.keyCode + 32)};
  }
  if (e.keyCode >= 96 && e.keyCode <= 105) {
    // Number pad keys with numlock on.
    return {ascii: String.fromCharCode(e.keyCode - 48)};
  }
  if (e.keyCode == 107)
    return {ascii: '+'};
  if (e.keyCode == 106)
    return {ascii: '*'};
  if (e.keyCode == 111)
    return {ascii: '/'};
  if (e.keyCode == 110)
    return {ascii: '.'};
  if (e.keyCode == 59 || e.keyCode == 186)
    return {ascii: e.shiftKey ? ':' : ';'};
  if (e.keyCode == 61 || e.keyCode == 187)
    return {ascii: e.shiftKey ? '+' : '='};
  if (e.keyCode == 188)
    return {ascii: e.shiftKey ? '<' : ','};
  if (e.keyCode == 109 || e.keyCode == 189)
    return {ascii: e.shiftKey ? '_' : '-'};
  if (e.keyCode == 190)
    return {ascii: e.shiftKey ? '>' : '.'};
  if (e.keyCode == 191)
    return {ascii: e.shiftKey ? '?' : '/'};
  if (e.keyCode == 192)
    return {ascii: e.shiftKey ? '~' : '`'};
  if (e.keyCode == 219)
    return {ascii: e.shiftKey ? '{' : '['};
  if (e.keyCode == 220)
    return {ascii: e.shiftKey ? '|' : '\\'};
  if (e.keyCode == 221)
    return {ascii: e.shiftKey ? '}' : ']'};
  if (e.keyCode == 222)
    return {ascii: e.shiftKey ? '"' : '\''};

  // Decode some specific special characters we care about for our UI.
  if (e.keyCode >= 112 && e.keyCode <= 123) {
    // Map function keys to {func: 1..12}.
    return {fkey: e.keyCode - 111};
  }
  var name = SpecialKeys[e.keyCode];
  if (name) {
    var key = {};
    key[name] = true;
    return key;
  }

  // Give up.
  return {unknown: true};
};
