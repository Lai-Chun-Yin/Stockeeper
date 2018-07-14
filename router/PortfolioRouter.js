const express = require("express");

module.exports = class PortfolioRouter {
    constructor(portfolioService){
        this.portfolioService = portfolioService;
    }

    router(){
        let router = express.Router();
        router.get('/',this.getPortfolios.bind(this));
        router.get('/:id',this.getTransactions.bind(this));
        router.post('/',this.addPortfolio.bind(this));
        router.put('/:id',this.putPortfolio.bind(this));
        router.delete('/:id',this.deletePortfolio.bind(this));
        return router;
    }

    getPortfolios(req,res){
        return this.portfolioService.listPortfolios(req.session.passport.user)
        .then((results)=>res.json(results))
        .catch((err) => res.status(500).json(err));
    }

    getTransactions(req,res){
        let objOfResults;
        return Promise.all([this.portfolioService.listTransinP(req.params.id),
            this.portfolioService.getStockPositions(req.params.id)])
        .then((arrayOfResults)=>{
            
            objOfResults = {
                transactions: arrayOfResults[0],
                positions: arrayOfResults[1]
            }
            
            let stockList = [];
            for (let i=0;i<objOfResults.positions.length;i++){
                stockList.push(objOfResults.positions[i].asset_symbol);
            }
            return this.portfolioService.updateStockPrice(stockList);
            
        }).then((listOfPrice)=>{
            
            for (let i=0;i<objOfResults.positions.length;i++){
                objOfResults.positions[i].current_price = listOfPrice[i];
            }
            res.json(objOfResults);
        })
        .catch((err)=> res.status(500).json(err));
    }

    addPortfolio(req,res){
        return this.portfolioService.addPortfolio(req.session.passport.user,req.body.name)
        .then(()=>{return this.portfolioService.listPortfolios(req.session.passport.user)})
        .then((results)=>res.json(results))
        .catch((err) => res.status(500).json(err));
    }

    putPortfolio(req,res){
        return this.portfolioService.putPortfolio(req.params.id,req.body.name)
        .then(()=>{return this.portfolioService.listPortfolios(req.session.passport.user)})
        .then((results)=>res.json(results))
        .catch((err) => res.status(500).json(err));
    }

    deletePortfolio(req,res){
        return this.portfolioService.deletePortfolio(req.params.id)
        .then(()=>{return this.portfolioService.listPortfolios(req.session.passport.user)})
        .then((results)=>res.json(results))
        .catch((err) => res.status(500).json(err));
    }
}