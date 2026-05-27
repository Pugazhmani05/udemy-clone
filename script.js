// =============================================
//  UDAMY - JavaScript Features
// =============================================

// =============================================
// 1. MOBILE MENU TOGGLE (hamburger icon)
// =============================================
const mobileIcon = document.querySelector(".navebar__s4 img");
const navS2 = document.querySelector(".navebar__s2");
const navS3 = document.querySelector(".navebar__s3");

if (mobileIcon) {
  mobileIcon.addEventListener("click", () => {
    // Toggle search bar on mobile
    if (navS2.style.display === "flex") {
      navS2.style.display = "none";
    } else {
      navS2.style.display = "flex";
      navS2.style.position = "fixed";
      navS2.style.top = "60px";
      navS2.style.left = "0";
      navS2.style.right = "0";
      navS2.style.margin = "0";
      navS2.style.width = "90%";
      navS2.style.zIndex = "100";
      navS2.style.backgroundColor = "white";
    }
  });
}

// =============================================
// 2. SEARCH FUNCTIONALITY
// =============================================
const searchInput = document.querySelector(".navebar__s2 input");
const cards = document.querySelectorAll(".card");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    cards.forEach((card) => {
      const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
      if (title.includes(query) || query === "") {
        card.style.display = "block";
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
      } else {
        card.style.display = "none";
      }
    });

    // Show "no results" message
    showNoResults(query);
  });
}

function showNoResults(query) {
  let existing = document.querySelector(".no-results-msg");
  const containers = document.querySelectorAll(
    ".recommended__container, .popular__container"
  );

  containers.forEach((container) => {
    const visibleCards = [...container.querySelectorAll(".card")].filter(
      (c) => c.style.display !== "none"
    );

    let msg = container.querySelector(".no-results-msg");

    if (visibleCards.length === 0 && query !== "") {
      if (!msg) {
        msg = document.createElement("p");
        msg.className = "no-results-msg";
        msg.textContent = `No courses found for "${query}"`;
        msg.style.cssText =
          "color: gray; text-align: center; padding: 20px; width: 100%;";
        container.appendChild(msg);
      }
    } else {
      if (msg) msg.remove();
    }
  });
}

// =============================================
// 3. CART SYSTEM
// =============================================
let cart = JSON.parse(localStorage.getItem("udamy_cart")) || [];

// Create cart icon and counter in navbar
const cartContainer = document.createElement("div");
cartContainer.className = "cart-container";
cartContainer.innerHTML = `
  <div class="cart-icon" title="View Cart">
    🛒 <span class="cart-count">0</span>
  </div>
`;
cartContainer.style.cssText =
  "position:relative; cursor:pointer; font-size:20px;";
document.querySelector(".navebar__s3")?.appendChild(cartContainer);

// Cart dropdown
const cartDropdown = document.createElement("div");
cartDropdown.className = "cart-dropdown";
cartDropdown.style.cssText = `
  display: none;
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  width: 280px;
  z-index: 100;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
`;
cartContainer.appendChild(cartDropdown);

cartContainer.querySelector(".cart-icon").addEventListener("click", (e) => {
  e.stopPropagation();
  const isVisible = cartDropdown.style.display === "block";
  cartDropdown.style.display = isVisible ? "none" : "block";
  renderCart();
});

document.addEventListener("click", () => {
  cartDropdown.style.display = "none";
});

function updateCartCount() {
  const countEl = document.querySelector(".cart-count");
  if (countEl) countEl.textContent = cart.length;
}

function renderCart() {
  if (cart.length === 0) {
    cartDropdown.innerHTML =
      "<p style='color:gray; text-align:center; padding:10px;'>Your cart is empty!</p>";
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartDropdown.innerHTML = `
    <h3 style="margin-bottom:10px; font-size:14px;">🛒 Your Cart</h3>
    ${cart
      .map(
        (item, i) => `
      <div style="display:flex; justify-content:space-between; align-items:center; margin:5px 0; font-size:12px;">
        <span style="flex:1; margin-right:5px;">${item.title.substring(0, 30)}...</span>
        <span style="color:blueviolet; font-weight:bold;">₹${item.price}</span>
        <button onclick="removeFromCart(${i})" style="background:red; color:white; border:none; border-radius:5px; padding:2px 6px; cursor:pointer; margin-left:5px;">✕</button>
      </div>
    `
      )
      .join("")}
    <hr style="margin:10px 0;">
    <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:13px;">
      <span>Total:</span>
      <span style="color:blueviolet;">₹${total}</span>
    </div>
    <button onclick="checkout()" style="width:100%; margin-top:10px; padding:8px; background:blueviolet; color:white; border:none; border-radius:8px; cursor:pointer; font-size:13px;">Checkout</button>
    <button onclick="clearCart()" style="width:100%; margin-top:5px; padding:6px; background:#eee; color:#333; border:none; border-radius:8px; cursor:pointer; font-size:12px;">Clear Cart</button>
  `;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("udamy_cart", JSON.stringify(cart));
  updateCartCount();
}

function checkout() {
  showToast("🎉 Order placed successfully! Happy Learning!");
  clearCart();
  cartDropdown.style.display = "none";
}

// =============================================
// 4. ADD TO CART BUTTONS ON CARDS
// =============================================
function addCartButtons() {
  document.querySelectorAll(".card").forEach((card) => {
    if (card.querySelector(".add-to-cart-btn")) return; // prevent duplicates

    const title = card.querySelector("h3")?.textContent || "Course";
    const priceText = card.querySelectorAll("p");
    let price = 499;

    priceText.forEach((p) => {
      const match = p.textContent.match(/\$?(\d+)/);
      if (match) price = parseInt(match[1]);
    });

    const btn = document.createElement("button");
    btn.className = "add-to-cart-btn";
    btn.textContent = "Add to Cart";
    btn.style.cssText = `
      display: block;
      width: 100%;
      margin-top: 8px;
      padding: 8px;
      background: blueviolet;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      transition: background 0.3s;
    `;

    btn.addEventListener("mouseover", () => {
      btn.style.background = "darkviolet";
    });
    btn.addEventListener("mouseout", () => {
      btn.style.background = "blueviolet";
    });

    btn.addEventListener("click", () => {
      const alreadyInCart = cart.find((item) => item.title === title);
      if (alreadyInCart) {
        showToast("⚠️ Already in your cart!");
        return;
      }
      cart.push({ title, price });
      saveCart();
      showToast(`✅ "${title.substring(0, 25)}..." added to cart!`);
      btn.textContent = "✓ Added";
      btn.style.background = "green";
      setTimeout(() => {
        btn.textContent = "Add to Cart";
        btn.style.background = "blueviolet";
      }, 2000);
    });

    card.appendChild(btn);
  });
}

addCartButtons();
updateCartCount();

// =============================================
// 5. TOAST NOTIFICATION
// =============================================
function showToast(message) {
  let toast = document.querySelector(".udamy-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "udamy-toast";
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: #333;
      color: white;
      padding: 12px 24px;
      border-radius: 30px;
      font-size: 14px;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s;
      max-width: 90%;
      text-align: center;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = "1";

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = "0";
  }, 3000);
}

// =============================================
// 6. CATEGORY FILTER
// =============================================
const categoryItems = document.querySelectorAll(".coatagries p");

categoryItems.forEach((cat) => {
  cat.addEventListener("click", () => {
    // Highlight selected category
    categoryItems.forEach((c) => {
      c.style.outline = "none";
      c.style.fontWeight = "normal";
    });
    cat.style.outline = "3px solid darkviolet";
    cat.style.fontWeight = "bold";

    const keyword = cat.textContent.toLowerCase().trim();
    const allCards = document.querySelectorAll(".card");

    allCards.forEach((card) => {
      const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
      // basic keyword matching — show all for "developer"
      if (
        title.includes(keyword) ||
        keyword === "developer" ||
        keyword === "personal development" ||
        keyword === "marketing"
      ) {
        card.style.display = "block";
      } else if (
        (keyword === "design" && title.includes("css")) ||
        (keyword === "it&software" && title.includes("python"))
      ) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });

    showNoResults(keyword);
  });
});

// =============================================
// 7. CARD HOVER ANIMATION
// =============================================
document.querySelectorAll(".card").forEach((card) => {
  card.style.transition = "transform 0.25s, box-shadow 0.25s";
  card.style.borderRadius = "10px";
  card.style.overflow = "hidden";
  card.style.cursor = "pointer";

  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-5px)";
    card.style.boxShadow = "0 8px 24px rgba(138, 43, 226, 0.2)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
    card.style.boxShadow = "none";
  });
});

// =============================================
// 8. SCROLL TO TOP BUTTON
// =============================================
const scrollBtn = document.createElement("button");
scrollBtn.textContent = "↑";
scrollBtn.title = "Scroll to top";
scrollBtn.style.cssText = `
  position: fixed;
  bottom: 80px;
  right: 20px;
  background: blueviolet;
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 20px;
  cursor: pointer;
  display: none;
  z-index: 999;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: opacity 0.3s;
`;
document.body.appendChild(scrollBtn);

window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// =============================================
// 9. FLASH SALE COUNTDOWN TIMER
// =============================================
const offerDiv = document.querySelector(".offer");
if (offerDiv) {
  const timerEl = document.createElement("p");
  timerEl.style.cssText =
    "font-weight:bold; color:red; margin-top:8px; font-size:14px;";
  offerDiv.appendChild(timerEl);

  // 24 hour countdown
  let endTime = localStorage.getItem("udamy_sale_end");
  if (!endTime) {
    endTime = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem("udamy_sale_end", endTime);
  }

  function updateTimer() {
    const remaining = endTime - Date.now();
    if (remaining <= 0) {
      timerEl.textContent = "⏰ Sale Ended!";
      return;
    }
    const hrs = Math.floor(remaining / 3600000);
    const mins = Math.floor((remaining % 3600000) / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    timerEl.textContent = `⏱ Ends in: ${String(hrs).padStart(2, "0")}:${String(
      mins
    ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// =============================================
// 10. TOPIC TAG CLICK FILTER
// =============================================
document.querySelectorAll(".Topic__container p").forEach((tag) => {
  tag.style.cursor = "pointer";
  tag.style.transition = "background 0.3s, color 0.3s";

  tag.addEventListener("click", () => {
    const keyword = tag.textContent.toLowerCase().trim();

    // Scroll to popular section
    document.querySelector(".popular")?.scrollIntoView({ behavior: "smooth" });

    // Filter cards
    document.querySelectorAll(".card").forEach((card) => {
      const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
      card.style.display = title.includes(keyword) ? "block" : "none";
    });

    // Highlight tag
    document.querySelectorAll(".Topic__container p").forEach((t) => {
      t.style.background = "";
      t.style.color = "";
    });
    tag.style.background = "blueviolet";
    tag.style.color = "white";

    showToast(`Showing courses for: "${tag.textContent.trim()}"`);
  });
});

console.log("✅ Udamy JS loaded successfully!");