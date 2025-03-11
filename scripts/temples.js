// Update Copyright Year
document.getElementById("year").textContent = new Date().getFullYear();

// Update Last Modified Date
document.getElementById("lastModified").textContent = document.lastModified;

// Mobile Navigation Toggle
document.querySelector(".hamburger").addEventListener("click", function () {
    document.querySelector(".nav-menu").classList.toggle("active");
});
