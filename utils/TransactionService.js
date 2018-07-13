const moment = require('moment');

module.exports = class TransactionService {
    constructor(knex){
        this.knex = knex;
    }

    getTran(tid){
        let query = this.knex.select().from('transactions')
        .where('id',tid);
        return query;
    }

    postTran(transaction){
        let buyOrSell;
        let tradePrice = +transaction["trade-price"];
        let volume;
        let tradeTime = moment(transaction["trade-date"]).toDate();
        switch (transaction["trade-type"]) {
            case "Buy":
                buyOrSell = 1;
                break;
            case "Sell":
                buyOrSell = 0;
                break;
        }
        if(buyOrSell===1){volume = +transaction.volume;}
        else{volume = -transaction.volume;}
        let addTran = this.knex('transactions').insert({
            asset_symbol : transaction.symbol,
            portfolio_id : transaction.portfolio,
            buy_sell : buyOrSell,
            purchase_price : tradePrice,
            purchase_quantity : volume,
            transaction_time : tradeTime
        });
        
        return addTran;
    }

    putTran(transaction,tid){
        let action = this.knex('transactions').where('id',tid)
        .update({
            
        });
    }

    deleteTran(tid){
        let action = this.knex('transactions').where('id',tid).del();
        return action;
    }

    checkPid(transaction){
        let checkPid = this.knex.select('id').from('portfolios').where('id',transaction.portfolio);
        return checkPid;
    }

    checkAsset(transaction){
        let checkAsset = this.knex.select('asset_symbol').from('assets').where('asset_symbol',transaction.symbol);
        return checkAsset;
    }

    getPortfolioId(tid) {
        let query = this.knex.select("portfolio_id").from('transactions').where('id',tid);
        return query;
    }

    listTransinP(portfolioId) {
        let query = this.knex.select("id","asset_symbol", "purchase_price", "purchase_quantity", "buy_sell", "transaction_time")
            .from("transactions").where("portfolio_id", portfolioId);
        return query;
    }
}