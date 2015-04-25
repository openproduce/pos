// SaleItemTemplate renders an item rung up in the sale list.
function SaleItemTemplate() {
}

SaleItemTemplate.prototype.fill = function(saleItem) {
  var data = {};
  data.saleItem = saleItem;
  data.qtyLine = '';
  data.subtotal = money(saleItem.subtotal);
  if (saleItem.qty && saleItem.costPerQty) {
    data.qtyLine = saleItem.qty + ' @ ' +
      money(saleItem.costPerQty) + '/' + saleItem.saleUnit;
  }
  return fillTemplate(data,
    '<li class="sale-item">' +
      '<div class="sale-item-desc">{{saleItem.desc}}</div>' +
      '<div class="sale-item-quantity">{{qtyLine}}</div>' +
      '<div class="sale-item-price">{{subtotal}}</div>');
};
