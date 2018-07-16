const express = require('express');

class StockRouter {
    constructor(stockService) {
        this.stockService = stockService;
    }

    router() {
        let router = express.Router();

        router.get('/', this.getStockList.bind(this));
        router.get('/:symbol', this.getStockDetails.bind(this));
        // router.put('/:id', this.put.bind(this));
        // router.delete('/:id', this.delete.bind(this));

        return router;
    }

    getStockDetails(req, res) {
        let objOfResults;
        return Promise.all([this.stockService.getHistorical(req.params.symbol),
        this.stockService.getCurrentPrice(req.params.symbol)])
        .then((arrayOfResults)=>{
            
            objOfResults = {
                Historical: arrayOfResults[0],
                Current: arrayOfResults[1].price
            }
            res.json(objOfResults);
        })
        .catch((err) => res.status(500).json(err));
    }

    getStockList(req, res) {
        let clearList = {};
        let header=[
            {
                "name": "asset_symbol",
                "title": "Symbol",
                "sortable": true,
                "sortDir": "asc",
            },
            {
                "name": "currency",
                "title": "Title",
                "sortable": true,
                "sortDir": "asc"
            },
            {
                "name":"quantity_per_hand",
                "title": "Quantity per hand",
                "sortable": true,
                "sortDir": "asc"
            },
            {
                "name":"name",
                "title": "Stock name",
                "sortable": true,
                "sortDir": "asc"
            }
        ];
        clearList.header = header;
        clearList.data = [];
        clearList.footer = header;
        return this.stockService.getStockList()
        .then((stockList) => {
            stockList.forEach((stock)=>{
                let indArray = [];
                indArray.push(stock.asset_symbol);
                indArray.push(stock.currency);
                indArray.push(stock.quantity_per_hand);
                indArray.push(stock.name);
                clearList.data.push(indArray);
            })
            res.json(clearList);})
        .catch((err) => res.status(500).json(err));
    }

    put(req, res) {
        // return this.noteService.update(req.params.id, req.body.note, req.auth.user)
        //     .then(() => this.noteService.list(req.auth.user))
        //     .then((notes) => res.json(notes))
        //     .catch((err) => res.status(500).json(err));
    }

    delete(req, res) {
        // return this.noteService.remove(req.params.id, req.auth.user)
        //     .then(() => this.noteService.list(req.auth.user))
        //     .then((notes) => res.json(notes))
        //     .catch((err) => res.status(500).json(err));
    }
}

module.exports = StockRouter;
