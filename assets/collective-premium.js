(function () {
"use strict";
var reduceMotion =
window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var hasGSAP = typeof window.gsap !== "undefined";
var isTouch = window.matchMedia && window.matchMedia("(hover:none)").matches;
document.querySelectorAll(".showcase-card").forEach(function (card) {
if (!isTouch) {
card.addEventListener("mousemove", function (e) {
var r = card.getBoundingClientRect();
card.style.setProperty("--mx", (e.clientX - r.left) + "px");
card.style.setProperty("--my", (e.clientY - r.top) + "px");
if (!reduceMotion) {
var px = (e.clientX - r.left) / r.width - 0.5;
var py = (e.clientY - r.top) / r.height - 0.5;
if (hasGSAP) {
gsap.to(card, { rotateY: px * 6, rotateX: py * -6, duration: 0.5, ease: "power3.out" });
} else {
card.style.transform = "rotateY(" + px * 6 + "deg) rotateX(" + py * -6 + "deg)";
}
}
});
card.addEventListener("mouseleave", function () {
if (hasGSAP) gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: "elastic.out(1,0.5)" });
else card.style.transform = "";
});
}
var illoStage = card.querySelector(".showcase-illo-stage");
if (illoStage && !isTouch && !reduceMotion) {
var illo = card.querySelector(".showcase-illo");
illo.addEventListener("mousemove", function (e) {
var r = illo.getBoundingClientRect();
var px = (e.clientX - r.left) / r.width - 0.5;
var py = (e.clientY - r.top) / r.height - 0.5;
if (hasGSAP) {
gsap.to(illoStage, { rotateY: px * 14, rotateX: py * -14, duration: 0.5, ease: "power3.out" });
} else {
illoStage.style.transform = "rotateY(" + px * 14 + "deg) rotateX(" + py * -14 + "deg)";
}
});
illo.addEventListener("mouseleave", function () {
if (hasGSAP) gsap.to(illoStage, { rotateY: 0, rotateX: 0, duration: 0.7, ease: "elastic.out(1,0.5)" });
else illoStage.style.transform = "";
});
}
});
document.querySelectorAll(".showcase-card[data-href]").forEach(function (card) {
card.addEventListener("click", function (e) {
if (e.target.closest("a")) return;
window.location.href = card.getAttribute("data-href");
});
});
(function techStagger() {
var grid = document.querySelector(".tech-grid");
if (!grid || reduceMotion || !hasGSAP) return;
var pills = grid.querySelectorAll(".tech-pill");
if (!pills.length) return;
gsap.set(pills, { opacity: 0, y: 22 });
if (window.ScrollTrigger) {
gsap.to(pills, {
opacity: 1,
y: 0,
duration: 0.7,
ease: "power3.out",
stagger: 0.08,
scrollTrigger: { trigger: grid, start: "top 82%" },
});
}
})();
(function compareSlider() {
document.querySelectorAll(".compare-slider").forEach(function (host) {
var before = host.querySelector(".compare-frame--before");
var handle = host.querySelector(".compare-handle");
var bar = host.querySelector(".compare-bar");
var range = host.querySelector(".compare-range");
if (!before || !range) return;
function set(pct) {
pct = Math.max(0, Math.min(100, pct));
before.style.width = pct + "%";
if (handle) handle.style.left = pct + "%";
if (bar) bar.style.left = pct + "%";
range.value = pct;
}
range.addEventListener("input", function () {
set(parseFloat(range.value));
});
host.addEventListener("mousemove", function (e) {
if (e.buttons !== 1) return;
var r = host.getBoundingClientRect();
set(((e.clientX - r.left) / r.width) * 100);
});
host.addEventListener("touchmove", function (e) {
var r = host.getBoundingClientRect();
var x = e.touches[0].clientX;
set(((x - r.left) / r.width) * 100);
});
set(parseFloat(range.value) || 50);
});
})();
window.addEventListener("load", function () {
if (hasGSAP && window.ScrollTrigger) window.ScrollTrigger.refresh();
});
})();
