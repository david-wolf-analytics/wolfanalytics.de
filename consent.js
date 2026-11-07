/* Wolf Analytics – Einwilligungs-Banner mit Google Consent Mode v2
   Kein Drittanbieter. Speichert die Auswahl im localStorage des Browsers (Schlüssel: wa_consent). */
(function () {
  var KEY = "wa_consent";
  var VERSION = 1;          // erhöhen, wenn sich die Kategorien ändern -> Banner erscheint erneut
  var MAX_AGE_DAYS = 365;   // Auswahl nach 12 Monaten erneut abfragen

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function load() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (!c || c.v !== VERSION) return null;
      if (Date.now() - c.ts > MAX_AGE_DAYS * 864e5) return null;
      return c;
    } catch (e) { return null; }
  }
  function save(c) {
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
  }
  var GTM_ID = "GTM-KB98TNZL";
  var gtmLoaded = false;
  function loadGTM() {
    if (gtmLoaded) return;
    gtmLoaded = true;
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtm.js?id=" + GTM_ID;
    document.head.appendChild(s);
  }

  function apply(c) {
    gtag("consent", "update", {
      analytics_storage: c.analytics ? "granted" : "denied",
      ad_storage: c.marketing ? "granted" : "denied",
      ad_user_data: c.marketing ? "granted" : "denied",
      ad_personalization: c.marketing ? "granted" : "denied"
    });
    window.dataLayer.push({ event: "consent_update", consent_analytics: c.analytics, consent_marketing: c.marketing });
    // Tag Manager erst nach Einwilligung laden (Basic Consent Mode)
    if (c.analytics || c.marketing) loadGTM();
  }
  function choose(analytics, marketing) {
    var c = { v: VERSION, ts: Date.now(), analytics: !!analytics, marketing: !!marketing };
    save(c); apply(c); close();
  }

  var box;
  function close() { if (box) { box.remove(); box = null; } }

  function open(showDetails) {
    close();
    var c = load() || { analytics: false, marketing: false };
    box = document.createElement("div");
    box.className = "cc-wrap";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-live", "polite");
    box.setAttribute("aria-label", "Datenschutz-Einstellungen");
    box.innerHTML =
      '<div class="cc-box">' +
        '<h2>Darf ich messen, wie die Seite genutzt wird?</h2>' +
        '<p>Mit deiner Einwilligung nutze ich Google Analytics, um zu sehen, welche Inhalte gelesen werden. ' +
        'Du kannst die Auswahl jederzeit unten auf der Seite unter „Cookie-Einstellungen“ ändern. Mehr in der <a href="datenschutz.html">Datenschutzerklärung</a>.</p>' +
        '<div class="cc-details"' + (showDetails ? "" : " hidden") + '>' +
          '<label class="cc-row"><input type="checkbox" checked disabled> <span><strong>Notwendig</strong> – speichert nur deine Auswahl. Immer aktiv.</span></label>' +
          '<label class="cc-row"><input type="checkbox" id="cc-analytics"' + (c.analytics ? " checked" : "") + '> <span><strong>Statistik</strong> – Google Analytics 4: Seitenaufrufe, Klicks, Herkunft.</span></label>' +
          '<label class="cc-row"><input type="checkbox" id="cc-marketing"' + (c.marketing ? " checked" : "") + '> <span><strong>Marketing</strong> – Erfolgsmessung von Google-Ads-Anzeigen.</span></label>' +
        '</div>' +
        '<div class="cc-actions">' +
          '<button type="button" class="cc-btn cc-ghost" data-cc="settings">' + (showDetails ? "Auswahl speichern" : "Einstellungen") + '</button>' +
          '<button type="button" class="cc-btn cc-primary" data-cc="necessary">Nur notwendige</button>' +
          '<button type="button" class="cc-btn cc-primary" data-cc="all">Alle akzeptieren</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(box);

    box.addEventListener("click", function (e) {
      var a = e.target.getAttribute && e.target.getAttribute("data-cc");
      if (!a) return;
      if (a === "all") choose(true, true);
      else if (a === "necessary") choose(false, false);
      else if (a === "settings") {
        var d = box.querySelector(".cc-details");
        if (d.hidden) { d.hidden = false; e.target.textContent = "Auswahl speichern"; }
        else choose(box.querySelector("#cc-analytics").checked, box.querySelector("#cc-marketing").checked);
      }
    });
  }

  window.waOpenConsent = function () { open(true); };

  function init() {
    var c = load();
    if (c) apply(c); else open(false);
    var links = document.querySelectorAll("[data-open-consent]");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function (e) { e.preventDefault(); open(true); });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
