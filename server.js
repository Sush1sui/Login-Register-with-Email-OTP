const express = require("express");
require("dotenv").config();
const path = require("path");
const app = express();
const registerRoute = require("./scripts/backend/routes/registerRoute.js");
const loginRoute = require("./scripts/backend/routes/loginRoute.js");
const dashboardRoute = require("./scripts/backend/routes/dashboardRoute.js");
const forgotPasswordRoute = require("./scripts/backend/routes/forgotPasswordRoute.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const PORT = process.env.PORT || 9999;

app.use("/forgotPassword", forgotPasswordRoute);
app.use("/dashboard", dashboardRoute);
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.get("/", (req, res) => res.redirect(path.join(__dirname, "index.html")));

app.listen(PORT, () => console.log(`Listening to http://localhost:${PORT}`));
