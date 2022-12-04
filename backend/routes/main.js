const { request, response } = require('express')
const express = require('express')
const passport = require('passport')
const router = express.Router()//new express router instance



//signup route
router.post("/signup", passport.authenticate('signup', { session: false }), (req, res) => {
    // console.log(req.body)
    if (!req.body) {
        res.status(400).json({ message: 'invalid body', status: 400 })
    } else {
        res.status(200).json({ message: 'ok', status: 200 })
    }
})

//login route
router.post("/login", (req, res, next) => {
    passport.authenticate('login', (error, user) => {
        try {
            if (error) {
                return next(error)
            }
            if (!user) {
                return next(new Error('email and password are required'))
            }

            req.login(user, { session: false }, (err) => {
                if (err) return next(err);
                return res.status(200).json({ user, status: 200 })
            })
        } catch (err) {
            return next(err)
        }
    })(req, res, next)
})

//logout route
router.post("/logout", (req, res) => {
    if (!req.body) {
        res.status(400).json({ message: 'invalid body', status: 400 })
    } else {
        res.status(200).json({ message: 'ok', status: 200 })
    }
})

//token-user doesnt need to keep logging in again
router.post("/token", (req, res) => {
    if (!req.body || !req.body.refreshToken) {
        res.status(400).json({ message: 'invalid body', status: 400 })
    } else {
        const { refreshToken } = req.body;
        res.status(200).json({ message: `refresh token requested for token: ${refreshToken}`, status: 200 })
    }
})

module.exports = router;