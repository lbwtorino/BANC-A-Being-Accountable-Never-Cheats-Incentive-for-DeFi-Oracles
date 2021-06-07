import csv
import math
import numpy as np 
import time
from datetime import datetime
import json
import statistics
import argparse

gasPrice = []
receiptGasUsed = []


with open('./chainlayer.csv') as f:
    f_csv = csv.DictReader(f)
    for row in f_csv:
        gasPrice.append(float(row['gas_price']))
        receiptGasUsed.append(float(row['receipt_gas_used']))


print('avg gas:', np.mean(receiptGasUsed), 'max gas:', max(receiptGasUsed), 'min gas', min(receiptGasUsed))
print('avg gas price:', np.mean(gasPrice)/1000000000.0, 'max gas price:', max(gasPrice)/1000000000.0, 'min:', min(gasPrice)/1000000000.0)


