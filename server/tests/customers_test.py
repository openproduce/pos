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
    rv = self.client.patch('/customers/42.json')
    self.assertEqual(rv.status_code, 200)

  def test_print_tab(self):
    rv = self.client.get('/customers/42/print_tab.json')
    self.assertEqual(rv.status_code, 200)
