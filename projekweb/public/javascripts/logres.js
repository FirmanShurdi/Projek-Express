const text = "Selamat Datang!";
const typingTarget = document.getElementById("typing-text");
let i = 0;

function typeEffect() {
    if (i < text.length) {
        typingTarget.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeEffect, 100);
    }
}

const fadeText = document.getElementById("fade-text");
fadeText.style.opacity = 0;
fadeText.style.transition = "opacity 2s ease-in-out";

window.addEventListener("load", () => {
    typeEffect();
    setTimeout(() => {
        fadeText.style.opacity = 1;
    }, 1500);
});