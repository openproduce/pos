from webapp import app

@app.route('/sales/since/<int:unixtime>.json', endpoint='sales_since')
def list_since(unixtime):
  return 'TODO'

@app.route('/sales/for_customer/<int:customer_id>.json')
def list_for_customer(customer_id):
  return 'TODO'

@app.route('/sales.json', methods=['POST'])
def create():
  return 'TODO'
  
@app.route('/sales/<int:sale_id>/set_customer/<int:customer_id>.json', methods=['PUT'])
def set_customer(sale_id, customer_id):
  return 'TODO'

@app.route('/sales/<int:sale_id>/clear_customer.json', methods=['PUT'])
def clear_customer(sale_id):
  return 'TODO'

@app.route('/sales/<int:sale_id>/set_clerk/<int:clerk_id>.json', methods=['PUT'])
def set_clerk(sale_id, clerk_id):
  return 'TODO'

@app.route('/sales/<int:sale_id>/clear_clerk.json', methods=['PUT'])
def clear_clerk(sale_id):
  return 'TODO'

@app.route('/sales/<int:sale_id>/add_item.json', methods=['PATCH'])
def add_item(sale_id):
  return 'TODO'

@app.route('/sales/<int:sale_id>/remove_item/<int:sale_item_id>.json', methods=['PATCH'])
def remove_item(sale_id, sale_item_id):
  return 'TODO'

@app.route('/sales/<int:sale_id>/pay.json', methods=['POST'])
def pay(sale_id):
  return 'TODO'

@app.route('/sales/<int:sale_id>/print_receipt.json')
def print_receipt(sale_id):
  return 'TODO'

@app.route('/sales/<int:sale_id>/void.json', methods=['PUT'])
def void(sale_id):
  return 'TODO'

@app.route('/sales/<int:sale_id>/unvoid.json', methods=['PUT'])
def unvoid(sale_id):
  return 'TODO'
