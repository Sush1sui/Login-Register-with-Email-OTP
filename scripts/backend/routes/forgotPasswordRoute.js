const router = require("express").Router();
const {
    changePassword,
    verifyEmail,
    validateOTP,
    forgotPasswordPage,
} = require("../controllers/forgotPasswordController.js");

router.post("/verifyEmail", verifyEmail);
router.post("/validateOTP", validateOTP);
router.patch("/", changePassword);
router.get("/", forgotPasswordPage);

module.exports = router;
