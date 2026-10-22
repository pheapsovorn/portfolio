/* =========================================================
   PHEAP SOVORN PORTFOLIO
   JAVASCRIPT
========================================================= */

const body = document.body;

const header = document.getElementById("header");
const progress = document.getElementById("progress");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const toTop = document.getElementById("toTop");
const typed = document.getElementById("typed");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

const navLinks = document.querySelectorAll(".nav-link");

const canHover = window.matchMedia(
  "(hover: hover) and (pointer: fine)",
).matches;
// splits every .title h1 into letters so each one animates
document.querySelectorAll('.title h1').forEach((h1) => {
  const text = h1.textContent.trim();
  h1.setAttribute('aria-label', text);
  h1.innerHTML = [...text]
    .map((c, i) => `<span class="ch" style="--i:${i}" aria-hidden="true">${c}</span>`)
    .join('');
});

/* =========================================================
   SCROLL
========================================================= */

function handleScroll() {
  const scrollTop = window.scrollY;
  const documentHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const percentage =
    documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

  progress.style.width = percentage + "%";

  if (scrollTop > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  if (scrollTop > 500) {
    toTop.classList.add("show");
  } else {
    toTop.classList.remove("show");
  }

  updateActiveNav();
}

window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

/* =========================================================
   BACK TO TOP
========================================================= */

toTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

/* =========================================================
   MOBILE MENU
========================================================= */

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("open");
  nav.classList.toggle("open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuBtn.classList.remove("open");
    nav.classList.remove("open");
  });
});

document.addEventListener("click", (event) => {
  const clickedInsideNav = nav.contains(event.target);
  const clickedMenu = menuBtn.contains(event.target);

  if (!clickedInsideNav && !clickedMenu && nav.classList.contains("open")) {
    nav.classList.remove("open");
    menuBtn.classList.remove("open");
  }
});

/* =========================================================
   TYPING EFFECT
========================================================= */

const roles = [
  "Software Development Student",
  "Front-End Developer",
  "Web Developer",
  "Future Full-Stack Developer",
  "IT Student at IMSE",
];

let roleIndex = 0;
let characterIndex = 0;
let deleting = false;

function typingEffect() {
  const currentRole = roles[roleIndex];

  if (!deleting) {
    typed.textContent = currentRole.substring(0, characterIndex);
    characterIndex++;

    if (characterIndex > currentRole.length) {
      deleting = true;
      setTimeout(typingEffect, 1500);
      return;
    }
  } else {
    typed.textContent = currentRole.substring(0, characterIndex);
    characterIndex--;

    if (characterIndex < 0) {
      characterIndex = 0;
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  const speed = deleting ? 45 : 90;
  setTimeout(typingEffect, speed);
}

if (typed) {
  typingEffect();
}

/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements = document.querySelectorAll(
  ".section-heading, " +
    ".about-grid, " +
    ".stats-grid, " +
    ".project-card, " +
    ".contact-wrapper",
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

revealElements.forEach((element) => {
  element.classList.add("reveal");
  revealObserver.observe(element);
});

/* =========================================================
   ACTIVE NAV
========================================================= */

function updateActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  let currentSection = "home";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 180;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const target = link.getAttribute("href");

    if (target === "#" + currentSection) {
      link.classList.add("active");
    }
  });
}

/* =========================================================
   CONTACT FORM
========================================================= */

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  formMessage.className = "form-message";

  if (!firstName || !lastName || !email || !message) {
    showFormMessage("Please fill in all required fields.", "error");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showFormMessage("Please enter a valid email address.", "error");
    return;
  }

  showFormMessage("Message ready! Thank you for contacting me.", "success");

  contactForm.reset();
});

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = "form-message show " + type;

  setTimeout(() => {
    formMessage.classList.remove("show");
  }, 5000);
}

/* =========================================================
   PROJECT LINKS
========================================================= */

const projectLinks = document.querySelectorAll(".project-link");

projectLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (href === "#" || href === "") {
      event.preventDefault();
      alert("Project link will be added soon.");
    }
  });
});

/* =========================================================
   SMOOTH ANCHOR LINKS
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");

    if (targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

    if (target) {
      event.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

/* =========================================================
   MOUSE PARALLAX — HERO CODE WINDOW
========================================================= */

const heroVisual = document.querySelector(".hero-visual");

if (heroVisual && canHover) {
  heroVisual.addEventListener("mousemove", (event) => {
    const codeWindow = heroVisual.querySelector(".code-window");
    if (!codeWindow) return;

    const rect = heroVisual.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 35;
    const rotateY = (centerX - x) / 35;

    codeWindow.style.transform =
      "perspective(1000px) " +
      "rotateX(" +
      rotateX +
      "deg) " +
      "rotateY(" +
      rotateY +
      "deg)";
  });

  heroVisual.addEventListener("mouseleave", () => {
    const codeWindow = heroVisual.querySelector(".code-window");
    if (codeWindow) {
      codeWindow.style.transform = "";
    }
  });
}

/* =========================================================
   KEYBOARD ESCAPE
========================================================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    nav.classList.remove("open");
    menuBtn.classList.remove("open");
  }
});

/* =========================================================
   PAGE LOADED
========================================================= */

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  updateActiveNav();
});
/* ===== ABOUT WHEEL ===== */
const fan = document.querySelector(".about-fan");

if (fan) {
  const ring = fan.querySelector(".ring");
  const originals = [...ring.children];
  const total = originals.length * Math.ceil(24 / originals.length);
  const angle = 360 / total;
  const gap = 14;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let spin = 0, vel = 0, degPerPx = 0.05;
  let dragging = false, hover = false, visible = false, lastX = 0;

  // fill the full circle by repeating the images
  for (let i = originals.length; i < total; i++) {
    const clone = originals[i % originals.length].cloneNode();
    clone.alt = "";
    ring.appendChild(clone);
  }
  [...ring.children].forEach((img, i) => {
    img.style.setProperty("--i", i);
    img.draggable = false;
  });
  fan.style.setProperty("--angle", angle);

  // radius so neighbouring cards almost touch (recalculated on resize)
  function layout() {
    const cs = getComputedStyle(fan);
    const w = parseFloat(cs.getPropertyValue("--w"));
    const h = parseFloat(cs.getPropertyValue("--h"));
    const chord = w + gap;
    const r = chord / (2 * Math.sin((angle * Math.PI) / 360)) - h / 2;
    fan.style.setProperty("--r", r + "px");
    degPerPx = angle / chord; // cards follow the finger 1:1
  }
  layout();
  window.addEventListener("resize", layout);

  function tick() {
    if (!dragging) {
      if (Math.abs(vel) > 0.01) {
        spin += vel;
        vel *= 0.95; // inertia after letting go
      } else if (!hover && !reduce) {
        spin -= 0.01; // slow auto-rotate
      }
    }
    ring.style.transform = `rotate(${spin}deg)`;
    if (visible) requestAnimationFrame(tick);
  }

  // only animate while the section is on screen
  new IntersectionObserver(([entry]) => {
    const wasVisible = visible;
    visible = entry.isIntersecting;
    if (visible && !wasVisible) requestAnimationFrame(tick);
  }).observe(fan);

  fan.addEventListener("mouseenter", () => (hover = true));
  fan.addEventListener("mouseleave", () => (hover = false));

  fan.addEventListener("pointerdown", (e) => {
    dragging = true;
    vel = 0;
    lastX = e.clientX;
    fan.setPointerCapture(e.pointerId);
    fan.classList.add("dragging");
  });
  fan.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const d = (e.clientX - lastX) * degPerPx;
    lastX = e.clientX;
    spin += d;
    vel = d;
  });
  ["pointerup", "pointercancel"].forEach((ev) =>
    fan.addEventListener(ev, () => {
      dragging = false;
      fan.classList.remove("dragging");
    })
  );
}