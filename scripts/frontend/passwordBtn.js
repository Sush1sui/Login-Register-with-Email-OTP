const password_button = document.getElementById("pwbtn");
const password_input = document.getElementById("password");

password_button.addEventListener("click", function () {
    password_button.classList.toggle("active");
    password_button.innerHTML = "";
    if (password_button.classList.contains("active")) {
        password_button.innerHTML = `<img src="../styles/eye-closed.svg" />`;
        password_input.type = "text";
    } else {
        password_button.innerHTML = `<img src="../styles/eye-open.svg" />`;
        password_input.type = "password";
    }
});
