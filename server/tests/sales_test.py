import unittest
from webapp import app

class TestSales(unittest.TestCase):

  def setUp(self):
    self.client = app.test_client()

  def test_list_since(self):
    rv = self.client.get('/sales/since/1234.json')
    self.assertEqual(rv.status_code, 200)

  def test_list_for_customer(self):
    rv = self.client.get('/sales/for_customer/42.json')
    self.assertEqual(rv.status_code, 200)

  def test_create(self):
    rv = self.client.post('/sales.json')
    self.assertEqual(rv.status_code, 200)

  def test_set_customer(self):
    rv = self.client.put('/sales/0/set_customer/1.json')
    self.assertEqual(rv.status_code, 200)

  def test_clear_customer(self):
    rv = self.client.put('/sales/0/clear_customer.json')
    self.assertEqual(rv.status_code, 200)

  def test_set_clerk(self):
    rv = self.client.put('/sales/0/set_clerk/1.json')
    self.assertEqual(rv.status_code, 200)

  def test_clear_clerk(self):
    rv = self.client.put('/sales/0/clear_clerk.json')
    self.assertEqual(rv.status_code, 200)

  def test_add_item(self):
    rv = self.client.patch('/sales/0/add_item.json')
    self.assertEqual(rv.status_code, 200)

  def test_remove_item(self):
    rv = self.client.patch('/sales/0/remove_item/1.json')
    self.assertEqual(rv.status_code, 200)

  def test_pay(self):
    rv = self.client.post('/sales/0/pay.json')
    self.assertEqual(rv.status_code, 200)

  def test_print_receipt(self):
    rv = self.client.get('/sales/0/print_receipt.json')
    self.assertEqual(rv.status_code, 200)

  def test_void(self):
    rv = self.client.put('/sales/0/void.json')
    self.assertEqual(rv.status_code, 200)

  def test_unvoid(self):
    rv = self.client.put('/sales/0/unvoid.json')
    self.assertEqual(rv.status_code, 200)
  
