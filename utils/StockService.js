const yahooFinance = require('yahoo-finance');
const moment = require('moment');
const knex = require('knex');
const PortfolioService = require('./PortfolioService');
let portfolioService = new PortfolioService(knex);

module.exports = class StockService{
    constructor(knex){
        this.knex = knex;
    }

    getHistorical(stockSymbol){
        let nowTimeString = moment().format("YYYY-MM-DD");
        let threeYB4 = moment().subtract(3, 'years').format("YYYY-MM-DD");
        return new Promise((resolve, reject)=>{
            yahooFinance.historical({
                // symbols: ['0700.HK','1810.HK','0763.HK'],
                symbol: stockSymbol,
                from: threeYB4,
                to: nowTimeString,
                // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
              }, function (err, quotes) {
                if(err){reject(err);}
                resolve(quotes);
              });
        })
    }

    getCurrentPrice(stockSymbol){
        return portfolioService.updateStockPrice(stockSymbol);
    }
}