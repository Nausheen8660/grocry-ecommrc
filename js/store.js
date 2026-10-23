/* =========================================================
   FreshCart — js/store.js
   Client-side state: cart, wishlist, orders, promo.
   Persisted to localStorage so it survives page reloads.
   ========================================================= */
(function (global) {
  "use strict";

  var App = global.App || (global.App = {});

  var KEYS = {
    cart:     "fc.cart.v1",
    wishlist: "fc.wishlist.v1",
    orders:   "fc.orders.v1",
    theme:    "fc.theme.v1",
    promo:    "fc.promo.v1"
  };

  /* ---------- storage helpers (safe against private mode) ---------- */
  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn("FreshCart: could not persist", key, e);
      return false;
    }
  }

  /* ---------- money ---------- */
  var moneyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

  function money(value) { return moneyFormatter.format(value); }

  function cents(value) { return Math.round(value * 100) / 100; }

  /* ---------- product lookup ---------- */
  function findProduct(id) {
    var list = App.data.products;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function findCategory(id) {
    var list = App.data.categories;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  /* =========================================================
     Cart
     ========================================================= */
  var cart = read(KEYS.cart, []);

  function getCart() { return cart.slice(); }

  function saveCart() { write(KEYS.cart, cart); }

  function cartCount() {
    return cart.reduce(function (sum, line) { return sum + line.qty; }, 0);
  }

  function addToCart(productId, qty) {
    var product = findProduct(productId);
    if (!product) return { ok: false, reason: "unknown" };
    if (product.stock <= 0) return { ok: false, reason: "out-of-stock" };

    qty = Math.max(1, parseInt(qty, 10) || 1);

    var existing = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === productId) { existing = cart[i]; break; }
    }

    var current = existing ? existing.qty : 0;
    var next = Math.min(current + qty, product.stock);

    if (existing) {
      existing.qty = next;
    } else {
      cart.push({ id: productId, qty: next });
    }

    saveCart();
    return { ok: true, qty: next, added: next - current, product: product };
  }

  function setQty(productId, qty) {
    var product = findProduct(productId);
    qty = parseInt(qty, 10);

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === productId) {
        if (!qty || qty < 1) {
          cart.splice(i, 1);
        } else {
          cart[i].qty = product ? Math.min(qty, product.stock) : qty;
        }
        saveCart();
        return true;
      }
    }
    return false;
  }

  function removeFromCart(productId) {
    cart = cart.filter(function (line) { return line.id !== productId; });
    saveCart();
  }

  function clearCart() {
    cart = [];
    saveCart();
  }

  /* Full cart lines, joined with product data. Drops stale lines. */
  function cartLines() {
    var lines = [];
    var changed = false;

    cart.forEach(function (line) {
      var product = findProduct(line.id);
      if (!product) { changed = true; return; }
      lines.push({
        product: product,
        qty: line.qty,
        lineTotal: cents(product.price * line.qty)
      });
    });

    if (changed) { cart = lines.map(function (l) { return { id: l.product.id, qty: l.qty }; }); saveCart(); }
    return lines;
  }

  /* ---------- totals ---------- */
  function totals(deliveryOption) {
    var lines = cartLines();
    var subtotal = cents(lines.reduce(function (sum, l) { return sum + l.lineTotal; }, 0));

    var savings = cents(lines.reduce(function (sum, l) {
      if (l.product.was && l.product.was > l.product.price) {
        return sum + (l.product.was - l.product.price) * l.qty;
      }
      return sum;
    }, 0));

    var promo = getPromo();
    var promoDiscount = 0;
    if (promo) {
      if (promo.code === "DELIVERY") {
        promoDiscount = 0; // affects delivery only
      } else if (promo.type === "percent") {
        promoDiscount = cents(subtotal * (promo.value / 100));
      } else if (promo.type === "flat") {
        promoDiscount = subtotal >= promo.minimum ? cents(promo.value) : 0;
      }
    }

    var deliveryCost = App.data.delivery.base;
    if (deliveryOption && typeof deliveryOption.price === "number") {
      deliveryCost = deliveryOption.price;
    }
    if (subtotal >= App.data.delivery.freeThreshold) deliveryCost = 0;
    if (promo && promo.code === "DELIVERY") deliveryCost = 0;

    var taxable = Math.max(0, subtotal - promoDiscount);
    var tax = cents(taxable * App.data.taxRate);
    var total = cents(taxable + deliveryCost + tax);

    return {
      lines: lines,
      count: lines.reduce(function (s, l) { return s + l.qty; }, 0),
      subtotal: subtotal,
      savings: savings,
      promo: promo,
      promoDiscount: promoDiscount,
      delivery: cents(deliveryCost),
      tax: tax,
      total: total,
      freeDeliveryThreshold: App.data.delivery.freeThreshold
    };
  }

  /* =========================================================
     Promo codes
     ========================================================= */
  function getPromo() { return read(KEYS.promo, null); }

  function applyPromo(code) {
    code = String(code || "").trim().toUpperCase();
    var promos = App.data.promos;
    if (!promos[code]) return { ok: false, reason: "invalid" };

    var promo = { code: code, type: promos[code].type, value: promos[code].value, label: promos[code].label };
    if (code === "SAVE5") promo.minimum = 50;

    var sub = totals().subtotal;
    if (promo.type === "flat" && sub < promo.minimum) {
      return { ok: false, reason: "minimum", minimum: promo.minimum };
    }

    write(KEYS.promo, promo);
    return { ok: true, promo: promo };
  }

  function clearPromo() { write(KEYS.promo, null); }

  /* =========================================================
     Wishlist
     ========================================================= */
  function getWishlist() { return read(KEYS.wishlist, []); }

  function isWishlisted(id) { return getWishlist().indexOf(id) !== -1; }

  function toggleWishlist(id) {
    var list = getWishlist();
    var idx = list.indexOf(id);
    if (idx === -1) { list.push(id); write(KEYS.wishlist, list); return true; }
    list.splice(idx, 1);
    write(KEYS.wishlist, list);
    return false;
  }

  /* =========================================================
     Orders
     ========================================================= */
  function getOrders() { return read(KEYS.orders, []); }

  function saveOrder(order) {
    var list = getOrders();
    list.unshift(order);
    write(KEYS.orders, list);
    return order;
  }

  function getOrder(id) {
    var list = getOrders();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function makeOrderId() {
    var n = getOrders().length + 1;
    return "FC-" + String(Date.now()).slice(-6) + "-" + String(n).padStart(2, "0");
  }

  /* =========================================================
     Theme
     ========================================================= */
  function getTheme() { return read(KEYS.theme, "light"); }

  function setTheme(theme) {
    write(KEYS.theme, theme);
    document.documentElement.setAttribute("data-theme", theme);
  }

  /* =========================================================
     Export
     ========================================================= */
  App.store = {
    money: money,
    cents: cents,
    findProduct: findProduct,
    findCategory: findCategory,
    getCart: getCart,
    cartCount: cartCount,
    addToCart: addToCart,
    setQty: setQty,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    cartLines: cartLines,
    totals: totals,
    getPromo: getPromo,
    applyPromo: applyPromo,
    clearPromo: clearPromo,
    getWishlist: getWishlist,
    isWishlisted: isWishlisted,
    toggleWishlist: toggleWishlist,
    getOrders: getOrders,
    getOrder: getOrder,
    saveOrder: saveOrder,
    makeOrderId: makeOrderId,
    getTheme: getTheme,
    setTheme: setTheme
  };
})(window);
