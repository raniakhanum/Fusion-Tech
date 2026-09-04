(function () {
"use strict";
var reduceMotion =
window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
(function compareChecks() {
var checks = document.querySelectorAll(".compare-check");
if (!checks.length) return;
if (reduceMotion || !("IntersectionObserver" in window)) {
checks.forEach(function (c) { c.classList.add("is-visible"); });
return;
}
var io = new IntersectionObserver(
function (entries) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
entry.target.classList.add("is-visible");
io.unobserve(entry.target);
}
});
},
{ threshold: 0.4 }
);
checks.forEach(function (c) { io.observe(c); });
})();
(function calculator() {
var root = document.getElementById("calcRoot");
if (!root) return;
var SERVICES = {
website: { label: "Website Development", price: 600,  unit: "one-time" },
logo:    { label: "Logo Designing",       price: 80,   unit: "one-time" },
seo:     { label: "SEO",                  price: 250,  unit: "month" },
social:  { label: "Social Media Marketing", price: 300, unit: "month" },
video:   { label: "Video Editing",        price: 200,  unit: "one-time" }
};
var EXTRAS = {
revision: { label: "Extra Revision Round", price: 150, unit: "one-time" },
adspend:  { label: "Paid Ad Management",   price: 350, unit: "month" },
manager:  { label: "Dedicated Success Manager", price: 200, unit: "month" }
};
var serviceInputs = root.querySelectorAll("[data-calc-service]");
var levelButtons = root.querySelectorAll("[data-calc-level]");
var extraInputs = root.querySelectorAll("[data-calc-extra]");
var totalEl = document.getElementById("calcOneTime");
var monthlyEl = document.getElementById("calcMonthly");
var listEl = document.getElementById("calcSummaryList");
var emptyEl = document.getElementById("calcSummaryEmpty");
var state = { level: "standard" };
var displayedOneTime = 0;
var displayedMonthly = 0;
function fmt(n) {
return "$" + Math.round(n).toLocaleString("en-US");
}
function tween(fromVal, toVal, onUpdate, done) {
if (reduceMotion) {
onUpdate(toVal);
if (done) done();
return;
}
var start = null;
var duration = 500;
function step(ts) {
if (!start) start = ts;
var p = Math.min(1, (ts - start) / duration);
var eased = 1 - Math.pow(1 - p, 3);
onUpdate(fromVal + (toVal - fromVal) * eased);
if (p < 1) requestAnimationFrame(step);
else if (done) done();
}
requestAnimationFrame(step);
}
function recalc() {
var multiplier = state.level === "priority" ? 1.15 : 1;
var oneTime = 0;
var monthly = 0;
var lines = [];
serviceInputs.forEach(function (input) {
if (!input.checked) return;
var key = input.getAttribute("data-calc-service");
var svc = SERVICES[key];
var price = svc.price * multiplier;
if (svc.unit === "month") monthly += price;
else oneTime += price;
lines.push({ label: svc.label, price: price, unit: svc.unit });
});
extraInputs.forEach(function (input) {
if (!input.checked) return;
var key = input.getAttribute("data-calc-extra");
var ex = EXTRAS[key];
if (ex.unit === "month") monthly += ex.price;
else oneTime += ex.price;
lines.push({ label: ex.label, price: ex.price, unit: ex.unit });
});
if (!lines.length) {
if (emptyEl) emptyEl.style.display = "block";
if (listEl) listEl.innerHTML = "";
} else {
if (emptyEl) emptyEl.style.display = "none";
if (listEl) {
listEl.innerHTML = lines
.map(function (l) {
return (
"<li><span>" +
l.label +
"</span><span>" +
fmt(l.price) +
(l.unit === "month" ? "/mo" : "") +
"</span></li>"
);
})
.join("");
}
}
var fromOneTime = displayedOneTime;
var fromMonthly = displayedMonthly;
tween(fromOneTime, oneTime, function (v) {
if (totalEl) totalEl.textContent = fmt(v);
});
tween(fromMonthly, monthly, function (v) {
if (monthlyEl) {
monthlyEl.textContent = v > 0.5 ? "+ " + fmt(v) + " / month ongoing" : "";
}
});
displayedOneTime = oneTime;
displayedMonthly = monthly;
}
serviceInputs.forEach(function (input) {
input.addEventListener("change", function () {
input.closest(".calc-chip").classList.toggle("is-active", input.checked);
recalc();
});
});
extraInputs.forEach(function (input) {
input.addEventListener("change", function () {
input.closest(".calc-extra-row").classList.toggle("is-active", input.checked);
recalc();
});
});
levelButtons.forEach(function (btn) {
btn.addEventListener("click", function () {
levelButtons.forEach(function (b) { b.classList.remove("is-active"); });
btn.classList.add("is-active");
state.level = btn.getAttribute("data-calc-level");
recalc();
});
});
recalc();
})();
})();
