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
  /* Brand marks are the official, filled service marks rather than house-drawn
     line icons, so they need .icon--brand (fill:currentColor, stroke:none) plus
     a per-service colour class. See design.md 5.6. */
  var BRAND_ICONS = {
    'i-whatsapp': 'whatsapp',
    'i-instagram': 'instagram',
    'i-facebook': 'facebook'
  };

  function icon(id) {
    var brand = BRAND_ICONS[id];
    var cls = brand ? 'icon icon--brand icon--' + brand : 'icon';
    return '<svg class="' + cls + '" aria-hidden="true"><use href="#' + id + '"></use></svg>';
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

    var waGreeting = "Hello " + name + ", I would like to know more about your yarn supply and services.";
    var waRow = contactItem("i-whatsapp", "WhatsApp",
      '<a class="contact-item__value" href="' + waLink(waGreeting) +
      '" target="_blank" rel="noopener">Chat on WhatsApp</a>');

    var primaryWaUrl = waLink(waGreeting, k.whatsapp || k.phoneTel);
    var personWaUrl = person && person.phone
      ? waLink("Hello " + person.name + ", I would like to enquire about yarn from Shivam Enterprise.", person.phoneTel || person.phone)
      : "";

    var personRow = person && person.phone
      ? contactItem("i-user", person.role ? person.role : "Contact", '<a class="contact-item__value" href="' +
          esc(personWaUrl) + '" target="_blank" rel="noopener" title="Chat on WhatsApp with ' + esc(person.name) + '">' +
          esc(person.name) + " &middot; " + esc(person.phone) + "</a>")
      : "";

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
        "<li><a href='" + esc(primaryWaUrl) + "' target='_blank' rel='noopener' title='Chat on WhatsApp (" + esc(k.phoneDisplay) + ")'>" + esc(k.phoneDisplay) + "</a></li>" +
        (k.email ? "<li><a href='mailto:" + esc(k.email) + "'>" + esc(k.email) + "</a></li>" : "") +
        (person && person.phone
          ? "<li><a href='" + esc(personWaUrl) + "' target='_blank' rel='noopener' title='Chat on WhatsApp with " + esc(person.name) + " (" + esc(person.phone) + ")'>" +
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
          icon('i-instagram') + '</a>';
      }
      if (s.facebook) {
        icons += '<a href="' + esc(s.facebook) + '" target="_blank" rel="noopener"' +
          ' aria-label="' + esc(SITE.business.name) + ' on Facebook">' +
          icon('i-facebook') + '</a>';
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
  function waLink(message, customNum) {
    var raw = customNum || ((SITE && SITE.contact.whatsapp) || "");
    var digitsOnly = String(raw).replace(/\D/g, "");
    var num = digitsOnly.length === 10 ? ("91" + digitsOnly) : digitsOnly;
    return "https://wa.me/" + num + (message ? "?text=" + encodeURIComponent(message) : "");
  }

  /* ======================================================================
     SCROLL READER — one rAF-throttled scroll pipeline.

     Before this, three separate things each ran a raw `scroll` listener and
     each did layout work per event: the header shadow, the scroll-spy, and
     the reduced-motion anchor handler. On a trackpad that is one event per
     frame, so any synchronous getBoundingClientRect() in the path forces a
     layout flush on every frame. This is the actual source of the "laggy"
     feeling, not the amount of content.

     Everything scroll-driven now hangs off ONE passive listener that sets a
     dirty flag, and the real work happens once per animation frame.
     ====================================================================== */
  var scrollTasks = [];
  var scrollQueued = false;

  function onScrollFrame(fn) { scrollTasks.push(fn); }

  function flushScroll() {
    scrollQueued = false;
    for (var i = 0; i < scrollTasks.length; i++) scrollTasks[i]();
  }

  function initScrollReader() {
    if (scrollTasks.length) return;
    window.addEventListener("scroll", function () {
      if (scrollQueued) return;
      scrollQueued = true;
      window.requestAnimationFrame(flushScroll);
    }, { passive: true });
    // Layout changes (images decoding, fonts swapping) move every section,
    // so cached offsets must be invalidated rather than left stale.
    window.addEventListener("resize", function () {
      if (scrollQueued) return;
      scrollQueued = true;
      window.requestAnimationFrame(flushScroll);
    }, { passive: true });
  }

  /* ======================================================================
     REDUCED MOTION — read once, and react if the user flips the setting
     mid-session (macOS sends this live when the setting is toggled).
     ====================================================================== */
  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reducedMotion = motionQuery.matches;
  onMediaChange("(prefers-reduced-motion: reduce)", function (e) {
    reducedMotion = e.matches;
  });

  /* ======================================================================
     NAVBAR — sticky shadow, mobile menu
     ====================================================================== */
  function initNav() {
    var header = $(".site-header");
    var toggle = $(".nav__toggle");
    var menu = $("#nav-menu");
    if (!header) return;

    var stuck = null;
    onScrollFrame(function () {
      var next = window.scrollY > 8;
      if (next === stuck) return;           // no class churn when unchanged
      stuck = next;
      header.classList.toggle("is-stuck", next);
    });

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
     SCROLL SPY — the "where am I" indicator.

     Lights the matching nav link for whichever section is in view, and mirrors
     the position into the URL hash without adding history entries, so the
     address bar always names the section you are looking at and Back still
     leaves the page in one step.

     Cost control: the observer only records WHICH sections are candidates
     (a boolean map, no geometry). The active section is then picked from
     cached offsets in one pass, so a scroll frame performs O(1) reads instead
     of getBoundingClientRect() on every section.
     ====================================================================== */
  function initScrollSpy() {
    var links = $$(".nav__link[data-nav]");
    if (!links.length) return;

    /* Scope to the SECTIONS. A bare [data-nav] selector also matches the six
       nav links, which carry data-nav but have no id - so the list came back
       with 12 entries, the measured offsets belonged to header links rather
       than sections, and the id lookup below resolved to "" and wrote a bare
       "#" into the address bar. */
    var sections = $$("section[data-nav]");
    if (!sections.length) return;

    /* nav key -> section element, built once. Looked up by key rather than by
       re-filtering the array on every active change. */
    var byNav = {};
    sections.forEach(function (s) { byNav[s.dataset.nav] = s; });

    var current = null;

    var setActive = function (key) {
      if (key === current) return;          // guard: no DOM writes if unchanged
      current = key;
      links.forEach(function (l) {
        var on = l.getAttribute("data-nav") === key;
        l.classList.toggle("is-active", on);
        if (on) l.setAttribute("aria-current", "true");
        else l.removeAttribute("aria-current");
      });
      // replaceState, never pushState: no history spam, no scroll jump, and
      // Back still leaves the site in a single step.
      if (history.replaceState) {
        var target = byNav[key];
        var hash = target ? "#" + target.id : "";
        if (hash && hash !== location.hash) history.replaceState(null, "", hash);
      }
    };

    // One cached read per section, refreshed only when layout may have moved.
    var tops = [];
    function measure() {
      tops = sections.map(function (s) {
        return { nav: s.dataset.nav, top: s.getBoundingClientRect().top + window.scrollY };
      });
    }

    /* The line that decides "current", expressed in DOCUMENT coordinates:
       a band 140px below the top of the viewport. Any section whose top has
       crossed it is behind us, and the last such section is the active one.
       Using one reading point avoids the ambiguity of two sections being
       partly visible at once.

       `tops` holds absolute document offsets, so the comparison has to be
       made against scrollY + line. Comparing against `line` alone pins the
       result to the first section and the highlight never moves. */
    var probe = function () {
      var line = window.scrollY + 140;
      var best = sections[0].dataset.nav;
      for (var i = 0; i < tops.length; i++) {
        if (tops[i].top <= line) best = tops[i].nav;
        else break;
      }
      // At the very bottom, the last section may still be short of the line.
      var scrolled = window.innerHeight + window.scrollY;
      var max = document.documentElement.scrollHeight;
      if (scrolled >= max - 2) best = tops[tops.length - 1].nav;
      setActive(best);
    };

    var scheduled = false;
    function schedule() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () { scheduled = false; measure(); probe(); });
    }

    if ("IntersectionObserver" in window) {
      // Rebuild the cache whenever the set of observed sections changes size,
      // which is the only reliable signal that layout shifted.
      var io = new IntersectionObserver(schedule, { rootMargin: "0px", threshold: 0 });
      sections.forEach(function (s) { io.observe(s); });
    }

    onScrollFrame(probe);
    window.addEventListener("load", schedule);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
    schedule();
  }

  /* ======================================================================
     SMOOTH SCROLL

     The CSS already does this: `html { scroll-behavior: smooth }` plus
     `scroll-padding-top` for the header offset. The old JS handler made
     browsers do the work TWICE — CSS started a smooth scroll and then
     scrollIntoView({behavior:"smooth"}) started a second one over the top of
     it, which reads as a stutter. It also pushState'd on every click, so
     Back had to be pressed once per section visited.

     All that is left to do here is move focus to the target, which native
     anchor navigation does inconsistently for keyboard and screen-reader
     users.
     ====================================================================== */
  function initAnchors() {
    $$('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;

      a.addEventListener("click", function () {
        // Let the browser perform the scroll; only fix up focus afterwards.
        window.requestAnimationFrame(function () {
          if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        });
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
    "f-category": function (v) { return !!(v && v.trim()); },
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
      input.addEventListener("change", function () {
        if (input.closest(".field").classList.contains("is-invalid")) validateField(input);
      });
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("is-invalid")) validateField(input);
      });
    });
  }

  /* ======================================================================
     FORM SUBMIT — Web3Forms first, WhatsApp always as the safety net
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
    var raw = data || {};
    var name = (raw["Customer Name"] || raw.name || "-");
    var phone = (raw["Phone Number"] || raw.phone || "-");
    var email = (raw["Email Address"] || raw.email || "-");
    var category = (raw["Yarn Category"] || raw.category || "-");
    var message = (raw["Requirement Details"] || raw.message || "-");

    var timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short"
    });

    var lines = [
      "*🧵 New Yarn Enquiry — Shivam Enterprise*",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "👤 *Customer:* " + name,
      "📞 *Phone:* " + phone,
      "✉️ *Email:* " + email,
      "🧶 *Category:* " + category,
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "📝 *Requirement:*",
      message,
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "🕒 *Submitted:* " + timestamp + " IST",
      "🌐 *Source:* Shivam Enterprise Website"
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
      var key = f.web3formsKey || "";
      return {
        key: key,
        useWeb3Forms: !!key && f.mode !== "whatsapp"
      };
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

      // With no key or mode set to whatsapp, WhatsApp is the direct delivery route.
      if (!cfg.useWeb3Forms) {
        status("Opening WhatsApp with your enquiry…");
        sendViaWhatsApp(form);
        return;
      }

      var rawData = toObject(new FormData(form));
      var name = (rawData.name || "").trim();
      var phone = (rawData.phone || "").trim();
      var email = (rawData.email || "").trim();
      var category = (rawData.category || "").trim();
      var message = (rawData.message || "").trim();

      // WhatsApp direct link for one-tap action
      var digitsOnly = (phone.match(/\d/g) || []).join("");
      var intlNumber = digitsOnly.length === 10 ? ("91" + digitsOnly) : digitsOnly;
      var waDirectChat = digitsOnly.length >= 7 ? ("https://wa.me/" + intlNumber) : "N/A";

      // Precise IST timestamp
      var submissionTime = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }) + " IST";

      // Dynamic Subject Line: Eye-catching and immediately actionable
      var phoneSnippet = phone ? (" (" + phone + ")") : "";
      var dynamicSubject = "🧵 [Shivam Enterprise] New Enquiry: " + (category || "Yarn") + " — " + (name || "Website Visitor") + phoneSnippet;
      var dynamicFrom = name ? (name + " (Shivam Enterprise Enquiry)") : "Shivam Enterprise Website";

      // Populate hidden form inputs
      var keyInput = $("#w3f-access-key");
      if (keyInput) keyInput.value = cfg.key;
      var subjInput = $("#w3f-subject");
      if (subjInput) subjInput.value = dynamicSubject;
      var fromInput = $("#w3f-from-name");
      if (fromInput) fromInput.value = dynamicFrom;
      var replyInput = $("#w3f-replyto");
      if (replyInput && email) replyInput.value = email;

      // Web3Forms email route
      var original = submitText.textContent;
      submit.disabled = true;
      submit.setAttribute("aria-disabled", "true");
      submitText.textContent = "Sending…";

      // Clean, beautifully structured email payload without messy technical keys
      var payload = {
        access_key: cfg.key,
        subject: dynamicSubject,
        from_name: dynamicFrom,
        replyto: email || undefined,

        // High-level customer and order table
        "Customer Name": name,
        "Contact Number": phone,
        "Email Address": email || "Not provided",
        "Yarn Category": category || "General Enquiry",
        "Requirement Details": message,
        "Direct WhatsApp Chat": waDirectChat,
        "Submission Time": submissionTime
      };

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok || !data.success) {
              throw new Error(data.message || ("HTTP " + res.status));
            }
            return data;
          });
        })
        .then(function () {
          form.reset();
          $$(".field", form).forEach(function (f) { f.classList.remove("is-invalid"); });
          status("Thank you — your enquiry has reached us. We reply within one working day.");
        })
        .catch(function (err) {
          // Never lose the enquiry: hand it to WhatsApp instead.
          status("We could not deliver your email directly — opening WhatsApp with your enquiry ready instead.");
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
    var selectors = [
      ".section-head",
      ".about__head",
      ".about-card",
      ".about__highlights",
      ".card",
      ".service",
      ".location__panel",
      ".map",
      ".contact-item",
      ".form"
    ];
    var targets = $$(selectors.join(", "));
    if (!targets.length) return;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var fold = window.innerHeight;

    targets.forEach(function (el, index) {
      var rect = el.getBoundingClientRect();
      // Elements fully or mostly in the initial viewport start visible
      if (rect.top < fold * 0.85 && rect.bottom > 0) {
        el.classList.add("is-in");
      } else {
        el.classList.add("reveal");
        // Stagger cards and sibling items nicely
        var siblings = el.parentElement ? el.parentElement.children : [];
        var siblingIndex = Array.prototype.indexOf.call(siblings, el);
        var delay = siblingIndex >= 0 ? (siblingIndex % 4) * 85 : (index % 4) * 70;
        if (delay > 0) {
          el.style.transitionDelay = delay + "ms";
        }
      }
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        en.target.style.transitionDelay = "";
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });

    $$(".reveal").forEach(function (el) { io.observe(el); });

    onScrollFrame(function () {
      if (window.innerHeight <= fold) return;
      fold = window.innerHeight;
    });
  }

  /* ======================================================================
     SCROLL ENHANCEMENTS — Progress indicator & Back-to-top button
     ====================================================================== */
  function initScrollEnhancements() {
    var bar = $("#scroll-progress");
    var topBtn = $("#back-to-top");

    onScrollFrame(function () {
      var scrollY = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Update top reading progress bar
      if (bar && docHeight > 0) {
        var pct = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        bar.style.width = pct + "%";
      }

      // Toggle floating back-to-top button
      if (topBtn) {
        topBtn.classList.toggle("is-visible", scrollY > 400);
      }
    });

    if (topBtn) {
      topBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /* ======================================================================
     TICKER — pause the marquee when it is off screen.

     `ticker-scroll` is an infinite 28s transform animation on a track that is
     two copies of the content side by side. It never stopped, so it burned a
     compositor frame budget for the entire time the visitor was anywhere
     else on the page. Animating only while visible removes that cost
     outright, and the pause is invisible because nothing is on screen.
     ====================================================================== */
  function initTicker() {
    var tickers = $$(".ticker");
    if (!tickers.length || !("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        en.target.classList.toggle("is-offscreen", !en.isIntersecting);
      });
    }, { threshold: 0 });

    tickers.forEach(function (t) {
      io.observe(t);
      if (reducedMotion) t.classList.add("is-offscreen");
    });
    onMediaChange("(prefers-reduced-motion: reduce)", function (e) {
      tickers.forEach(function (t) { t.classList.toggle("is-offscreen", e.matches); });
    });
  }

  /* ======================================================================
     BOOT
     ====================================================================== */
  function init() {
    var y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());

    renderContact();
    renderLocation();
    initScrollReader();   // must exist before anything registers a task
    initNav();
    initAnchors();
    initScrollSpy();
    initValidation();
    initSubmit();
    initReveal();
    initScrollEnhancements();
    initTicker();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
