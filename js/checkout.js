/* =========================================================
   FreshCart — js/checkout.js
   Multi-step checkout with client-side validation.
   ========================================================= */
(function (global) {
  "use strict";

  var App = global.App;
  var store = App.store;
  var ui = App.ui;

  function $(id) { return document.getElementById(id); }

  var STEP_LABELS = ["Address", "Delivery", "Payment", "Review"];

  var state = {
    step: 1,
    slot: App.data.delivery.slots[0],
    payment: "card"
  };

  var draft = {};   /* saved form values, so going back keeps them */

  /* =========================================================
     Steps navigation
     ========================================================= */
  function goTo(step) {
    state.step = step;
    for (var i = 1; i <= 4; i++) {
      $("panel" + i).classList.toggle("hide", i !== step);
    }
    renderSteps();
    renderSummary();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderSteps() {
    var html = "";
    for (var i = 1; i <= STEP_LABELS.length; i++) {
      var cls = i === state.step ? "active" : (i < state.step ? "done" : "");
      html += '<div class="step ' + cls + '">' +
                '<span class="num">' + (i < state.step ? "✓" : i) + "</span>" +
                '<span class="label">' + STEP_LABELS[i - 1] + "</span>" +
              "</div>";
      if (i < STEP_LABELS.length) html += '<span class="step-sep"></span>';
    }
    $("steps").innerHTML = html;
  }

  /* =========================================================
     Validation
     ========================================================= */
  var RULES = {
    firstName:  { test: function (v) { return v.trim().length > 1; } },
    lastName:   { test: function (v) { return v.trim().length > 1; } },
    email:      { test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } },
    phone:      { test: function (v) { return v.replace(/\D/g, "").length >= 7; } },
    address:    { test: function (v) { return v.trim().length > 3; } },
    city:       { test: function (v) { return v.trim().length > 1; } },
    zip:        { test: function (v) { return v.trim().length >= 3; } },
    cardName:   { test: function (v) { return v.trim().length > 2; } },
    cardNumber: { test: function (v) { return v.replace(/\D/g, "").length >= 15; } },
    cardExp:    { test: function (v) { return /^\d{2}\/\d{2}$/.test(v.trim()); } },
    cardCvc:    { test: function (v) { return /^\d{3,4}$/.test(v.trim()); } }
  };

  function validateFields(ids) {
    var ok = true;
    var firstBad = null;

    ids.forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) return;
      var field = input.closest(".field");
      var value = input.value;
      var rule = RULES[id];

      var valid = rule ? rule.test(value) : true;
      if (field) field.classList.toggle("invalid", !valid);
      if (!valid) {
        ok = false;
        if (!firstBad) firstBad = input;
      }
    });

    if (firstBad) {
      firstBad.focus();
      firstBad.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    return ok;
  }

  function saveDraft() {
    var form = $("panel1");
    if (form) {
      Array.prototype.forEach.call(form.querySelectorAll("input, textarea"), function (el) {
        if (el.name) draft[el.name] = el.value;
      });
    }
    var cn = $("cardName"), cnum = $("cardNumber"), cexp = $("cardExp"), ccvc = $("cardCvc");
    if (cn) draft.cardName = cn.value;
    if (cnum) draft.cardNumber = cnum.value;
    if (cexp) draft.cardExp = cexp.value;
    if (ccvc) draft.cardCvc = ccvc.value;
    draft.slotNote = $("slotNote") ? $("slotNote").value : "";
  }

  function restoreDraft() {
    Object.keys(draft).forEach(function (key) {
      var el = document.querySelector('[name="' + key + '"]');
      if (el) el.value = draft[key];
    });
    if (draft.slotNote && $("slotNote")) $("slotNote").value = draft.slotNote;
  }

  /* =========================================================
     Delivery slots
     ========================================================= */
  function renderSlots() {
    var t = store.totals(state.slot);
    var free = t.subtotal >= App.data.delivery.freeThreshold;

    $("slotList").innerHTML = App.data.delivery.slots.map(function (s) {
      var price = free ? "FREE" : store.money(s.price);
      var selected = state.slot.id === s.id;
      return '<div class="option-card' + (selected ? " selected" : "") + '" data-slot="' + s.id + '" role="button" tabindex="0">' +
        '<span class="ico">' + s.icon + "</span>" +
        '<div class="body"><b>' + ui.esc(s.label) + "</b><span>" + ui.esc(s.detail) + "</span></div>" +
        '<span class="price-tag">' + price + "</span>" +
      "</div>";
    }).join("");
  }

  /* =========================================================
     Summary sidebar
     ========================================================= */
  function renderSummary() {
    var t = store.totals(state.slot);
    var promo = t.promo;

    var items = t.lines.map(function (l) {
      return '<div class="summary-row" style="align-items:flex-start;gap:10px">' +
        '<span style="flex:1">' + ui.esc(l.product.name) +
          '<span style="color:var(--text-soft)"> × ' + l.qty + "</span></span>" +
        "<span>" + store.money(l.lineTotal) + "</span>" +
      "</div>";
    }).join("");

    if (!items) {
      items = '<div class="summary-row"><span class="text-muted">Your basket is empty</span></div>';
    }
    $("summaryItems").innerHTML = items;

    var rows = '<div class="summary-row"><span>Subtotal</span><span>' + store.money(t.subtotal) + "</span></div>";
    if (promo) {
      rows += '<div class="summary-row"><span>Promo (' + ui.esc(promo.code) + ")</span><span class=\"discount\">−" + store.money(t.promoDiscount) + "</span></div>";
    }
    rows += '<div class="summary-row"><span>Delivery — ' + ui.esc(state.slot.label) + "</span><span" +
            (t.delivery === 0 ? ' class="free"' : "") + ">" +
            (t.delivery === 0 ? "FREE" : store.money(t.delivery)) + "</span></div>";
    rows += '<div class="summary-row"><span>Tax</span><span>' + store.money(t.tax) + "</span></div>";
    rows += '<div class="summary-row total"><span>Total</span><span>' + store.money(t.total) + "</span></div>";

    $("summaryTotals").innerHTML = rows;
  }

  /* =========================================================
     Review panel
     ========================================================= */
  function renderReview() {
    var t = store.totals(state.slot);
    var d = draft;

    var payLabel = { card: "Card ending " + (d.cardNumber || "••••").replace(/\D/g, "").slice(-4),
                     paypal: "PayPal", apple: "Apple Pay", cash: "Cash on delivery" }[state.payment];

    var itemsHtml = t.lines.map(function (l) {
      return '<div class="review-item">' +
        '<span class="emo">' + l.product.emoji + "</span>" +
        '<div class="grow"><b>' + ui.esc(l.product.name) + "</b><span>" + ui.esc(l.product.unit) + " × " + l.qty + "</span></div>" +
        "<b>" + store.money(l.lineTotal) + "</b>" +
      "</div>";
    }).join("");

    $("reviewBody").innerHTML =
      '<div class="form-grid" style="gap:14px">' +
        '<div class="eta-item"><div class="lbl">Deliver to</div><div class="val">' +
          ui.esc(d.firstName || "") + " " + ui.esc(d.lastName || "") + "<br>" +
          ui.esc(d.address || "") + ", " + ui.esc(d.city || "") + " " + ui.esc(d.zip || "") +
        "</div></div>" +
        '<div class="eta-item"><div class="lbl">Contact</div><div class="val">' +
          ui.esc(d.email || "") + "<br>" + ui.esc(d.phone || "") +
        "</div></div>" +
        '<div class="eta-item"><div class="lbl">Delivery slot</div><div class="val">' +
          ui.esc(state.slot.label) + "<br>" + ui.esc(state.slot.detail) +
        "</div></div>" +
        '<div class="eta-item"><div class="lbl">Payment</div><div class="val">' + ui.esc(payLabel) + "</div></div>" +
      "</div>" +
      (d.notes || d.slotNote
        ? '<div class="eta-item mt-16"><div class="lbl">Instructions</div><div class="val">' +
          ui.esc(d.notes || d.slotNote) + "</div></div>"
        : "") +
      '<div class="confirm-items"><h4 class="mb-8">Items (' + t.count + ")</h4>" + itemsHtml + "</div>";
  }

  /* =========================================================
     Place order
     ========================================================= */
  function placeOrder() {
    var t = store.totals(state.slot);
    if (!t.count) {
      ui.toast("Your basket is empty", { type: "error", title: "Nothing to order" });
      return;
    }

    var order = {
      id: store.makeOrderId(),
      createdAt: new Date().toISOString(),
      items: t.lines.map(function (l) {
        return { id: l.product.id, name: l.product.name, emoji: l.product.emoji,
                 unit: l.product.unit, price: l.product.price, qty: l.qty, total: l.lineTotal };
      }),
      totals: { subtotal: t.subtotal, discount: t.promoDiscount, delivery: t.delivery, tax: t.tax, total: t.total },
      promo: t.promo ? t.promo.code : null,
      customer: {
        name: (draft.firstName || "") + " " + (draft.lastName || ""),
        email: draft.email || "",
        phone: draft.phone || "",
        address: (draft.address || "") + ", " + (draft.city || "") + " " + (draft.zip || "")
      },
      slot: { id: state.slot.id, label: state.slot.label, detail: state.slot.detail },
      payment: state.payment,
      status: "confirmed"
    };

    store.saveOrder(order);
    store.clearCart();
    store.clearPromo();
    ui.paintCartBadge();

    window.location.href = "order.html?id=" + order.id + "&new=1";
  }

  /* =========================================================
     Init
     ========================================================= */
  function init() {
    if (!store.cartCount()) {
      window.location.href = "cart.html";
      return;
    }

    renderSlots();
    renderSteps();
    renderSummary();

    /* --- step navigation --- */
    document.addEventListener("click", function (e) {
      var next = e.target.closest("[data-next]");
      if (next) {
        e.preventDefault();
        var target = parseInt(next.getAttribute("data-next"), 10);
        saveDraft();

        if (state.step === 1) {
          if (!validateFields(["firstName", "lastName", "email", "phone", "address", "city", "zip"])) {
            ui.toast("Check your details", { type: "error", title: "Some fields need attention" });
            return;
          }
        }
        if (state.step === 3 && state.payment === "card") {
          if (!validateFields(["cardName", "cardNumber", "cardExp", "cardCvc"])) {
            ui.toast("Check your card details", { type: "error", title: "Some fields need attention" });
            return;
          }
        }
        if (target === 4) renderReview();
        goTo(target);
        return;
      }

      var prev = e.target.closest("[data-prev]");
      if (prev) {
        e.preventDefault();
        saveDraft();
        goTo(parseInt(prev.getAttribute("data-prev"), 10));
        return;
      }

      /* delivery slot */
      var slot = e.target.closest("[data-slot]");
      if (slot) {
        var id = slot.getAttribute("data-slot");
        state.slot = App.data.delivery.slots.filter(function (s) { return s.id === id; })[0];
        renderSlots();
        renderSummary();
        return;
      }

      /* payment method */
      var pay = e.target.closest("[data-pay]");
      if (pay) {
        state.payment = pay.getAttribute("data-pay");
        document.querySelectorAll("[data-pay]").forEach(function (el) {
          el.classList.toggle("selected", el === pay);
        });
        $("cardFields").classList.toggle("hide", state.payment !== "card");
        return;
      }
    });

    /* live-clear the error state as the user types */
    document.addEventListener("input", function (e) {
      var field = e.target.closest(".field.invalid");
      if (field) field.classList.remove("invalid");
    });

    /* format the card number as the user types */
    var cardNumber = $("cardNumber");
    if (cardNumber) {
      cardNumber.addEventListener("input", function () {
        var digits = cardNumber.value.replace(/\D/g, "").slice(0, 16);
        cardNumber.value = digits.replace(/(.{4})/g, "$1 ").trim();
      });
    }

    /* expiry */
    var cardExp = $("cardExp");
    if (cardExp) {
      cardExp.addEventListener("input", function () {
        var digits = cardExp.value.replace(/\D/g, "").slice(0, 4);
        cardExp.value = digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
      });
    }

    $("placeOrder").addEventListener("click", placeOrder);

    /* restore a saved address if the browser offers one */
    restoreDraft();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
