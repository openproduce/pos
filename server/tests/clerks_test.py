import unittest
from webapp import app

class TestClerks(unittest.TestCase):

  def setUp(self):
    self.client = app.test_client()

  def test_list(self):
    rv = self.client.get('/clerks.json')
    self.assertEqual(rv.status_code, 200)
