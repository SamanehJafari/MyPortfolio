"use strict";

const siteHeader = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-nav");
const menuBreakpoint = typeof window.matchMedia === "function"
  ? window.matchMedia("(max-width: 900px)")
  : null;

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
}

// Only collapse navigation after its controls have initialized successfully.
// Without JavaScript, the links remain visible in the mobile layout.
if (menuBreakpoint) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
  });
  navigation.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    closeMenu();
    if (menuBreakpoint.matches) {
      const destination = document.querySelector(link.getAttribute("href"));
      if (destination) {
        destination.setAttribute("tabindex", "-1");
        destination.focus({ preventScroll: true });
      }
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!siteHeader.contains(event.target)) closeMenu();
  });
  siteHeader.addEventListener("focusout", (event) => {
    if (!siteHeader.contains(event.relatedTarget)) closeMenu();
  });
  const onBreakpointChange = () => {
    const focusInNavigation = navigation.contains(document.activeElement);
    const focusOnToggle = document.activeElement === menuButton;
    closeMenu();
    if (menuBreakpoint.matches && focusInNavigation) menuButton.focus();
    else if (!menuBreakpoint.matches && focusOnToggle) navigation.querySelector("a").focus();
  };
  if (typeof menuBreakpoint.addEventListener === "function") {
    menuBreakpoint.addEventListener("change", onBreakpointChange);
  } else if (typeof menuBreakpoint.addListener === "function") {
    menuBreakpoint.addListener(onBreakpointChange);
  }
  siteHeader.setAttribute("data-menu-ready", "");
}

const notice = document.querySelector("#project-notice");
let noticeTimeout;
document.querySelectorAll("[data-placeholder]").forEach((project) => {
  project.addEventListener("click", (event) => {
    event.preventDefault();
    notice.textContent = project.querySelector("h3").textContent + " is coming soon. A live link will be added here.";
    notice.classList.add("visible");
    clearTimeout(noticeTimeout);
    noticeTimeout = setTimeout(() => notice.classList.remove("visible"), 4500);
  });
});

const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === "#" + entry.target.id) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
  }, { rootMargin: "-15% 0px -65% 0px", threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}
document.querySelector("#year").textContent = String(new Date().getFullYear());
