const express = require("express");
const router = express.Router();
const routes = require("../controllers/user")
const incomeroutes = require("../controllers/income");
const expenseroutes = require("../controllers/expense");
const auth = require("../middleware/auth");

router.get("/", auth,  routes.redirect); 

router.get("/:userId/addIncome", auth, incomeroutes.addIncome);

router.post("/:userId/addIncome", incomeroutes.updateIncome);

router.get("/:userId/addExpense",auth, expenseroutes.addExpense);

router.post("/:userId/addExpense", expenseroutes.updateExpense);

router.post("/:userId/deleteExpense", expenseroutes.deleteExpense);

router.post("/:userId/updateExpense", expenseroutes.prePopulateExpense);

router.post("/:userId/updateExpense/:expenseId", expenseroutes.updateUpdateExpense);

router.get("/:userId", auth, routes.listUserExpenses);

router.post("/:userId/month", routes.listUserExpensesParticularMonth);

module.exports = router;