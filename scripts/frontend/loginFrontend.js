import { showFailToast, showSuccessToast } from "./toastMessage.js";

const loginBtn = document.getElementById("login-form-btn");
const loginUsername = document.getElementById("username");
const loginPassword = document.getElementById("password");
let toastMessageID;
let successId;
let rerouteId;

loginBtn.addEventListener("click", async function () {
    await submitLoginForm();
});
loginUsername.addEventListener("keydown", async function (e) {
    if (e.key === "Enter") {
        await submitLoginForm();
    }
});
loginPassword.addEventListener("keydown", async function (e) {
    if (e.key === "Enter") {
        await submitLoginForm();
    }
});

async function submitLoginForm() {
    clearTimeout(successId);
    showSuccessToast("Please wait for a moment", toastMessageID);
    successId = setTimeout(async () => {
        try {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: loginUsername.value,
                    password: loginPassword.value,
                }),
            };

            const res = await fetch(
                "http://localhost:9999/login",
                requestOptions
            );
            const data = await res.json();

            if (res.ok) {
                clearTimeout(rerouteId);
                showSuccessToast("Login Successful!!!");
                rerouteId = setTimeout(() => {
                    window.location.href = `/dashboard?id=${data.userID}`;
                }, 1000);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error(error);
            showFailToast(error, toastMessageID);
        }
    }, 1000);
}
