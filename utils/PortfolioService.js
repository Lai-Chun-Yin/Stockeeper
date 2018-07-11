const yahooFinance = require('yahoo-finance');

module.exports = class PortfolioService {
    constructor(knex) {
        this.knex = knex;
    }

    listPortfolios(userId) {
        let query = this.knex.select("id", "name").from("portfolios")
            .where("user_id", userId);
        return query;
    }

    listTransinP(portfolioId) {
        let query = this.knex.select("asset_symbol", "purchase_price", "purchase_quantity", "buy_sell", "transaction_time")
            .from("transactions").where("portfolio_id", portfolioId);
        return query;
    }

    getStockPositions(portfolioId) {
        let query = this.knex.select("asset_symbol", this.knex.raw('SUM(purchase_quantity)')).from('transactions')
            .where("portfolio_id", portfolioId).groupBy('asset_symbol');
        return query;
    }

    updateStockPrice(stocks) {
        let stockSymbols = stocks;
        if (!Array.isArray(stocks)) { stockSymbols = [stocks]; }
        return this.getPriceFromYahoo(stockSymbols);
        // .then((listOfPrice) => {   
        //     return listOfPrice;
        // }).catch((err) => {
        //     console.log(err);
        //     return Promise.all(stockSymbols.map((stockSymbol) => {
        //         return getPriceFromDB(stockSymbol);
        //     }));
        // })

    }

    getPriceFromDB(stockSymbol) {
        return this.knex.select('current_price').from('assets')
            .where("asset_symbol", stockSymbol);
    }

    getPriceFromYahoo(stockSymbols) {
        return new Promise((resolve, reject) => {
            yahooFinance.quote({
                symbols: stockSymbols,
                modules: ['price']
            }, function (err, quotes) {
                if (err) { reject(err); }
                let arrayOfPrice = [];
                for (let symbol in quotes) {
                    arrayOfPrice.push(quotes[symbol].price.regularMarketPrice);
                }
                resolve(arrayOfPrice);
            });
        });
    }
}