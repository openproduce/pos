import unittest
from webapp import app

class TestSales(unittest.TestCase):

  def setUp(self):
    self.client = app.test_client()

  def test_list_since(self):
    rv = self.client.get('/sales/since/1234.json')
    self.assertEqual(rv.status_code, 200)

  def test_list_for_customer(self):
    rv = self.client.get('/sales/for_customer/30d80fad-7a76-4cf6-a421-7771ef8a60ec.json')
    self.assertEqual(rv.status_code, 200)

  def test_create(self):
    rv = self.client.post('/sales.json')
    self.assertEqual(rv.status_code, 200)

  def test_set_customer(self):
    rv = self.client.put('/sales/2f30f6bf-ca06-472a-b22c-3866ec809648/set_customer/30d80fad-7a76-4cf6-a421-7771ef8a60ec.json')
    self.assertEqual(rv.status_code, 200)

  def test_clear_customer(self):
    rv = self.client.put('/sales/2f30f6bf-ca06-472a-b22c-3866ec809648/clear_customer.json')
    self.assertEqual(rv.status_code, 200)

  def test_set_clerk(self):
    rv = self.client.put('/sales/2f30f6bf-ca06-472a-b22c-3866ec809648/set_clerk/d5c4ebea-e338-413a-b0a4-58dca1542da9.json')
    self.assertEqual(rv.status_code, 200)

  def test_clear_clerk(self):
    rv = self.client.put('/sales/2f30f6bf-ca06-472a-b22c-3866ec809648/clear_clerk.json')
    self.assertEqual(rv.status_code, 200)

  def test_add_item(self):
    rv = self.client.patch('/sales/2f30f6bf-ca06-472a-b22c-3866ec809648/add_item.json')
    self.assertEqual(rv.status_code, 200)

  def test_remove_item(self):
    rv = self.client.patch('/sales/2f30f6bf-ca06-472a-b22c-3866ec809648/remove_item/1.json')
    self.assertEqual(rv.status_code, 200)

  def test_pay(self):
    rv = self.client.post('/sales/2f30f6bf-ca06-472a-b22c-3866ec809648/pay.json')
    self.assertEqual(rv.status_code, 200)

  def test_print_receipt(self):
    rv = self.client.get('/sales/2f30f6bf-ca06-472a-b22c-3866ec809648/print_receipt.json')
    self.assertEqual(rv.status_code, 200)

  def test_void(self):
    rv = self.client.put('/sales/2f30f6bf-ca06-472a-b22c-3866ec809648/void.json')
    self.assertEqual(rv.status_code, 200)

  def test_unvoid(self):
    rv = self.client.put('/sales/2f30f6bf-ca06-472a-b22c-3866ec809648/unvoid.json')
    self.assertEqual(rv.status_code, 200)
  
