const db = require("../util/database");

module.exports = class Income {
    constructor(card,cash,month, userId){
        this.card = Number(card);
        this.cash = Number(cash);
        this.userId = Number(userId);
        this.month = month;
    }


    async saveIncome(){
        await db.execute("insert into Income values(null,?,?,?,?)",[this.userId,this.card,this.cash,this.month]);
        console.log("new income inserted");
    }

    async updateIncome(card, cash){
        const cardAmount = this.card + card;
        const cashAmount = this.cash + cash;
        console.log("value is",card,cardAmount,cash,cashAmount);
        await db.execute("update Income set cardAmount = ?, cashAmount = ? where userId = ? and Month = ?",[cardAmount,cashAmount,this.userId, this.month]);
        console.log("existing income updated successfully");
    }

    static updateIncome(expenseData){
        let cardAmount = 0;
        let cashAmount = 0;
        let expenses = 0;
        expenseData.forEach(expense => {
            if(expense.paymentMode == "card"){
                cardAmount += expense.amount;
                
            }else{
                cashAmount += expense.amount;
            }
            expenses += expense.amount;
        })
        return {cardAmount,cashAmount,expenses};
    }

}