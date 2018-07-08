const fs = require('fs');

class portfolioService {
    constructor(file) {
        this.file = file;
    }

    init(){
        return null;
    }

    list() {
        // List all symbols in the portfolio
        return this.file;
    }

    remove() {
        // Remove symbols in the portfolio
        return null;
    }
}

module.exports = portfolioService;