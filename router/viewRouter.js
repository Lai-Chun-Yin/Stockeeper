const passport = require('passport');

module.exports = (express) => {
    const router = express.Router();

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/login');
    }


    router.get('/',isLoggedIn, (req, res) => {
        res.render("index", {
            pageTitle: 'Index',
            pageID: 'index'
        });
    });

    router.get('/login', (req, res) => {
        res.render('login', {
            pageTitle: 'Login',
            pageID: 'login'
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
        });
        console.log(req.session.passport.user);
    });

    router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    router.get('/home', function(req, res){
        res.render('home', {
            pageTitle: 'Home',
            pageID: 'home'
        });
    });
    router.get('/search',isLoggedIn, function(req, res){
        res.render('search', {
            pageTitle: 'Search',
            pageID: 'search'
        });
    });

    router.get('/portfolio',isLoggedIn, function(req,res){
        res.render('portfolio', {
            pageTitle: 'Portfolio',
            pageID: 'portfolio'
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