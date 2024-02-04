const Income = require("../models/income");
const db = require("../util/database");


exports.addIncome = (req,res,next) => {
    const userId = req.params.userId;
    res.render("addIncome.ejs" , {userId: userId});
    
}

exports.updateIncome = async (req,res,next) => {
    const {card, cash,month,userId} = req.body;
    const income = new Income(card,cash,month,userId);
    req.session.isloggedin= true;
    console.log("id",req.session.id);
    await db.execute("select * from Income where Month = ? and userId = ?",[month,userId]).then( async r => {
        const [resultArray] = r;
        if(resultArray.length == 0){
            await income.saveIncome();
        }
        else{
            await income.updateIncome(resultArray[0].cardAmount, resultArray[0].cashAmount);
        }
    });

    res.redirect("/user/" + userId);
}