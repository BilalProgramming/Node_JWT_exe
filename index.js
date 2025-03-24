const express = require("express")
const jwt = require("jsonwebtoken")
const app = express()
const secretKey = 'secretKey'

app.get("/", (req, resp) => {
    resp.json({
        message: "Hi i am Muhammad Bilal . I am hafiz what abouyt you?"
    })
})

app.post("/login", (req, resp) => {
    const user = {
        id: 1,
        name: "Bilal",
        email: "bilal123@gmail.com"
    }
    jwt.sign({ user }, secretKey, { expiresIn: "300s" }, (err, token) => {
        resp.json(
            {
                token
            }
        )

    })
})

app.post("/Profile", verifyToken, (req, resp) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
            resp.send({ message: "invalid token" })
        }
        else {
            resp.json(
                {
                    message: "profile page access",
                    authData
                })

        }
    })


})

function verifyToken(req, resp, next) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ")
        const token = bearer[1]
        req.token = token
        next()


    }
    else {
        resp.send({
            message: "token is not valid"
        })



    }



}
const port = 5000
app.listen(port, () => {
    console.log(`you code is running on ${port} port`)

})