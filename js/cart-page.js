/* =========================================================
   FreshCart — js/cart-page.js
   Cart page: line items, quantity, promo codes, summary.
   ========================================================= */
(function (global) {
  "use strict";

  var App = global.App;
  var store = App.store;
  var ui = App.ui;

  function $(id) { return document.getElementById(id); }

  function render() {
    var t = store.totals();

    renderItems(t);
    renderSummary(t);
    renderMeter(t);

    $("cartSub").textContent = t.count
      ? t.count + (t.count === 1 ? " item" : " items") + " in your basket"
      : "Your basket is empty.";
  }

  /* ---------- line items ---------- */
  function renderItems(t) {
    var list = $("cartList");

    if (!t.lines.length) {
      list.innerHTML =
        '<div class="cart-empty">' +
          '<div style="font-size:3.4rem">🛒</div>' +
          "<h3>Your basket is empty</h3>" +
          "<p>Browse the store and add a few fresh favourites to get started.</p>" +
          '<a class="btn btn-primary" href="index.html">Start shopping</a>' +
        "</div>";
      return;
    }

    list.innerHTML = t.lines.map(function (line) {
      var p = line.product;
      return "" +
        '<div class="cart-row" data-id="' + p.id + '">' +
          '<div class="cart-thumb">' + ui.media(p, "") + "</div>" +
          '<div class="cart-info">' +
            '<h4><a href="product.html?id=' + p.id + '">' + ui.esc(p.name) + "</a></h4>" +
            '<div class="meta">' + ui.esc(p.brand) + " · " + ui.esc(p.unit) + "</div>" +
            '<div class="meta">' + ui.stockTag(p) + "</div>" +
            '<div class="line-price">' + store.money(line.lineTotal) + "</div>" +
          "</div>" +
          '<div class="cart-actions">' +
            '<div class="qty sm">' +
              '<button data-cart-step="-1" aria-label="Decrease quantity">−</button>' +
              "<output>" + line.qty + "</output>" +
              '<button data-cart-step="1" aria-label="Increase quantity"' + (line.qty >= p.stock ? " disabled" : "") + ">+</button>" +
            "</div>" +
            '<button class="cart-remove" data-cart-remove aria-label="Remove ' + ui.esc(p.name) + ' from cart">' + ui.icon("trash") + "</button>" +
          "</div>" +
        "</div>";
    }).join("");
  }

  /* ---------- summary ---------- */
  function renderSummary(t) {
    var rows = "";

    rows += row("Subtotal", store.money(t.subtotal));
    if (t.savings > 0) {
      rows += '<div class="summary-row"><span>Product savings</span><span class="discount">−' + store.money(t.savings) + "</span></div>";
    }
    if (t.promo) {
      rows += '<div class="summary-row"><span>Promo (' + ui.esc(t.promo.code) + ")</span><span class=\"discount\">−" + store.money(t.promoDiscount) + "</span></div>";
    }
    rows += '<div class="summary-row"><span>Delivery</span><span' + (t.delivery === 0 ? ' class="free"' : "") + ">" +
            (t.delivery === 0 ? "FREE" : store.money(t.delivery)) + "</span></div>";
    rows += '<div class="summary-row"><span>Estimated tax (' + Math.round(App.data.taxRate * 100) + "%)</span><span>" + store.money(t.tax) + "</span></div>";
    rows += '<div class="summary-row total"><span>Total</span><span>' + store.money(t.total) + "</span></div>";

    $("summaryRows").innerHTML = rows;

    var btn = $("checkoutBtn");
    btn.classList.toggle("hide", !t.count);
  }

  function row(label, value) {
    return '<div class="summary-row"><span>' + label + "</span><span>" + value + "</span></div>";
  }

  /* ---------- free delivery progress ---------- */
  function renderMeter(t) {
    var meter = $("deliveryMeter");
    if (!t.count) { meter.innerHTML = ""; return; }

    var threshold = t.freeDeliveryThreshold;
    var pct = Math.min(100, Math.round((t.subtotal / threshold) * 100));

    if (t.delivery === 0) {
      meter.innerHTML =
        '<div class="bar"><span style="width:100%"></span></div>' +
        "<p>🎉 <b>You've unlocked free delivery!</b></p>";
    } else {
      var remaining = Math.max(0, threshold - t.subtotal);
      meter.innerHTML =
        '<div class="bar"><span style="width:' + pct + '%"></span></div>' +
        "<p>Add <b>" + store.money(remaining) + "</b> more for free delivery</p>";
    }
  }

  /* ---------- promo ---------- */
  function renderPromo() {
    var promo = store.getPromo();
    var note = $("promoNote");
    if (promo) {
      $("promoInput").value = promo.code;
      $("promoInput").disabled = true;
      $("promoApply").textContent = "Remove";
      note.innerHTML = '<span class="text-sm" style="color:var(--success-fg)">✓ ' + ui.esc(promo.code) + " applied — " + ui.esc(promo.label) + "</span>";
    } else {
      $("promoInput").disabled = false;
      $("promoApply").textContent = "Apply";
      note.innerHTML = "";
    }
  }

  /* =========================================================
     Init
     ========================================================= */
  function init() {
    render();
    renderPromo();

    $("cartList").addEventListener("click", function (e) {
      var row = e.target.closest(".cart-row");
      if (!row) return;
      var id = row.getAttribute("data-id");
      var p = store.findProduct(id);

      var step = e.target.closest("[data-cart-step]");
      if (step) {
        var direction = parseInt(step.getAttribute("data-cart-step"), 10);
        var current = store.getCart().filter(function (l) { return l.id === id; })[0];
        if (!current) return;
        var next = current.qty + direction;
        if (next < 1) {
          store.removeFromCart(id);
          ui.toast("Removed from basket", { title: p ? p.name : "Item", subtitle: "Removed from your basket" });
        } else {
          store.setQty(id, Math.min(next, p.stock));
        }
        ui.paintCartBadge();
        render();
        return;
      }

      if (e.target.closest("[data-cart-remove]")) {
        store.removeFromCart(id);
        ui.paintCartBadge();
        render();
        ui.toast("Removed from basket", { title: p ? p.name : "Item", subtitle: "Removed from your basket" });
      }
    });

    $("promoApply").addEventListener("click", function () {
      var input = $("promoInput");
      var code = input.value.trim();

      if (store.getPromo()) {
        store.clearPromo();
        renderPromo();
        render();
        ui.toast("Promo removed", { type: "info", title: "Promo code removed" });
        return;
      }

      if (!code) return;
      var result = store.applyPromo(code);
      if (result.ok) {
        renderPromo();
        render();
        ui.toast("Promo applied", { title: code + " applied", subtitle: result.promo.label });
      } else if (result.reason === "minimum") {
        ui.toast("Not eligible", {
          type: "error",
          title: "Minimum spend not met",
          subtitle: "Spend " + store.money(result.minimum) + " or more to use this code"
        });
      } else {
        ui.toast("Invalid code", { type: "error", title: "That code isn't valid", subtitle: "Try FRESH10 or SAVE5" });
      }
    });

    $("promoInput").addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); $("promoApply").click(); }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
