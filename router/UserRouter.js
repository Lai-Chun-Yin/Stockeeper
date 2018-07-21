const express = require("express");

module.exports = class UserRouter {
    constructor(userService){
        this.userService = userService;
    }

    router(){
        let router = express.Router();
        router.get('',this.verifyUserByEmail.bind(this));
        
        return router;
    }

    verifyUserByEmail(req,res){
        this.userService.verifyUserByEmail(req.query.email)
        .then((result)=>{
            if(result.length>0){return res.json({check: "fail"})}
            else if(result.length===0){return res.json({check: "pass"})}
        })
    }
}