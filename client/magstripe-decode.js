// decodeMagstripe extracts credit card info from a magstripe. If track 1
// format B is present, use that, else try to use track 2. See
// http://en.wikipedia.org/wiki/Magnetic_stripe_card#Financial_cards
function decodeCreditCardMagstripe(data) {
  if (!data || !data.match)
    return null;
  var track1 = data.match(/^%B(\d{1,19})\^([^^]{2,26})\^(\d\d)(\d\d)[^?]*\?/);
  if (track1 && track1.length == 5) {
    return new CreditCard({
      cardNumber: track1[1],
      customerName: track1[2],
      expYear: track1[3],
      expMonth: track1[4]});
  }
  var track2 = data.match(/;(\d{1,19})=(\d\d)(\d\d)[^?]*\?/);
  if (track2 && track2.length == 4) {
    return new CreditCard({
      cardNumber: track2[1],
      customerName: null,
      expYear: track2[2],
      expMonth: track2[3]});
  }
  return null;
}
