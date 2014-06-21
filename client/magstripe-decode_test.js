module('magstripe decoding');

test('stackoverflow example cards', function() {
  // Some examples taken from
  // http://stackoverflow.com/questions/16598500/where-can-i-find-magnetic-strip-track-test-data
  // Intended for checksum algorithm testing but still valid swipes.
  var card = decodeCreditCardMagstripe(';5301250070000191=08051010912345678901?3');
  equal(card.cardNumber, '5301250070000191', 'mastercard number');
  equal(card.expYear, '08', 'mastercard exp year');
  equal(card.expMonth, '05', 'mastercard exp month');
  ok(!card.customerName, 'mastercard no customer just track 2');

  card = decodeCreditCardMagstripe(';4539791001730106=08051010912345678901?;');
  equal(card.cardNumber, '4539791001730106', 'delta number');
  equal(card.expYear, '08', 'delta exp year');
  equal(card.expMonth, '05', 'delta exp month');
  ok(!card.customerName, 'delta no customer just track 2');

  card = decodeCreditCardMagstripe(';3540599999991043=080501234567?<');
  equal(card.cardNumber, '3540599999991043', 'jcb number');
  equal(card.expYear, '08', 'jcb exp year');
  equal(card.expMonth, '05', 'jcb exp month');
  ok(!card.customerName, 'jcb no customer just track 2');

  card = decodeCreditCardMagstripe(';490303340561001048=080510109123345678?3');
  equal(card.cardNumber, '490303340561001048', 'switch 2 number');
  equal(card.expYear, '08', 'switch 2 exp year');
  equal(card.expMonth, '05', 'switch 2 exp month');
  ok(!card.customerName, 'switch 2 no customer just track 2');
});

test('padilla example cards', function() {
  // Some examples from L Padilla:
  // http://www.gae.ucm.es/~padilla/extrawork/magexam1.html
  // MagTek reader doesn't include the LRC check digit at the end of the track.
  var visaTrack1 = '%B1234567890123445^PADILLA/L.                ^99011200000000000000**XXX******?';
  var visaTrack2 = ';1234567890123445=99011200XXXX00000000?';
  var visaTrack3 = ';011234567890123445=724724100000000000030300XXXX040400099010=************************==1=0000000000000000?';
  var card = decodeCreditCardMagstripe(visaTrack1 + visaTrack2 + visaTrack3);
  equal(card.cardNumber, '1234567890123445', 'visa card number');
  equal(card.expYear, '99', 'visa expiration year');
  equal(card.expMonth, '01', 'visa expiration month');
  equal(card.customerName, 'PADILLA/L.                ', 'visa customer name');
});

test('obfuscated bofa visa atm card', function() {
  var swipe = '%B4444444444444444^WIERZBICKI/JERED^1801101000000000044400444000000?;4444444444444444=18011010000000000444?';
  var card = decodeCreditCardMagstripe(swipe);
  equal(card.cardNumber, '4444444444444444', 'visa card number');
  equal(card.expYear, '18', 'visa exp year');
  equal(card.expMonth, '01', 'visa exp month');
  equal(card.customerName, 'WIERZBICKI/JERED', 'visa customer name');
});
