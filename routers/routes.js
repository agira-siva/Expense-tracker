const express = require("express");
const router  = express.Router();

const routes = require("../controllers/user");

router.get("/", routes.getUserName);

router.get("/signup", routes.signup);

router.post("/signup" , routes.authenticateSignup);

router.get("/login", routes.login);

router.post("/login", routes.authenticateLogin);

router.get("/logout", routes.logout);





module.exports = router;