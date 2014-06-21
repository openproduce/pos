var DB = {};

DB.items = [
  {id: 0,
   desc: 'georgia peach',
   costPerQty: '.89',
   saleUnit: 'lb',
   discontinued: false,
   plu: '',
   barcode: '',
   updatedAt: 1},
  {id: 1,
   desc: '2% milk',
   costPerQty: '4.49',
   saleUnit: 'ea',
   discontinued: false,
   plu: '',
   barcode: '',
   updatedAt: 1000},
  {id: 2,
   desc: 'black beans',
   costPerQty: '1.50',
   saleUnit: 'ea',
   discontinued: false,
   plu: '',
   barcode: '',
   updatedAt: 2000},
  {id: 3,
   desc: 'kidney beans',
   costPerQty: '1.50',
   saleUnit: 'ea',
   discontinued: false,
   plu: '',
   barcode: '',
   updatedAt: 3000},
  {id: 4,
   desc: 'pasta',
   costPerQty: '3.50',
   saleUnit: 'ea',
   discontinued: false,
   plu: '',
   barcode: '',
   updatedAt: 4000},
  {id: 5,
   desc: 'tab payment',
   costPerQty: '1.00',
   saleUnit: 'ea',
   discontinued: false,
   plu: '',
   barcode: '',
   updatedAt: 1},
  {id: 6,
   desc: 'discount',
   costPerQty: '-1.00',
   saleUnit: 'ea',
   discontinued: false,
   plu: '',
   barcode: '',
   updatedAt: 1}
];

DB.clerks = [
  {id: 0, name: 'Moe'},
  {id: 1, name: 'Larry'},
  {id: 2, name: 'Curly'}
];

DB.customers = [
  {id: 0,
   name: 'James Tiberius Kirk',
   phone: '555-1212',
   email: 'james.t.kirk@example.com',
   postal: '1503 Gooseberry Ln\n' + 'Iowa, US, Earth',
   balance: '213.00',
   limit: '100.00'},
  {id: 1,
   name: 'Barack Obama',
   phone: '555-1213',
   email: '',
   postal: '',
   balance: '-10.00',
   limit: '100000.00'},
  {id: 2,
   name: 'Alan Turing',
   phone: '',
   email: 'amt@example.com',
   postal: '',
   balance: '0',
   limit: '0'},
  {id: 3,
   name: 'Alonso Church',
   phone: '',
   email: 'church@example.com',
   postal: '',
   balance: '0',
   limit: '0'},
  {id: 4,
   name: 'Kurt Gödel',
   phone: '',
   email: 'goedel@example.com',
   postal: '',
   balance: '0',
   limit: '0'},
];

DB.saleItems = [
  {id: 0, saleId: 0, itemId: 4, qty: '1', subtotal: '3.50'},
  {id: 1, saleId: 0, itemId: 2, qty: '1', subtotal: '1.50'}
];

DB.sales = [
  {id: 0, startTime: 0, endTime: 200,
   total: '5.00', preTaxTotal: '4.50',
   clerkId: null, customerId: 0, isVoid: true, isPaid: true},
  {id: 1, startTime: 0, endTime: 500,
   total: '25.00', preTaxTotal: '4.50',
   clerkId: null, customerId: 0, isVoid: false, isPaid: true},
  {id: 2, startTime: 0, endTime: 500,
   total: '65.00', preTaxTotal: '4.50',
   clerkId: null, customerId: 0, isVoid: false, isPaid: true},
  {id: 3, startTime: 0, endTime: 500,
   total: '435.00', preTaxTotal: '4.50',
   clerkId: null, customerId: 0, isVoid: false, isPaid: true},
  {id: 4, startTime: 0, endTime: 500,
   total: '15.00', preTaxTotal: '4.50',
   clerkId: null, customerId: 0, isVoid: false, isPaid: true},
  {id: 5, startTime: 0, endTime: 500,
   total: '55.00', preTaxTotal: '4.50',
   clerkId: null, customerId: 0, isVoid: false, isPaid: true},
  {id: 6, startTime: 0, endTime: 500,
   total: '25.00', preTaxTotal: '4.50',
   clerkId: null, customerId: 0, isVoid: false, isPaid: true},
  {id: 7, startTime: 0, endTime: 500,
   total: '75.00', preTaxTotal: '4.50',
   clerkId: null, customerId: 0, isVoid: false, isPaid: true},
  {id: 8, startTime: 0, endTime: 500,
   total: '45.00', preTaxTotal: '4.50',
   clerkId: null, customerId: 0, isVoid: false, isPaid: true},
  {id: 9, startTime: 0, endTime: 500,
   total: '35.00', preTaxTotal: '4.50',
   clerkId: null, customerId: 0, isVoid: false, isPaid: true},
];

DB.saleItems.forEach(function(saleItem) {
  var items = DB.items.filter(function(item) {
    return item.id == saleItem.itemId;
  });
  if (items.length)
    saleItem.item = items[0];
});

DB.sales.forEach(function(sale) {
  sale.saleItems = DB.saleItems.filter(function(saleItem) {
    return saleItem.saleId == sale.id;
  });
});

DB.insertOrUpdate = function(table, newRow) {
  var maxId = 0;
  for (var i = 0, numRows = table.length; i < numRows; i++) {
    maxId = Math.max(table[i].id, maxId);
    if (table[i].id === newRow.id) {
      table[i] = newRow;
      return newRow;
    }
  }
  newRow.id = maxId + 1;
  table.push(newRow);
  return newRow;
};

DB.find = function(table, id) {
  for (var i = 0, numRows = table.length; i < numRows; i++)
    if (table[i].id === id)
      return table[i];
  return undefined;
};

exports.DB = DB;
