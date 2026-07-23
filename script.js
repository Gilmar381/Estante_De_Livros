// ------------------------------------------------------------------
// CONFIGURAÇÃO — troque pela sua tag de associado da Amazon
// ------------------------------------------------------------------
const AMAZON_TAG = "SEU-TAG-20";
const AMAZON_DOMAIN = "www.amazon.com.br"; // troque para .com, .es, etc se necessário

function buildAffiliateLink(asin) {
  return `https://${AMAZON_DOMAIN}/dp/${asin}?tag=${AMAZON_TAG}`;
}

const colorMap = {
  gold: "var(--gold)", moss: "var(--moss)", rust: "var(--rust)",
  wine: "var(--wine)", teal: "var(--teal)", ink2: "#40506480"
};

const shelfEl = document.getElementById("shelf");
const gridEl = document.getElementById("grid");
const filtersEl = document.getElementById("filters");

let BOOKS = [];
let activeCategory = "Todos";

function slug(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");
}

function renderShelf() {
  shelfEl.innerHTML = "";
  BOOKS.forEach((book, i) => {
    const btn = document.createElement("button");
    btn.className = "spine";
    btn.style.background = colorMap[book.color] || "var(--slate)";
    btn.style.setProperty("--h", (200 + (i % 4) * 22) + "px");
    btn.setAttribute("aria-label", `Ir para ${book.title}, de ${book.author}`);
    btn.innerHTML = `<span class="label">${book.title}</span>`;
    btn.addEventListener("click", () => {
      const card = document.getElementById("book-" + slug(book.title));
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.classList.add("flash");
        setTimeout(() => card.classList.remove("flash"), 1600);
      }
    });
    shelfEl.appendChild(btn);
  });
}

function renderFilters() {
  const categories = ["Todos", ...new Set(BOOKS.map(b => b.category))];
  filtersEl.querySelectorAll(".chip").forEach(c => c.remove());
  categories.forEach(cat => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = cat;
    chip.setAttribute("aria-pressed", cat === activeCategory ? "true" : "false");
    chip.addEventListener("click", () => {
      activeCategory = cat;
      renderFilters();
      renderGrid();
    });
    filtersEl.appendChild(chip);
  });
}

function renderGrid() {
  gridEl.innerHTML = "";
  const list = activeCategory === "Todos"
    ? BOOKS
    : BOOKS.filter(b => b.category === activeCategory);

  if (list.length === 0) {
    gridEl.innerHTML = `<p class="empty">Nenhum livro nessa categoria ainda.</p>`;
    return;
  }

  list.forEach(book => {
    const card = document.createElement("article");
    card.className = "card";
    card.id = "book-" + slug(book.title);
    const coverInner = book.cover
      ? `<img src="${book.cover}" alt="Capa de ${book.title}" loading="lazy"
           onerror="this.remove(); this.parentElement.classList.add('cover--fallback');">`
      : "";

    card.innerHTML = `
      <div class="cover ${book.cover ? '' : 'cover--fallback'}" style="background:${colorMap[book.color] || 'var(--slate)'}">
        ${coverInner}
        <span class="cat">${book.category}</span>
      </div>
      <div class="body">
        <p class="author">${book.author}</p>
        <h3>${book.title}</h3>
        <p class="blurb">${book.blurb}</p>
        <a class="cta" href="${buildAffiliateLink(book.asin)}" target="_blank" rel="noopener sponsored nofollow">
          <span>Ver na Amazon</span>
          <span class="arrow">→</span>
        </a>
      </div>
    `;
    gridEl.appendChild(card);
  });
}

// ------------------------------------------------------------------
// Carrega os livros de books.json — edite esse arquivo para
// adicionar, remover ou alterar produtos, sem tocar no HTML/JS.
// ------------------------------------------------------------------
fetch("books.json")
  .then(res => {
    if (!res.ok) throw new Error("books.json não encontrado");
    return res.json();
  })
  .then(data => {
    BOOKS = data;
    renderShelf();
    renderFilters();
    renderGrid();
  })
  .catch(err => {
    gridEl.innerHTML = `<p class="empty">Não consegui carregar books.json. Se você abriu o arquivo direto no navegador (file://), rode um servidor local — veja o README. Detalhe: ${err.message}</p>`;
    console.error(err);
  });