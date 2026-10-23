/* =========================================================
   FreshCart — js/auth.js
   Browser-local demo profile only; this is not authentication.
   ========================================================= */
(function (global) {
  "use strict";

  var App = global.App || (global.App = {});
  var KEY = "fc.demo.account.v1";

  function getSession() {
    try {
      var session = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!session || typeof session.name !== "string" || typeof session.email !== "string") return null;
      return { name: session.name, email: session.email };
    } catch (error) {
      console.warn("FreshCart: could not read demo account", error);
      return null;
    }
  }

  function signIn(name, email) {
    var profile = {
      name: String(name || "").trim(),
      email: String(email || "").trim().toLowerCase()
    };
    if (!profile.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      return { ok: false, message: "Enter your name and a valid email address." };
    }

    try {
      localStorage.setItem(KEY, JSON.stringify(profile));
      return { ok: true, profile: profile };
    } catch (error) {
      console.warn("FreshCart: could not save demo account", error);
      return { ok: false, message: "Your browser could not save this demo profile. Check its storage settings and try again." };
    }
  }

  function signOut() {
    try {
      localStorage.removeItem(KEY);
      return { ok: true };
    } catch (error) {
      console.warn("FreshCart: could not clear demo account", error);
      return { ok: false, message: "Your browser could not clear this demo profile. Check its storage settings and try again." };
    }
  }

  function updateNavigation() {
    var profile = getSession();
    var label = profile ? "Hi, " + profile.name : "Sign in";
    var headerActions = document.querySelector(".header-actions");
    var drawerBody = document.querySelector(".mobile-drawer .drawer-body");

    if (headerActions && !headerActions.querySelector("[data-demo-account-link]")) {
      var headerLink = document.createElement("a");
      headerLink.className = "account-link";
      headerLink.href = "account.html";
      headerLink.setAttribute("data-demo-account-link", "");
      headerActions.insertBefore(headerLink, headerActions.firstChild);
    }

    if (drawerBody && !drawerBody.querySelector("[data-demo-account-link]")) {
      var drawerLink = document.createElement("a");
      drawerLink.className = "drawer-link";
      drawerLink.href = "account.html";
      drawerLink.setAttribute("data-demo-account-link", "");
      drawerBody.appendChild(drawerLink);
    }

    document.querySelectorAll("[data-demo-account-link]").forEach(function (link) {
      link.textContent = label;
      link.setAttribute("aria-label", profile ? "Demo account for " + profile.name : "Sign in to a demo account");
    });
  }

  App.auth = {
    getSession: getSession,
    signIn: signIn,
    signOut: signOut,
    updateNavigation: updateNavigation
  };

  updateNavigation();
})(window);
