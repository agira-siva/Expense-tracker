const db = require("../util/database");
const User = require("../models/user");
const Income = require("../models/income");
const bcrypt = require("bcrypt");
const session = require("express-session");



exports.getUserName = (req,res,next) => {
    if(req.session.isLoggedIn){
        return res.redirect("/user/" + req.session.userId);
    }
    res.render("username");
}

exports.signup = (req,res,next) => {
    res.render("signup",{error : "", login : ""});
}

exports.login = (req,res, next) => {
    res.render("login", {error: "", signup: ""});
}

exports.logout = (req,res,next) =>{
    req.session.destroy(() => {
        console.log("destroyed");
        res.redirect("/");
    })
}

exports.authenticateLogin = async (req,res,next) => {
    const {email,password} = req.body;
    const emailExists = await User.checkemailExists(email,1);
    console.log(emailExists);
    if(emailExists != false ){
        const valid = bcrypt.compare(password, emailExists.password);
        if(valid){
            req.session.isLoggedIn = true;
            req.session.userId = emailExists.userId;
            return res.redirect("/user/" + emailExists.userId );
        }
        return res.render("login", {error: "password is wrong", signup: ""});
    }

    res.render("login", {error: "user does not exist, click the below button to signup", signup: "signup"});
}

exports.authenticateSignup = async (req,res,next) => {
    const {email, password, confirmpassword } = req.body;
    const emailExists = await User.checkemailExists(email,0);
    console.log(emailExists);
    if(emailExists){
        return res.render("signup", {error: "user already exists go to login page", login: "login"} );
    } 
    
    if(password !== confirmpassword){
        return res.render("signup", {error: "both passwords are not same, enter the password correctly", login: ""});
    }

    const hashedPassword = await bcrypt.hash(password,12);
    const newUser = new User(email, hashedPassword);
    await newUser.save();

    res.redirect("/login");
}

exports.listUserExpenses = async (req,res,next) => {
    
    const userId = req.params.userId;
    const d = new Date();
    const monthString = d.getFullYear().toString() + "-" + (d.getMonth() + 1).toString().padStart(2,"0");
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const [data] = await db.execute("select * from Income where userId = ? and Month = ?", [userId, monthString]);
    const [expenseData] = await db.execute("select * from expenses where expenseUserId = ? and Month = ? and year = ? order by date desc ",[userId, month, year]);
    if(expenseData.length != 0){
        const {cardAmount,cashAmount,expenses} = Income.updateIncome(expenseData);
        data[0].cardAmount -= cardAmount;
        data[0].cashAmount -= cashAmount;
        return res.render("userExpenses.ejs", {userId : userId,month: monthString,amount: data, expenseData: expenseData,expenses: expenses});
    }else{
        return res.render("userExpenses.ejs", {userId : userId,month: monthString, amount: data, expenseData: expenseData,expenses: 0});

    }
    

    
}

exports.listUserExpensesParticularMonth = async (req,res,next) => {
    const monthString = req.body.month;
    let [year, month] = monthString.split("-");
    year = Number(year);
    month = Number(month);
    const userId = req.params.userId;
    const [data] = await db.execute("select * from Income where userId = ? and Month = ?", [userId, monthString]);
    const [expenseData] = await db.execute("select * from expenses where expenseUserId = ? and month = ? and year = ? order by date desc ",[userId,month,year]);
    if(expenseData.length != 0){
        const {cardAmount,cashAmount,expenses} = Income.updateIncome(expenseData);
        data[0].cardAmount -= cardAmount;
        data[0].cashAmount -= cashAmount;
        res.render("userExpensesMonth.ejs", {userId : userId ,month: month, year : year,amount: data, expenseData: expenseData,expenses: expenses});
    }else{
        res.render("userExpensesMonth.ejs", {userId : userId, month: month, year : year,amount: data, expenseData: expenseData,expenses: 0});
    }
}


exports.redirect = (req,res,next) => {
    res.redirect("/user/" + req.session.userId);
}

