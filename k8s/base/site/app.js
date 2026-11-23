(function () {
  var products = window.PRODUCTS;
  var cart = {};
  var category = "All";
  var query = "";

  try { cart = JSON.parse(localStorage.getItem("cart") || "{}"); } catch (e) { cart = {}; }

  var $ = function (id) { return document.getElementById(id); };
  var money = function (n) { return "€" + n.toFixed(2); };
  var save = function () { try { localStorage.setItem("cart", JSON.stringify(cart)); } catch (e) {} };

  if (window.SHOP_ENV) {
    var b = $("env-banner");
    b.textContent = "Environment: " + window.SHOP_ENV;
    b.hidden = false;
  }

  function renderFilters() {
    var cats = ["All"].concat(products.map(function (p) { return p.cat; })
      .filter(function (c, i, a) { return a.indexOf(c) === i; }));
    $("filters").innerHTML = cats.map(function (c) {
      return '<button class="' + (c === category ? "active" : "") + '" data-cat="' + c + '">' + c + "</button>";
    }).join("");
  }

  function renderProducts() {
    var list = products.filter(function (p) {
      return (category === "All" || p.cat === category) &&
             p.name.toLowerCase().indexOf(query) !== -1;
    });
    $("products").innerHTML = list.map(function (p) {
      return '<div class="card"><div class="img">' + p.icon + "</div><h3>" + p.name +
             '</h3><p class="cat">' + p.cat + '</p><p class="price">' + money(p.price) +
             '</p><button class="primary" data-add="' + p.id + '">Add to cart</button></div>';
    }).join("") || "<p>No products found.</p>";
  }

  function renderCart() {
    var ids = Object.keys(cart), total = 0, count = 0;
    $("cart-items").innerHTML = ids.map(function (id) {
      var p = products.filter(function (x) { return String(x.id) === id; })[0];
      if (!p) return "";
      var q = cart[id]; total += p.price * q; count += q;
      return '<div class="line"><span>' + p.icon + " " + p.name + "</span><span>" +
             '<button data-dec="' + id + '">-</button> ' + q + ' <button data-add="' + id + '">+</button></span>' +
             "<span>" + money(p.price * q) + "</span></div>";
    }).join("") || "<p>Your cart is empty.</p>";
    $("cart-total").textContent = money(total);
    $("cart-count").textContent = count;
    save();
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t.dataset.cat) { category = t.dataset.cat; renderFilters(); renderProducts(); }
    if (t.dataset.add) { cart[t.dataset.add] = (cart[t.dataset.add] || 0) + 1; renderCart(); }
    if (t.dataset.dec) {
      cart[t.dataset.dec]--;
      if (cart[t.dataset.dec] <= 0) delete cart[t.dataset.dec];
      renderCart();
    }
  });

  $("search").addEventListener("input", function (e) { query = e.target.value.toLowerCase(); renderProducts(); });
  $("cart-btn").addEventListener("click", function () { $("cart").classList.toggle("hidden"); });
  $("cart-close").addEventListener("click", function () { $("cart").classList.add("hidden"); });
  $("checkout").addEventListener("click", function () {
    if (!Object.keys(cart).length) { alert("Your cart is empty."); return; }
    alert("Thanks! Order placed (demo store - no real payment).");
    cart = {}; renderCart();
  });

  renderFilters(); renderProducts(); renderCart();
})();
