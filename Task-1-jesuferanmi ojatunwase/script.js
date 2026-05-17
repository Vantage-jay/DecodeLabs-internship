let menuBtn = document.getElementById("menuBtn");
let mainNav = document.getElementById("mainNav");

menuBtn.addEventListener("click", function() {
    mainNav.classList.toggle("open");
});
let allNavLinks = document.querySelectorAll("#mainNav a");
allNavLinks.forEach(function(link) {
    link.addEventListener("click", function() {
        mainNav.classList.remove("open");
    });
});
let sections = document.querySelectorAll("section");
let scrollLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", function() {
    sections.forEach(function(section) {
        let sectionTop = section.offsetTop - 100;
        let sectionHeight = section.offsetHeight;
        let scrollPosition = window.scrollY;

        if(scrollPosition >= sectionTop && 
           scrollPosition < sectionTop + sectionHeight) {
            scrollLinks.forEach(function(link) {
                link.classList.remove("active");
            });
            let currentId = section.getAttribute("id");
            let activeLink = document.querySelector("nav a[href='#" + currentId + "']");
            if(activeLink) {
                activeLink.classList.add("active");
            }
        }
    });
});