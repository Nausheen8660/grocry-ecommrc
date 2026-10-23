/* =========================================================
   FreshCart — js/ui.js
   Shared UI: icons, toasts, header behaviour, theme, and
   reusable renderers (product card, stars, price).
   ========================================================= */
(function (global) {
  "use strict";

  var App = global.App || (global.App = {});
  var store = App.store;

  /* =========================================================
     Icons (inline SVG so nothing loads from the network)
     ========================================================= */
  var ICONS = {
    search:   '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    cart:     '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h2.2l2.3 12.1a1.8 1.8 0 0 0 1.8 1.4h8.9a1.8 1.8 0 0 0 1.8-1.4L21 7H5.4"/></svg>',
    heart:    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5 4.1 13a4.6 4.6 0 0 1 6.5-6.5l1.4 1.3 1.4-1.3A4.6 4.6 0 1 1 19.9 13Z"/></svg>',
    sun:      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2Z"/></svg>',
    menu:     '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    close:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    plus:     '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    minus:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14"/></svg>',
    trash:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6M19 6l-.9 13.1a2 2 0 0 1-2 1.9H7.9a2 2 0 0 1-2-1.9L5 6"/></svg>',
    arrow:    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
    check:    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12 5.5 5.5L20 7"/></svg>',
    star:     '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9Z"/></svg>',
    starHalf: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9Z" opacity=".35"/></svg>',
    starEmpty:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9Z"/></svg>',
    truck:    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h13v13H1zM14 8h4.5L22 11.5V16h-8"/></svg>',
    shield:   '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.8 20 6v6c0 4.4-3.2 7.9-8 9.2-4.8-1.3-8-4.8-8-9.2V6Z"/><path d="m8.8 12 2.2 2.2 4.2-4.2"/></svg>',
    clock:    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/></svg>',
    copy:     '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>',
    filter:   '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18l-7 8v6l-4 2v-8Z"/></svg>',
    tag:      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 2.8 12V4.8A2 2 0 0 1 4.8 2.8H12a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.3" fill="currentColor"/></svg>',
    lock:     '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    refresh:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 12a8.5 8.5 0 1 1-2.5-6"/><path d="M20.5 4v5h-5"/></svg>'
  };

  function icon(name) { return ICONS[name] || ""; }

  /* =========================================================
     Escape HTML so product data can never inject markup
     ========================================================= */
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* =========================================================
     Toasts
     ========================================================= */
  function toastHost() {
    var host = document.querySelector(".toast-host");
    if (!host) {
      host = document.createElement("div");
      host.className = "toast-host";
      host.setAttribute("role", "status");
      host.setAttribute("aria-live", "polite");
      document.body.appendChild(host);
    }
    return host;
  }

  function toast(message, options) {
    options = options || {};
    var host = toastHost();

    var el = document.createElement("div");
    el.className = "toast" + (options.type ? " " + options.type : "");

    el.innerHTML =
      '<span class="ico">' + (options.icon || (options.type === "error" ? "⚠️" : "✅")) + "</span>" +
      '<span class="msg"><b>' + esc(options.title || message) + "</b>" +
      (options.subtitle ? "<span>" + esc(options.subtitle) + "</span>" : "") + "</span>" +
      '<button class="close" aria-label="Dismiss">' + icon("close") + "</button>";

    var timer = setTimeout(dismiss, options.duration || 3200);

    function dismiss() {
      clearTimeout(timer);
      if (!el.parentNode) return;
      el.classList.add("out");
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 280);
    }

    el.querySelector(".close").addEventListener("click", dismiss);
    host.appendChild(el);
    return dismiss;
  }

  /* =========================================================
     Header: theme toggle, cart badge, drawers, search
     ========================================================= */
  function paintCartBadge() {
    var count = store.cartCount();
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = count > 99 ? "99+" : count;
      el.classList.toggle("show", count > 0);
      if (count > 0) {
        el.classList.remove("pop");
        void el.offsetWidth; /* restart animation */
        el.classList.add("pop");
      }
    });
  }

  function paintWishlistBadge() {
    var count = store.getWishlist().length;
    document.querySelectorAll("[data-wish-count]").forEach(function (el) {
      el.textContent = count > 99 ? "99+" : count;
      el.classList.toggle("show", count > 0);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.innerHTML = icon(theme === "dark" ? "sun" : "moon");
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }

  function initTheme() {
    var saved = store.getTheme();
    if (saved !== "light" && saved !== "dark") {
      saved = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    applyTheme(saved);

    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        store.setTheme(next);
        applyTheme(next);
      });
    });
  }

  /* Drawer / scrim helpers */
  function openDrawer(el) {
    el.classList.add("open");
    var scrim = document.querySelector(".scrim");
    if (scrim) scrim.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeDrawers() {
    document.querySelectorAll(".mobile-drawer, .filters").forEach(function (el) { el.classList.remove("open"); });
    var scrim = document.querySelector(".scrim");
    if (scrim) scrim.classList.remove("show");
    document.body.style.overflow = "";
  }

  function initDrawers() {
    document.addEventListener("click", function (e) {
      var opener = e.target.closest("[data-drawer]");
      if (opener) {
        var target = document.querySelector(opener.getAttribute("data-drawer"));
        if (target) { e.preventDefault(); openDrawer(target); }
        return;
      }
      if (e.target.closest("[data-close-drawer]")) { e.preventDefault(); closeDrawers(); }
    });

    var scrim = document.querySelector(".scrim");
    if (scrim) scrim.addEventListener("click", closeDrawers);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDrawers();
    });
  }

  /* =========================================================
     Renderers
     ========================================================= */
  function stars(rating) {
    var out = '<span class="stars">';
    for (var i = 1; i <= 5; i++) {
      if (rating >= i) out += icon("star");
      else if (rating >= i - 0.5) out += icon("starHalf");
      else out += icon("starEmpty");
    }
    return out + "</span>";
  }

  /* Gradient + emoji placeholder; uses a real photo if "image" is set. */
  function media(product, extraClass) {
    var cls = "media-fill " + (extraClass || "");
    var h = product.hue || 100;

    if (product.image) {
      var safe = encodeURI(product.image).replace(/'/g, "%27");
      return '<div class="' + cls + '" style="background-image:url(&quot;' + safe + '&quot;);background-size:cover;background-position:center"></div>';
    }

    return '<div class="' + cls + '" style="background:linear-gradient(140deg,hsl(' + h + ',72%,88%),hsl(' + ((h + 30) % 360) + ',68%,76%))">' +
           '<span class="emo">' + product.emoji + "</span></div>";
  }

  function stockTag(product) {
    if (product.stock <= 0) return '<span class="stock-tag out">Out of stock</span>';
    if (product.stock <= 10) return '<span class="stock-tag low">Only ' + product.stock + " left</span>";
    return '<span class="stock-tag in">In stock</span>';
  }

  function priceBlock(product) {
    var html = '<span class="price-now">' + store.money(product.price) + "</span>";
    if (product.was && product.was > product.price) {
      html += '<span class="price-was">' + store.money(product.was) + "</span>";
    }
    return html;
  }

  function productCard(product) {
    var inCart = store.getCart().some(function (l) { return l.id === product.id; });
    var wished = store.isWishlisted(product.id);
    var badge = "";
    if (product.badge === "sale") badge = '<span class="ribbon sale">Sale</span>';
    else if (product.badge === "new") badge = '<span class="ribbon new">New</span>';

    return "" +
      '<article class="card" data-id="' + product.id + '">' +
        '<div class="card-img">' +
          media(product) +
          badge +
          '<button class="fav-btn' + (wished ? " on" : "") + '" data-fav="' + product.id + '" aria-label="Save for later" aria-pressed="' + wished + '">' + icon("heart") + "</button>" +
        "</div>" +
        '<div class="card-body">' +
          '<span class="card-brand">' + esc(product.brand) + "</span>" +
          '<h3 class="card-title"><a href="product.html?id=' + product.id + '">' + esc(product.name) + "</a></h3>" +
          '<span class="card-unit">' + esc(product.unit) + "</span>" +
          '<span class="card-rating">' + stars(product.rating) +
            '<span class="rating-num">' + product.rating.toFixed(1) + "</span>" +
            '<span class="review-count">(' + product.reviews + ")</span>" +
          "</span>" +
          '<div class="card-foot">' +
            '<span class="price">' + priceBlock(product) + "</span>" +
            '<button class="add-btn' + (inCart ? " in-cart" : "") + '" data-add="' + product.id + '" ' +
              (product.stock <= 0 ? "disabled" : "") +
              ' aria-label="Add ' + esc(product.name) + ' to cart" title="Add to cart">' +
              (inCart ? icon("check") : icon("plus")) +
            "</button>" +
          "</div>" +
        "</div>" +
      "</article>";
  }

  function renderGrid(container, products) {
    if (!container) return;
    if (!products.length) {
      container.innerHTML =
        '<div class="empty" style="grid-column:1/-1">' +
          '<div class="emo">🔍</div>' +
          "<h3>No products found</h3>" +
          "<p>Try a different search term or clear your filters.</p>" +
          '<button class="btn btn-outline" data-clear-filters>Clear all filters</button>' +
        "</div>";
      return;
    }
    container.innerHTML = products.map(productCard).join("");
  }

  /* =========================================================
     Global delegated actions (add to cart, wishlist, etc.)
     ========================================================= */
  function initGlobalActions() {
    document.addEventListener("click", function (e) {
      /* add to cart */
      var addBtn = e.target.closest("[data-add]");
      if (addBtn) {
        e.preventDefault();
        var result = store.addToCart(addBtn.getAttribute("data-add"), 1);
        if (!result.ok) {
          toast("Out of stock", { type: "error", title: "Unavailable" });
        } else {
          paintCartBadge();
          toast("Added to cart", {
            title: "Added to your cart",
            subtitle: result.product.name + " · " + store.money(result.product.price)
          });
          refreshAddButtons();
        }
        return;
      }

      /* wishlist */
      var favBtn = e.target.closest("[data-fav]");
      if (favBtn) {
        e.preventDefault();
        var id = favBtn.getAttribute("data-fav");
        var nowWished = store.toggleWishlist(id);
        favBtn.classList.toggle("on", nowWished);
        favBtn.setAttribute("aria-pressed", String(nowWished));
        paintWishlistBadge();
        var p = store.findProduct(id);
        toast(nowWished ? "Saved for later" : "Removed from saved items", {
          type: nowWished ? "info" : "",
          title: nowWished ? "Added to wishlist" : "Removed from wishlist",
          subtitle: p ? p.name : ""
        });
        return;
      }
    });
  }

  function refreshAddButtons() {
    var cart = store.getCart();
    document.querySelectorAll("[data-add]").forEach(function (btn) {
      var id = btn.getAttribute("data-add");
      var inCart = cart.some(function (l) { return l.id === id; });
      btn.classList.toggle("in-cart", inCart);
      if (inCart) btn.innerHTML = icon("check");
    });
  }

  /* =========================================================
     Search in header (navigates to index with ?q=)
     ========================================================= */
  function initHeaderSearch() {
    var form = document.querySelector("[data-search-form]");
    if (!form) return;
    var input = form.querySelector("input");
    var clear = form.querySelector(".search-clear");

    /* Emit a search event. The homepage filters in place; other pages
       navigate to the homepage with the query in the URL. */
    function emit() {
      document.dispatchEvent(new CustomEvent("fc:search", {
        detail: { q: input.value.trim() }
      }));
    }

    var debounce;
    input.addEventListener("input", function () {
      clearTimeout(debounce);
      debounce = setTimeout(emit, 220);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = input.value.trim();

      /* already on the homepage — filter in place */
      if (document.getElementById("productGrid")) {
        emit();
        return;
      }

      window.location.href = "index.html" + (q ? "?q=" + encodeURIComponent(q) : "");
    });

    if (clear) {
      clear.addEventListener("click", function () {
        input.value = "";
        input.focus();
        emit();
      });
      input.addEventListener("input", function () {
        clear.classList.toggle("hide", !input.value);
      });
      clear.classList.toggle("hide", !input.value);
    }
  }

  /* Fill the header search box from ?q= */
  function syncSearchFromQuery() {
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    var input = document.querySelector("[data-search-form] input");
    if (input && q) {
      input.value = q;
      var clear = document.querySelector("[data-search-form] .search-clear");
      if (clear) clear.classList.remove("hide");
    }
    return q || "";
  }

  /* =========================================================
     Boot
     ========================================================= */
  function init() {
    initTheme();
    initDrawers();
    initGlobalActions();
    initHeaderSearch();
    syncSearchFromQuery();
    paintCartBadge();
    paintWishlistBadge();
  }

  App.ui = {
    icon: icon,
    esc: esc,
    toast: toast,
    stars: stars,
    media: media,
    stockTag: stockTag,
    priceBlock: priceBlock,
    productCard: productCard,
    renderGrid: renderGrid,
    paintCartBadge: paintCartBadge,
    paintWishlistBadge: paintWishlistBadge,
    refreshAddButtons: refreshAddButtons,
    applyTheme: applyTheme,
    openDrawer: openDrawer,
    closeDrawers: closeDrawers,
    init: init
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
