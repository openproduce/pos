import unittest
from webapp import app

class TestItems(unittest.TestCase):

  def setUp(self):
    self.client = app.test_client()

  def test_list_since(self):
    rv = self.client.get('/items/since/1234.json')
    self.assertEqual(rv.status_code, 200)
