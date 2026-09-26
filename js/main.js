/* ==========================================================================
   Shivam Enterprise — site behaviour
   No dependencies. Progressive enhancement: with JS off, the page still
   reads and the contact details are reachable via the <noscript> blocks.
   ========================================================================== */
(function () {
  "use strict";

  var SITE = window.SITE || null;

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* FormData -> plain object.
     Note: FormData has no .length and is not indexable - forEach() is the
     only reliable accessor, and it is supported everywhere back to IE-less
     Chrome 50 / Safari 11, so there is no need for Object.fromEntries. */
  function toObject(formData) {
    var out = {};
    formData.forEach(function (value, key) { out[key] = value; });
    return out;
  }

  /* Safari < 14 only has the deprecated matchMedia listener API. */
  function onMediaChange(query, handler) {
    var mq = window.matchMedia(query);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else if (mq.addListener) mq.addListener(handler);
  }

  /* ======================================================================
     CONTACT DETAILS — rendered from js/data.js
     ====================================================================== */
  function icon(id) {
    return '<svg class="icon" aria-hidden="true"><use href="#' + id + '"></use></svg>';
  }

  function contactItem(iconId, label, valueHtml) {
    return (
      '<div class="contact-item">' +
        '<div class="contact-item__icon">' + icon(iconId) + '</div>' +
        '<div class="contact-item__body">' +
          '<span class="contact-item__label">' + label + '</span>' +
          valueHtml +
        '</div>' +
      '</div>'
    );
  }

  function renderContact() {
    if (!SITE) return;
    var k = SITE.contact;
    var name = SITE.business.name || "Shivam Enterprise";
    var addr = k.address.map(esc).join("<br>");

    /* Optional rows are omitted entirely when empty, so the site never shows
       a dead mailto: link or an empty contact. */
    var emailRow = k.email
      ? contactItem("i-mail", "Email", '<a class="contact-item__value" href="mailto:' +
          esc(k.email) + '">' + esc(k.email) + "</a>")
      : "";

    var person = k.person && k.person.name ? k.person : null;
    var personRow = person && person.phone
      ? contactItem("i-user", person.role ? person.role : "Contact", '<a class="contact-item__value" href="tel:' +
          esc(person.phoneTel || person.phone) + '">' + esc(person.name) + " &middot; " + esc(person.phone) + "</a>")
      : "";

    var waGreeting = "Hello " + name + ", I would like to know more about your yarn supply and services.";
    var waRow = contactItem("i-whatsapp", "WhatsApp",
      '<a class="contact-item__value" href="' + waLink(waGreeting) +
      '" target="_blank" rel="noopener">Chat on WhatsApp</a>');

    var rows =
      contactItem("i-pin", "Address",
        '<span class="contact-item__value contact-item__value--plain">' + addr + "</span>") +
      contactItem("i-phone", "Phone", '<a class="contact-item__value" href="tel:' +
        esc(k.phoneTel) + '">' + esc(k.phoneDisplay) + "</a>") +
      waRow + emailRow + personRow;

    // The Location section shows address first, then reach-us options.
    var loc = $("#location-contact");
    if (loc) loc.innerHTML = rows;

    var list = $("#contact-list");
    if (list) {
      list.innerHTML =
        contactItem("i-phone", "Phone", '<a class="contact-item__value" href="tel:' +
          esc(k.phoneTel) + '">' + esc(k.phoneDisplay) + "</a>") +
        waRow + emailRow + personRow +
        contactItem("i-pin", "Address",
          '<span class="contact-item__value contact-item__value--plain">' + addr + "</span>");
    }

    var foot = $("#footer-contact");
    if (foot) {
      foot.innerHTML =
        "<li><a href='tel:" + esc(k.phoneTel) + "'>" + esc(k.phoneDisplay) + "</a></li>" +
        (k.email ? "<li><a href='mailto:" + esc(k.email) + "'>" + esc(k.email) + "</a></li>" : "") +
        (person && person.phone
          ? "<li><a href='tel:" + esc(person.phoneTel || person.phone) + "'>" +
            esc(person.name) + " &middot; " + esc(person.phone) + "</a></li>"
          : "") +
        "<li><span>" + addr + "</span></li>";
    }

    /* Social icons live in their own row. They stay hidden until a real URL
       is supplied, so the site never ships a dead link. */
    var socialRow = document.querySelector(".footer__social");
    if (socialRow) {
      var s = k.social || {};
      var icons = "";
      if (s.instagram) {
        icons += '<a href="' + esc(s.instagram) + '" target="_blank" rel="noopener"' +
          ' aria-label="' + esc(SITE.business.name) + ' on Instagram">' +
          '<svg class="icon" aria-hidden="true"><use href="#i-instagram"></use></svg></a>';
      }
      if (s.facebook) {
        icons += '<a href="' + esc(s.facebook) + '" target="_blank" rel="noopener"' +
          ' aria-label="' + esc(SITE.business.name) + ' on Facebook">' +
          '<svg class="icon" aria-hidden="true"><use href="#i-facebook"></use></svg></a>';
      }
      socialRow.innerHTML = icons;
      socialRow.hidden = icons === "";
    }
  }

  /* ======================================================================
     AREAS WE SUPPLY + MAP — rendered from js/data.js
     ====================================================================== */
  function renderLocation() {
    if (!SITE) return;

    var list = $("#areas-list");
    if (list && Array.isArray(SITE.areas) && SITE.areas.length) {
      list.innerHTML = SITE.areas
        .map(function (a) { return "<li>" + esc(a) + "</li>"; })
        .join("");
    }

    var map = $("#map");
    if (map && SITE.mapEmbed) {
      var title = "Map showing the location of " + (SITE.business.name || "our business");
      map.innerHTML =
        '<iframe src="' + esc(SITE.mapEmbed) + '" title="' + esc(title) + '" ' +
        'loading="lazy" referrerpolicy="no-referrer-when-downgrade" ' +
        'allowfullscreen></iframe>';
    }
  }

  /* ======================================================================
     ESCAPING
     ====================================================================== */
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ======================================================================
     WHATSAPP LINK BUILDER
     ====================================================================== */
  function waLink(message) {
    var num = (SITE && SITE.contact.whatsapp) || "";
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(message);
  }

  /* ======================================================================
     NAVBAR — sticky shadow, mobile menu
     ====================================================================== */
  function initNav() {
    var header = $(".site-header");
    var toggle = $(".nav__toggle");
    var menu = $("#nav-menu");
    if (!header) return;

    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (!toggle || !menu) return;

    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("is-locked", open);
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (!menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });

    $$("a", menu).forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });

    // Leaving the mobile breakpoint should not strand the body as locked.
    onMediaChange("(min-width: 900px)", function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* ======================================================================
     SCROLL SPY — lights the matching nav link for whichever section is
     currently in view. Sections are matched by their data-nav attribute,
     so the nav label and the section id never have to match.
     ====================================================================== */
  function initScrollSpy() {
    var links = $$(".nav__link[data-nav]");
    if (!links.length || !("IntersectionObserver" in window)) return;

    var sections = $$("[data-nav]");
    var visible = {};

    var setActive = function (key) {
      links.forEach(function (l) {
        var on = l.getAttribute("data-nav") === key;
        l.classList.toggle("is-active", on);
        if (on) l.setAttribute("aria-current", "true");
        else l.removeAttribute("aria-current");
      });
    };

    var pick = function () {
      // Choose the topmost section currently in view, else fall back to the
      // last one scrolled past.
      var best = null;
      var bestTop = -Infinity;
      sections.forEach(function (s) {
        if (!visible[s.id + s.dataset.nav]) return;
        var top = s.getBoundingClientRect().top;
        if (top < bestTop) return;
        bestTop = top;
        best = s;
      });
      if (best) setActive(best.dataset.nav);
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        visible[en.target.id + en.target.dataset.nav] = en.isIntersecting;
      });
      pick();
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

    sections.forEach(function (s) { io.observe(s); });

    // Keep the highlight correct right at the very top of the page.
    window.addEventListener("scroll", function () {
      if (window.scrollY < 40) setActive("home");
    }, { passive: true });
  }

  /* ======================================================================
     SMOOTH SCROLL — for browsers without CSS scroll-behavior, and to
     respect prefers-reduced-motion.
     ====================================================================== */
  function initAnchors() {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    $$('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      a.addEventListener("click", function (e) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (history.pushState) history.pushState(null, "", id);
      });
    });
  }


  /* ======================================================================
     FORM VALIDATION
     No red anywhere (design.md 5.4) — errors use bold Space Indigo text
     plus a warning icon, a thicker border and aria-invalid. Never colour
     alone.
     ====================================================================== */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function digits(str) { return (str.match(/\d/g) || []).length; }

  var RULES = {
    "f-name": function (v) { return v.trim().length >= 2; },
    "f-phone": function (v) { return digits(v) >= 7 && digits(v) <= 15; },
    "f-email": function (v) { return EMAIL_RE.test(v.trim()); },
    "f-message": function (v) { return v.trim().length >= 5; },
  };

  function setInvalid(input, bad) {
    var field = input.closest(".field");
    if (!field) return;
    field.classList.toggle("is-invalid", bad);
    input.setAttribute("aria-invalid", String(bad));
  }

  function validateField(input) {
    var rule = RULES[input.id];
    if (!rule) return true;
    var ok = rule(input.value);
    setInvalid(input, !ok);
    return ok;
  }

  function initValidation() {
    var form = $("#enquiry-form");
    if (!form) return;

    $$("[required]", form).forEach(function (input) {
      input.addEventListener("blur", function () {
        if (input.value !== "") validateField(input);
      });
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("is-invalid")) validateField(input);
      });
    });
  }

  /* ======================================================================
     FORM SUBMIT — Formspree first, WhatsApp always as the safety net
     ====================================================================== */
  function status(msg) {
    var box = $("#form-status");
    var text = $("#form-status-text");
    if (!box || !text) return;
    if (!msg) { box.classList.remove("is-visible"); return; }
    text.textContent = msg;
    box.classList.add("is-visible");
  }

  function buildWhatsAppMessage(data) {
    var lines = [
      "*New enquiry — Shivam Enterprise website*",
      "",
      "Name: " + data.name,
      "Phone: " + data.phone,
      "Email: " + data.email,
      "",
      "Message:",
      data.message,
    ];
    return lines.join("\n");
  }

  function sendViaWhatsApp(form) {
    var data = toObject(new FormData(form));
    window.open(waLink(buildWhatsAppMessage(data)), "_blank", "noopener");
  }

  function initSubmit() {
    var form = $("#enquiry-form");
    var submit = $("#form-submit");
    var submitText = $("#form-submit-text");
    if (!form || !submit) return;

    // Read the delivery config at submit time rather than caching it at init,
    // so js/data.js values can be changed without a reload.
    function delivery() {
      var f = (SITE && SITE.form) || {};
      var endpoint = f.endpoint || "";
      return { endpoint: endpoint, useEmail: !!endpoint && f.mode === "email" };
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status("");

      // Validate everything first.
      var bad = [];
      $$("[required]", form).forEach(function (input) {
        if (!validateField(input)) bad.push(input);
      });

      if (bad.length) {
        status("Please correct the highlighted fields and try again.");
        bad[0].focus();
        return;
      }

      var cfg = delivery();

      // With no endpoint configured, WhatsApp is the delivery route.
      if (!cfg.useEmail) {
        status("Opening WhatsApp with your enquiry…");
        sendViaWhatsApp(form);
        return;
      }

      // Email route.
      var original = submitText.textContent;
      submit.disabled = true;
      submit.setAttribute("aria-disabled", "true");
      submitText.textContent = "Sending…";

      fetch(cfg.endpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(toObject(new FormData(form))),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          form.reset();
          $$(".field", form).forEach(function (f) { f.classList.remove("is-invalid"); });
          status("Thank you — your enquiry has reached us. We reply within one working day.");
        })
        .catch(function () {
          // Never lose the enquiry: hand it to WhatsApp instead.
          status("We could not reach our inbox just now — opening WhatsApp with your enquiry instead.");
          sendViaWhatsApp(form);
        })
        .then(function () {
          submit.disabled = false;
          submit.removeAttribute("aria-disabled");
          submitText.textContent = original;
        });
    });
  }

  /* ======================================================================
     REVEAL ON SCROLL
     ====================================================================== */
  function initReveal() {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var targets = $$(".card, .service");

    // Only animate what starts below the fold — anything already on screen
    // must never be left invisible if the observer misbehaves.
    targets = targets.filter(function (el) {
      if (el.getBoundingClientRect().top <= window.innerHeight) return false;
      el.classList.add("reveal");
      el.style.transitionDelay = (targets.indexOf(el) % 4) * 60 + "ms";
      return true;
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ======================================================================
     BOOT
     ====================================================================== */
  function init() {
    var y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());

    renderContact();
    renderLocation();
    initNav();
    initAnchors();
    initScrollSpy();
    initValidation();
    initSubmit();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
