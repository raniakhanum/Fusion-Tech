(function () {
"use strict";
var reduceMotion =
window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var hasGSAP = typeof window.gsap !== "undefined";
var isTouch = window.matchMedia && window.matchMedia("(hover:none)").matches;
var cards = document.querySelectorAll(".lp-card");
if (cards.length) {
cards.forEach(function (card, i) {
card.style.setProperty("--d", (i % 4) * 0.35 + "s");
if (isTouch) return;
var tiltRotate = (i % 2 === 0 ? -0.6 : 0.6);
card.addEventListener("mouseenter", function () {
if (hasGSAP && !reduceMotion) {
gsap.to(card, {
y: -10,
scale: 1.035,
rotate: tiltRotate,
duration: 0.55,
ease: "back.out(1.6)",
overwrite: "auto",
});
}
});
card.addEventListener("mousemove", function (e) {
var r = card.getBoundingClientRect();
card.style.setProperty("--mx", e.clientX - r.left + "px");
card.style.setProperty("--my", e.clientY - r.top + "px");
if (reduceMotion || !hasGSAP) return;
var px = (e.clientX - r.left) / r.width - 0.5;
var py = (e.clientY - r.top) / r.height - 0.5;
gsap.to(card, {
rotateY: px * 8,
rotateX: py * -8,
duration: 0.5,
ease: "power3.out",
overwrite: "auto",
});
});
card.addEventListener("mouseleave", function () {
if (hasGSAP) {
gsap.to(card, {
y: 0,
scale: 1,
rotate: 0,
rotateY: 0,
rotateX: 0,
duration: 0.7,
ease: "elastic.out(1,0.5)",
});
}
});
});
var grid = document.querySelector(".lp-grid");
var section = document.querySelector(".logo-portfolio");
if (grid && section && !isTouch && !reduceMotion) {
section.addEventListener("mousemove", function (e) {
var r = section.getBoundingClientRect();
var px = (e.clientX - r.left) / r.width - 0.5;
var py = (e.clientY - r.top) / r.height - 0.5;
if (hasGSAP) {
gsap.to(grid, { x: px * -10, y: py * -6, duration: 0.9, ease: "power3.out" });
}
});
section.addEventListener("mouseleave", function () {
if (hasGSAP) gsap.to(grid, { x: 0, y: 0, duration: 1, ease: "power3.out" });
});
}
}
var cloudGroups = document.querySelectorAll(".logo-cloud-group");
if (cloudGroups.length > 1) {
for (var g = 1; g < cloudGroups.length; g++) {
cloudGroups[g].setAttribute("aria-hidden", "true");
}
}
var underlineEls = document.querySelectorAll(".lp-underline-wrap");
if (underlineEls.length) {
if (reduceMotion || !("IntersectionObserver" in window)) {
underlineEls.forEach(function (el) {
el.classList.add("is-visible");
});
} else {
var uio = new IntersectionObserver(
function (entries) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
entry.target.classList.add("is-visible");
uio.unobserve(entry.target);
}
});
},
{ threshold: 0.4 }
);
underlineEls.forEach(function (el) {
uio.observe(el);
});
}
}
})();
