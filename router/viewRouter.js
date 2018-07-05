const passport = require('passport');

module.exports = (express) => {
    const router = express.Router();

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/login');
    }


    router.get('/', (req, res) => {
        res.render("index");
    });

    router.get('/login', (req, res) => {
        res.render("login");
    });

    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/welcome',
        failureRedirect: '/login',
        failureFlash: true
    }));

    router.get('/signup', (req,res)=>{
        res.render("signup");
    });

    router.post('/signup',passport.authenticate('local-signup', {
        successRedirect: '/welcome',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    router.get("/auth/facebook",passport.authenticate('facebook',{
        scope: ['user_friends', 'manage_pages'] 
    }));
    router.get("/auth/facebook/callback",passport.authenticate('facebook',{
        failureRedirect: "/"
    }),(req,res)=>res.redirect('/welcome'));

    router.get('/welcome',isLoggedIn, (req, res) => {
        res.render("welcome", { username: req.user.username });
    });

    router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    return router;
};