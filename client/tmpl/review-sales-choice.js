// ReviewSalesChoiceTemplate renders a past sale in the review sales dialog list.
function ReviewSalesChoiceTemplate() {
}

ReviewSalesChoiceTemplate.prototype.fill = function(sale) {
  var data = {};
  if (sale.isVoid)
    data.className = 'review-sales-item-void';
  else
    data.className = 'review-sales-item-nonvoid';
  data.total = money(sale.total);
  data.date = date(sale.endTime);
  return fillTemplate(data, '<li class="{{className}}">' +
      '<div class="review-sales-item-total">{{total}}</div>' +
      '<div class="review-sales-item-date">{{date}}</div>');
};
