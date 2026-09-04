(function () {
"use strict";
var reduceMotion =
window.matchMedia &&
window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var hasGSAP = typeof window.gsap !== "undefined";
var hasScrollTrigger = hasGSAP && typeof window.ScrollTrigger !== "undefined";
var hasLenis = typeof window.Lenis !== "undefined";
var isTouch = window.matchMedia && window.matchMedia("(hover:none)").matches;
if (hasGSAP && hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);
(function buildBackground() {
if (document.querySelector(".bg-mesh")) return;
var mesh = document.createElement("div");
mesh.className = "bg-mesh";
mesh.setAttribute("aria-hidden", "true");
mesh.innerHTML =
'<div class="bg-mesh__blob bg-mesh__blob--a" data-speed="0.06"></div>' +
'<div class="bg-mesh__blob bg-mesh__blob--b" data-speed="0.1"></div>' +
'<div class="bg-mesh__blob bg-mesh__blob--c" data-speed="0.04"></div>' +
'<div class="bg-mesh__blob bg-mesh__blob--d" data-speed="0.08"></div>' +
'<div class="bg-mesh__particles"></div>' +
'<div class="bg-mesh__noise"></div>';
document.body.insertBefore(mesh, document.body.firstChild);
var particleHost = mesh.querySelector(".bg-mesh__particles");
if (particleHost && !reduceMotion) {
var count = window.innerWidth < 700 ? 8 : 16;
for (var i = 0; i < count; i++) {
var p = document.createElement("span");
p.className = "bg-particle";
var size = 3 + Math.random() * 5;
p.style.width = size + "px";
p.style.height = size + "px";
p.style.left = Math.random() * 100 + "%";
p.style.top = Math.random() * 100 + "%";
particleHost.appendChild(p);
if (hasGSAP) {
gsap.to(p, {
y: (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 60),
x: (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 40),
duration: 8 + Math.random() * 10,
repeat: -1,
yoyo: true,
ease: "sine.inOut",
});
}
}
}
if (!reduceMotion) {
var blobs = mesh.querySelectorAll(".bg-mesh__blob");
window.addEventListener(
"scroll",
function () {
var y = window.scrollY;
blobs.forEach(function (b) {
var speed = parseFloat(b.getAttribute("data-speed")) || 0.05;
b.style.transform = "translate3d(0," + y * speed + "px,0)";
});
},
{ passive: true }
);
}
})();
var lenis = null;
if (hasLenis && !reduceMotion && !isTouch) {
lenis = new Lenis({
duration: 1.15,
easing: function (t) {
return Math.min(1, 1.001 - Math.pow(2, -10 * t));
},
smoothWheel: true,
wheelMultiplier: 1,
touchMultiplier: 1.2,
});
var raf = function (time) {
lenis.raf(time);
requestAnimationFrame(raf);
};
requestAnimationFrame(raf);
if (hasScrollTrigger) {
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add(function (time) {
lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
}
}
(function navScroll() {
var header = document.querySelector("header.site-header");
if (!header) return;
var toggle = function () {
if (window.scrollY > 24) header.classList.add("is-scrolled");
else header.classList.remove("is-scrolled");
};
toggle();
window.addEventListener("scroll", toggle, { passive: true });
})();
if (!reduceMotion && !isTouch) {
var glow = document.createElement("div");
glow.className = "cursor-glow";
glow.setAttribute("aria-hidden", "true");
document.body.appendChild(glow);
var gx = window.innerWidth / 2,
gy = window.innerHeight / 2,
cx = gx,
cy = gy;
var shown = false;
window.addEventListener(
"mousemove",
function (e) {
gx = e.clientX;
gy = e.clientY;
if (!shown) {
glow.classList.add("is-active");
shown = true;
}
},
{ passive: true }
);
(function loop() {
cx += (gx - cx) * 0.12;
cy += (gy - cy) * 0.12;
glow.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
requestAnimationFrame(loop);
})();
}
document.querySelectorAll(".btn").forEach(function (btn) {
btn.classList.add("magnetic");
if (!reduceMotion && !isTouch) {
btn.addEventListener("mousemove", function (e) {
var r = btn.getBoundingClientRect();
var x = e.clientX - (r.left + r.width / 2);
var y = e.clientY - (r.top + r.height / 2);
if (hasGSAP) {
gsap.to(btn, {
x: x * 0.28,
y: y * 0.38,
duration: 0.5,
ease: "power3.out",
});
} else {
btn.style.transform = "translate(" + x * 0.28 + "px," + y * 0.38 + "px)";
}
});
btn.addEventListener("mouseleave", function () {
if (hasGSAP) {
gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
} else {
btn.style.transform = "";
}
});
}
btn.addEventListener("click", function (e) {
var r = btn.getBoundingClientRect();
var ripple = document.createElement("span");
ripple.className = "btn__ripple";
var size = Math.max(r.width, r.height) * 1.8;
ripple.style.width = ripple.style.height = size + "px";
ripple.style.left = (e.clientX - r.left - size / 2) + "px";
ripple.style.top = (e.clientY - r.top - size / 2) + "px";
btn.appendChild(ripple);
setTimeout(function () {
ripple.remove();
}, 650);
});
});
if (!isTouch) {
document.querySelectorAll(".card").forEach(function (card) {
card.addEventListener("mousemove", function (e) {
var r = card.getBoundingClientRect();
card.style.setProperty("--mx", (e.clientX - r.left) + "px");
card.style.setProperty("--my", (e.clientY - r.top) + "px");
if (!reduceMotion && hasGSAP) {
var px = (e.clientX - r.left) / r.width - 0.5;
var py = (e.clientY - r.top) / r.height - 0.5;
gsap.to(card, {
rotateY: px * 5,
rotateX: py * -5,
y: -4,
duration: 0.5,
ease: "power3.out",
});
}
});
card.addEventListener("mouseleave", function () {
if (hasGSAP) {
gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.5)" });
}
});
});
}
var tilt = document.getElementById("heroTilt");
if (tilt && !reduceMotion && !isTouch) {
var frameEl = tilt.querySelector(".hero-photo-frame");
tilt.addEventListener("mousemove", function (e) {
var r = tilt.getBoundingClientRect();
var px = (e.clientX - r.left) / r.width - 0.5;
var py = (e.clientY - r.top) / r.height - 0.5;
if (hasGSAP) {
gsap.to(frameEl, { rotateY: px * 8, rotateX: py * -8, duration: 0.6, ease: "power3.out" });
} else {
frameEl.style.transform = "rotateY(" + px * 8 + "deg) rotateX(" + py * -8 + "deg)";
}
});
tilt.addEventListener("mouseleave", function () {
if (hasGSAP) gsap.to(frameEl, { rotateY: 0, rotateX: 0, duration: 0.7, ease: "elastic.out(1,0.5)" });
else frameEl.style.transform = "";
});
}
var hero = document.getElementById("hero");
var spotlight = document.getElementById("heroSpotlight");
if (hero && spotlight && !reduceMotion && !isTouch) {
hero.addEventListener("mousemove", function (e) {
var r = hero.getBoundingClientRect();
var x = ((e.clientX - r.left) / r.width) * 100;
var y = ((e.clientY - r.top) / r.height) * 100;
hero.style.setProperty("--sx", x + "%");
hero.style.setProperty("--sy", y + "%");
});
}
(function heroHeadline() {
var h1 = document.querySelector(".hero-copy h1");
if (!h1) return;
var text = h1.getAttribute("data-text") || h1.textContent.trim();
var words = text.split(" ");
h1.innerHTML = words
.map(function (w) {
return '<span class="word">' + w + "&nbsp;</span>";
})
.join("");
var wordEls = h1.querySelectorAll(".word");
if (reduceMotion) return;
if (hasGSAP) {
gsap.set(wordEls, { opacity: 0, y: 28, filter: "blur(8px)" });
gsap.to(wordEls, {
opacity: 1,
y: 0,
filter: "blur(0px)",
duration: 0.9,
ease: "power3.out",
stagger: 0.075,
delay: 0.15,
});
} else {
wordEls.forEach(function (w, i) {
w.style.opacity = "0";
w.style.transform = "translateY(28px)";
w.style.transition = "opacity .7s ease, transform .7s ease";
setTimeout(function () {
w.style.opacity = "1";
w.style.transform = "translateY(0)";
}, 150 + i * 75);
});
}
var buttons = document.querySelectorAll(".hero-copy .btn");
var stats = document.querySelectorAll(".hero-stats > *");
var eyebrow = document.querySelector(".hero-eyebrow");
var lead = document.querySelector(".hero-copy p");
if (hasGSAP) {
gsap.set([eyebrow, lead], { opacity: 0, y: 20 });
gsap.set(buttons, { opacity: 0, y: 24 });
gsap.set(stats, { opacity: 0, y: 20 });
gsap.to(eyebrow, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0 });
gsap.to(lead, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.6 });
gsap.to(buttons, {
opacity: 1,
y: 0,
duration: 0.7,
ease: "back.out(1.6)",
stagger: 0.1,
delay: 0.85,
});
gsap.to(stats, {
opacity: 1,
y: 0,
duration: 0.6,
ease: "power3.out",
stagger: 0.08,
delay: 1.05,
});
}
var photoTilt = document.querySelector(".hero-photo-tilt");
if (photoTilt && hasGSAP) {
gsap.from(photoTilt, {
opacity: 0,
y: 40,
scale: 0.96,
duration: 1,
ease: "power3.out",
delay: 0.3,
});
}
})();
(function scrollReveals() {
var autoSelectors = [
".section-head",
".card",
".cta-band > .wrap > *",
"form.form-panel",
".page-hero .breadcrumb",
".page-hero h1",
".page-hero p",
"table",
];
autoSelectors.forEach(function (sel) {
document.querySelectorAll(sel).forEach(function (el) {
if (!el.classList.contains("reveal") && !el.hasAttribute("data-reveal")) {
el.setAttribute("data-reveal", "");
}
});
});
var revealEls = document.querySelectorAll(".reveal, [data-reveal], .reveal-scale");
if (!revealEls.length) return;
if (reduceMotion || (!hasGSAP && !("IntersectionObserver" in window))) {
revealEls.forEach(function (el) {
el.classList.add("is-visible");
});
return;
}
if (hasGSAP && hasScrollTrigger) {
var groups = new Map();
revealEls.forEach(function (el) {
var parent = el.parentElement;
if (!groups.has(parent)) groups.set(parent, []);
groups.get(parent).push(el);
});
groups.forEach(function (els) {
ScrollTrigger.batch(els, {
start: "top 88%",
once: true,
onEnter: function (batch) {
gsap.to(batch, {
opacity: 1,
y: 0,
filter: "blur(0px)",
duration: 0.9,
ease: "power3.out",
stagger: 0.09,
});
},
});
});
} else {
var io = new IntersectionObserver(
function (entries) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
entry.target.classList.add("is-visible");
io.unobserve(entry.target);
}
});
},
{ threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
);
revealEls.forEach(function (el) {
io.observe(el);
});
}
})();
if (hasGSAP && hasScrollTrigger && !reduceMotion) {
document.querySelectorAll(".hero-photo, .page-hero img, .card img").forEach(function (img) {
img.style.overflow = "hidden";
});
}
window.addEventListener("load", function () {
if (hasScrollTrigger) ScrollTrigger.refresh();
});
})();

/* Dark mode toggle */
(function () {
var btn = document.getElementById("themeToggle");
if (!btn) return;
btn.addEventListener("click", function () {
var isDark = document.documentElement.getAttribute("data-theme") === "dark";
var next = isDark ? "light" : "dark";
if (next === "dark") {
document.documentElement.setAttribute("data-theme", "dark");
} else {
document.documentElement.removeAttribute("data-theme");
}
try { localStorage.setItem("ft-theme", next); } catch (e) {}
});
})();
