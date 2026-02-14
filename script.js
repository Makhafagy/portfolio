const rotatingWords = ["AGENTS", "MODELS", "TOKENS", "IMPACT"];
const wordEl = document.getElementById("rotating-word");
let wordIndex = 0;

if (wordEl) {
  setInterval(() => {
    wordIndex = (wordIndex + 1) % rotatingWords.length;
    wordEl.textContent = rotatingWords[wordIndex];
  }, 1700);
}

const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.16 }
);

reveals.forEach((section) => revealObserver.observe(section));

const metricObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const targets = entry.target.querySelectorAll("[data-target]");
      targets.forEach((el) => animateNumber(el));
      obs.unobserve(entry.target);
    });
  },
  { threshold: 0.4 }
);

const metricsSection = document.querySelector(".metrics");
if (metricsSection) {
  metricObserver.observe(metricsSection);
}

function animateNumber(el) {
  const raw = Number(el.dataset.target);
  if (!Number.isFinite(raw)) {
    return;
  }

  const duration = 1200;
  const startTime = performance.now();
  const suffix = el.textContent.includes("%") ? "%" : "";

  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(raw * eased);
    el.textContent = `${value}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

const interestMap = {
  genai: {
    title: "Production GenAI",
    copy: "I focus on LLM systems that are actually usable in production: structured outputs, guardrails, retries, and traceable behavior.",
  },
  mlpipelines: {
    title: "ML Pipelines",
    copy: "I enjoy building practical data-to-model pipelines with clear interfaces, robust preprocessing, and deployment-ready outputs.",
  },
  evaluation: {
    title: "Model Evaluation",
    copy: "I care about evaluation quality, not vanity metrics: thresholding, ambiguity handling, offline checks, and behavior under edge cases.",
  },
  appliedresearch: {
    title: "Applied Research",
    copy: "I like translating promising papers and ideas into lightweight experiments that either prove value fast or get discarded early.",
  },
  funfacts: {
    title: "Interesting Facts",
    copy: "I ranked in the top 550 players globally in Clash Royale and reached the top 0.1% of Rocket League players. Competitive gaming definitely trained my focus and calm under pressure.",
  },
  productai: {
    title: "Product + AI",
    copy: "I work backwards from user behavior and product constraints so every AI decision maps to business impact, not just model complexity.",
  },
};

const pills = document.querySelectorAll(".interest-pill");
const panel = document.getElementById("interest-panel");

pills.forEach((pill) => {
  pill.addEventListener("click", () => {
    pills.forEach((p) => p.classList.remove("is-active"));
    pill.classList.add("is-active");
    const key = pill.dataset.interest;
    const content = interestMap[key];
    if (!content || !panel) {
      return;
    }
    panel.innerHTML = `<h3>${content.title}</h3><p>${content.copy}</p>`;
  });
});

function initProjectStoryButtons() {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach((card) => {
    const storyButtons = [...card.querySelectorAll(".story-btn")];
    const note = card.querySelector(".project-note");

    if (!storyButtons.length || !note) {
      return;
    }

    storyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        storyButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        const next = button.dataset.note;
        if (!next) {
          return;
        }
        note.textContent = next;
        note.classList.remove("note-flash");
        requestAnimationFrame(() => note.classList.add("note-flash"));
      });
    });
  });
}

initProjectStoryButtons();

const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initGoofyProximityEffects() {
  const reactiveElements = [
    ...document.querySelectorAll(".btn, .project-card, .metric-card, .contact-card, .interest-pill, .logo, .topbar nav a"),
  ];

  reactiveElements.forEach((el) => el.classList.add("goofy-reactive"));

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let rafId = 0;

  function resetEffects() {
    reactiveElements.forEach((el) => {
      el.style.transform = "";
      el.style.filter = "";
    });
  }

  function applyEffects() {
    rafId = 0;

    reactiveElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isOffscreen =
        rect.bottom < -120 ||
        rect.top > window.innerHeight + 120 ||
        rect.right < -120 ||
        rect.left > window.innerWidth + 120;

      if (isOffscreen) {
        el.style.transform = "";
        el.style.filter = "";
        return;
      }

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = pointerX - centerX;
      const dy = pointerY - centerY;
      const distance = Math.hypot(dx, dy);
      const radius = Math.max(180, Math.min(340, rect.width * 2));
      const influence = Math.max(0, 1 - distance / radius);

      if (influence < 0.02) {
        el.style.transform = "";
        el.style.filter = "";
        return;
      }

      const isSmallControl = el.classList.contains("btn") || el.classList.contains("interest-pill");
      const scale = 1 + influence * (isSmallControl ? 0.09 : 0.05);
      const lift = -(influence * (isSmallControl ? 7 : 5));
      const tilt = (dx / radius) * (el.classList.contains("project-card") ? 3.5 : 2.4);
      const saturate = 1 + influence * 0.3;

      el.style.transform = `translateY(${lift}px) scale(${scale}) rotate(${tilt}deg)`;
      el.style.filter = `saturate(${saturate})`;
    });
  }

  function scheduleApply() {
    if (rafId) {
      return;
    }
    rafId = requestAnimationFrame(applyEffects);
  }

  document.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    scheduleApply();
  });

  document.addEventListener("pointerleave", resetEffects);
  window.addEventListener("blur", resetEffects);
  window.addEventListener("scroll", scheduleApply, { passive: true });
  window.addEventListener("resize", scheduleApply);
}

function initGoofyScrollEffects() {
  const body = document.body;
  const stickers = [...document.querySelectorAll(".goof-sticker")];
  const scrollBuddy = document.querySelector(".scroll-buddy");
  const buddyFace = document.querySelector(".buddy-face");

  if (!stickers.length && !scrollBuddy) {
    return;
  }

  const stickerConfigs = [
    { depth: 0.07, wobble: 0.015, spin: 0.09 },
    { depth: 0.11, wobble: 0.012, spin: -0.07 },
    { depth: 0.09, wobble: 0.017, spin: 0.06 },
    { depth: 0.13, wobble: 0.01, spin: -0.08 },
  ];

  let lastScrollY = window.scrollY;
  let ticking = false;

  function update() {
    ticking = false;
    const y = window.scrollY;
    const scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, y / scrollMax));
    const delta = y - lastScrollY;

    if (Math.abs(delta) > 1) {
      body.classList.toggle("scroll-down", delta > 0);
      body.classList.toggle("scroll-up", delta < 0);
      lastScrollY = y;
    }

    stickers.forEach((sticker, index) => {
      const cfg = stickerConfigs[index % stickerConfigs.length];
      const swayX = Math.sin((y * cfg.wobble) + index) * 15;
      const driftY = -y * cfg.depth;
      const rotate = (y * cfg.spin) % 360;
      const scale = 1 + Math.sin((y * 0.012) + index * 0.7) * 0.08;

      sticker.style.setProperty("--gx", `${swayX.toFixed(2)}px`);
      sticker.style.setProperty("--gy", `${driftY.toFixed(2)}px`);
      sticker.style.setProperty("--gr", `${rotate.toFixed(2)}deg`);
      sticker.style.setProperty("--gs", scale.toFixed(3));
    });

    if (scrollBuddy) {
      scrollBuddy.style.setProperty("--progress", progress.toFixed(4));
      if (buddyFace) {
        if (progress > 0.86) {
          buddyFace.textContent = "🚀";
        } else if (delta > 2) {
          buddyFace.textContent = "🤪";
        } else if (delta < -2) {
          buddyFace.textContent = "🧠";
        } else {
          buddyFace.textContent = "😎";
        }
      }
    }
  }

  function scheduleUpdate() {
    if (ticking) {
      return;
    }
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  update();
}

initGoofyScrollEffects();

if (supportsFinePointer && !prefersReducedMotion) {
  initGoofyProximityEffects();

  const body = document.body;
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");

  if (cursorDot && cursorRing) {
    body.classList.add("cursor-enabled");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let lastSparkAt = 0;

    function spawnSpark(x, y, burst = false) {
      const now = performance.now();
      const sparkGap = burst ? 0 : 32;
      if (now - lastSparkAt < sparkGap) {
        return;
      }
      lastSparkAt = now;

      const spark = document.createElement("span");
      spark.className = "cursor-spark";
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      const dx = (Math.random() - 0.5) * (burst ? 150 : 90);
      const dy = (Math.random() - 0.5) * (burst ? 150 : 90);
      spark.style.setProperty("--dx", `${dx}px`);
      spark.style.setProperty("--dy", `${dy}px`);
      document.body.appendChild(spark);
      window.setTimeout(() => spark.remove(), 560);
    }

    function tick() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(tick);
    }

    document.addEventListener("pointermove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      body.classList.add("cursor-active");
      spawnSpark(mouseX, mouseY, false);
    });

    document.addEventListener("pointerdown", (event) => {
      for (let i = 0; i < 6; i += 1) {
        spawnSpark(event.clientX, event.clientY, true);
      }
    });

    document.addEventListener("pointerover", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const hoverable = target.closest("a, button, .project-card, .interest-pill, .contact-card");
      body.classList.toggle("cursor-hover", Boolean(hoverable));
    });

    document.addEventListener("pointerleave", () => {
      body.classList.remove("cursor-active");
      body.classList.remove("cursor-hover");
    });

    tick();
  }
}
