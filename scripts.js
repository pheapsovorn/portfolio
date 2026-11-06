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
const langBtns = document.querySelectorAll(".lang-btn");

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* =========================================================
   TELEGRAM CONFIG
========================================================= */
const TELEGRAM_BOT_TOKEN = "8932506421:AAE4GJp2Q1T_0OgPNDnh0ZS2oIGhGl8Wgn4";
const TELEGRAM_CHAT_ID = "7234177204";

/* =========================================================
   i18n — LANGUAGE SYSTEM
========================================================= */
const STORAGE_KEY = "ps_lang";
let currentLang = (localStorage.getItem(STORAGE_KEY) || "en").toLowerCase();
if (currentLang !== "en" && currentLang !== "kh") currentLang = "en";

const typedRoles = {
  en: [
    "Software Development Student",
    "Front-End Developer",
    "Web Developer",
    "Future Full-Stack Developer",
    "IT Student at IMSE",
  ],
  kh: [
    "និស្សិតអភិវឌ្ឍន៍កម្មវិធី",
    "អ្នកអភិវឌ្ឍន៍ Front-End",
    "អ្នកអភិវឌ្ឍន៍គេហទំព័រ",
    "អ្នកអភិវឌ្ឍន៍ Full-Stack អនាគត",
    "និស្សិត IT នៅ IMSE",
  ],
};

const formI18n = {
  en: {
    required: "Please fill in all required fields.",
    invalidEmail: "Please enter a valid email address.",
    sending: "Sending your message...",
    sendingBtn: "Sending...",
    success: (name) => `✅ Message sent! Thank you, ${name}. I'll reply soon.`,
    sendError: (reason) => `❌ Could not send. ${reason || "Please try again."}`,
    networkError: "❌ Network error. Please check your connection and try again.",
    noProject: "Project link will be added soon.",
  },
  kh: {
    required: "សូមបំពេញវាលដែលចាំបាច់ទាំងអស់។",
    invalidEmail: "សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ។",
    sending: "កំពុងផ្ញើសាររបស់អ្នក...",
    sendingBtn: "កំពុងផ្ញើ...",
    success: (name) => `✅ សារបានផ្ញើ! អរគុណ ${name}។ ខ្ញុំនឹងឆ្លើយតបឆាប់ៗនេះ។`,
    sendError: (reason) => `❌ មិនអាចផ្ញើបានទេ។ ${reason || "សូមព្យាយាមម្តងទៀត។"}`,
    networkError: "❌ កំហុសបណ្តាញ។ សូមពិនិត្យការតភ្ជាប់របស់អ្នក ហើយព្យាយាមម្តងទៀត។",
    noProject: "តំណគម្រោងនឹងត្រូវបានបន្ថែមឆាប់ៗនេះ។",
  },
};

/* Split string into grapheme clusters (safe for Khmer combining marks) */
function splitGraphemes(str) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(str)].map(
      (s) => s.segment
    );
  }
  return [...str];
}

/* Splits a title <h1> into per-character spans for the pop animation. */
function renderTitles(lang) {
  document.querySelectorAll(".title h1").forEach((h1) => {
    const text = h1.dataset[lang] || h1.textContent;
    h1.setAttribute("aria-label", text);

    if (lang === "kh") {
      // Khmer combining marks break if split into characters → plain text.
      h1.textContent = text;
    } else {
      h1.innerHTML = [...text]
        .map((c, i) => `<span class="ch" style="--i:${i}" aria-hidden="true">${c}</span>`)
        .join("");
    }
  });
}

/* Apply a language to the entire page. */
function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.setAttribute("lang", lang);

  // Title tag
  document.title =
    lang === "kh" ? "គេហទំព័រប្រវត្តិរូបផ្ទាល់ខ្លួន" : "Personal Profile Website";

  // Toggle buttons
  langBtns.forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));

  // Text content (skip titles — handled by renderTitles — and busy buttons)
  document.querySelectorAll("[data-en][data-kh]").forEach((el) => {
    if (el.matches(".title h1")) return;
    if (el.tagName === "BUTTON" && el.disabled) return;
    el.textContent = el.dataset[lang];
  });

  // Placeholders
  document.querySelectorAll("[data-en-ph][data-kh-ph]").forEach((el) => {
    el.placeholder = lang === "kh" ? el.dataset.khPh : el.dataset.enPh;
  });

  // Aria-labels
  document.querySelectorAll("[data-en-aria][data-kh-aria]").forEach((el) => {
    el.setAttribute("aria-label", lang === "kh" ? el.dataset.khAria : el.dataset.enAria);
  });

  // Titles
  renderTitles(lang);

  // Typing effect (restart with new language)
  startTyping();
}

/* Wire up the toggle buttons */
langBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang;
    if (lang && lang !== currentLang) applyLanguage(lang);
  });
});

/* =========================================================
   SCROLL
========================================================= */
function handleScroll() {
  const scrollTop = window.scrollY;
  const documentHeight =
    document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const percentage = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

  progress.style.width = percentage + "%";

  header.classList.toggle("scrolled", scrollTop > 40);
  toTop.classList.toggle("show", scrollTop > 500);

  updateActiveNav();
}

window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

/* =========================================================
   BACK TO TOP
========================================================= */
toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
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
let typingGen = 0;

function startTyping() {
  if (!typed) return;

  typingGen++;
  const gen = typingGen;
  const roles = typedRoles[currentLang].map(splitGraphemes);

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function step() {
    if (gen !== typingGen) return;

    const chars = roles[roleIndex];

    if (!deleting) {
      typed.textContent = chars.slice(0, charIndex).join("");
      charIndex++;
      if (charIndex > chars.length) {
        deleting = true;
        setTimeout(step, 1500);
        return;
      }
    } else {
      typed.textContent = chars.slice(0, charIndex).join("");
      charIndex--;
      if (charIndex < 0) {
        charIndex = 0;
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(step, deleting ? 45 : 90);
  }

  step();
}

/* =========================================================
   SCROLL REVEAL
========================================================= */
const revealElements = document.querySelectorAll(
  ".section-heading, .about-grid, .stats-grid, .project-card, .contact-wrapper"
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
  { threshold: 0.12 }
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
    if (link.getAttribute("href") === "#" + currentSection) {
      link.classList.add("active");
    }
  });
}

/* =========================================================
   CONTACT FORM → TELEGRAM
========================================================= */
if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const service = document.getElementById("service").value;
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();
    const signup = document.querySelector('input[name="signup"]').checked;

    const t = formI18n[currentLang];

    formMessage.className = "form-message";

    if (!firstName || !lastName || !email || !phone) {
      showFormMessage(t.required, "error");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showFormMessage(t.invalidEmail, "error");
      return;
    }

    const telegramText = [
      "📬 New Contact Form Message",
      "──────────────────",
      "👤 First Name: " + firstName,
      "👤 Last Name: " + lastName,
      "🛠 Service: " + (service || "Not selected"),
      "📧 Email: " + email,
      "📞 Phone: " + phone,
      "📨 Sign up: " + (signup ? "Yes" : "No"),
      "──────────────────",
      "📝 Project Description:",
      message || "(No additional notes)",
    ].join("\n");

    const submitBtn = contactForm.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = t.sendingBtn;
    showFormMessage(t.sending, "success");

    try {
      const url = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramText,
          disable_web_page_preview: true,
        }),
      });

      const data = await response.json();

      if (data.ok) {
        showFormMessage(t.success(firstName), "success");
        contactForm.reset();
      } else {
        console.error("Telegram API error:", data);
        showFormMessage(t.sendError(data.description), "error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      showFormMessage(t.networkError, "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset[currentLang];
    }
  });
}

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = "form-message show " + type;

  clearTimeout(showFormMessage._t);
  showFormMessage._t = setTimeout(
    () => formMessage.classList.remove("show"),
    type === "error" ? 7000 : 5000
  );
}

/* =========================================================
   PROJECT LINKS
========================================================= */
document.querySelectorAll(".project-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (href === "#" || href === "") {
      event.preventDefault();
      alert(formI18n[currentLang].noProject);
    }
  });
});

/* =========================================================
   SMOOTH ANCHOR LINKS
========================================================= */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
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
      "perspective(1000px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
  });

  heroVisual.addEventListener("mouseleave", () => {
    const codeWindow = heroVisual.querySelector(".code-window");
    if (codeWindow) codeWindow.style.transform = "";
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

/* =========================================================
   ABOUT WHEEL
========================================================= */
const fan = document.querySelector(".about-fan");

if (fan) {
  const ring = fan.querySelector(".ring");
  const originals = [...ring.children];
  const total = originals.length * Math.ceil(24 / originals.length);
  const angle = 360 / total;
  const gap = 14;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let spin = 0,
    vel = 0,
    degPerPx = 0.05;
  let dragging = false,
    hover = false,
    visible = false,
    lastX = 0;

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

  function layout() {
    const cs = getComputedStyle(fan);
    const w = parseFloat(cs.getPropertyValue("--w"));
    const h = parseFloat(cs.getPropertyValue("--h"));
    const chord = w + gap;
    const r = chord / (2 * Math.sin((angle * Math.PI) / 360)) - h / 2;
    fan.style.setProperty("--r", r + "px");
    degPerPx = angle / chord;
  }
  layout();
  window.addEventListener("resize", layout);

  function tick() {
    if (!dragging) {
      if (Math.abs(vel) > 0.01) {
        spin += vel;
        vel *= 0.95;
      } else if (!hover && !reduce) {
        spin -= 0.01;
      }
    }
    ring.style.transform = `rotate(${spin}deg)`;
    if (visible) requestAnimationFrame(tick);
  }

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

/* =========================================================
   INITIALISE LANGUAGE
========================================================= */
applyLanguage(currentLang);