/* =========================================================
   FreshCart — js/data.js
   Static product catalogue (no backend required).
   Images are generated as CSS gradients + emoji so the
   project runs fully offline from the filesystem.
   To use real photos, set "image" on a product to a URL.
   ========================================================= */
(function (global) {
  "use strict";

  var App = global.App || (global.App = {});

  var CATEGORIES = [
    { id: "all",      name: "All Items",     emoji: "🛒" },
    { id: "produce",  name: "Fruits & Veg",  emoji: "🥬" },
    { id: "dairy",    name: "Dairy & Eggs",  emoji: "🥛" },
    { id: "bakery",   name: "Bakery",        emoji: "🥖" },
    { id: "meat",     name: "Meat & Seafood",emoji: "🍗" },
    { id: "pantry",   name: "Pantry",        emoji: "🥫" },
    { id: "beverage", name: "Beverages",     emoji: "🧃" },
    { id: "snacks",   name: "Snacks",        emoji: "🍿" },
    { id: "frozen",   name: "Frozen",        emoji: "🧊" }
  ];

  var PRODUCTS = [
    /* ---- Fruits & Vegetables ---- */
    { id: "p01", name: "Hass Avocados", brand: "Green Valley", cat: "produce", price: 5.49, was: 6.99, unit: "4 pack", emoji: "🥑", hue: 118, rating: 4.8, reviews: 412, stock: 24, badge: "sale", desc: "Creamy Hass avocados picked at peak ripeness. Each one is hand-selected for even texture and rich, buttery flavour — perfect for toast, salads and guacamole.", features: ["Sourced from Mexico", "Ripened for 3 days", "Non-GMO"] },
    { id: "p02", name: "Vine Tomatoes", brand: "Sunridge Farms", cat: "produce", price: 3.29, unit: "500 g", emoji: "🍅", hue: 6, rating: 4.6, reviews: 289, stock: 40, badge: "", desc: "Sweet, juicy vine-ripened tomatoes grown on the vine for an intense flavour that makes any salad or sauce sing.", features: ["Vine ripened", "Picked daily", "High in lycopene"] },
    { id: "p03", name: "Baby Spinach", brand: "Leaf & Root", cat: "produce", price: 2.99, unit: "200 g", emoji: "🥬", hue: 132, rating: 4.5, reviews: 178, stock: 32, badge: "", desc: "Tender baby spinach leaves, washed and ready to use. Add a handful to smoothies, pastas or salads.", features: ["Triple washed", "Ready to eat", "Rich in iron"] },
    { id: "p04", name: "Organic Bananas", brand: "Eco Farm", cat: "produce", price: 1.89, was: 2.49, unit: "1 kg", emoji: "🍌", hue: 48, rating: 4.7, reviews: 654, stock: 60, badge: "sale", desc: "Certified organic bananas with the perfect balance of sweetness and creaminess. Naturally ripened and packed in a single recyclable band.", features: ["Certified organic", "Fairtrade", "Plastic-free band"] },
    { id: "p05", name: "Red Bell Peppers", brand: "Sunridge Farms", cat: "produce", price: 3.79, unit: "3 pack", emoji: "🫑", hue: 2, rating: 4.4, reviews: 143, stock: 18, badge: "", desc: "Crisp, glossy red peppers with thick walls. Excellent for roasting, grilling or slicing into fresh salads.", features: ["Thick walled", "Locally grown", "Vine selected"] },
    { id: "p06", name: "Baby Carrots", brand: "Leaf & Root", cat: "produce", price: 2.29, unit: "500 g", emoji: "🥕", hue: 24, rating: 4.3, reviews: 96, stock: 27, badge: "", desc: "Sweet, tender baby carrots with no need for peeling. A healthy, crunchy snack for little hands and lunchboxes.", features: ["No peeling needed", "Naturally sweet", "High in beta-carotene"] },
    { id: "p07", name: "Blueberries", brand: "Berry Lane", cat: "produce", price: 4.99, was: 5.99, unit: "250 g", emoji: "🫐", hue: 218, rating: 4.9, reviews: 523, stock: 21, badge: "sale", desc: "Plump, sweet blueberries packed within hours of picking. Perfect for smoothies, yoghurt bowls and pancakes.", features: ["Picked & packed same day", "No preservatives", "Antioxidant rich"] },
    { id: "p08", name: "Lemons", brand: "Citrus Grove", cat: "produce", price: 3.19, unit: "6 pack", emoji: "🍋", hue: 55, rating: 4.6, reviews: 211, stock: 35, badge: "", desc: "Zesty, juicy lemons with a bright aroma. Essential for cooking, dressings and summer drinks.", features: ["Unwaxed", "Seedless option", "Rich in vitamin C"] },
    { id: "p09", name: "Red Onions", brand: "Leaf & Root", cat: "produce", price: 1.99, unit: "1 kg", emoji: "🧅", hue: 320, rating: 4.2, reviews: 87, stock: 44, badge: "", desc: "Mild, sweet red onions with a fine skin and a firm texture. The all-rounder for salads, curries and caramelising.", features: ["Mild & sweet", "Stores well", "Versatile"] },
    { id: "p10", name: "Broccoli Crowns", brand: "Sunridge Farms", cat: "produce", price: 2.49, unit: "400 g", emoji: "🥦", hue: 104, rating: 4.5, reviews: 164, stock: 25, badge: "", desc: "Tight, dark-green broccoli crowns that stay crunchy when steamed. An everyday source of fibre and vitamin C.", features: ["Farm fresh", "Fine stem", "Great for steaming"] },

    /* ---- Dairy & Eggs ---- */
    { id: "p11", name: "Whole Milk", brand: "Meadow Dairy", cat: "dairy", price: 1.69, unit: "1 litre", emoji: "🥛", hue: 205, rating: 4.7, reviews: 812, stock: 50, badge: "", desc: "Fresh whole milk from grass-fed cows, non-homogenised for a richer, creamier taste. Comes in a returnable glass bottle.", features: ["Grass-fed cows", "Non-homogenised", "Returnable glass"] },
    { id: "p12", name: "Free Range Eggs", brand: "Sunny Yards", cat: "dairy", price: 4.49, was: 5.19, unit: "12 pack", emoji: "🥚", hue: 40, rating: 4.9, reviews: 934, stock: 38, badge: "sale", desc: "Deep orange-yolked free range eggs from hens that roam outdoors. Collected daily and packed in recycled cardboard.", features: ["Free range", "Collected daily", "Recycled packaging"] },
    { id: "p13", name: "Greek Yoghurt", brand: "Meadow Dairy", cat: "dairy", price: 3.79, unit: "500 g", emoji: "🍶", hue: 190, rating: 4.6, reviews: 267, stock: 29, badge: "", desc: "Thick, creamy Greek yoghurt strained for a rich protein hit with no added sugar. Spoon it, blend it, spread it.", features: ["High protein", "No added sugar", "Probiotic cultures"] },
    { id: "p14", name: "Mature Cheddar", brand: "English Creamery", cat: "dairy", price: 6.49, unit: "400 g", emoji: "🧀", hue: 42, rating: 4.8, reviews: 331, stock: 16, badge: "", desc: "Rich, crumbly 18-month matured cheddar with a sharp depth and a buttery finish. Aged in wooden crates for full flavour.", features: ["18 months matured", "Free-range milk", "Wooden crate aged"] },
    { id: "p15", name: "Salted Butter", brand: "Meadow Dairy", cat: "dairy", price: 3.99, unit: "250 g", emoji: "🧈", hue: 48, rating: 4.8, reviews: 445, stock: 33, badge: "", desc: "Traditional churned butter with a delicate salt balance. Made in small batches from fresh cream for a clean, pure taste.", features: ["Churned daily", "82% fat", "No additives"] },
    { id: "p16", name: "Double Cream", brand: "Meadow Dairy", cat: "dairy", price: 2.89, unit: "300 ml", emoji: "🫗", hue: 36, rating: 4.5, reviews: 158, stock: 22, badge: "", desc: "Silky double cream with a high fat content, made for pouring over desserts, folding into sauces or whipping to clouds.", features: ["48% fat", "Non-homogenised", "Vegetarian friendly"] },

    /* ---- Bakery ---- */
    { id: "p17", name: "Sourdough Loaf", brand: "Stone Mill Bakehouse", cat: "bakery", price: 5.99, unit: "800 g", emoji: "🍞", hue: 28, rating: 4.9, reviews: 723, stock: 14, badge: "new", desc: "Slow-fermented for 36 hours with a crisp, blistered crust and a tangy open crumb. Baked fresh every morning.", features: ["36 hour ferment", "Stone-baked", "Naturally leavened"] },
    { id: "p18", name: "Butter Croissants", brand: "Stone Mill Bakehouse", cat: "bakery", price: 4.49, unit: "4 pack", emoji: "🥐", hue: 35, rating: 4.8, reviews: 402, stock: 20, badge: "", desc: "Flaky, buttery croissants laminated 27 times for delicate layers that shatter on the first bite.", features: ["27 layers", "Real butter", "Baked on site"] },
    { id: "p19", name: "Blueberry Muffins", brand: "Stone Mill Bakehouse", cat: "bakery", price: 3.49, unit: "6 pack", emoji: "🧁", hue: 300, rating: 4.4, reviews: 189, stock: 17, badge: "", desc: "Moist, generously topped muffins studded with plump blueberries. A weekend treat that freezes beautifully.", features: ["6 per pack", "Real fruit", "Freezer friendly"] },
    { id: "p20", name: "Sesame Bagels", brand: "Stone Mill Bakehouse", cat: "bakery", price: 2.99, unit: "5 pack", emoji: "🥯", hue: 33, rating: 4.3, reviews: 121, stock: 23, badge: "", desc: "Soft, chewy bagels rolled in toasted sesame seeds. Boil-baked for that classic dense chew.", features: ["Boil baked", "5 per pack", "High fibre"] },

    /* ---- Meat & Seafood ---- */
    { id: "p21", name: "Chicken Breast Fillets", brand: "Field & Farm", cat: "meat", price: 8.99, was: 10.49, unit: "600 g", emoji: "🍗", hue: 20, rating: 4.5, reviews: 388, stock: 19, badge: "sale", desc: "Lean, tender chicken breast fillets trimmed and portioned. Seal and refrigerate on the day of delivery for maximum freshness.", features: ["British reared", "Skin off, trimmed", "Vacuum sealed"] },
    { id: "p22", name: "Beef Mince 12% Fat", brand: "Field & Farm", cat: "meat", price: 7.49, unit: "500 g", emoji: "🥩", hue: 8, rating: 4.7, reviews: 296, stock: 24, badge: "", desc: "Evenly minced beef for burgers, bolognese and meatballs, with a balanced 12% fat content for flavour without heaviness.", features: ["12% fat", "British beef", "Freshly minced"] },
    { id: "p23", name: "Atlantic Salmon Fillet", brand: "North Sea Co.", cat: "meat", price: 12.99, was: 14.99, unit: "2 fillets", emoji: "🐟", hue: 14, rating: 4.8, reviews: 244, stock: 11, badge: "sale", desc: "Responsibly farmed Atlantic salmon with firm, bright-pink flesh and a delicate flavour. Skin-on and ready to cook.", features: ["Responsibly farmed", "Skin on", "Line caught"] },
    { id: "p24", name: "Free Range Chicken", brand: "Field & Farm", cat: "meat", price: 6.99, unit: "1.2 kg", emoji: "🍗", hue: 26, rating: 4.6, reviews: 178, stock: 15, badge: "", desc: "A whole free-range bird with tender, succulent meat and crisp skin. Ideal for roasting on a Sunday.", features: ["Free range", "Air chilled", "Feed for 80+ days"] },
    { id: "p25", name: "Smoked Bacon Rashers", brand: "Field & Farm", cat: "meat", price: 4.79, unit: "300 g", emoji: "🥓", hue: 12, rating: 4.5, reviews: 312, stock: 26, badge: "", desc: "Thick-cut bacon rasher smoked over oak chips for a deep, savoury flavour. Use the fat to flavour everything.", features: ["Oak smoked", "Thick cut", "British pork"] },

    /* ---- Pantry ---- */
    { id: "p26", name: "Extra Virgin Olive Oil", brand: "Casa Oliva", cat: "pantry", price: 11.99, was: 13.99, unit: "500 ml", emoji: "🫒", hue: 78, rating: 4.9, reviews: 512, stock: 28, badge: "sale", desc: "Cold-pressed extra virgin olive oil with a peppery finish and a grassy aroma. A first pressing harvested within 24 hours.", features: ["Cold pressed", "First pressing", "Single harvest"] },
    { id: "p27", name: "Basmati Rice", brand: "Golden Fields", cat: "pantry", price: 6.49, unit: "2 kg", emoji: "🍚", hue: 45, rating: 4.7, reviews: 623, stock: 34, badge: "", desc: "Long-grain aged basmati rice that stays separate and fluffy. Aged for 12 months for a delicate, nutty aroma.", features: ["Aged 12 months", "Extra long grain", "Aromatic"] },
    { id: "p28", name: "Penne Rigate", brand: "Casa Pasta", cat: "pantry", price: 2.39, unit: "500 g", emoji: "🍝", hue: 44, rating: 4.5, reviews: 287, stock: 45, badge: "", desc: "Bronze-die extruded penne with a rough, textured surface that holds chunky sauces perfectly.", features: ["Bronze die cut", "10 min cook", "100% durum wheat"] },
    { id: "p29", name: "Chopped Tomatoes", brand: "Sunridge Farms", cat: "pantry", price: 1.29, unit: "400 g", emoji: "🥫", hue: 4, rating: 4.4, reviews: 445, stock: 60, badge: "", desc: "Sweet Italian plum tomatoes chopped and packed in tomato juice with no added sugar or citric acid.", features: ["No added sugar", "Italian plum tomatoes", "Packed in juice"] },
    { id: "p30", name: "Peanut Butter", brand: "Nut House", cat: "pantry", price: 4.29, unit: "340 g", emoji: "🥜", hue: 32, rating: 4.8, reviews: 398, stock: 31, badge: "", desc: "Roasted peanut butter with no added sugar or palm oil. Smooth, deeply roasted and made with 100% peanuts.", features: ["No palm oil", "No added sugar", "100% peanuts"] },
    { id: "p31", name: "Granola", brand: "Morning Crunch", cat: "pantry", price: 5.49, unit: "500 g", emoji: "🥣", hue: 38, rating: 4.5, reviews: 176, stock: 22, badge: "", desc: "Clusters of toasted oats, almonds and maple syrup with a satisfying crunch. Perfect over yoghurt or milk.", features: ["Almonds & oats", "Maple syrup", "No palm oil"] },
    { id: "p32", name: "Green Tea", brand: "Leaf & Root", cat: "pantry", price: 4.99, unit: "40 bags", emoji: "🍵", hue: 96, rating: 4.3, reviews: 134, stock: 27, badge: "", desc: "Light, grassy green tea bags with a delicate floral finish. Naturally caffeinated for a gentle afternoon lift.", features: ["40 bags", "Loose leaf style", "Lightly scented"] },

    /* ---- Beverages ---- */
    { id: "p33", name: "Orange Juice", brand: "Citrus Grove", cat: "beverage", price: 3.99, was: 4.49, unit: "1 litre", emoji: "🧃", hue: 30, rating: 4.6, reviews: 341, stock: 37, badge: "sale", desc: "Not-from-concentrate orange juice with no added sugar. Pressed from Valencia oranges and chilled straight away.", features: ["Not from concentrate", "No added sugar", "Pressed in Spain"] },
    { id: "p34", name: "Sparkling Water", brand: "Clear Spring", cat: "beverage", price: 5.99, unit: "6 x 330 ml", emoji: "💧", hue: 195, rating: 4.5, reviews: 268, stock: 42, badge: "", desc: "Crisp, naturally carbonated spring water in recyclable cans. Zero calories, zero sugar, full refreshment.", features: ["Zero sugar", "Recyclable cans", "Natural minerals"] },
    { id: "p35", name: "Cold Brew Coffee", brand: "Night Owl", cat: "beverage", price: 6.49, unit: "500 ml", emoji: "☕", hue: 24, rating: 4.7, reviews: 452, stock: 29, badge: "", desc: "Slow-steeped for 18 hours for a smooth, low-acid cold brew with notes of chocolate and caramel. No sugar added.", features: ["18 hour steep", "No added sugar", "Single origin"] },

    /* ---- Snacks ---- */
    { id: "p36", name: "Sea Salt Crisps", brand: "Crunch Co.", cat: "snacks", price: 2.79, unit: "150 g", emoji: "🥔", hue: 45, rating: 4.5, reviews: 389, stock: 48, badge: "", desc: "Thick-cut, crunchy crisps cooked in sunflower oil and finished with flaky sea salt. Nothing else in the bag.", features: ["Cooked in sunflower oil", "No artificial flavours", "Thick cut"] },
    { id: "p37", name: "Dark Chocolate", brand: "Cocoa House", cat: "snacks", price: 3.99, was: 4.79, unit: "100 g", emoji: "🍫", hue: 18, rating: 4.9, reviews: 623, stock: 33, badge: "sale", desc: "Single-origin 70% dark chocolate with tasting notes of red fruit and toasted almond. Smooth, slow-melting couverture.", features: ["70% cacao", "Single origin", "Ethically sourced"] },
    { id: "p38", name: "Roasted Almonds", brand: "Nut House", cat: "snacks", price: 4.49, unit: "200 g", emoji: "🌰", hue: 28, rating: 4.6, reviews: 234, stock: 26, badge: "", desc: "Crunchy, dry-roasted almonds lightly salted. A naturally high-protein snack that travels well.", features: ["Dry roasted", "High in protein", "No added oil"] },

    /* ---- Frozen ---- */
    { id: "p39", name: "Garden Peas", brand: "Sunridge Farms", cat: "frozen", price: 2.19, unit: "900 g", emoji: "🫛", hue: 118, rating: 4.6, reviews: 312, stock: 30, badge: "", desc: "Sweet garden peas frozen within hours of picking to lock in colour, crunch and natural sweetness.", features: ["Frozen fresh", "No added sugar", "900 g value pack"] },
    { id: "p40", name: "Vanilla Ice Cream", brand: "Creamery Lane", cat: "frozen", price: 5.49, unit: "1 litre", emoji: "🍨", hue: 44, rating: 4.7, reviews: 287, stock: 18, badge: "", desc: "Rich French-style vanilla ice cream churned with real Madagascar vanilla and double cream. A proper treat.", features: ["Real vanilla bean", "Madagascar beans", "Churned in small batches"] }
  ];

  /* Promotional codes usable at checkout */
  var PROMOS = {
    FRESH10: { type: "percent", value: 10, label: "10% off your order" },
    SAVE5:   { type: "flat",   value: 5,  label: "$5 off orders over $50" },
    DELIVERY: { type: "delivery", value: 0, label: "Free delivery" }
  };

  var DELIVERY = {
    base: 3.99,
    freeThreshold: 40,
    express: 7.99,
    slots: [
      { id: "standard", label: "Standard Delivery",  detail: "Tomorrow, 8:00 AM – 12:00 PM", price: 3.99,  icon: "🚚" },
      { id: "evening",   label: "Evening Delivery",  detail: "Tomorrow, 5:00 PM – 8:00 PM",  price: 3.99,  icon: "🌙" },
      { id: "express",   label: "Express Delivery",  detail: "Today, within 90 minutes",     price: 7.99,  icon: "⚡" }
    ]
  };

  var TAX_RATE = 0.08;

  App.data = {
    categories: CATEGORIES,
    products: PRODUCTS,
    promos: PROMOS,
    delivery: DELIVERY,
    taxRate: TAX_RATE
  };
})(window);
