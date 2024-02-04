const db = require("../util/database");

module.exports = class Expense{
    constructor(amount, mode,category,description,userId,date,year,month){
        this.amount = Number(amount);
        this.userId = Number(userId);
        this.date = Number(date);
        this.year = Number(year);
        this.month = Number(month);
        this.category = category;
        this.description = description;
        this.mode = mode;
    }

    async save(){
        await db.execute("insert into expenses values(null,?,?,?,?,?,?,?,?)",[this.userId,this.amount,this.mode,this.category,this.date,this.month,this.year,this.description]);
        console.log("expenses insertion successful");
    }

    static async delete(expenseId){
        await db.execute("delete from expenses where id = ?",[expenseId]);
    }

    static async updateExpense(expenseBody, expenseId){
        console.log(expenseBody,expenseId);
        const {amount, mode, category, description, date, month, year} = expenseBody;
        await db.execute("update expenses set amount = ?, paymentMode = ? , categoryName = ?, date= ? , month = ?, year = ?, description = ? where id = ?",[amount,mode,category,date,month,year,description,expenseId]);
        console.log("db executed successfully");
    }

}