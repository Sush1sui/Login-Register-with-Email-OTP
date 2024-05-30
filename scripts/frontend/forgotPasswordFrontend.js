import { showFailToast, showSuccessToast } from "./toastMessage.js";
const OTP_Wrapper = document.querySelector(".otp-wrapper");
const OTP_Input = document.getElementById("OTP_Input");
const newPassword_Wrapper = document.querySelector(
    ".new-password-form-container"
);
const newPassword_Input = document.getElementById("password");
const newPassword_Btn = document.getElementById("submit-new-password-btn");
const verifyEmailButton = document.getElementById(
    "send-otp-forgot-password-btn"
);
const verifyOtpButton = document.getElementById("verify-otp-btn");
const emailInput = document.getElementById("email");
let otp;
let toastMessageID;
let successId;
let rerouteId;

verifyEmailButton.addEventListener("click", async function () {
    enterEmail();
});
emailInput.addEventListener("keydown", async function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        enterEmail();
    }
});

verifyOtpButton.onclick = function (e) {
    e.preventDefault();
    submitOTP();
};
OTP_Input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        submitOTP();
    }
});

newPassword_Btn.addEventListener("click", function () {
    submitNewPassword(emailInput.value, newPassword_Input.value);
});

newPassword_Input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        submitNewPassword(emailInput.value, newPassword_Input.value);
    }
});

async function submitNewPassword(userEmail, newPassword) {
    if (newPassword === "") {
        showFailToast("Please enter a password", toastMessageID);
        return;
    }
    try {
        showSuccessToast("Please wait for a few moments", toastMessageID);
        const requestOptions = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail, newPassword }),
        };
        const res = await fetch(
            "http://localhost:9999/forgotPassword",
            requestOptions
        );
        const data = await res.json();

        if (res.ok) {
            showSuccessToast("Successfully changed password");
            clearTimeout(rerouteId);
            rerouteId = setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error(error);
        showFailToast(error, toastMessageID);
    }
}

async function enterEmail() {
    if (emailInput.value === "") {
        showFailToast("Enter an email please");
        return;
    } else if (!emailInput.value.includes("@")) {
        showFailToast("Email is not valid", toastMessageID);
        return;
    } else {
        await sendOTP(emailInput.value);
        return;
    }
}

async function sendOTP(userEmail) {
    otp = undefined;
    OTP_Wrapper.style.display = "flex";
    showSuccessToast(
        "Please wait for a few moments for OTP to arrive in your email",
        toastMessageID
    );
    try {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail }),
        };

        const res = await fetch(
            `http://localhost:9999/forgotPassword/verifyEmail`,
            requestOptions
        );
        const data = await res.json();
        console.log(data);
        if (res.ok) {
            otp = data.otpGenerated;
            return;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error(error);
        showFailToast(error, toastMessageID);
    }
}

async function submitOTP() {
    if (+OTP_Input.value !== otp) {
        showFailToast("Invalid OTP, Please try again", toastMessageID);
        return;
    }
    clearTimeout(successId);
    showSuccessToast("Please wait for a moment", toastMessageID);
    successId = setTimeout(() => {
        OTP_Wrapper.style.display = "none";
        OTP_Input.value = "";
        newPassword_Wrapper.style.display = "flex";
    }, 1000);
}
