(function () {
  "use strict";

  // GA4の実際の測定IDへ差し替える場所（例: G-ABC123DE45）
  var GA4_MEASUREMENT_ID = "G-XXXXXXXXXX";
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

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA4_MEASUREMENT_ID);
  document.head.appendChild(script);
})();
