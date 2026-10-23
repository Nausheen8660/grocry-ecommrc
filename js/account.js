/* =========================================================
   FreshCart — js/account.js
   Browser-local demo profile form.
   ========================================================= */
(function (global) {
  "use strict";

  var auth = global.App.auth;
  var form = document.getElementById("demo-account-form");
  var profilePanel = document.getElementById("demo-account-profile");
  var message = document.getElementById("account-message");
  var signOutMessage = document.getElementById("signout-message");

  function showProfile() {
    var profile = auth.getSession();
    form.classList.toggle("hide", Boolean(profile));
    profilePanel.classList.toggle("hide", !profile);

    if (profile) {
      profilePanel.querySelector("[data-profile-name]").textContent = profile.name;
      profilePanel.querySelector("[data-profile-email]").textContent = profile.email;
    }
    auth.updateNavigation();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    message.textContent = "";

    var result = auth.signIn(
      form.elements.name.value,
      form.elements.email.value
    );
    if (!result.ok) {
      message.textContent = result.message;
      return;
    }

    showProfile();
  });

  profilePanel.querySelector("[data-demo-signout]").addEventListener("click", function () {
    signOutMessage.textContent = "";
    var result = auth.signOut();
    if (!result.ok) {
      signOutMessage.textContent = result.message;
      return;
    }
    form.reset();
    showProfile();
  });

  showProfile();
})(window);
