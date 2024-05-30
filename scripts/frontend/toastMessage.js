export function showFailToast(message, toastMessageID) {
    clearTimeout(toastMessageID);
    if (document.querySelector(".fail")) {
        document.querySelector(".fail").remove();
    }
    if (document.querySelector(".success")) {
        document.querySelector(".success").remove();
    }

    const errorToastMessage = document.createElement("div");
    errorToastMessage.classList.add("fail");
    errorToastMessage.innerText = message;
    document.body.append(errorToastMessage);
    errorToastMessage.classList.toggle("active");

    toastMessageID = setTimeout(() => {
        if (errorToastMessage.parentNode) {
            errorToastMessage.parentNode.removeChild(errorToastMessage);
        }
    }, 4000);
}

export function showSuccessToast(message, toastMessageID) {
    clearTimeout(toastMessageID);
    if (document.querySelector(".success")) {
        document.querySelector(".success").remove();
    }
    if (document.querySelector(".fail")) {
        document.querySelector(".fail").remove();
    }

    const successToastMessage = document.createElement("div");
    successToastMessage.classList.add("success");
    successToastMessage.innerText = message;
    document.body.append(successToastMessage);
    successToastMessage.classList.toggle("active");

    toastMessageID = setTimeout(() => {
        if (successToastMessage.parentNode) {
            successToastMessage.parentNode.removeChild(successToastMessage);
        }
    }, 4000);
}
