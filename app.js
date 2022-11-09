const PORT = process.env.PORT || 3000;
let express = require("express");
const recordRoutes = express.Router();
let app = express();
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ 
  extended: true,
  limit: "50mb"
})); 

var cors = require("cors");
app.use(cors({origin: '*'}));

app.use('/', recordRoutes);

app.get("/", (req, res) => {

    res.send("Server Monkeys Backend Production");

});
require('./src/models')

app.listen(PORT, function() {
    console.log(`Listening on Port ${PORT}`);
});

const userRouter = require ("./src/routes/userRouter")
app.use('/users', userRouter)


const loanRouter = require("./src/routes/loanRouter")
app.use('/loans', loanRouter)


const itemRouter = require("./src/routes/itemRouter")
app.use('/items', itemRouter)

const dashboardRouter = require("./src/routes/dashboardRouter")
app.use('/dashboard', dashboardRouter)


require("dotenv").config()  
const user = require("./src/models/userModel");
var mongoose = require('mongoose');
require('./src/models')



const jwt = require("jsonwebtoken")
const bcrypt = require ('bcrypt')
app.use(express.json())



app.post("/login", async(req,res) => {
    
    const result = await user.find({login_email: req.body.login_email}).lean()
    console.log(result)
    if (result.length == 0 ) {res.status(404).send("User not found")}
    const final = {}
   
    const accessToken = generateAccessToken ({user: result[0]._id})
    const refreshToken = generateRefreshToken ({user: result[0]._id})

    final.accessToken = accessToken
    final.refreshToken = refreshToken
    final.hashed_password = result[0].hashed_password
    res.json(final)
   

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
    const accessToken = generateAccessToken ({user: req.body.uid})
    const refreshToken = generateRefreshToken ({user: req.body.uid})
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





   
