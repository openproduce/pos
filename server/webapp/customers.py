from webapp import app

@app.route('/customers.json', methods=['GET', 'POST'])
def list_or_add():
  return 'TODO'

@app.route('/customers/<int:customer_id>.json', methods=['PATCH'])
def edit(customer_id):
  return 'TODO'

@app.route('/customers/<int:customer_id>/print_tab.json')
def print_tab(customer_id):
  return 'TODO'
