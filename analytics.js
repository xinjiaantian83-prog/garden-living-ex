(function () {
  "use strict";

  // GA4の実際の測定IDへ差し替える場所（例: G-ABC123DE45）
  var GA4_MEASUREMENT_ID = "G-30TMHDBZP7";
  var isConfigured = /^G-[A-Z0-9]+$/i.test(GA4_MEASUREMENT_ID) && GA4_MEASUREMENT_ID !== "G-XXXXXXXXXX";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.glAnalytics = {
    measurementId: GA4_MEASUREMENT_ID,
    isConfigured: isConfigured,
    track: function (eventName, parameters) {
      window.gtag("event", eventName, parameters || {});
    }
  };

  if (!isConfigured) {
    console.info("GA4: analytics.js の GA4_MEASUREMENT_ID を実際の測定IDへ差し替えてください。");
    return;
  }

  window.gtag("js", new Date());
  window.gtag("config", GA4_MEASUREMENT_ID, { send_page_view: true });

  function cleanText(element) {
    return (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100);
  }

  function trackLinkEvent(eventName, element) {
    window.glAnalytics.track(eventName, {
      link_text: cleanText(element),
      link_url: element.href || "",
      page_location: window.location.href
    });
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (!link || link.dataset.gaSkipAuto === "true") return;

    var eventName = link.dataset.gaEvent || "";
    var href = link.getAttribute("href") || "";

    if (!eventName && /(^|\.)lin\.ee$/i.test(link.hostname)) eventName = "click_line";
    if (!eventName && href.indexOf("tel:") === 0) eventName = "click_tel";
    if (!eventName && href.indexOf("mailto:") === 0) eventName = "click_mail";

    if (eventName) trackLinkEvent(eventName, link);
  });

  document.addEventListener("submit", function (event) {
    var form = event.target.closest("form[data-contact-form]");
    if (!form) return;
    window.glAnalytics.track("submit_contact", {
      form_id: form.id || "contact_form",
      page_location: window.location.href
    });
  });

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA4_MEASUREMENT_ID);
  document.head.appendChild(script);
})();
