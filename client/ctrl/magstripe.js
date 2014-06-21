// MagstripeReader consumes keyboard events to receive data from a magstripe
// reader that emulates a USB keyboard. It does this even when it isn't time to
// swipe a card, so that swiping a card in random places in the UI doesn't send
// random keys and break it terribly. Documentation for a typical MagTek USB
// reader is at http://www.magtek.com/documentation/public/99875207-7.03.pdf
function MagstripeReader() {
  this.sentinelTimeoutId = -1;
  this.swipeTimeoutId = -1;
  this.sentinelEvent = null;
  this.ignoreNextKey = false;
  this.buf = [];
  this.onswipe = null;
};

// Max time to wait for next key event after the start sentinel. A MagTek USB
// reader sends about 15 keys in 30 ms, but real keyboards aren't this fast.
MagstripeReader.MAX_SENTINEL_MS = 30;

// Max total time to wait for a swipe. A MagTek USB reader sends two tracks of
// data in just over 200 ms, so really shouldn't take longer than this.
MagstripeReader.MAX_SWIPE_MS = 1000;

// keydown intercepts key data from the magstripe reader.
// The reader sends a start sentinel '%', a bunch of data, and then an enter
// key. Data arrival is timed to distinguish the case where the user types '%'.
// Returns true if the key was consumed and false if not.
MagstripeReader.prototype.keydown = function(e) {
  if (this.ignoreNextKey) {
    this.ignoreNextKey = false;
    return;
  }
  var key = decodeKey(e);
  if (this.buf.length) {
    // In the middle of a swipe.
    this.clearSentinelTimeout();
    this.sentinelEvent = null;
    if (key.enter) {
      // End sentinel.
      this.clearSwipeTimeout();
      this.finishSwipe();
    } else if (key.ascii) {
      // Readers also send e.g. shift keys, we only care about the data.
      this.buf.push(key.ascii);
    }
  } else if (key.ascii == '%') {
    // Start sentinel.
    this.sentinelTimeoutId = setTimeout(
        this.resendSentinel.bind(this), MagstripeReader.MAX_SENTINEL_MS);
    this.swipeTimeoutId = setTimeout(
        this.cancelSwipe.bind(this), MagstripeReader.MAX_SWIPE_MS);
    this.sentinelEvent = e;
    this.buf = ['%'];
  }
  if (this.buf.length) {
    e.preventDefault();
    return true;
  }
  return false;
};

// resendSentinel triggers when there's too long a pause after the sentinel
// character for it to have been sent by the magstripe reader.
MagstripeReader.prototype.resendSentinel = function() {
  this.sentinelTimeoutId = -1;
  this.cancelSwipe();
  // The user and not the magstripe reader probably typed the sentinel key.
  // Logically, we should re-dispatch the key and ignore it this time.
  // Unfortunately, the original key event has been canceled, and synthesizing
  // a new keypress is an act of such alchemical erudition that four browsers
  // implement three standards for it differently on each platform, and I can't
  // get even one of them to work. Instead, we're going to cheat.
  var target = this.sentinelEvent.target;
  if (target == document.activeElement &&
      target.selectionStart == target.selectionEnd &&
      target.selectionStart == target.value.length) {
    // Append a % and trigger keydown to update search fields.
    target.value = target.value + '%';
    this.ignoreNextKey = true;
    target.dispatchEvent(this.sentinelEvent);
  }
};

// cancelSwipe triggers when the card reader has taken too long to send data.
// Either it's flaking out, or the user typed the sentinel and then another
// character rapidly enough that we thought it was card data.
MagstripeReader.prototype.cancelSwipe = function() {
  this.clearSentinelTimeout();
  this.clearSwipeTimeout();
  this.buf = [];
};

// clearSentinelTimeout cancels the sentinel-to-data timeout.
MagstripeReader.prototype.clearSentinelTimeout = function() {
  if (this.sentinelTimeoutId != -1) {
    clearTimeout(this.sentinelTimeoutId);
    this.sentinelTimeoutId = -1;
  }
};

// clearSwipeTimeout cancels the overall swipe timeout.
MagstripeReader.prototype.clearSwipeTimeout = function() {
  if (this.swipeTimeoutId != -1) {
    clearTimeout(this.swipeTimeoutId);
    this.swipeTimeoutId = -1;
  }
};

// finishSwipe is called when an end sentinel (enter) is received.
MagstripeReader.prototype.finishSwipe = function() {
  if (this.onswipe) {
    this.onswipe(decodeCreditCardMagstripe(this.buf.join('')));
  }
  this.buf = [];
};

// bind sets a callback to call with card info.
MagstripeReader.prototype.bind = function(onswipe) {
  this.onswipe = onswipe;
};

// unbind removes the callback to call with card info.
MagstripeReader.prototype.unbind = function() {
  this.onswipe = null;
};
