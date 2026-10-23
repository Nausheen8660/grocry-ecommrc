/* =========================================================
   FreshCart — js/wishlist.js
   Saved-items page.
   ========================================================= */
(function (global) {
  "use strict";

  var App = global.App;
  var store = App.store;
  var ui = App.ui;

  function $(id) { return document.getElementById(id); }

  function render() {
    var ids = store.getWishlist();
    var products = ids.map(store.findProduct).filter(Boolean);

    $("wishSub").textContent = products.length
      ? products.length + (products.length === 1 ? " item" : " items") + " saved for later."
      : "Products you save with the heart icon will appear here.";

    if (products.length) {
      $("wishActions").innerHTML =
        '<button class="btn btn-outline btn-sm" id="addAll">Add all ' + products.length + " to cart</button>" +
        '<button class="btn btn-ghost btn-sm" id="clearWish">Clear saved items</button>';
    } else {
      $("wishActions").innerHTML = "";
    }

    ui.renderGrid($("wishGrid"), products);
  }

  function init() {
    render();

    $("wishActions").addEventListener("click", function (e) {
      if (e.target.closest("#addAll")) {
        var ids = store.getWishlist();
        var added = 0;
        ids.forEach(function (id) {
          var r = store.addToCart(id, 1);
          if (r.ok) added++;
        });
        ui.paintCartBadge();
        ui.toast("Added " + added + " to cart", {
          title: added + (added === 1 ? " item" : " items") + " added to your cart",
          subtitle: "Review your basket before checkout"
        });
        return;
      }

      if (e.target.closest("#clearWish")) {
        store.getWishlist().forEach(store.toggleWishlist);
        ui.paintWishlistBadge();
        render();
        ui.toast("Saved items cleared", { type: "info", title: "Your list is empty" });
      }
    });

    /* keep the grid in sync when a heart is toggled from here */
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-fav]")) {
        setTimeout(function () {
          ui.paintWishlistBadge();
          render();
        }, 0);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
