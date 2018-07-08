const express = require("express");

module.exports = class PortfolioRouter {
    constructor(portfolioService){
        this.portfolioService = portfolioService;
    }

    router(){
        let router = express.Router();
        router.get('/portfolio',this.getPortfolios.bind(this));

    }

    getPortfolios(req,res){
        return this.portfolioService
    }
}