const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav-list ul");

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("hamburger-active");
  nav.classList.toggle("slide-in");
});
