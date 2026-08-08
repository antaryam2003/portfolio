/* =============================================================
   Antarya Mondal — Portfolio
   Progressive enhancement only: the site is fully readable
   and navigable with JavaScript disabled.
   ============================================================= */

(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     Theme toggle — persisted, defaults to system preference.
     (The initial theme is applied by an inline script in <head>
      so there is no flash of the wrong theme.)
     --------------------------------------------------------- */
  var themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "light"
          : "dark";
      document.documentElement.setAttribute("data-theme", next);
      themeBtn.setAttribute("aria-pressed", String(next === "dark"));
      try {
        localStorage.setItem("am-theme", next);
      } catch (e) {
        /* private mode — the toggle still works for this session */
      }
    });
  }

  /* ---------------------------------------------------------
     Sticky nav state
     --------------------------------------------------------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------
     Mobile menu
     --------------------------------------------------------- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    var setMenu = function (open) {
      navLinks.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    };

    navToggle.addEventListener("click", function () {
      setMenu(!navLinks.classList.contains("is-open"));
    });

    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    document.addEventListener("click", function (e) {
      if (!navLinks.classList.contains("is-open")) return;
      if (e.target.closest("#nav-links") || e.target.closest("[data-nav-toggle]")) return;
      setMenu(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------- */
  var revealables = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealables.forEach(function (el, i) {
      // Stagger siblings so groups cascade instead of popping in together.
      var group = el.getAttribute("data-reveal");
      if (group === "stagger") {
        var siblings = Array.prototype.slice.call(el.parentElement.children);
        el.style.setProperty("--reveal-delay", siblings.indexOf(el) * 80 + "ms");
      } else if (group && !isNaN(parseInt(group, 10))) {
        el.style.setProperty("--reveal-delay", parseInt(group, 10) + "ms");
      }
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------
     Profile photo fallback — shows an "AM" monogram until a real
     photo is dropped at assets/img/profile.jpg
     --------------------------------------------------------- */
  var photo = document.querySelector("[data-photo]");
  if (photo) {
    var showMonogram = function () {
      photo.style.display = "none";
      var mono = document.querySelector("[data-monogram]");
      if (mono) mono.hidden = false;
    };
    if (photo.complete && photo.naturalWidth === 0) showMonogram();
    photo.addEventListener("error", showMonogram);
  }

  /* ---------------------------------------------------------
     Case study: active section in the table of contents
     --------------------------------------------------------- */
  var tocLinks = document.querySelectorAll(".toc a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var sections = [];
    tocLinks.forEach(function (link) {
      var target = document.getElementById(link.getAttribute("href").slice(1));
      if (target) sections.push({ link: link, target: target });
    });

    var tocObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          tocLinks.forEach(function (l) {
            l.classList.remove("is-active");
          });
          var match = sections.filter(function (s) {
            return s.target === entry.target;
          })[0];
          if (match) match.link.classList.add("is-active");
        });
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );

    sections.forEach(function (s) {
      tocObserver.observe(s.target);
    });
  }

  /* ---------------------------------------------------------
     Responsive tables

     The case study tables are authored for a desktop column and
     are wider than a phone. Sideways-scrolling them means reading
     values with their headings scrolled off screen — and where a
     wrapper clips instead of scrolling, the last column cannot be
     reached at all. So each cell is given its column heading and
     the rows stack into cards on small screens (see responsive.css).

     Two-column tables are left alone beyond dropping the authored
     minimum width; they already fit.
     --------------------------------------------------------- */
  var tables = document.querySelectorAll("table");

  Array.prototype.forEach.call(tables, function (table) {
    var headRow = table.querySelector("thead tr");
    if (!headRow) return;

    var labels = Array.prototype.map.call(headRow.children, function (cell) {
      return (cell.textContent || "").replace(/\s+/g, " ").trim();
    });

    if (labels.length < 3) {
      table.setAttribute("data-fit", "");
      return;
    }

    var bodyRows = table.querySelectorAll("tbody tr");
    Array.prototype.forEach.call(bodyRows, function (row) {
      Array.prototype.forEach.call(row.children, function (cell, i) {
        // Skip blank headings — a label of "" would render an empty line.
        if (labels[i]) cell.setAttribute("data-label", labels[i]);
      });
    });

    table.setAttribute("data-stack", "");
  });

  /* ---------------------------------------------------------
     Scroll affordance for wide figures

     Blueprints, Gantt charts and wide SVGs are two-dimensional —
     stacking them would destroy the comparison they exist to make,
     so they keep scrolling sideways. Nothing on a touch device
     signals that a box scrolls, so anything actually overflowing
     gets a line of text saying so.
     --------------------------------------------------------- */
  var scrollers = [];

  Array.prototype.forEach.call(
    document.querySelectorAll(
      "figure div, figure, .table-scroll, .blueprint, .gantt, .scroll-x"
    ),
    function (el) {
      var overflowX = window.getComputedStyle(el).overflowX;
      if (overflowX !== "auto" && overflowX !== "scroll") return;
      if (scrollers.indexOf(el) !== -1) return;

      var hint = document.createElement("p");
      hint.className = "scroll-hint";
      hint.setAttribute("aria-hidden", "true");
      hint.textContent = "Swipe sideways to see all of it →";
      el.parentNode.insertBefore(hint, el.nextSibling);

      scrollers.push(el);
    }
  );

  // Enough hidden width to be worth telling someone about. A dozen
  // stray pixels from rounding is not a hidden column, and prompting
  // for it on a desktop the figure very nearly fits reads as noise.
  var SCROLL_HINT_THRESHOLD = 28;

  function refreshScrollHints() {
    scrollers.forEach(function (el) {
      var hidden = el.scrollWidth - el.clientWidth;
      el.classList.toggle("is-scrollable", hidden > SCROLL_HINT_THRESHOLD);
    });
  }

  if (scrollers.length) {
    refreshScrollHints();

    // Stacking a table changes what overflows, and so does rotating
    // the phone. Re-check on resize, throttled to one frame.
    var pending = false;
    window.addEventListener("resize", function () {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(function () {
        pending = false;
        refreshScrollHints();
      });
    });

    // Fonts land after first paint and change measured widths.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refreshScrollHints);
    }
  }

  /* ---------------------------------------------------------
     Footer year
     --------------------------------------------------------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
