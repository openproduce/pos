// CustomerChoiceTemplate renders a customer in the customers dialog list.
function CustomerChoiceTemplate() {
}

CustomerChoiceTemplate.prototype.fill = function(customer) {
  var data = {};
  data.name = customer.name;
  data.balance = money(customer.balance);
  return fillTemplate(data, '<li class="customer-list-row">' +
      '<span class="customer-list-name">{{name}}</span>' +
      '<span class="customer-list-balance">{{balance}}</span>');
};
