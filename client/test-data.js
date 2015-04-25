var DB = {};

DB.items = [
  {id: '2ccc972b-bc0b-48f1-a5d2-24505fc153b9',
   desc: 'georgia peach',
   costPerQty: '.89',
   saleUnit: 'lb',
   discontinued: false,
   plu: '',
   barcodes: [],
   updatedAt: 1},
  {id: '2d984048-4a79-4054-b0be-3ba2eaf0e6ac',
   desc: '2% milk',
   costPerQty: '4.49',
   saleUnit: 'ea',
   discontinued: false,
   plu: '',
   barcodes: [],
   updatedAt: 1000},
  {id: '7c65346c-d013-4a96-85ce-24c4990ce5d5',
   desc: 'black beans',
   costPerQty: '1.50',
   saleUnit: 'ea',
   discontinued: false,
   plu: '',
   barcodes: [],
   updatedAt: 2000},
  {id: '183f4b60-e5de-41ab-8785-2370afb3b4d6',
   desc: 'kidney beans',
   costPerQty: '1.50',
   saleUnit: 'ea',
   discontinued: false,
   plu: '',
   barcodes: [],
   updatedAt: 3000},
  {id: '0f95f07c-e7f1-4fb0-94f5-66301460c675',
   desc: 'pasta',
   costPerQty: '3.50',
   saleUnit: 'ea',
   discontinued: false,
   plu: '',
   barcodes: [],
   updatedAt: 4000},
  {id: 'c8fe1e9a-c353-4861-99f6-901ebe134f5e',
   desc: 'tab payment',
   costPerQty: '1.00',
   saleUnit: 'ea',
   discontinued: false,
   plu: '',
   barcodes: [],
   updatedAt: 1},
  {id: '4c0c7f49-43df-4afd-9b17-adf276df8c99',
   desc: 'discount',
   costPerQty: '-1.00',
   saleUnit: 'ea',
   discontinued: false,
   plu: '',
   barcodes: [],
   updatedAt: 1},
  {id: '7f27c764-1fff-495a-9d84-f9c8cc82586a',
   desc: 'random can of olives',
   costPerQty: '10.00',
   saleUnit: 'ea',
   discontinued: false,
   plu: '',
   barcodes: ['021130470167'],
   updatedAt: 1},
];

DB.clerks = [
  {id: '4c201c5d-a30b-4786-96ba-f1403cb19e0b',
   name: 'Moe'},
  {id: '7c162815-2d06-4332-b11d-699a91fe5161',
   name: 'Larry'},
  {id: 'b8730ab1-1033-402a-9d17-dd791b07f220',
   name: 'Curly'}
];

DB.customers = [
  {id: 'e6b1feed-c766-4fa0-be0c-e70b36ddb19e',
   name: 'James Tiberius Kirk',
   phone: '555-1212',
   email: 'james.t.kirk@example.com',
   postal: '1503 Gooseberry Ln\n' + 'Iowa, US, Earth',
   balance: '213.00',
   limit: '100.00'},
  {id: 'ad249067-6999-4fa0-be36-d423e89c19f6',
   name: 'Barack Obama',
   phone: '555-1213',
   email: '',
   postal: '',
   balance: '-10.00',
   limit: '100000.00'},
  {id: '14d653b9-d9a8-45ff-8dd3-4a99b3f191fe',
   name: 'Alan Turing',
   phone: '',
   email: 'amt@example.com',
   postal: '',
   balance: '0',
   limit: '0'},
  {id: '7104c630-8f5d-4165-948f-8e4d4319722d',
   name: 'Alonso Church',
   phone: '',
   email: 'church@example.com',
   postal: '',
   balance: '0',
   limit: '0'},
  {id: 'da536f29-bb9f-4a88-8c0a-3156aa032425',
   name: 'Kurt Gödel',
   phone: '',
   email: 'goedel@example.com',
   postal: '',
   balance: '0',
   limit: '0'},
];

DB.saleItems = [
  {id: '29c9c123-e4a1-460a-a388-6113641fc584',
   saleId: 'f4471c9c-1c2d-4898-88ec-3e79653bc6cf',
   itemId: '0f95f07c-e7f1-4fb0-94f5-66301460c675',
   desc: 'pasta',
   costPerQty: '3.50',
   saleUnit: 'ea',
   qty: '1',
   subtotal: '3.50'},
  {id: '98b1e205-a9bd-4e6f-bf28-608d6a05a105',
   saleId: 'f4471c9c-1c2d-4898-88ec-3e79653bc6cf',
   itemId: '7c65346c-d013-4a96-85ce-24c4990ce5d5',
   desc: 'black beans',
   costPerQty: '1.50',
   saleUnit: 'ea',
   qty: '1',
   subtotal: '1.50'}
];

DB.sales = [
  {id: 'f4471c9c-1c2d-4898-88ec-3e79653bc6cf',
   startTime: 0,
   endTime: 200,
   total: '5.00',
   preTaxTotal: '4.50',
   clerkId: null,
   customerId: 'e6b1feed-c766-4fa0-be0c-e70b36ddb19e',
   isVoid: true,
   isPaid: true},
  {id: '0109b0e4-e76f-448a-9b21-045abfb72a8a',
   startTime: 0,
   endTime: 500,
   total: '25.00',
   preTaxTotal: '4.50',
   clerkId: null,
   customerId: 'e6b1feed-c766-4fa0-be0c-e70b36ddb19e',
   isVoid: false,
   isPaid: true},
  {id: '4f26e8d7-4569-440a-aeec-1411cf5dd771',
   startTime: 0,
   endTime: 500,
   total: '65.00',
   preTaxTotal: '4.50',
   clerkId: null,
   customerId: 'e6b1feed-c766-4fa0-be0c-e70b36ddb19e',
   isVoid: false,
   isPaid: true},
  {id: '5c7d0fe0-ab1a-447a-849c-9eaee86ea6c6',
   startTime: 0,
   endTime: 500,
   total: '435.00',
   preTaxTotal: '4.50',
   clerkId: null,
   customerId: 'e6b1feed-c766-4fa0-be0c-e70b36ddb19e',
   isVoid: false,
   isPaid: true},
  {id: 'a0957649-50ea-48c3-88d8-45cfdc070596',
   startTime: 0,
   endTime: 500,
   total: '15.00',
   preTaxTotal: '4.50',
   clerkId: null,
   customerId: 'e6b1feed-c766-4fa0-be0c-e70b36ddb19e',
   isVoid: false,
   isPaid: true},
  {id: '8c166815-3ca3-4086-9f8d-c14fc8883539',
   startTime: 0,
   endTime: 500,
   total: '55.00',
   preTaxTotal: '4.50',
   clerkId: null,
   customerId: 'e6b1feed-c766-4fa0-be0c-e70b36ddb19e',
   isVoid: false,
   isPaid: true},
  {id: '976c83b3-2a54-4a35-9a73-5aba3c6b8766',
   startTime: 0,
   endTime: 500,
   total: '25.00',
   preTaxTotal: '4.50',
   clerkId: null,
   customerId: 'e6b1feed-c766-4fa0-be0c-e70b36ddb19e',
   isVoid: false,
   isPaid: true},
  {id: 'ccfac4c8-4d50-45b0-96e5-0af33522a989',
   startTime: 0,
   endTime: 500,
   total: '75.00',
   preTaxTotal: '4.50',
   clerkId: null,
   customerId: 'e6b1feed-c766-4fa0-be0c-e70b36ddb19e',
   isVoid: false,
   isPaid: true},
  {id: 'aa5cd731-b107-47cb-b196-3483e289b406',
   startTime: 0,
   endTime: 500,
   total: '45.00',
   preTaxTotal: '4.50',
   clerkId: null,
   customerId: 'e6b1feed-c766-4fa0-be0c-e70b36ddb19e',
   isVoid: false,
   isPaid: true},
  {id: '6803911c-debe-4be3-a578-5094a43d347d',
   startTime: 0,
   endTime: 500,
   total: '35.00',
   preTaxTotal: '4.50',
   clerkId: null,
   customerId: 'e6b1feed-c766-4fa0-be0c-e70b36ddb19e',
   isVoid: false,
   isPaid: true},
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
  for (var i = 0, numRows = table.length; i < numRows; i++) {
    if (table[i].id === newRow.id) {
      table[i] = newRow;
      return newRow;
    }
  }
  newRow.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/(.)/g, function(m, p) {
    return p == 'x' ? '0123456789abcdef'[~~(Math.random()*16)] :
           p == 'y' ? '89ab'[~~(Math.random()*4)] : p;
  });
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
