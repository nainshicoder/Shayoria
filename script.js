/* ===============================
   SHAYORIA – ALL FEATURES SCRIPT
   =============================== */

/* CONFIG */
let ITEMS_PER_LOAD = 6;

/* STATE */
let allData = [];
let filteredData = [];
let currentIndex = 0;
let currentCategory = "all";

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof shayariData === "undefined") {
    console.error("shayariData not found");
    return;
  }

  allData = shayariData;
  filteredData = allData;
  render(true);

  window.addEventListener("scroll", handleScroll);
});

/* RENDER SHAYARI */
function render(reset = false) {
  const box = document.getElementById("shayariBox");
  if (!box) return;

  if (reset) {
    box.innerHTML = "";
    currentIndex = 0;
  }

  const slice = filteredData.slice(
    currentIndex,
    currentIndex + ITEMS_PER_LOAD
  );

  slice.forEach((item, i) => {
    const globalIndex = currentIndex + i;
    const likeKey = "shayoria_like_" + globalIndex;
    const likes = localStorage.getItem(likeKey) || 0;

    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-category", item.category);

    card.innerHTML = `
      <h3>${item.title}</h3>
      <div class="shayari">${item.text}</div>
      <div class="actions">
        <button onclick="copyText(this)">Copy</button>
        <button onclick="shareText(this)">Share</button>
        <button onclick="likeShayari(this,'${likeKey}')">
          ❤ <span>${likes}</span>
        </button>
      </div>
    `;

    box.appendChild(card);
  });

  currentIndex += ITEMS_PER_LOAD;
}

/* CATEGORY FILTER */
function filterCategory(category) {
  currentCategory = category;

  if (category === "all") {
    filteredData = allData;
  } else {
    filteredData = allData.filter(
      (item) => item.category === category
    );
  }

  render(true);
}

/* SEARCH */
function searchShayari() {
  const input = document
    .getElementById("searchInput")
    .value.toLowerCase();

  filteredData = allData.filter((item) =>
    item.text.toLowerCase().includes(input)
  );

  render(true);
}

/* INFINITE SCROLL */
function handleScroll() {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 120
  ) {
    render();
  }
}

/* COPY */
function copyText(btn) {
  const text =
    btn.parentElement.previousElementSibling.innerText;

  navigator.clipboard.writeText(text);
  alert("Shayari copied ✨");
}

/* SHARE */
function shareText(btn) {
  const text =
    btn.parentElement.previousElementSibling.innerText;

  if (navigator.share) {
    navigator.share({ text });
  } else {
    alert("Share not supported on this device");
  }
}

/* LIKE + SAVE */
function likeShayari(btn, key) {
  const span = btn.querySelector("span");
  let count = parseInt(span.innerText) || 0;
  count++;
  span.innerText = count;
  localStorage.setItem(key, count);
}
