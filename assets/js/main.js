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
    /* Trigger positions are measured at script time, before images and
       fonts settle — photos further down the page then shift every
       trigger's real position (~600px measured), so reveals/counters can
       fire at the wrong scroll offset or never. Re-measure once the page
       is fully loaded. */
    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });
  }

  /* ---------- Hero buffering indicator ----------
     Sits above this file's reduce-motion early-return on purpose: it is a
     loading affordance, not decoration, so it must run even when GSAP is
     absent or the user has reduced motion on (the CSS drops the spin in
     that case, keeping the ring static).

     Hidden on the first signal that playback is genuinely underway.
     "playing" is the accurate event, but Safari/iOS can autoplay muted
     video without ever firing it reliably, so canplaythrough and a
     readyState poll back it up. The 12s ceiling means a stalled or failed
     download degrades to "poster only" rather than spinning forever. */
  var heroLoader = document.querySelector("[data-hero-loader]");
  var heroVideo = document.querySelector(".hero-video");
  if (heroLoader) {
    var hideLoader = function () {
      if (!heroLoader || heroLoader.classList.contains("is-hidden")) return;
      heroLoader.classList.add("is-hidden");
      window.setTimeout(function () {
        heroLoader.parentNode && heroLoader.parentNode.removeChild(heroLoader);
      }, 600);
    };
    if (!heroVideo) {
      hideLoader();
    } else {
      // HAVE_FUTURE_DATA or better means it can actually start.
      if (heroVideo.readyState >= 3 && !heroVideo.paused) hideLoader();
      ["playing", "canplaythrough"].forEach(function (evt) {
        heroVideo.addEventListener(evt, hideLoader, { once: true });
      });
      heroVideo.addEventListener("error", hideLoader, { once: true });
      window.setTimeout(hideLoader, 12000);
    }
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
  /* The overlay covers the page but the page stays in the tab order behind
     it, so before this a keyboard user opening the menu tabbed straight
     into invisible content, Escape did nothing, and focus never returned
     to the toggle. Below 1024px this IS the primary navigation, so it was
     effectively keyboard-inaccessible on the site's main breakpoint. */
  var toggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");
  if (toggle && mobileMenu) {
    var setMenu = function (open) {
      mobileMenu.classList.toggle("is-open", open);
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
      // Hide the rest of the page from assistive tech while the overlay is up.
      [].forEach.call(document.body.children, function (el) {
        if (el === mobileMenu || el.contains(mobileMenu) || el.tagName === "SCRIPT") return;
        if (open) { el.setAttribute("aria-hidden", "true"); el.setAttribute("inert", ""); }
        else { el.removeAttribute("aria-hidden"); el.removeAttribute("inert"); }
      });
      if (open) {
        var first = mobileMenu.querySelector("a, button");
        first && first.focus();
      } else {
        toggle.focus();
      }
    };

    toggle.addEventListener("click", function () {
      setMenu(!mobileMenu.classList.contains("is-open"));
    });

    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (!mobileMenu.classList.contains("is-open")) return;
      if (e.key === "Escape") { setMenu(false); return; }
      if (e.key !== "Tab") return;
      // Trap: cycle focus inside the overlay.
      var items = mobileMenu.querySelectorAll("a, button");
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
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
      .from(".hero-proof", { y: 18, opacity: 0, duration: 0.6 }, "-=0.35")
      .from(".scroll-cue", { opacity: 0, duration: 0.8 }, "-=0.3");

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
    var mHalf = track.scrollWidth / 2;
    gsap.to(track, { x: -mHalf, duration: 28, repeat: -1, ease: "none" });
  }

  /* ---------- Review rail ----------
     Same infinite-rail technique as the marquee. The track is duplicated
     in JS rather than in the HTML so the seven reviews are authored once
     and stay a single source of truth. */
  var rail = document.querySelector(".review-track");
  if (rail) {
    rail.innerHTML += rail.innerHTML;
    var half = rail.scrollWidth / 2;
    gsap.to(rail, { x: -half, duration: 60, repeat: -1, ease: "none" });
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

    /* The markup carried role="tablist" on the bar with plain <button>
       children — no role="tab", no aria-selected, no tabpanel — which
       announces a tab list containing zero tabs, worse than no role at
       all. These are filter toggles, not tabs, so the roles are dropped
       and aria-pressed is used instead. A live region announces the
       result count, which previously changed silently. */
    bar.removeAttribute("role");
    var buttons = bar.querySelectorAll("button");
    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", b.classList.contains("is-active") ? "true" : "false");
    });

    var live = document.getElementById("filter-status");
    if (!live) {
      live = document.createElement("p");
      live.id = "filter-status";
      live.className = "visually-hidden";
      live.setAttribute("role", "status");
      live.setAttribute("aria-live", "polite");
      bar.parentNode.insertBefore(live, bar.nextSibling);
    }

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      buttons.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      var f = btn.getAttribute("data-filter");
      var cards = document.querySelectorAll(".proj-card"); // Query dynamically to account for CMS cards
      var shown = 0;
      cards.forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-cat") === f;
        card.classList.toggle("is-hidden", !show);
        if (show) shown++;
      });
      live.textContent = shown + (shown === 1 ? " project" : " projects") + " shown for " + btn.textContent.trim() + ".";
      if (hasGsap) {
        gsap.from(".proj-card:not(.is-hidden)", { opacity: 0, y: 20, duration: 0.5, stagger: 0.05, ease: "power2.out" });
      }
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    });
  }

  /* ---------- Quote form ----------
     This used to call preventDefault(), hide the form and reveal a panel
     reading "RECEIVED. AN ENGINEER REVIEWS EVERY REQUEST." — while the
     <form> had no action and carried `novalidate`, so a completely empty
     submission produced that same confirmation and nothing was sent
     anywhere. The site was issuing a false receipt: the prospect waited a
     business day, heard nothing, and concluded Augzet was unprofessional.

     Until a real endpoint is wired (deferred by the client, 2026-08-07),
     the form composes the enquiry into a mail draft to the address the
     site already publishes. It is not as good as a POST to a CRM, but it
     delivers, and it never claims to have delivered when it hasn't.

     TO GO LIVE: replace the body of this handler with a fetch() POST to
     the endpoint, and only then show a confirmation. Do not restore a
     confirmation that fires without a successful response. */
  function initForm() {
    var form = document.querySelector(".quote-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var get = function (name) {
        var el = form.elements[name];
        return el && el.value ? el.value.trim() : "";
      };

      var lines = [
        ["Name", get("name")],
        ["Phone", get("phone")],
        ["Email", get("email")],
        ["Location", get("location")],
        ["Project type", get("type")],
        ["Monthly bill", get("bill")],
        ["Details", get("message")]
      ].filter(function (pair) { return pair[1]; })
       .map(function (pair) { return pair[0] + ": " + pair[1]; });

      var subject = "Quote request" + (get("type") ? " — " + get("type") : "");
      var href = "mailto:info@augzet.com"
        + "?subject=" + encodeURIComponent(subject)
        + "&body=" + encodeURIComponent(lines.join("\n"));

      var status = document.querySelector(".form-success");
      if (status) {
        status.classList.add("is-visible");
        status.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      window.location.href = href;
    });
  }
})();
