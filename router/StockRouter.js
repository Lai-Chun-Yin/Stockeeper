const express = require('express');

class StockRouter {
    constructor(stockService) {
        this.stockService = stockService;
    }

    router() {
        let router = express.Router();

        router.get('/:symbol', this.getStockDetails.bind(this));
        // router.post('/', this.post.bind(this));
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

    post(req, res) {
        // return this.noteService.add(req.body.note, req.auth.user)
        //     .then(() => this.noteService.list(req.auth.user))
        //     .then((notes) => res.json(notes))
        //     .catch((err) => res.status(500).json(err));
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
