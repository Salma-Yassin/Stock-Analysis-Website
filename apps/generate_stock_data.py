import json
import random

def generate_stock_data():
    stock_symbols = ["AAPL", "GOOG", "MSFT", "AMZN", "FB", "TSLA", "NFLX", "NVDA", "PYPL", "ADBE",
                     "INTC", "CSCO", "CRM", "V", "MA", "JPM", "BAC", "WFC", "XOM", "CVX"]
    
    stock_data = {}
    for symbol in stock_symbols:
        stock_data[symbol] = {
            "financialData": {
                "maxAge": 86400,
                "currentPrice": {
                    "raw": 100 + random.uniform(-10, 10),
                    "fmt": "{:.2f}".format(100 + random.uniform(-10, 10))
                },
                "targetHighPrice": {
                    "raw": 150 + random.uniform(-10, 10),
                    "fmt": "{:.2f}".format(150 + random.uniform(-10, 10))
                },
                "targetLowPrice": {
                    "raw": 50 + random.uniform(-10, 10),
                    "fmt": "{:.2f}".format(50 + random.uniform(-10, 10))
                },
                "targetMeanPrice": {
                    "raw": 100 + random.uniform(-10, 10),
                    "fmt": "{:.2f}".format(100 + random.uniform(-10, 10))
                },
                "targetMedianPrice": {
                    "raw": 100 + random.uniform(-10, 10),
                    "fmt": "{:.2f}".format(100 + random.uniform(-10, 10))
                },
                "recommendationMean": {
                    "raw": 2 + random.uniform(-0.5, 0.5),
                    "fmt": "{:.2f}".format(2 + random.uniform(-0.5, 0.5))
                },
                "recommendationKey": "buy"
            }
        }
    
    return stock_data