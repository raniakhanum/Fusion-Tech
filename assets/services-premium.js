(function () {
"use strict";
var reduceMotion =
window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var hasGSAP = typeof window.gsap !== "undefined";
var hasScrollTrigger = hasGSAP && typeof window.ScrollTrigger !== "undefined";
var isTouch = window.matchMedia && window.matchMedia("(hover:none)").matches;
(function heroIllo() {
var host = document.getElementById("svcHeroIllo");
var stage = document.getElementById("svcIlloStage");
if (!host || !stage || reduceMotion || isTouch) return;
host.addEventListener("mousemove", function (e) {
var r = host.getBoundingClientRect();
var px = (e.clientX - r.left) / r.width - 0.5;
var py = (e.clientY - r.top) / r.height - 0.5;
if (hasGSAP) {
gsap.to(stage, { rotateY: px * 10, rotateX: py * -10, duration: 0.7, ease: "power3.out" });
} else {
stage.style.transform = "rotateY(" + px * 10 + "deg) rotateX(" + py * -10 + "deg)";
}
});
host.addEventListener("mouseleave", function () {
if (hasGSAP) gsap.to(stage, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "elastic.out(1,0.5)" });
else stage.style.transform = "";
});
})();
(function svcHeroHeadline() {
var h1 = document.querySelector(".svc-hero-copy h1");
if (!h1) return;
var raw = h1.getAttribute("data-text") || h1.textContent.trim();
var accentStart = h1.getAttribute("data-accent-from");
var words = raw.split(" ");
var accentIdx = accentStart ? words.indexOf(accentStart) : -1;
h1.innerHTML = words
.map(function (w, i) {
var cls = accentIdx !== -1 && i >= accentIdx ? "word word-accent" : "word";
return '<span class="' + cls + '">' + w + "&nbsp;</span>";
})
.join("");
var wordEls = h1.querySelectorAll(".word");
if (reduceMotion) return;
if (hasGSAP) {
gsap.set(wordEls, { opacity: 0, y: 26, filter: "blur(8px)" });
gsap.to(wordEls, {
opacity: 1,
y: 0,
filter: "blur(0px)",
duration: 0.9,
ease: "power3.out",
stagger: 0.06,
delay: 0.1,
});
} else {
wordEls.forEach(function (w, i) {
w.style.opacity = "0";
w.style.transform = "translateY(26px)";
w.style.transition = "opacity .7s ease, transform .7s ease";
setTimeout(function () {
w.style.opacity = "1";
w.style.transform = "translateY(0)";
}, 100 + i * 60);
});
}
var rest = document.querySelectorAll(".svc-hero-copy .hero-eyebrow, .svc-hero-copy p.lead, .svc-hero-ctas, .svc-hero-trust > *");
if (hasGSAP) {
gsap.set(rest, { opacity: 0, y: 20 });
gsap.to(rest, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.1, delay: 0.55 });
}
var illo = document.querySelector(".svc-hero-illo");
if (illo && hasGSAP) {
gsap.from(illo, { opacity: 0, y: 34, scale: 0.96, duration: 1, ease: "power3.out", delay: 0.3 });
}
})();
(function counters() {
var nodes = document.querySelectorAll("[data-count-to]");
if (!nodes.length) return;
function animateCounter(el) {
var to = parseFloat(el.getAttribute("data-count-to"));
var suffix = el.getAttribute("data-suffix") || "";
var decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals"), 10) : 0;
if (reduceMotion) {
el.textContent = to.toFixed(decimals) + suffix;
return;
}
var obj = { val: 0 };
if (hasGSAP) {
gsap.to(obj, {
val: to,
duration: 1.8,
ease: "power2.out",
onUpdate: function () {
el.textContent = obj.val.toFixed(decimals) + suffix;
},
});
} else {
var start = null;
var dur = 1600;
function step(ts) {
if (!start) start = ts;
var p = Math.min(1, (ts - start) / dur);
el.textContent = (to * p).toFixed(decimals) + suffix;
if (p < 1) requestAnimationFrame(step);
}
requestAnimationFrame(step);
}
}
if ("IntersectionObserver" in window) {
var io = new IntersectionObserver(
function (entries) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
animateCounter(entry.target);
io.unobserve(entry.target);
}
});
},
{ threshold: 0.5 }
);
nodes.forEach(function (el) {
io.observe(el);
});
} else {
nodes.forEach(animateCounter);
}
})();
(function timeline() {
var steps = document.querySelectorAll(".svc-timeline-step");
var fill = document.getElementById("svcTimelineFill");
if (!steps.length) return;
function activateUpTo(index) {
steps.forEach(function (s, i) {
s.classList.toggle("is-active", i <= index);
});
if (fill) {
var pct = steps.length > 1 ? (index / (steps.length - 1)) * 100 : 0;
fill.style.width = pct + "%";
}
}
if ("IntersectionObserver" in window) {
var io = new IntersectionObserver(
function (entries) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
var idx = Array.prototype.indexOf.call(steps, entry.target);
activateUpTo(idx);
}
});
},
{ threshold: 0.6, rootMargin: "0px 0px -10% 0px" }
);
steps.forEach(function (s) {
io.observe(s);
});
}
})();
(function faq() {
var items = document.querySelectorAll(".faq-item");
if (!items.length) return;
items.forEach(function (item) {
var q = item.querySelector(".faq-q");
var a = item.querySelector(".faq-a");
if (!q || !a) return;
q.addEventListener("click", function () {
var isOpen = item.classList.contains("is-open");
items.forEach(function (other) {
other.classList.remove("is-open");
var otherA = other.querySelector(".faq-a");
if (otherA) otherA.style.maxHeight = "0px";
});
if (!isOpen) {
item.classList.add("is-open");
a.style.maxHeight = a.scrollHeight + "px";
}
});
});
})();
(function testimonials() {
var track = document.getElementById("testiTrack");
var prev = document.getElementById("testiPrev");
var next = document.getElementById("testiNext");
if (!track || !prev || !next) return;
function scrollByCard(dir) {
var card = track.querySelector(".testi-card");
var amount = card ? card.getBoundingClientRect().width + 22 : 300;
track.scrollBy({ left: dir * amount, behavior: "smooth" });
}
prev.addEventListener("click", function () {
scrollByCard(-1);
});
next.addEventListener("click", function () {
scrollByCard(1);
});
})();
(function gridLinks() {
document.querySelectorAll(".svc-card[data-target]").forEach(function (card) {
card.addEventListener("click", function (e) {
if (e.target.closest("a")) return;
var target = document.getElementById(card.getAttribute("data-target"));
if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
});
});
})();
if (!reduceMotion && !isTouch) {
document.querySelectorAll(".svc-media-frame").forEach(function (frame) {
var host = frame.parentElement;
host.addEventListener("mousemove", function (e) {
var r = host.getBoundingClientRect();
var px = (e.clientX - r.left) / r.width - 0.5;
var py = (e.clientY - r.top) / r.height - 0.5;
if (hasGSAP) {
gsap.to(frame, { rotateY: px * 8, rotateX: py * -8, duration: 0.6, ease: "power3.out" });
}
});
host.addEventListener("mouseleave", function () {
if (hasGSAP) gsap.to(frame, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "elastic.out(1,0.5)" });
});
});
}
window.addEventListener("load", function () {
if (hasScrollTrigger) window.ScrollTrigger.refresh();
});
})();
