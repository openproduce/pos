// fillTemplate expands simple html templates. It replaces moustache-escaped
// literals like '{{field}}' in the template string with data.field in the
// given data object. It understands dotted paths like {{item.desc}} to mean
// data.item.desc.
function fillTemplate(data, template) {
  return template.replace(/({{)([.\w]+)(}})/g, function(_, _, path, _) {
    var value = path.split('.').reduce(function(obj, prop) {
      return obj[prop] || '';
    }, data);
    return value || '';
  });
}

// money formats a decimal value, which may be positive or negative, as dollars.
function money(value) {
  var decimal = Big(value);
  return decimal.lt(0) ? '-$' + decimal.abs().toFixed(2) : '$' + decimal.toFixed(2);
}

// zeropad prepends leading zeroes to a number to make it n digits long.
function zeropad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

// date formats a unix timestamp (NB: not a Javascript timestamp) for a human.
// The format is supposed to be easily scannable in a time-ordered list of
// recent dates, and doesn't follow any locale convention.
function date(unixTime) {
  var d = new Date(1000 * unixTime);
  var hours = (d.getHours() % 12) || '12';
  var mins = zeropad(d.getMinutes(), 2);
  var timePart = hours + ':' + mins + (d.getHours() >= 12 ? 'pm' : 'am');
  var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var datePart = dayNames[d.getDay()] + ' ' +
      d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear();
  return timePart + ' ' + datePart;
}

// dom is shorthand for getElementById.
function dom(name) {
  return document.getElementById(name);
}
