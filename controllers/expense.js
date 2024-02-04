const Expense = require("../models/expense");

exports.addExpense = (req,res,next) => {
    const userId = req.params.userId;
    res.render("addExpense", {userId : userId});
};

exports.updateExpense = async (req,res,next) => {
    const userId = req.params.userId;
    const {amount,mode,category,description,datetime} = req.body;
    console.log(datetime);
    const [year, month, datestring] = datetime.split("-");
    const date = datestring[0] + datestring[1];
    const expense = new Expense(amount, mode,category, description, userId, date, year, month);
    await expense.save();
    res.redirect("/user/" + userId);
}

exports.deleteExpense = async (req,res,next) => {
    const expenseId = req.body.id;
    const userId = req.params.userId;
    Expense.delete(expenseId);
    console.log("deleted");
    res.redirect("/user/" + userId);
}


exports.prePopulateExpense = (req,res,next) => {
    const data = req.body;
    console.log(data);
    const userId = req.params.userId;
    console.log(userId);
    const dateString = data.year + "-" + (data.month).padStart(2,"0") + "-" + data.date[0] + "T" + "12:24"; 
    console.log(dateString);
    console.log(data.description);
    res.render("updateExpense", {data: data, dateString: dateString, userId: userId});
}

exports.updateUpdateExpense  = async (req,res,next) => {
    const expenseBody = req.body;
    const monthString = expenseBody.datetime;
    const expenseId = Number(req.params.expenseId);
    let [year, month, dateString] = monthString.split("-");
    yearNumber = Number(year);
    monthNumber = Number(month);
    dateNumber = Number(dateString[0] + dateString[1]);
    expenseBody.date = dateNumber;
    expenseBody.year = yearNumber;
    expenseBody.month = monthNumber;
    expenseBody.amount = Number(expenseBody.amount);
    await Expense.updateExpense(expenseBody, expenseId);
    res.redirect("/user/" + req.params.userId);
}