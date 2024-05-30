const profileBtn = document.getElementById("profile-button");
const menu = document.querySelector(".profile-menu");
const userName = document.getElementById("userName");

generateMembers();

profileBtn.addEventListener("click", () => {
    menu.classList.toggle("active");
});

async function generateMembers() {
    try {
        const userID = new URLSearchParams(window.location.search).get("id");
        const res = await fetch(
            `http://localhost:9999/dashboard/${userID}/members`
        );
        const data = await res.json();
        console.log(data);
        if (res.ok) {
            userName.innerHTML = data.dashboardData.loggedUser;
            renderMembers(data.dashboardData.members);
        } else {
            throw new Error("Failed to fetch members");
        }
    } catch (error) {
        console.error(error);
    }
}

function renderMembers(members) {
    const membersContainer = document.getElementById("list-container");
    membersContainer.innerHTML = "";

    members.forEach((member) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div><b>ID:</b> ${member._id}</div>
            <div><b>Username:</b> ${member.username}</div>
            <div>
                <b>Full Name:</b> ${member.lastname}, ${member.firstname}
            </div>
            <div><b>Contact:</b> ${member.contact}</div>
            <div><b>Email:</b> ${member.email}</div>
            <div><b>Address:</b> ${member.address}</div>
        `;
        membersContainer.appendChild(li);
    });
}
