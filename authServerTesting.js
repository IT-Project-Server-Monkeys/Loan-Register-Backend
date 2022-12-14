require("dotenv").config()  
const user = require("./src/models/userModel");
var mongoose = require('mongoose');
require('./src/models')

const express = require('express')
const app = express()
const jwt = require("jsonwebtoken")
const bcrypt = require ('bcrypt')
app.use(express.json())

const port = process.env.TOKEN_SERVER_PORT

app.post("/login", async(req,res) => {
    
    const result = await user.find({login_email: req.body.login_email}).lean()
    console.log(result)
    if (result.length == 0 ) {res.status(404).send("User not found")}
   
    if (req.body.hashed_password == result[0].hashed_password ) {
        const accessToken = generateAccessToken ({user: req.body.login_email})
        const refreshToken = generateRefreshToken ({user: req.body.login_email})
        res.json ({accessToken: accessToken, refreshToken: refreshToken})
        console.log("Password is correct")

    }else{
        res.status(401).send("Password incorrect")
    }
})

// accessTokens
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"}) 
}
    // refreshTokens
let refreshTokens = []
function generateRefreshToken(user) {
const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "20m"})
refreshTokens.push(refreshToken)
return refreshToken }

app.get("/", (req, res) => {
    res.send("Authen server testing");
});

// call this after every 15mins
app.post("/refreshToken", (req,res) => {
    if (!refreshTokens.includes(req.body.token)) res.status(400).send("Refresh Token Invalid")
    refreshTokens = refreshTokens.filter( (c) => c != req.body.token)
    //remove the old refreshToken from the refreshTokens list
    const accessToken = generateAccessToken ({user: req.body.login_email})
    const refreshToken = generateRefreshToken ({user: req.body.login_email})
    //generate new accessToken and refreshTokens
    res.json ({accessToken: accessToken, refreshToken: refreshToken})
    })

app.delete("/logout", (req,res)=>{
        refreshTokens = refreshTokens.filter( (c) => c != req.body.token)
        //remove the old refreshToken from the refreshTokens list
        res.status(204).send("Logged out!")
        })
        
        
        app.get("/posts", validateToken, (req, res)=>{
            console.log("Token is valid")
            res.send('Token is valid')
            
        })
        
        
        function validateToken(req, res, next) {
            //get token from request header
            const authHeader = req.headers["authorization"]
            const token = authHeader.split(" ")[1]
            //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
            if (token == null) res.sendStatus(400).send("Token not present")
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) { 
             res.status(403).send("Token invalid")
             }
             else {
             req.user = user
             next() //proceed to the next action in the calling function
             }
            }) //end of jwt.verify()
            } //end of function        





   