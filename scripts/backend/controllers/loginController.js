const mongodb = require("mongodb");
const path = require("path");
require("dotenv").config();
const bcrypt = require("bcrypt");

const MONGO = {
    client: mongodb.MongoClient,
    url: process.env.MONGO_URL,
};
const client = new MONGO.client(MONGO.url);
const db = client.db("JPM_Pyramid");
const tables = db.collection("members");

const loginPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../../../pages/login.html"));
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const acc = await tables.findOne({ username: username });
        if (!acc) throw new Error("Invalid username or password");

        const matched = await bcrypt.compare(password, acc.password);

        if (!matched) {
            throw new Error("Invalid username or password");
        } else {
            console.log("Login Successful");
            return res
                .status(200)
                .json({ message: "Login Successful", userID: acc._id });
        }
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: error.message });
    }
};

module.exports = { loginPage, loginUser };
