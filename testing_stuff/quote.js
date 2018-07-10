const yahooFinance = require('yahoo-finance');

/* 
yahooFinance.historical({
  symbols: ['0700.HK','1810.HK','0763.HK'],
  // symbol: '0700.HK',
  from: '2018-07-05',
  to: '2018-07-10',
  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
}, function (err, quotes) {
  //...
  console.log(quotes);
});
 */



yahooFinance.quote({
  // symbol: '0700.HK',
  symbols: ['0005.HK','1398.HK','0700.HK','0763.HK','1810.HK','9983.T','AAPL', 'ASML.AS'],
  modules: [ 'price'] // see the docs for the full list
}, function (err, quotes) {
  // ...
  for (let symbol in quotes) {
    console.log(symbol, quotes[symbol].price.currency, quotes[symbol].price.regularMarketPrice);
  }
});

