const express = require("express");
const app = express();
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);
const csurf = require('csurf');
const routes = require("./routers/routes");
const userroutes = require("./routers/user");
const db = require("./util/database");
const csurfProtection = csurf();

const sessionStore = new mysqlStore({}, db);

app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));

app.use(session({
    secret:"hii i am siva",
    resave : false,
    saveUninitialized: false,
    store: sessionStore
}));

app.use(csurfProtection);

app.use((req,res,next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.set("view engine","ejs");
app.set("views", "views");

app.use("/", routes);
app.use("/user", userroutes);

app.use((req,res,next) =>{
    res.status(404).send("page not found");
});

app.listen(10000);