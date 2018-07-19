const passport = require('passport');
const knexConfig = require('../knexfile').development;
const knex = require('knex')(knexConfig);
const PortfolioService = require('../utils/PortfolioService');
let ps = new PortfolioService(knex);

module.exports = (express) => {
    const router = express.Router();
    let portfoList = [];

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
          // as soon as user logged in, retrieve portfolio list
          ps.listPortfolios(req.session.passport.user).then((result) => {
            portfoList = result;
          })  
          return next();
        }

        res.redirect('/login');
    }


    router.get('/',isLoggedIn, (req, res) => {
        res.render("index", {
            pageTitle: 'Index',
            pageID: 'index',
            portfoList: portfoList
        });
    });

    router.get('/login', (req, res) => {
        res.render('login', {
            pageTitle: 'Login',
            pageID: 'login',
        });
    });

    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/index',
        failureRedirect: '/login',
        failureFlash: true // Disable flash
    }));

    router.get('/signup', (req,res)=>{
        res.render('signup', {
            pageTitle: 'Signup',
            pageID: 'signup'
        });
    });

    router.post('/signup',passport.authenticate('local-signup', {
        successRedirect: '/index',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    router.get("/auth/facebook",passport.authenticate('facebook',{
        scope: ['user_friends', 'manage_pages'] 
    }));
    router.get("/auth/facebook/callback",passport.authenticate('facebook',{
        failureRedirect: "/"
    }),(req,res)=>res.redirect('/welcome'));

    router.get('/index',isLoggedIn, (req, res) => {
        res.render("index", { 
          username: req.user.username,
          pageTitle: 'Index',
          pageID: 'index',
          portfoList: portfoList
        });
    });

    router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    router.get('/home', function(req, res){
        res.render('home', {
            pageTitle: 'Home',
            pageID: 'home',
            portfoList: portfoList
        });
    });
    router.get('/search',isLoggedIn, function(req, res){
        res.render('search', {
            pageTitle: 'Search',
            pageID: 'search',
            portfoList: portfoList
        });
    });

    router.get('/portfolio',isLoggedIn, function(req,res){
      ps.listPortfolios(req.session.passport.user).then((result) => {
        res.render('portfolio', {
            pageTitle: 'Portfolio',
            pageID: 'portfolio',
            portfoList: portfoList
          });
        })
    });

    router.get('/chat',isLoggedIn, function(req,res){
      res.render('chat', {
          pageTitle: 'Chat Room',
          pageID: 'chat',
          portfoList: portfoList
        });
    });

    router.get('/stock/:symbol',isLoggedIn,function(req,res){
        res.render('stock',{symbol:req.params.symbol})
    });

    router.get('/addTran/:symbol',isLoggedIn, function(req,res){
        res.render('addTran',{symbol:req.params.symbol})
    });

    return router;
};