const router = require("express").Router();
const {
    sendOTP,
    registerPage,
    validateOTP,
    registerUser,
} = require("../controllers/registerController.js");

router.post("/sendOTP", sendOTP);
router.post("/validateOTP", validateOTP);
router.post("/", registerUser);
router.get("/", registerPage);

module.exports = router;
