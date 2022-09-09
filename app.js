const PORT = process.env.PORT || 3000;
let express = require("express");
const recordRoutes = express.Router();
let app = express();
app.use(express.json());
app.use(
  express.urlencoded({ extended: true })
);
var cors = require("cors");
app.use(cors({origin: '*'}));

app.use('/', recordRoutes);

app.get("/", (req, res) => {
    res.send("Server Monkeys Backend Testing");
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
