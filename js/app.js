/**
 * Enterprise QA Portal - Application Logic
 */
let documentsDatabase = {};
let currentCategory = "ALL";
let searchTerm = "";

async function initApp() {
  try {
    const basePath = DocumentViewer.getBaseUrl();
    const response = await fetch(`${basePath}/data/documents.json`);
    if (!response.ok) throw new Error("Unable to fetch documents.json");
    documentsDatabase = await response.json();
    applyFilters();
  } catch (err) {
    console.error("Initialization Error:", err);
    renderEmptyState("Failed to load documents catalog.");
  }
}

function renderDocuments(records) {
  const container = document.getElementById("documentGrid");
  if (!container) return;
  container.innerHTML = "";

  const keys = Object.keys(records);
  if (keys.length === 0) {
    renderEmptyState("No matching documents found.");
    return;
  }

  keys.forEach((code) => {
    const doc = records[code];
    const card = document.createElement("div");
    card.className = "doc-card";
    card.innerHTML = `
      <div>
        <div class="card-header">
          <span class="badge">${doc.category || "General"}</span>
          <span class="code">${code}</span>
        </div>
        <h3 class="title">${doc.title}</h3>
        <p class="meta"><strong>Product:</strong> ${doc.product}</p>
        <p class="meta"><strong>Version:</strong> ${doc.version}</p>
        <p class="meta"><strong>Updated:</strong> ${doc.lastUpdate}</p>
      </div>
      <div class="card-actions">
        <button type="button" class="btn btn-primary btn-open" style="flex:1;">
          📄 Open
        </button>
        <a href="${DocumentViewer.resolvePdfUrl(doc.pdf)}" target="_blank" rel="noopener" class="btn btn-outline">
          ↗ Tab
        </a>
      </div>
    `;

    card.querySelector(".btn-open").addEventListener("click", () => {
      DocumentViewer.openDocument(code, doc);
    });

    container.appendChild(card);
  });
}

function renderEmptyState(message) {
  const container = document.getElementById("documentGrid");
  if (container) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #5e6c84;">
        <p>${message}</p>
      </div>
    `;
  }
}

function applyFilters() {
  const filtered = {};
  const query = searchTerm.toLowerCase();

  Object.entries(documentsDatabase).forEach(([code, doc]) => {
    const matchesCategory = (currentCategory === "ALL") || (doc.category === currentCategory);
    const matchesSearch = code.toLowerCase().includes(query) ||
                          doc.title.toLowerCase().includes(query) ||
                          doc.product.toLowerCase().includes(query);

    if (matchesCategory && matchesSearch) {
      filtered[code] = doc;
    }
  });

  renderDocuments(filtered);
}

// Bind Global Listeners
document.addEventListener("DOMContentLoaded", () => {
  initApp();

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value.trim();
      applyFilters();
    });
  }

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      currentCategory = e.target.getAttribute("data-category");
      applyFilters();
    });
  });

  const closeBtn = document.getElementById("modalCloseBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => DocumentViewer.closeModal());
  }

  window.addEventListener("click", (e) => {
    const modal = document.getElementById("pdfModal");
    if (e.target === modal) DocumentViewer.closeModal();
  });
});