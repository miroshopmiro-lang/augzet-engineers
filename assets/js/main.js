/* ============================================================
   AUGZET ENGINEERS — interaction layer
   GSAP + ScrollTrigger · restraint is the aesthetic
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined";

  if (hasGsap && typeof window.ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 80);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");
  if (toggle && mobileMenu) {
    toggle.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        toggle.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Stagger delay for mobile menu links ---------- */
  if (mobileMenu) {
    mobileMenu.querySelectorAll("nav a").forEach(function (a, i) {
      a.style.transitionDelay = 0.06 * i + "s";
    });
  }

  if (reduceMotion || !hasGsap) {
    // Show everything immediately, still run counters instantly
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    document.querySelectorAll("[data-count]").forEach(function (el) {
      el.textContent = Number(el.getAttribute("data-count")).toLocaleString("en-IN");
    });
    initBeats(true);
    initFilters();
    initForm();
    return;
  }

  /* ---------- Hero intro timeline ---------- */
  var heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  if (document.querySelector(".hero")) {
    heroTl
      .from(".hero h1", { y: 56, opacity: 0, duration: 1.0, delay: 0.2 })
      .from(".hero-sub", { y: 26, opacity: 0, duration: 0.8 }, "-=0.55")
      .from(".hero-ctas > *", { y: 24, opacity: 0, duration: 0.6, stagger: 0.12 }, "-=0.45")
      .from(".scroll-cue", { opacity: 0, duration: 0.8 }, "-=0.3");

    /* Hero scene: slow sun rise + panel glint + haze drift */
    var sun = document.querySelector("#hero-sun");
    if (sun) {
      gsap.fromTo(sun, { y: 60 }, { y: 0, duration: 6, ease: "power1.out" });
      gsap.to(sun, { scale: 1.04, transformOrigin: "50% 50%", duration: 5, yoyo: true, repeat: -1, ease: "sine.inOut" });
    }
    var glow = document.querySelector("#hero-glow");
    if (glow) {
      gsap.to(glow, { opacity: 0.75, duration: 4.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
    }
    var haze = document.querySelector("#hero-haze");
    if (haze) {
      gsap.to(haze, { x: 80, duration: 26, yoyo: true, repeat: -1, ease: "sine.inOut" });
    }
    var glint = document.querySelector("#hero-glint");
    if (glint) {
      gsap.fromTo(glint, { x: -400, opacity: 0 },
        { x: 1600, opacity: 0.55, duration: 7, repeat: -1, repeatDelay: 4, ease: "power2.inOut" });
    }

    /* Hero handoff: content fades up as next section arrives */
    gsap.to(".hero-content", {
      y: -50,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "40% top",
        end: "bottom top",
        scrub: true
      }
    });
    /* Subtle scene parallax */
    gsap.to(".hero-scene", {
      yPercent: 14,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  /* ---------- Section reveals ---------- */
  document.querySelectorAll("[data-reveal]").forEach(function (el) {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      delay: parseFloat(el.getAttribute("data-reveal-delay") || 0),
      scrollTrigger: { trigger: el, start: "top 84%", once: true }
    });
  });

  /* Grid cell stagger */
  document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
    if (group.classList.contains("proj-grid")) {
      document.addEventListener("projectsRendered", function () {
        var items = group.children;
        gsap.from(items, {
          opacity: 0,
          y: 32,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: group, start: "top 82%", once: true }
        });
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }
      });
      return;
    }
    var items = group.children;
    gsap.from(items, {
      opacity: 0,
      y: 32,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: "top 82%", once: true }
    });
  });

  /* ---------- Counters ---------- */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var target = Number(el.getAttribute("data-count"));
    var obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 2.2,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      onUpdate: function () {
        el.textContent = Math.round(obj.v).toLocaleString("en-IN");
      }
    });
  });

  /* ---------- Marquee ---------- */
  var track = document.querySelector(".marquee-track");
  if (track) {
    var half = track.scrollWidth / 2;
    gsap.to(track, { x: -half, duration: 28, repeat: -1, ease: "none" });
  }

  /* ---------- Manifesto sun drift ---------- */
  var mSun = document.querySelector(".manifesto-bg-sun");
  if (mSun) {
    gsap.to(mSun, {
      y: "-38%",
      scale: 1.15,
      ease: "none",
      scrollTrigger: { trigger: ".manifesto", start: "top bottom", end: "bottom top", scrub: true }
    });
  }

  initBeats(false);
  initFilters();
  initForm();

  /* ---------- Sticky flagship beats ---------- */
  function initBeats(instant) {
    var beats = document.querySelectorAll(".beat");
    var imgs = document.querySelectorAll(".flagship-media .beat-img");
    if (!beats.length || !imgs.length) return;
    if (instant || !hasGsap || typeof ScrollTrigger === "undefined") {
      imgs[0] && imgs[0].classList.add("is-active");
      return;
    }
    imgs[0].classList.add("is-active");
    beats.forEach(function (beat, i) {
      ScrollTrigger.create({
        trigger: beat,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: function (self) {
          if (self.isActive) {
            imgs.forEach(function (img, j) {
              img.classList.toggle("is-active", i === j);
            });
          }
        }
      });
    });
  }

  /* ---------- Project filters ---------- */
  function initFilters() {
    var bar = document.querySelector(".filter-bar");
    if (!bar) return;
    bar.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      bar.querySelectorAll("button").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var f = btn.getAttribute("data-filter");
      var cards = document.querySelectorAll(".proj-card"); // Query dynamically to account for CMS cards
      cards.forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-cat") === f;
        card.classList.toggle("is-hidden", !show);
      });
      if (hasGsap) {
        gsap.from(".proj-card:not(.is-hidden)", { opacity: 0, y: 20, duration: 0.5, stagger: 0.05, ease: "power2.out" });
      }
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    });
  }

  /* ---------- Quote form (client-side demo handler) ---------- */
  function initForm() {
    var form = document.querySelector(".quote-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var success = document.querySelector(".form-success");
      if (success) {
        success.classList.add("is-visible");
        form.style.display = "none";
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
})();
