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
        let volume = +transaction.volume;
        let tradeTime = moment(transaction["trade-date"]).toDate();
        switch (transaction.trade_type) {
            case "Buy":
                buyOrSell = true;
                break;
            case "Sell":
                buyOrSell = false;
                break;
        }
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
}