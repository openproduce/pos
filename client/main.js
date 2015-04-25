window.addEventListener('DOMContentLoaded', function() {
  var netController = new NetworkController({
    serverOrigin: '//localhost:8001'
  });
  var saleController = new SaleController({
    view: new SaleView({
      customer: dom('sale-customer'),
      customerName: dom('sale-customer-name'),
      list: dom('sale-list'),
      total: dom('sale-total-price')
    }),
    netController: netController
  });
  var pickerController = new PickerController({
    view: new PickerView({
      clerk: dom('picker-clerk-name'),
      time: dom('picker-time'),
      date: dom('picker-date'),
      price: dom('picker-price'),
      unit: dom('picker-price-unit'),
      quantity: dom('picker-quantity'),
      searchField: dom('picker-search-field'),
      list: dom('picker-list')
    }),
    saleController: saleController,
    netController: netController,
    pickCustomer: function() {
      return dialogController.pickCustomer();
    }
  });
  var magstripeReader = new MagstripeReader();
  var dialogController = new DialogController({
    mask: new DialogMaskView({
      mask: dom('dialog-mask')
    }),
    setClerk: function(clerk) {
      pickerController.setClerk(clerk);
      saleController.setClerk(clerk);
    },
    saleController: saleController,
    netController: netController,
    clearSale: function() {
      saleController.clear();
      pickerController.reset();
    },
    stealFocus: function() {
      keyController.focusDialog();
    },
    cedeFocus: function() {
      keyController.focusPicker();
    },
    magstripeReader: magstripeReader
  });
  var keyController = new KeyController({
    pickerController: pickerController,
    saleController: saleController,
    dialogController: dialogController,
    magstripeReader: magstripeReader
  });
});
