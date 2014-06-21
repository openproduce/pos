// TabSaleChoiceTemplate renders a sale in the tab history dialog view.
function TabSaleChoiceTemplate() {
}

TabSaleChoiceTemplate.prototype.fill = function(sale) {
  var data = {};
  data.total = money(sale.total);
  return fillTemplate(data, '<li class="tab-history-sale-list-item">{{total}}');
};
