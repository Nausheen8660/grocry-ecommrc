/* =========================================================
   FreshCart — js/order.js
   Order confirmation + order history.
   ========================================================= */
(function (global) {
  "use strict";

  var App = global.App;
  var store = App.store;
  var ui = App.ui;

  function $(id) { return document.getElementById(id); }

  function formatDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) +
           " · " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }

  /* =========================================================
     Confirmation view
     ========================================================= */
  function renderConfirmation(order) {
    $("historyView").classList.add("hide");
    $("confirmView").classList.remove("hide");

    $("orderIdText").textContent = order.id;

    /* delivery estimate */
    var eta = new Date(order.createdAt);
    if (order.slot.id === "express") {
      eta.setMinutes(eta.getMinutes() + 90);
    } else {
      eta.setDate(eta.getDate() + 1);
      eta.setHours(8, 0, 0, 0);
    }

    $("etaCard").innerHTML =
      etaItem("Order placed", formatDate(order.createdAt)) +
      etaItem("Delivery slot", order.slot.label) +
      etaItem("Arriving", eta.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })) +
      etaItem("Delivering to", order.customer.address);

    var items = order.items.map(function (i) {
      return '<div class="review-item">' +
        '<span class="emo">' + i.emoji + "</span>" +
        '<div class="grow"><b>' + ui.esc(i.name) + "</b><span>" + ui.esc(i.unit) + " × " + i.qty + "</span></div>" +
        "<b>" + store.money(i.total) + "</b>" +
      "</div>";
    }).join("");

    var t = order.totals;
    var totals =
      '<div class="summary-row"><span>Subtotal</span><span>' + store.money(t.subtotal) + "</span></div>" +
      (t.discount ? '<div class="summary-row"><span>Discount</span><span class="discount">−' + store.money(t.discount) + "</span></div>" : "") +
      '<div class="summary-row"><span>Delivery</span><span' + (t.delivery === 0 ? ' class="free"' : "") + ">" +
        (t.delivery === 0 ? "FREE" : store.money(t.delivery)) + "</span></div>" +
      '<div class="summary-row"><span>Tax</span><span>' + store.money(t.tax) + "</span></div>" +
      '<div class="summary-row total"><span>Paid</span><span>' + store.money(t.total) + "</span></div>";

    $("confirmItems").innerHTML =
      "<h4 class='mb-8'>Items (" + order.items.reduce(function (s, i) { return s + i.qty; }, 0) + ")</h4>" +
      items +
      '<div class="summary-rows mt-16">' + totals + "</div>";

    /* copy order id */
    $("copyId").innerHTML = ui.icon("copy");
    $("copyId").addEventListener("click", function () {
      var text = order.id;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          ui.toast("Copied", { title: "Order ID copied", subtitle: text });
        }, function () {
          ui.toast("Order ID: " + text, { title: "Copy the order ID", subtitle: text });
        });
      } else {
        ui.toast("Order ID: " + text, { title: "Copy the order ID", subtitle: text });
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function etaItem(label, value) {
    return '<div class="eta-item"><div class="lbl">' + ui.esc(label) + '</div><div class="val">' + ui.esc(value) + "</div></div>";
  }

  /* =========================================================
     History view
     ========================================================= */
  function renderHistory() {
    var orders = store.getOrders();
    $("historySub").textContent = orders.length
      ? "You've placed " + orders.length + (orders.length === 1 ? " order" : " orders") + " with FreshCart."
      : "Orders you've placed with FreshCart will appear here.";

    if (!orders.length) {
      $("orderList").innerHTML =
        '<div class="empty">' +
          '<div class="emo">📦</div>' +
          "<h3>No orders yet</h3>" +
          "<p>When you place your first order, you'll be able to track it here.</p>" +
          '<a class="btn btn-primary" href="index.html">Start shopping</a>' +
        "</div>";
      return;
    }

    $("orderList").innerHTML =
      '<div class="cart-list">' +
      orders.map(function (o) {
        var count = o.items.reduce(function (s, i) { return s + i.qty; }, 0);
        var preview = o.items.slice(0, 4).map(function (i) { return i.emoji; }).join(" ");
        var more = o.items.length > 4 ? " +" + (o.items.length - 4) + " more" : "";

        return '<div class="cart-row" style="grid-template-columns:1fr auto">' +
          '<div class="cart-info">' +
            '<div class="row gap-10 wrap mb-8">' +
              '<h4>Order ' + ui.esc(o.id) + "</h4>" +
              '<span class="stock-tag in">' + ui.esc(o.status) + "</span>" +
            "</div>" +
            '<div class="meta">' + formatDate(o.createdAt) + " · " + count + " items · " + ui.esc(o.slot.label) + "</div>" +
            '<div class="meta" style="font-size:1.1rem;margin-top:6px">' + preview + '<span class="text-muted" style="font-size:.8rem">' + more + "</span></div>" +
          "</div>" +
          '<div class="cart-actions">' +
            '<b style="font-size:1.05rem">' + store.money(o.totals.total) + "</b>" +
            '<a class="btn btn-outline btn-sm" href="order.html?id=' + ui.esc(o.id) + '">View</a>' +
          "</div>" +
        "</div>";
      }).join("") +
      "</div>";
  }

  /* =========================================================
     Init
     ========================================================= */
  function init() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");

    if (id) {
      var order = store.getOrder(id);
      if (order) {
        renderConfirmation(order);
        return;
      }
      ui.toast("Order not found", { type: "error", title: "We couldn't find that order" });
    }

    renderHistory();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
