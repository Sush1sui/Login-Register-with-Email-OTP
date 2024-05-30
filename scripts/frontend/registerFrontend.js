import { showFailToast, showSuccessToast } from "./toastMessage.js";

const RegisterInputs = {
    id: document.getElementById("idnum"),
    surname: document.getElementById("surname"),
    firstname: document.getElementById("firstname"),
    address: document.getElementById("address"),
    contact: document.getElementById("contact"),
    email: document.getElementById("email"),
    username: document.getElementById("username"),
    password: document.getElementById("password"),
};
const registerButton = document.getElementById("register-btn");
const verifyOtpButton = document.getElementById("verify-otp-btn");
const OTP_Wrapper = document.querySelector(".otp-wrapper");
const OTP_Input = document.getElementById("OTP_Input");
const REGISTER_FORM = document.getElementById("registerForm");
let toastMessageID;
let successId;
let rerouteId;
let otp;

Object.values(RegisterInputs).forEach((input) => {
    input.addEventListener("keydown", async function (e) {
        if (e.key === "Enter") {
            submitForm();
        }
    });
});

registerButton.addEventListener("click", async function () {
    submitForm();
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

async function sendOTP(userEmail) {
    otp = undefined;
    OTP_Wrapper.style.display = "flex";
    const userData = {
        idnum: RegisterInputs.id.value,
        contact: RegisterInputs.contact.value,
        email: RegisterInputs.email.value,
        username: RegisterInputs.username.value,
    };
    try {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        };

        const res = await fetch(
            `http://localhost:9999/register/sendOTP`,
            requestOptions
        );
        const data = await res.json();

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

async function submitForm() {
    let allInputsFilled = true;
    Object.values(RegisterInputs).forEach((input) => {
        if (input.value === "") {
            allInputsFilled = false;
        }
    });

    if (allInputsFilled === false) {
        showFailToast("Please fill all inputs!", toastMessageID);
        return;
    }
    if (isNaN(RegisterInputs.id.value)) {
        showFailToast("ID is not a number", toastMessageID);
        return;
    }
    if (isNaN(RegisterInputs.contact.value)) {
        showFailToast("Contact is not a number", toastMessageID);
        return;
    }
    if (!RegisterInputs.email.value.includes("@")) {
        showFailToast("Email is not valid", toastMessageID);
        return;
    }

    await sendOTP(RegisterInputs.email.value);
    return;
}

function submitOTP() {
    if (+OTP_Input.value !== otp) {
        showFailToast("Invalid OTP", toastMessageID);
    } else {
        showSuccessToast("Please wait for a moment", toastMessageID);
        successId = setTimeout(async () => {
            try {
                const userData = {
                    idnum: RegisterInputs.id.value,
                    surname: RegisterInputs.surname.value,
                    firstname: RegisterInputs.firstname.value,
                    address: RegisterInputs.address.value,
                    contact: RegisterInputs.contact.value,
                    email: RegisterInputs.email.value,
                    username: RegisterInputs.username.value,
                    password: RegisterInputs.password.value,
                };

                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                };

                const res = await fetch(
                    `http://localhost:9999/register`,
                    requestOptions
                );

                if (res.ok) {
                    clearTimeout(rerouteId);
                    showSuccessToast("Registered Successfully", toastMessageID);
                    rerouteId = setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                } else {
                    const data = await res.json();
                    throw new Error(data.error);
                }
            } catch (error) {
                console.error("Error during registration:", error);
                OTP_Wrapper.style.display = "none";
                OTP_Input.value = "";
                showFailToast(error, toastMessageID);
            }
        }, 1000);
    }
}
