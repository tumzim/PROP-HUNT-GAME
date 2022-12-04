const e = require('express');
const { request } = require('express')
const passport = require('passport')
const localStrategy = require('passport-local')

//handle user registering  
passport.use('signup', new localStrategy.Strategy({
    usernameField: 'email',
    passwordfield: 'password',
    passReqToCallback: true,
}, (req, email, password, done) => {
    console.log(email, password);
    console.log(req.body)

    const { username } = req.body;
    username && username !== "error" ? done(null, { name: "Luffy" }) : done(new Error('invalid user'))
}))

//handle user login
passport.use('login', new localStrategy.Strategy({
    usernameField: 'email',
    passwordfield: 'password',
}, (email, password, done) => {
    if (email !== "luffy@onepiece.com") {
        return done(new Error('user not found'), false)
    }
    if (password !== "test") {
        return done(new Error('password is wrong'), false)
    }

    return done(null, { name: 'Luffy' })
}))


/**
 * when user sends post req to login endpoint - user and pass field is sent
 * that will be used to validate + authenticate user
 */