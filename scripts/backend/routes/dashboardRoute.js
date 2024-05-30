const router = require("express").Router();
const {
    dashboardPage,
    dashboardMembers,
} = require("../controllers/dashboardController.js");

router.get("/:id/members", dashboardMembers);
router.get("/", dashboardPage);

module.exports = router;
