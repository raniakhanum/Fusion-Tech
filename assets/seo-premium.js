(function () {
"use strict";
var reduceMotion =
window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var hasGSAP = typeof window.gsap !== "undefined";
var isTouch = window.matchMedia && window.matchMedia("(hover:none)").matches;
(function dashboard() {
var dash = document.querySelector(".seo-dash");
if (!dash) return;
function playIn() {
var bars = dash.querySelectorAll(".seo-mini-bar");
bars.forEach(function (b, i) {
setTimeout(function () {
b.classList.add("is-in");
}, i * 70);
});
var points = dash.querySelectorAll(".seo-point");
points.forEach(function (p, i) {
p.style.animationDelay = 1.2 + i * 0.15 + "s";
});
var gaugeFill = dash.querySelector(".seo-gauge-fill");
if (gaugeFill && hasGSAP && !reduceMotion) {
var len = gaugeFill.getTotalLength ? gaugeFill.getTotalLength() : 140;
gsap.set(gaugeFill, { strokeDasharray: len, strokeDashoffset: len });
gsap.to(gaugeFill, { strokeDashoffset: len * 0.18, duration: 1.6, ease: "power3.out", delay: 0.3 });
}
}
if ("IntersectionObserver" in window) {
var io = new IntersectionObserver(
function (entries) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
playIn();
io.unobserve(entry.target);
}
});
},
{ threshold: 0.35 }
);
io.observe(dash);
} else {
playIn();
}
})();
if (!reduceMotion && hasGSAP && !isTouch) {
document.querySelectorAll(".compare-card").forEach(function (card) {
card.addEventListener("mouseenter", function () {
gsap.to(card, { y: -6, duration: 0.45, ease: "power3.out" });
});
card.addEventListener("mouseleave", function () {
gsap.to(card, { y: 0, duration: 0.55, ease: "power3.out" });
});
});
}
if (!reduceMotion && hasGSAP && !isTouch) {
document.querySelectorAll(".seo-why-card").forEach(function (card) {
var icon = card.querySelector(".icon-box");
if (!icon) return;
card.addEventListener("mouseenter", function () {
gsap.to(icon, { scale: 1.08, rotate: -4, duration: 0.45, ease: "back.out(2)" });
});
card.addEventListener("mouseleave", function () {
gsap.to(icon, { scale: 1, rotate: 0, duration: 0.5, ease: "power3.out" });
});
});
}
window.addEventListener("load", function () {
if (hasGSAP && window.ScrollTrigger) window.ScrollTrigger.refresh();
});
})();
