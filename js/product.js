/* =========================================================
   FreshCart — js/product.js
   Product detail page.
   ========================================================= */
(function (global) {
  "use strict";

  var App = global.App;
  var store = App.store;
  var ui = App.ui;

  function $(id) { return document.getElementById(id); }

  var product = null;
  var qty = 1;

  function getId() {
    var params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  /* =========================================================
     Render
     ========================================================= */
  function render() {
    var id = getId();
    product = store.findProduct(id);

    if (!product) {
      $("pdp").innerHTML =
        '<div class="empty" style="grid-column:1/-1">' +
          '<div class="emo">🕵️</div>' +
          "<h3>Product not found</h3>" +
          "<p>That product may have sold out or the link is incorrect.</p>" +
          '<a class="btn btn-primary" href="index.html">Back to shopping</a>' +
        "</div>";
      $("relatedSection").classList.add("hide");
      return;
    }

    document.title = product.name + " — FreshCart";
    renderCrumbs();
    renderDetails();
    renderRelated();
  }

  function renderCrumbs() {
    var cat = store.findCategory(product.cat);
    $("crumbs").innerHTML =
      '<a href="index.html">Home</a><span class="sep">/</span>' +
      '<a href="index.html?cat=' + product.cat + '">' + ui.esc(cat ? cat.name : "Shop") + "</a>" +
      '<span class="sep">/</span><span class="text-muted">' + ui.esc(product.name) + "</span>";
  }

  function renderDetails() {
    var inCart = store.getCart().some(function (l) { return l.id === product.id; });
    var wished = store.isWishlisted(product.id);
    var cat = store.findCategory(product.cat);
    var discount = product.was && product.was > product.price
      ? Math.round(((product.was - product.price) / product.was) * 100)
      : 0;

    var badge = "";
    if (product.badge === "sale") badge = '<span class="ribbon sale">' + discount + "% off</span>";
    else if (product.badge === "new") badge = '<span class="ribbon new">New</span>';

    var stockHtml = product.stock <= 0
      ? '<span class="stock-tag out">Out of stock</span>'
      : product.stock <= 10
        ? '<span class="stock-tag low">Only ' + product.stock + " left</span>"
        : '<span class="stock-tag in">✓ In stock</span>';

    $("pdp").innerHTML =
      /* --- media --- */
      '<div class="pdp-media">' +
        ui.media(product, "") +
        badge +
        '<button class="fav-btn' + (wished ? " on" : "") + '" data-fav="' + product.id + '" aria-label="Save for later" aria-pressed="' + wished + '" style="top:14px;right:14px">' + ui.icon("heart") + "</button>" +
      "</div>" +

      /* --- info --- */
      '<div class="pdp-info">' +
        '<span class="eyebrow">' + (cat ? cat.emoji + " " + ui.esc(cat.name) : "Groceries") + "</span>" +
        '<h1 class="pdp-title">' + ui.esc(product.name) + "</h1>" +
        '<div class="row gap-10 wrap">' +
          '<span class="card-rating">' + ui.stars(product.rating) +
            '<span class="rating-num">' + product.rating.toFixed(1) + "</span>" +
            '<span class="review-count">(' + product.reviews + " reviews)</span>" +
          "</span>" +
          '<span class="text-soft">·</span>' +
          "<span>" + ui.esc(product.brand) + "</span>" +
        "</div>" +

        '<div class="pdp-price">' +
          '<span class="now">' + store.money(product.price) + "</span>" +
          (product.was && product.was > product.price
            ? '<span class="was">' + store.money(product.was) + "</span>" +
              '<span class="save">Save ' + store.money(product.was - product.price) + "</span>"
            : "") +
        "</div>" +
        '<div class="row gap-12 wrap" style="margin-top:-6px">' +
          "<span>" + ui.esc(product.unit) + "</span>" + stockHtml +
        "</div>" +

        '<p class="pdp-desc">' + ui.esc(product.desc) + "</p>" +

        '<div class="pdp-actions">' +
          '<div class="qty">' +
            '<button data-step="-1" aria-label="Decrease quantity">−</button>' +
            '<output id="qtyOut">' + qty + "</output>" +
            '<button data-step="1" aria-label="Increase quantity">+</button>' +
          "</div>" +
          '<button class="btn btn-primary btn-lg" data-pdp-add' + (product.stock <= 0 ? " disabled" : "") + ">" +
            ui.icon("cart") + (inCart ? " Add more to cart" : " Add to cart") +
          "</button>" +
          '<button class="btn btn-outline btn-lg" data-fav="' + product.id + '" aria-pressed="' + wished + '">' +
            ui.icon("heart") + (wished ? " Saved" : " Save") +
          "</button>" +
        "</div>" +

        '<dl class="spec-list">' +
          specRow("Brand", product.brand) +
          specRow("Category", cat ? cat.name : "—") +
          specRow("Unit size", product.unit) +
          specRow("Availability", product.stock > 0 ? "In stock (" + product.stock + ")" : "Out of stock") +
          specRow("Delivery", "Tomorrow, 8:00 AM – 12:00 PM") +
        "</dl>" +

        '<div class="mt-24">' +
          '<h4 class="mb-8">Why you\'ll love it</h4>' +
          '<div class="chip-row">' +
            product.features.map(function (f) { return '<span class="chip">' + ui.esc(f) + "</span>"; }).join("") +
          "</div>" +
        "</div>" +

        '<div class="feature-grid mt-24">' +
          featureCard("🚚", "Free delivery", "On orders over " + store.money(App.data.delivery.freeThreshold)) +
          featureCard("❄️", "Cold-chain", "Kept refrigerated end to end") +
          featureCard("↩️", "Easy refunds", "24-hour money back promise") +
        "</div>" +
      "</div>";
  }

  function specRow(label, value) {
    return '<div class="spec-row"><dt>' + ui.esc(label) + "</dt><dd>" + ui.esc(value) + "</dd></div>";
  }

  function featureCard(ico, title, sub) {
    return '<div class="feature-card"><span class="ico">' + ico + "</span><div><b>" + ui.esc(title) + "</b><span>" + ui.esc(sub) + "</span></div></div>";
  }

  /* Related products: same category first, then anything else. */
  function renderRelated() {
    var related = App.data.products
      .filter(function (p) { return p.id !== product.id; })
      .sort(function (a, b) {
        var aScore = (a.cat === product.cat ? 0 : 10) - a.rating;
        var bScore = (b.cat === product.cat ? 0 : 10) - b.rating;
        return aScore - bScore;
      })
      .slice(0, 4);

    ui.renderGrid($("relatedGrid"), related);
  }

  /* =========================================================
     Interactions
     ========================================================= */
  function setQty(next) {
    var max = product ? product.stock : 1;
    qty = Math.max(1, Math.min(next, max));
    var out = $("qtyOut");
    if (out) out.textContent = qty;
  }

  function init() {
    render();

    document.addEventListener("click", function (e) {
      /* quantity stepper */
      var step = e.target.closest("[data-step]");
      if (step) {
        e.preventDefault();
        setQty(qty + parseInt(step.getAttribute("data-step"), 10));
        return;
      }

      /* add to cart */
      var add = e.target.closest("[data-pdp-add]");
      if (add) {
        e.preventDefault();
        var result = store.addToCart(product.id, qty);
        if (!result.ok) {
          ui.toast("Out of stock", { type: "error", title: "Unavailable" });
          return;
        }
        ui.paintCartBadge();
        ui.refreshAddButtons();
        ui.toast("Added to cart", {
          title: qty + " × " + product.name,
          subtitle: "Subtotal " + store.money(product.price * qty)
        });
        renderDetails();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
