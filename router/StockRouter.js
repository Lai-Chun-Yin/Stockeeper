const express = require('express');

class StockRouter {
    // constructor(noteService) {
    //     this.noteService = noteService;
    // }
    constructor(view) {
        this.view = view;
    }

    router() {
        let router = express.Router();

        router.get('/', this.get.bind(this));
        router.post('/', this.post.bind(this));
        router.put('/:id', this.put.bind(this));
        router.delete('/:id', this.delete.bind(this));

        return router;
    }

    get(req, res) {
        // return this.noteService.list(req.auth.user)
        //     .then((notes) => res.json(notes))
        //     .catch((err) => res.status(500).json(err));
        // res.render(this.view);
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
