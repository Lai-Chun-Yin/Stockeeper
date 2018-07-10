const express = require("express");

module.exports = class PortfolioRouter {
    constructor(portfolioService){
        this.portfolioService = portfolioService;
    }

    router(){
        let router = express.Router();
        router.get('/',this.getPortfolios.bind(this));
        return router;
    }

    getPortfolios(req,res){
        return this.portfolioService.listPortfolios(req.session.passport.user)
        .then((results)=>res.json(results))
        .catch((err) => res.status(500).json(err));
    }
}