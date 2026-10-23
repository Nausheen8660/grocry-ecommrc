/* =========================================================
   FreshCart — js/home.js
   Homepage: category rail, filtering, sorting, rendering.
   ========================================================= */
(function (global) {
  "use strict";

  var App = global.App;
  var store = App.store;
  var ui = App.ui;

  /* ---------- state ---------- */
  var state = {
    q: "",
    cat: "all",
    min: null,
    max: null,
    rating: 0,
    inStock: false,
    onSale: false,
    sort: "featured"
  };

  var els = {};
  var onRender = null;   /* hook so init() can attach the URL sync */

  function $(id) { return document.getElementById(id); }

  /* =========================================================
     Category rail + filter list
     ========================================================= */
  function buildCategoryRail() {
    els.catRail.innerHTML = App.data.categories.map(function (c) {
      var count = c.id === "all"
        ? App.data.products.length
        : App.data.products.filter(function (p) { return p.cat === c.id; }).length;
      return '<button class="cat-pill' + (c.id === state.cat ? " active" : "") + '" data-cat="' + c.id + '">' +
               '<span class="emo">' + c.emoji + "</span>" + ui.esc(c.name) +
               ' <span class="text-xs" style="opacity:.6">' + count + "</span>" +
             "</button>";
    }).join("");
  }

  function buildCatFilters() {
    els.catFilters.innerHTML = App.data.categories.map(function (c) {
      var count = c.id === "all"
        ? App.data.products.length
        : App.data.products.filter(function (p) { return p.cat === c.id; }).length;
      return '<label class="filter-item radio">' +
               '<span class="checkbox" style="align-items:center"><input type="radio" name="cat" value="' + c.id + '"' + (c.id === state.cat ? " checked" : "") + ">" +
               "<span>" + ui.esc(c.name) + "</span></span>" +
               '<span class="count">' + count + "</span>" +
             "</label>";
    }).join("");
  }

  /* =========================================================
     Filtering + sorting
     ========================================================= */
  function applyFilters() {
    var q = state.q.toLowerCase().trim();

    var list = App.data.products.filter(function (p) {
      if (state.cat !== "all" && p.cat !== state.cat) return false;
      if (state.inStock && p.stock <= 0) return false;
      if (state.onSale && !(p.was && p.was > p.price)) return false;
      if (state.rating && p.rating < state.rating) return false;
      if (state.min !== null && p.price < state.min) return false;
      if (state.max !== null && p.price > state.max) return false;
      if (q) {
        var haystack = (p.name + " " + p.brand + " " + p.unit + " " + p.desc + " " + p.cat).toLowerCase();
        if (haystack.indexOf(q) === -1) return false;
      }
      return true;
    });

    return sortProducts(list);
  }

  function sortProducts(list) {
    var sorted = list.slice();
    switch (state.sort) {
      case "price-asc":  sorted.sort(function (a, b) { return a.price - b.price; }); break;
      case "price-desc": sorted.sort(function (a, b) { return b.price - a.price; }); break;
      case "rating":     sorted.sort(function (a, b) { return b.rating - a.rating; }); break;
      case "name":       sorted.sort(function (a, b) { return a.name.localeCompare(b.name); }); break;
      case "discount":
        sorted.sort(function (a, b) { return discountPct(b) - discountPct(a); });
        break;
      default:           /* featured: sale/new first, then rating */
        sorted.sort(function (a, b) {
          var rank = function (p) { return p.badge === "sale" ? 0 : p.badge === "new" ? 1 : 2; };
          return rank(a) - rank(b) || b.rating - a.rating;
        });
    }
    return sorted;
  }

  function discountPct(p) {
    if (!p.was || p.was <= p.price) return 0;
    return Math.round(((p.was - p.price) / p.was) * 100);
  }

  /* =========================================================
     Render
     ========================================================= */
  function render() {
    var products = applyFilters();

    ui.renderGrid(els.grid, products);

    els.resultCount.innerHTML = "Showing <b>" + products.length + "</b> of " + App.data.products.length + " products";
    els.shopTitle.textContent = titleForState();
    els.shopSub.textContent = products.length
      ? "Prices include farm-direct sourcing and cold-chain delivery."
      : "No items match your current selection.";

    renderActiveFilters();
    syncControls();

    if (onRender) onRender();
  }

  function titleForState() {
    if (state.q) return 'Results for "' + state.q + '"';
    if (state.cat !== "all") {
      var c = store.findCategory(state.cat);
      return c ? c.name : "Groceries";
    }
    return "All groceries";
  }

  function renderActiveFilters() {
    var tags = [];

    if (state.q) {
      tags.push({ key: "q", label: 'Search: "' + state.q + '"' });
    }
    if (state.cat !== "all") {
      var c = store.findCategory(state.cat);
      tags.push({ key: "cat", label: c ? c.name : state.cat });
    }
    if (state.min !== null) tags.push({ key: "min", label: "Min $" + state.min });
    if (state.max !== null) tags.push({ key: "max", label: "Max $" + state.max });
    if (state.rating) tags.push({ key: "rating", label: state.rating + "★ & up" });
    if (state.inStock) tags.push({ key: "inStock", label: "In stock" });
    if (state.onSale) tags.push({ key: "onSale", label: "On sale" });

    if (!tags.length) { els.activeFilters.innerHTML = ""; return; }

    els.activeFilters.innerHTML =
      tags.map(function (t) {
        return '<span class="tag">' + ui.esc(t.label) +
          '<button data-remove-filter="' + t.key + '" aria-label="Remove filter">✕</button></span>';
      }).join("") +
      '<button class="btn btn-ghost btn-sm" data-clear-filters>Clear all</button>';
  }

  function syncControls() {
    document.querySelectorAll("[data-cat]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-cat") === state.cat);
    });
    var radio = document.querySelector('input[name="cat"][value="' + state.cat + '"]');
    if (radio) radio.checked = true;

    els.fInStock.checked = state.inStock;
    els.fOnSale.checked = state.onSale;
    els.fMin.value = state.min === null ? "" : state.min;
    els.fMax.value = state.max === null ? "" : state.max;
    els.sortBy.value = state.sort;

    document.querySelectorAll("[data-rating]").forEach(function (chip) {
      chip.classList.toggle("active", parseFloat(chip.getAttribute("data-rating")) === state.rating);
    });
  }

  /* =========================================================
     Actions
     ========================================================= */
  function setCategory(cat) {
    state.cat = cat || "all";
    render();
  }

  function clearFilters() {
    state.q = "";
    state.cat = "all";
    state.min = null;
    state.max = null;
    state.rating = 0;
    state.inStock = false;
    state.onSale = false;
    state.sort = "featured";

    var searchInput = document.querySelector("[data-search-form] input");
    if (searchInput) {
      searchInput.value = "";
      var clear = document.querySelector("[data-search-form] .search-clear");
      if (clear) clear.classList.add("hide");
    }
    render();
  }

  /* =========================================================
     Init
     ========================================================= */
  function init() {
    els.catRail = $("catRail");
    els.catFilters = $("catFilters");
    els.grid = $("productGrid");
    els.resultCount = $("resultCount");
    els.shopTitle = $("shopTitle");
    els.shopSub = $("shopSub");
    els.activeFilters = $("activeFilters");
    els.fInStock = $("fInStock");
    els.fOnSale = $("fOnSale");
    els.fMin = $("fMin");
    els.fMax = $("fMax");
    els.sortBy = $("sortBy");

    if (!els.grid) return;

    /* read initial state from the URL */
    var params = new URLSearchParams(window.location.search);
    state.q = params.get("q") || "";
    var cat = params.get("cat");
    if (cat && store.findCategory(cat)) state.cat = cat;

    buildCategoryRail();
    buildCatFilters();
    render();

    /* --- events --- */

    /* category pills */
    els.catRail.addEventListener("click", function (e) {
      var pill = e.target.closest("[data-cat]");
      if (pill) setCategory(pill.getAttribute("data-cat"));
    });

    /* category radios */
    els.catFilters.addEventListener("change", function (e) {
      if (e.target.name === "cat") setCategory(e.target.value);
    });

    /* availability */
    els.fInStock.addEventListener("change", function () { state.inStock = els.fInStock.checked; render(); });
    els.fOnSale.addEventListener("change", function () { state.onSale = els.fOnSale.checked; render(); });

    /* price */
    function readPrice() {
      var min = parseFloat(els.fMin.value);
      var max = parseFloat(els.fMax.value);
      state.min = isNaN(min) ? null : min;
      state.max = isNaN(max) ? null : max;
      render();
    }
    els.fMin.addEventListener("input", readPrice);
    els.fMax.addEventListener("input", readPrice);

    /* rating chips */
    $("ratingChips").addEventListener("click", function (e) {
      var chip = e.target.closest("[data-rating]");
      if (!chip) return;
      var val = parseFloat(chip.getAttribute("data-rating"));
      state.rating = state.rating === val ? 0 : val;
      render();
    });

    /* sort */
    els.sortBy.addEventListener("change", function () { state.sort = els.sortBy.value; render(); });

    /* clear filters (anywhere on the page) */
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-clear-filters]")) { e.preventDefault(); clearFilters(); return; }

      var remove = e.target.closest("[data-remove-filter]");
      if (remove) {
        e.preventDefault();
        var key = remove.getAttribute("data-remove-filter");
        if (key === "q") {
          state.q = "";
          var input = document.querySelector("[data-search-form] input");
          if (input) input.value = "";
        }
        else if (key === "min") state.min = null;
        else if (key === "max") state.max = null;
        else if (key === "rating") state.rating = 0;
        else if (key === "inStock") state.inStock = false;
        else if (key === "onSale") state.onSale = false;
        else if (key === "cat") state.cat = "all";
        render();
      }
    });

    /* newsletter */
    var news = $("newsletterForm");
    if (news) {
      news.addEventListener("submit", function (e) {
        e.preventDefault();
        var email = news.querySelector("input").value;
        ui.toast("Welcome to FreshCart!", {
          icon: "🎉",
          title: "You're on the list!",
          subtitle: "Use code FRESH10 for 10% off your first order."
        });
        news.reset();
      });
    }

    /* keep the URL in sync so the view is shareable.
       Guarded because history.replaceState can throw on file:// */
    var pushTimer;
    function syncUrl() {
      clearTimeout(pushTimer);
      pushTimer = setTimeout(function () {
        try {
          var params = new URLSearchParams();
          if (state.q) params.set("q", state.q);
          if (state.cat !== "all") params.set("cat", state.cat);
          var qs = params.toString();
          history.replaceState(null, "", qs ? "?" + qs : location.pathname);
        } catch (e) { /* file:// protocol — ignore */ }
      }, 250);
    }
    onRender = syncUrl;

    /* live search from the header — filters in place, no reload */
    document.addEventListener("fc:search", function (e) {
      state.q = e.detail.q;
      render();
    });

    /* footer year */
    var year = $("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
