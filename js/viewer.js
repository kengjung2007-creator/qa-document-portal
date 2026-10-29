/**
 * Enterprise QA Portal - PDF Viewer Controller
 */
const DocumentViewer = {
  activeDoc: null,

  getBaseUrl() {
    const path = window.location.pathname;
    if (window.location.hostname.includes("github.io")) {
      const segment = path.split("/")[1];
      return segment ? `/${segment}` : "";
    }
    return "";
  },

  resolvePdfUrl(rawPath) {
    if (!rawPath) return "#";
    if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
      return rawPath;
    }
    const cleanPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    return `${this.getBaseUrl()}${cleanPath}`;
  },

  openDocument(docId, docData) {
    if (!docData) {
      alert("Document record not found.");
      return;
    }

    this.activeDoc = { id: docId, ...docData };
    const fullPdfUrl = this.resolvePdfUrl(docData.pdf);

    const modal = document.getElementById("pdfModal");
    const frame = document.getElementById("pdfFrame");
    const title = document.getElementById("modalTitle");
    const downloadBtn = document.getElementById("modalDownloadBtn");
    const openNewTabBtn = document.getElementById("modalNewTabBtn");

    if (title) title.innerText = `${docData.title} (${docId})`;
    if (downloadBtn) downloadBtn.href = fullPdfUrl;
    if (openNewTabBtn) {
      openNewTabBtn.onclick = () => window.open(fullPdfUrl, "_blank", "noopener,noreferrer");
    }

    if (frame) {
      frame.src = fullPdfUrl;
    }

    if (modal) {
      modal.style.display = "flex";
    }
  },

  closeModal() {
    const modal = document.getElementById("pdfModal");
    const frame = document.getElementById("pdfFrame");
    if (frame) frame.src = "about:blank";
    if (modal) {
      modal.style.display = "none";
    }
  }
};

window.DocumentViewer = DocumentViewer;