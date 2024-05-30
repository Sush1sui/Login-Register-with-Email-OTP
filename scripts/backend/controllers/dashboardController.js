const mongodb = require("mongodb");
const path = require("path");
require("dotenv").config();

const MONGO = {
    client: mongodb.MongoClient,
    url: process.env.MONGO_URL,
};
const client = new MONGO.client(MONGO.url);
const db = client.db("JPM_Pyramid");
const tables = db.collection("members");

const dashboardPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../../../pages/dashboard.html"));
};

const dashboardMembers = async (req, res) => {
    try {
        const user = await tables.findOne({ _id: +req.params.id });
        const dashboardData = {
            userID: user._id,
            loggedUser: user.username,
            members: await tables.find().sort({ _id: 1 }).toArray(),
        };
        return res.status(201).json({
            message: "Members fetched successfully",
            dashboardData: dashboardData,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch members" });
    }
};

module.exports = { dashboardPage, dashboardMembers };
