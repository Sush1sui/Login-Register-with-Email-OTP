const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");
const mongodb = require("mongodb");
const bcrypt = require("bcrypt");

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

const registerPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../../../pages/register.html"));
};

let otpStorage = {};

const sendOTP = async (req, res) => {
    const { idnum, contact, email, username } = req.body;

    const matchedID = await tables.find({ _id: +idnum }).toArray();
    const matchedEmail = await tables.find({ email: email }).toArray();
    const matchedContact = await tables.find({ contact: contact }).toArray();
    const matchedUsername = await tables.find({ username: username }).toArray();

    try {
        if (isNaN(+idnum))
            return res.status(400).json({ error: "ID is not a number" });
        if (matchedID.length > 0)
            return res.status(409).json({ error: "ID is taken" });
        if (matchedContact.length > 0)
            return res.status(409).json({ error: "Contact number is taken" });
        if (matchedEmail.length > 0)
            return res.status(409).json({ error: "Email is taken" });
        if (matchedUsername.length > 0)
            return res.status(409).json({ error: "Username is taken" });

        otpStorage[email] = otpGenerator();

        const message = {
            from: ACCOUNT_OTP.email,
            to: email,
            subject: `${otpStorage[email]} is your OTP`,
            text: `Here is your OTP: ${otpStorage[email]}`,
            html: `<p>Here is your OTP: <b>${otpStorage[email]}</b>`,
        };

        const info = await transporter.sendMail(message);
        return res.status(201).json({
            msg: `Email has been sent to ${email}`,
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info),
            otpGenerated: otpStorage[email],
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

const registerUser = async (req, res) => {
    const {
        idnum,
        surname,
        firstname,
        address,
        contact,
        email,
        username,
        password,
    } = req.body;

    bcrypt.hash(password, 10, async (err, hashedPW) => {
        if (err) {
            res.status(500).json({ message: "Error hashing password" });
        }

        try {
            await tables.insertOne({
                _id: +idnum,
                lastname: surname,
                firstname: firstname,
                address: address,
                contact: contact,
                email: email,
                username: username,
                password: hashedPW,
            });

            return res.status(201).json({ message: "Successfully Registered" });
        } catch (error) {
            console.error(error);
            return res.status(409).json({ error: error });
        }
    });
};

const otpGenerator = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

module.exports = { sendOTP, registerPage, validateOTP, registerUser };
