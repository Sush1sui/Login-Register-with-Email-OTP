const mongodb = require("mongodb");
require("dotenv").config();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const path = require("path");

const MONGO = {
    client: mongodb.MongoClient,
    url: process.env.MONGO_URL,
};
const client = new MONGO.client(MONGO.url);
const db = client.db("JPM_Pyramid");
const tables = db.collection("members");

const ACCOUNT_OTP = {
    email: process.env.AUTH_EMAIL,
    password: process.env.AUTH_PASSWORD,
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: ACCOUNT_OTP.email,
        pass: ACCOUNT_OTP.password,
    },
});

let otpStorage = {};

const forgotPasswordPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../../../pages/forgotPassword.html"));
};

const verifyEmail = async (req, res) => {
    const userEmail = req.body.userEmail;
    console.log(userEmail);
    try {
        const acc = await tables.findOne({ email: userEmail });
        if (!acc) {
            return res
                .status(500)
                .json({ error: "Email is not registered on any accounts" });
        }

        otpStorage[userEmail] = otpGenerator();
        const message = {
            from: ACCOUNT_OTP.email,
            to: userEmail,
            subject: `${otpStorage[userEmail]} is your OTP for changing password`,
            text: `Here is your OTP: ${otpStorage[userEmail]}, Now go change your password`,
            html: `<p>Here is your OTP: <b>${otpStorage[userEmail]}</b>, Now go change your password`,
        };
        const info = await transporter.sendMail(message);
        console.log(`Email has been sent to ${userEmail}`);
        return res.status(201).json({
            msg: `Email has been sent to ${userEmail}`,
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info),
            otpGenerated: otpStorage[userEmail],
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
};

const validateOTP = (req, res) => {
    const { userEmail, otp } = req.body;

    if (otpStorage[userEmail] === otp) {
        delete otpStorage[userEmail];
        return res.status(200).json({ valid: true, msg: "OTP is valid" });
    } else {
        return res.status(400).json({ valid: false, msg: "Invalid OTP" });
    }
};

const changePassword = async (req, res) => {
    const { userEmail, newPassword } = req.body;
    console.log(userEmail);
    console.log(req.body);
    try {
        bcrypt.hash(newPassword, 10, async (err, hashedPW) => {
            if (err) {
                return res
                    .status(500)
                    .json({ error: "Error hashing password" });
            }

            const filter = { email: userEmail };
            const update = { $set: { password: hashedPW } };

            const result = await tables.updateOne(filter, update);

            if (result.modifiedCount === 1) {
                return res
                    .status(200)
                    .json({ message: "Successfully changed password" });
            } else {
                throw new Error("Cannot find the document");
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
};

const otpGenerator = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

module.exports = {
    changePassword,
    verifyEmail,
    validateOTP,
    forgotPasswordPage,
};
