module('template');

test('fills templates', function() {
  equal('foo', fillTemplate({}, 'foo'));
  equal('foo bar', fillTemplate({s: 'bar'}, 'foo {{s}}'));
  equal('foo baz', fillTemplate({s: {t: 'baz'}}, 'foo {{s.t}}'));
  equal('foo quux', fillTemplate({s: {t: {u: 'quux'}}}, 'foo {{s.t.u}}'));
  equal('foo ', fillTemplate({}, 'foo {{bogus}}'));
  equal('foo ', fillTemplate({s: {t: 'baz'}}, 'foo {{s.bogus}}'));
});

test('formats money', function() {
  equal(money('2.56'), '$2.56');
  equal(money('-2.56'), '-$2.56');
  equal(money('2.589'), '$2.59');
  equal(money('-2.589'), '-$2.59');
});

test('zeropad pads with zeros', function() {
  equal(zeropad(24, 5), '00024');
  equal(zeropad('4', 2), '04');
  equal(zeropad(37, 1), '37');
});

test('formats dates', function() {
  equal(date(1327340460), '9:41am Mon 23 Jan 2012');
  equal(date(1361304000), '12:00pm Tue 19 Feb 2013');
  equal(date(1394075100), '7:05pm Wed 5 Mar 2014');
  equal(date(1397113200), '12:00am Thu 10 Apr 2014');
  equal(date(1212783780), '1:23pm Fri 6 Jun 2008');
  equal(date(1400944403), '8:13am Sat 24 May 2014');
  equal(date(1278597000), '6:50am Thu 8 Jul 2010');
  equal(date(1281275400), '6:50am Sun 8 Aug 2010');
  equal(date(1283972340), '11:59am Wed 8 Sep 2010');
  equal(date(1286607540), '11:59pm Fri 8 Oct 2010');
  equal(date(1289262600), '4:30pm Mon 8 Nov 2010');
  equal(date(1291795260), '12:01am Wed 8 Dec 2010');
});

test('dom getter', function() {
  var div = document.createElement('div');
  div.id = 'pants';
  document.body.appendChild(div);
  equal(dom('pants'), div);
  div.parentNode.removeChild(div);
});
