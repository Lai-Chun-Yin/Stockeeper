const yahooFinance = require('yahoo-finance');

module.exports = class StockService{
    constructor(knex){
        this.knex = knex;
    }

    getHistorical(){
        return new Promise((resolve, reject)=>{
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
        })
    }
}