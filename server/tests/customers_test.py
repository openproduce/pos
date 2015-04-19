import unittest
from webapp import app

class TestCustomers(unittest.TestCase):

  def setUp(self):
    self.client = app.test_client()

  def test_list(self):
    rv = self.client.get('/customers.json')
    self.assertEqual(rv.status_code, 200)

  def test_add(self):
    rv = self.client.post('/customers.json')
    self.assertEqual(rv.status_code, 200)

  def test_update(self):
    rv = self.client.patch('/customers/30d80fad-7a76-4cf6-a421-7771ef8a60ec.json')
    self.assertEqual(rv.status_code, 200)

  def test_print_tab(self):
    rv = self.client.get('/customers/30d80fad-7a76-4cf6-a421-7771ef8a60ec/print_tab.json')
    self.assertEqual(rv.status_code, 200)
