const menuBtn = document.querySelector("#menu-btn");
const navbar = document.querySelector(".navbar");

if (menuBtn && navbar) {
  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("fa-xmark");
    navbar.classList.toggle("active");
  });
}

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("header nav a");

window.onscroll = () => {
  sections.forEach((sec) => {
    const top = window.scrollY;
    const offset = sec.offsetTop - 150;
    const height = sec.offsetHeight;
    const id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navLinks.forEach((links) => {
        links.classList.remove("active");
        const match = document.querySelector(`header nav a[href*="${id}"]`);
        if (match) match.classList.add("active");
      });
    }
  });

  const header = document.querySelector("header");
  if (header) {
    header.classList.toggle("sticky", window.scrollY > 100);
  }

  if (menuBtn && navbar) {
    menuBtn.classList.remove("fa-xmark");
    navbar.classList.remove("active");
  }
};

const words = ["Frontend Developer", "UI/UX Designer", "STEM Scholar", "OpenFlash Builder"];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typingElem = document.querySelector(".typing-text");

function typeEffect() {
  if (!typingElem) return;

  const currentWord = words[wordIdx];
  if (isDeleting) {
    typingElem.textContent = currentWord.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typingElem.textContent = currentWord.substring(0, charIdx + 1);
    charIdx++;
  }

  let delay = isDeleting ? 60 : 120;

  if (!isDeleting && charIdx === currentWord.length) {
    delay = 1500;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    wordIdx = (wordIdx + 1) % words.length;
    delay = 400;
  }

  setTimeout(typeEffect, delay);
}

document.addEventListener("DOMContentLoaded", typeEffect);