const express = require("express");

module.exports = class UserRouter {
    constructor(userService){
        this.userService = userService;
    }

    router(){
        let router = express.Router();
        router.get('/:email',this.getUserByEmail.bind(this));
        
        return router;
    }

    getUserByEmail(req,res){
        
    }
}