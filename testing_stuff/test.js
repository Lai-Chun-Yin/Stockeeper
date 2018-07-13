const StockService = require('../utils/StockService');

(async () => {
  let ss = new StockService();
  let price = await ss.getCurrentPrice('0700.HK').price;
  console.log(price.regularMarketPrice);
})()
