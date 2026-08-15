
function logoutUser() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    localStorage.removeItem("currentUser");
    localStorage.removeItem("activeUser");

    window.location.href = "login.html";
}
document.addEventListener("DOMContentLoaded", () => {

    const currentUser =
        localStorage.getItem("currentUser");

    if (!currentUser) {
        window.location.href = "login.html";
    }

});