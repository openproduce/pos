// TabSaleItemTemplate renders an item in a sale in the tab history dialog.
function TabSaleItemTemplate() {
}

TabSaleItemTemplate.prototype.fill = function(saleItem) {
  var data = {};
  data.desc = saleItem.desc;
  data.subtotal = money(saleItem.subtotal);
  return fillTemplate(data, '<li>{{desc}} - {{subtotal}}');
};
