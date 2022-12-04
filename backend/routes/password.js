const express = require('express')
const router = express.Router()//new express router instance

//forgot password 
router.post("/forgot-password", (req, res) => {
    if (!req.body || !req.body.email) {
        res.status(400).json({ message: 'invalid body', status: 400 })
    } else {
        const { email } = req.body;
        res.status(200).json({ message: `forgot password requested for email: ${email}`, status: 200 })
    }
})

//reset password
router.post("/reset-password", (req, res) => {
    if (!req.body || !req.body.email) {
        res.status(400).json({ message: 'invalid body', status: 400 })
    } else {
        const { email } = req.body;
        res.status(200).json({ message: `password reset requested for email: ${email}`, status: 200 })
    }
})

module.exports = router;