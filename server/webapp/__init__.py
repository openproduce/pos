from flask import Flask
app = Flask(__name__)

import webapp.clerks
import webapp.customers
import webapp.items
import webapp.sales
