const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GooglePlusTokenStrategy = require('passport-google-oauth20');
const bcrypt = require('./bcrypt');
require('dotenv').config();
const knex = require('knex')({
    client: 'postgres',
    connection: {
        database: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    }
});

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use('local-login', new LocalStrategy(
        async (email, password, done) => {
            try{
                let users = await knex('users').where({email:email});
                if (users.length == 0) {
                    return done(null, false, { message: 'Incorrect credentials.' });
                }
                let user = users[0];
                
                let pwMatch = await bcrypt.checkPassword(password, user.password);
                if (pwMatch) {
                    return done(null, user);
                }else{
                    return done(null, false, { message: 'Incorrect credentials.' });
                }
            }catch(err){
                return done(err);
            }
        }
    ));

    passport.use('local-signup', new LocalStrategy(
        async (email, password, done) => {
            try{
                let users = await knex('users').where({email:email});
                if (users.length > 0) {
                    return done(null, false, { message: 'Email already taken' });
                }
                let hash = await bcrypt.hashPassword(password)
                let newUser = {
                    email:email,
                    password: hash
                };
                // console.log(hash);
                let userId = await knex('users').insert(newUser).returning('id');
                console.log(userId);
                newUser = {
                    email:email,
                    password:hash,
                    id:userId[0]
                }
                done(null,newUser);
            }catch(err){
                done(err);
            }
    
        })
    );

    passport.use('facebook', new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: `/auth/facebook/callback`
    },(accessToken, refreshToken, profile, cb)=>{
        
            return cb(null,{profile:profile,accessToken:accessToken});
        }
    )); 

    passport.use("googleToken",new GooglePlusTokenStrategy({
        clientID: process.env.GOOGLE_PLUS_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:"/auth/google/redirect"
    }, async(req, accessToken, refreshToken, profile, done)=> {
        try{
            let email =  profile.emails[0].value;
            let users = await knex('users').where({email:email});
            // If the email is not registered, this means new sign-up
            if (users.length === 0) {
                let userId = await knex('users').insert({email:email}).returning('id');
                return done(null, {email:email,id:userId[0]});
            }
            // if the email is registered, this is the existing user
            done(null,users[0]);
        } catch(err){
            done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        //check if user is already within the database
        //if no, make one

        //if yes, serialize
        done(null, user.id);
    });

    const deserializeUser = async (id, done) => {
      console.log('deserialize user id ', id);
      let users = await knex('users').where({ id: Number(id) });   // my own addition
      if (users.length == 0) {
        return done(new Error(`Wrong user id ${id}`));
      }
      let user = users[0];
      return done(null, user.email);
    };

    passport.deserializeUser(deserializeUser);

    return {
      deserializeUser: deserializeUser
    }
};