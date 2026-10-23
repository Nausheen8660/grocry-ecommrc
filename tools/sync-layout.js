/* =========================================================
   FreshCart — tools/sync-layout.js
   Copies the header + footer blocks from index.html into every
   other page so the shared chrome never drifts out of sync.

   Usage:  node tools/sync-layout.js
   ========================================================= */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const indexPath = path.join(root, "index.html");

const PAGES = ["product.html", "cart.html", "checkout.html", "order.html", "wishlist.html"];

function extract(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker);
  if (start === -1 || end === -1) {
    throw new Error(`Markers not found: ${startMarker} / ${endMarker}`);
  }
  return html.slice(start + startMarker.length, end).trim();
}

const index = fs.readFileSync(indexPath, "utf8");
const header = extract(index, "<!-- #header -->", "<!-- #endheader -->");
const footer = extract(index, "<!-- #footer -->", "<!-- #endfooter -->");

let changed = 0;

for (const page of PAGES) {
  const file = path.join(root, page);
  if (!fs.existsSync(file)) {
    console.warn(`skip  ${page} (not found)`);
    continue;
  }

  let html = fs.readFileSync(file, "utf8");
  const before = html;

  html = html.replace("<!--HEADER-->", header).replace("<!--FOOTER-->", footer);

  if (html !== before) {
    fs.writeFileSync(file, html, "utf8");
    changed++;
    console.log(`sync  ${page}`);
  } else {
    console.log(`ok    ${page} (already up to date)`);
  }
}

console.log(`\nDone — ${changed} page(s) updated.`);
