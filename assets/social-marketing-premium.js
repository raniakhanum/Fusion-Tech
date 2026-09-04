(function () {
"use strict";
var reduceMotion =
window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var hasGSAP = typeof window.gsap !== "undefined";
var isTouch = window.matchMedia && window.matchMedia("(hover:none)").matches;
var cards = document.querySelectorAll(".portfolio-card");
if (cards.length) {
cards.forEach(function (card, i) {
card.style.setProperty("--d", (i % 4) * 0.28 + "s");
var stage = card.querySelector(".portfolio-stage");
if (isTouch) return;
card.addEventListener("mousemove", function (e) {
var r = card.getBoundingClientRect();
var mx = e.clientX - r.left;
var my = e.clientY - r.top;
if (stage) {
stage.style.setProperty("--mx", mx + "px");
stage.style.setProperty("--my", my + "px");
}
if (reduceMotion || !hasGSAP) return;
var px = mx / r.width - 0.5;
var py = my / r.height - 0.5;
gsap.to(card, {
rotateY: px * 7,
rotateX: py * -7,
y: -6,
duration: 0.5,
ease: "power3.out",
overwrite: "auto",
});
});
card.addEventListener("mouseleave", function () {
if (hasGSAP) {
gsap.to(card, {
rotateY: 0,
rotateX: 0,
y: 0,
duration: 0.7,
ease: "elastic.out(1,0.5)",
overwrite: "auto",
});
}
});
});
}
var mocks = document.querySelectorAll(".campaign-card");
if (mocks.length && hasGSAP && !reduceMotion && !isTouch) {
mocks.forEach(function (card) {
var media = card.querySelectorAll(".mock-media, .mock-bar");
card.addEventListener("mouseenter", function () {
gsap.to(media, { scale: 1.03, duration: 0.4, ease: "power2.out", stagger: 0.02 });
});
card.addEventListener("mouseleave", function () {
gsap.to(media, { scale: 1, duration: 0.4, ease: "power2.out" });
});
});
}
window.addEventListener("load", function () {
if (hasGSAP && window.ScrollTrigger) window.ScrollTrigger.refresh();
});
})();
