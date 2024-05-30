const router = require("express").Router();
const { loginPage, loginUser } = require("../controllers/loginController.js");

router.post("/", loginUser);
router.get("/", loginPage);

module.exports = router;
