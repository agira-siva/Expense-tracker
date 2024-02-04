const db = require("../util/database");

module.exports = class User {
    constructor(email,password){
        this.email = email;
        this.password = password;
    }

    async save(){
        await db.execute("insert into users(email,password) values(?,?)",[this.email, this.password]);
        console.log("inserted");
    }

    static async getUserId(email){
        const data = await db.execute("select userId from users where userName = ?",[username]);
        return data[0][0].userId;
    }

    static async checkemailExists(email, value) {
        try{
            const exists =  await db.execute("select * from users where email = ?",[email]);
            console.log(exists);
            if(exists[0].length == 0){
                return false;
            }
            return value ? exists[0][0] : true;  
        }catch(err) {
            console.log(err);
        }
    }

    

}