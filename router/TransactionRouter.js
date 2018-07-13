const express = require("express");

module.exports = class TransactionRouter {
    constructor(transactionService){
        this.transactionService = transactionService;
    }

    router(){
        let router = express.Router();
        router.get('/:tid',this.getTran.bind(this));
        router.post('/',this.postTran.bind(this));
        router.put('/:tid',this.putTran.bind(this));
        router.delete('/:tid',this.deleteTran.bind(this));
        return router;
    }

    getTran(req,res){
        return this.transactionService.getTran(req.params.tid)
        .then((results)=>res.json(results))
        .catch((err) => res.status(500).json(err));
    }

    postTran(req,res){
        //check if portfolio_id and asset_symbol exist first
        let checkPid = this.transactionService.checkPid(req.body);
        let checkAsset = this.transactionService.checkAsset(req.body);
        
        Promise.all([checkPid,checkAsset]).then((arrayOfResults)=>{
            if(arrayOfResults[0].length===0||arrayOfResults[1].length===0){
                throw ('Portfolio or asset does not exist.')
            }
            return this.transactionService.postTran(req.body);
        }).then((result)=>{
            res.redirect('/search');
        }).catch((err) => res.status(500).json(err));
    }

    putTran(req,res){
        return this.transactionService.putTran(req.params.tid);
    }

    deleteTran(req,res){
        let portfolioId;
        this.transactionService.getPortfolioId(req.params.tid)
        .then((result)=>{
            portfolioId = result[0].portfolio_id;
            return this.transactionService.deleteTran(req.params.tid)
        }).then(()=>{
            return this.transactionService.listTransinP(portfolioId)
        }).then((transactions)=>{
            res.json(transactions);
        }).catch((err) => res.status(500).json(err));
    }
}