SELECT portfolio_id, asset_symbol, SUM(purchase_quantity),
SUM(purchase_quantity * purchase_price) / NULLIF(SUM(purchase_quantity), 0) AS avg_price,
SUM(purchase_quantity * purchase_price) AS cost_basis
FROM transactions
GROUP BY asset_symbol,portfolio_id;

/* 
portfolio_id | asset_symbol |   sum   |      avg_price      |  cost_basis
--------------+--------------+---------+---------------------+--------------
            3 | 2282.HK      |  -50000 | 32.0000000000000000 | -1600000.000
            1 | 0005.HK      |       0 |                     |  -150000.000
            3 | 0880.HK      |    9000 | 50.0000000000000000 |   450000.000
            3 | 2269.HK      |   50000 | 43.0000000000000000 |  2150000.000
            1 | 1810.HK      |   40000 | 16.3000000000000000 |   652000.000
            1 | 0992.HK      |   20000 |  5.0500000000000000 |   101000.000
            3 | 1929.HK      |   60000 |  6.0000000000000000 |   360000.000
            3 | 1211.HK      |   60000 | 42.0000000000000000 |  2520000.000
            2 | 1810.HK      |   90000 | 17.0000000000000000 |  1530000.000
            3 | 1938.HK      |  200000 |  1.2200000000000000 |   244000.000
            3 | 1716.HK      | -100000 |  3.0800000000000000 |  -308000.000
            3 | 1928.HK      |   60000 | 38.9166666666666667 |  2335000.000
            2 | 0005.HK      |   10000 | 55.0000000000000000 |   550000.000
 */