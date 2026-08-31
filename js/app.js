/**
 * SOLLEMDEV PORTFOLIO LOGIC
 * High-Performance Interactive Portfolio System
 */

// Portfolio Data
const PROJECTS_DATA = [
  {
    id: "babel-translator",
    title: "Babel",
    subtitle: "Instant in-place AI translation and prompt engineering browser extension",
    description: "A high-performance Chrome extension (Manifest V3) that translates thoughts into natural conversational English or fine-tuned AI prompts directly inside any input field with a single keystroke (Alt+T). Built with a 4-tier DOM replacement engine compatible with React, Vue, Slate.js, and ProseMirror.",
    year: "2026",
    tags: ["AI & LLM", "Chrome Extension", "JavaScript", "UX"],
    icon: "assets/icons/babel/icon48.png",
    banner: "assets/images/banners/Babel_Keyboard_Magic_1.jpg",
    github: "https://github.com/Sollemdev",
    demo: "projects/babel.html",
    featured: true,
    highlights: [
      "Sub-300ms in-place DOM text replacement via Alt+T",
      "6 dynamic style tones (Natural, Friendly, Slang, Business, Brief, Vivid)",
      "AI Prompt Engineering Mode for Midjourney, Higgsfield, and Google Flow",
      "Client-side Data Loss Prevention (DLP) for secret leak blocking",
      "23 localized UI language dictionaries"
    ]
  }
];

// App State
let currentTag = "All";
let searchQuery = "";
let viewMode = "list"; // 'list' or 'grid'

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initTagFilters();
  initViewMode();
  initSearch();
  initModal();
  initContactForm();
  renderProjects();
});

// Theme Management
function initTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const storedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  const initialTheme = storedTheme || (systemPrefersDark ? "dark" : "light");
  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    });
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  
  const themeIcon = document.getElementById("theme-icon");
  if (themeIcon) {
    if (theme === "dark") {
      themeIcon.innerHTML = `<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    } else {
      themeIcon.innerHTML = `<path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>`;
    }
  }
}

// Tag Filters
function initTagFilters() {
  const filterContainer = document.getElementById("filter-bar");
  if (!filterContainer) return;

  if (PROJECTS_DATA.length === 0) {
    filterContainer.innerHTML = `
      <span class="filter-label">Filter:</span>
      <button class="tag-btn active" data-tag="All">
        All <span class="tag-count">(0)</span>
      </button>
    `;
    return;
  }

  // Extract all unique tags
  const tagsSet = new Set();
  PROJECTS_DATA.forEach(p => p.tags.forEach(t => tagsSet.add(t)));
  const tags = ["All", ...Array.from(tagsSet)];

  filterContainer.innerHTML = `
    <span class="filter-label">Filter:</span>
    ${tags.map(tag => {
      const count = tag === "All" 
        ? PROJECTS_DATA.length 
        : PROJECTS_DATA.filter(p => p.tags.includes(tag)).length;
      return `
        <button class="tag-btn ${tag === currentTag ? 'active' : ''}" data-tag="${tag}">
          ${tag} <span class="tag-count">(${count})</span>
        </button>
      `;
    }).join("")}
  `;

  filterContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".tag-btn");
    if (!btn) return;
    
    currentTag = btn.dataset.tag;
    
    // Update active class
    filterContainer.querySelectorAll(".tag-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    
    renderProjects();
  });
}

// View Mode Toggle (List vs Grid)
function initViewMode() {
  const viewBtns = document.querySelectorAll(".view-btn");
  viewBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      viewBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      viewMode = btn.dataset.mode;
      renderProjects();
    });
  });
}

// Search Input
function initSearch() {
  const searchInput = document.getElementById("search-input");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderProjects();
  });
}

// Filter logic
function getFilteredProjects() {
  return PROJECTS_DATA.filter(project => {
    const matchesTag = currentTag === "All" || project.tags.includes(currentTag);
    const matchesSearch = !searchQuery || 
      project.title.toLowerCase().includes(searchQuery) ||
      project.subtitle.toLowerCase().includes(searchQuery) ||
      project.description.toLowerCase().includes(searchQuery) ||
      project.tags.some(t => t.toLowerCase().includes(searchQuery));
    
    return matchesTag && matchesSearch;
  });
}

// Render Projects List / Grid
function renderProjects() {
  const container = document.getElementById("projects-container");
  const statsContainer = document.getElementById("results-stats");
  if (!container) return;

  const filtered = getFilteredProjects();

  // Render Stats
  if (statsContainer) {
    statsContainer.textContent = `Showing ${filtered.length} of ${PROJECTS_DATA.length} projects`;
  }

  // Update container view mode class
  container.className = `projects-container ${viewMode}-view`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p style="color: var(--text-muted); font-size: 15px;">No projects to display.</p>
      </div>
    `;
    return;
  }

  if (viewMode === "list") {
    // Render jgthms.com Minimalist List Layout with Cursor-Following Mosaic Preview
    container.innerHTML = filtered.map(p => `
      <article class="project-item" data-id="${p.id}" data-share="${p.banner || ''}" onclick="window.location.href='${p.demo || '#'}'">
        <div class="project-row-main">
          ${p.icon ? `
            <div class="project-icon-thumb" aria-label="${p.title}">
              <img src="${p.icon}" alt="${p.title} icon" />
            </div>
          ` : ''}
          <div class="project-content-body">
            <div class="project-header">
              <h3 class="project-title">
                ${p.title}
              </h3>
              <span class="project-meta-top">/ ${p.tags.slice(0, 3).join(" / ")} / ${p.year}</span>
            </div>
            <p class="project-description">${p.subtitle}</p>
            <div class="project-footer">
              <div class="project-tags">
                ${p.tags.map(t => `<span class="mini-tag">${t}</span>`).join("")}
              </div>
              <div class="project-links">
                <span class="link-btn">
                  Case Study &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    `).join("");

    initProjectPreviews();
  } else {
    // Render Grid Card Layout with Top Banner
    container.innerHTML = filtered.map(p => `
      <article class="project-item" data-id="${p.id}" onclick="window.location.href='${p.demo || '#'}'">
        ${p.banner ? `
          <div class="project-card-banner">
            <img src="${p.banner}" alt="${p.title} banner" loading="lazy" />
          </div>
        ` : ''}
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              ${p.icon ? `<img src="${p.icon}" alt="${p.title}" style="width: 18px; height: 18px; border-radius: 4px;" />` : ''}
              <span class="project-meta-top">${p.tags[0]}</span>
            </div>
            <span class="project-meta-top">${p.year}</span>
          </div>
          <h3 class="project-title">
            ${p.title}
          </h3>
          <p class="project-description">${p.subtitle}</p>
        </div>
        <div>
          <div class="project-tags" style="margin-bottom: 16px;">
            ${p.tags.map(t => `<span class="mini-tag">${t}</span>`).join("")}
          </div>
          <div class="project-links" style="justify-content: flex-end;">
            <span class="btn-primary" style="padding: 6px 14px; font-size: 12px;">
              Case Study &rarr;
            </span>
          </div>
        </div>
      </article>
    `).join("");
  }
}

// Cursor-Following Mosaic Preview Banner (Authentic jgthms.com implementation)
let previewInitialized = false;
let previewTiles = [];
const tileCols = 6;
const tileRows = 4;
const tileDelayStep = 18;
const loadedPreviews = new Set();

function preloadProjectBanners() {
  PROJECTS_DATA.forEach(p => {
    if (p.banner && !loadedPreviews.has(p.banner)) {
      const img = new Image();
      img.onload = () => loadedPreviews.add(p.banner);
      img.src = p.banner;
    }
  });
}

function initProjectPreviews() {
  const preview = document.getElementById("hover-preview");
  const previewGrid = document.getElementById("preview-grid");
  if (!preview || !previewGrid) return;

  preloadProjectBanners();

  // Initialize 6x4 tiles in the grid once
  if (!previewInitialized) {
    previewGrid.innerHTML = "";
    previewTiles = [];
    for (let i = 0; i < tileCols * tileRows; i++) {
      const tile = document.createElement("span");
      tile.className = "preview-tile";
      tile.style.setProperty("--col", i % tileCols);
      tile.style.setProperty("--row", Math.floor(i / tileCols));
      previewGrid.appendChild(tile);
      previewTiles.push(tile);
    }
    previewInitialized = true;
  }

  function shuffledTileOrder() {
    const order = Array.from(previewTiles, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }

  function getFollowX(event, elWidth, offsetX) {
    const rightThreshold = elWidth + 40;
    const isRightSide = window.innerWidth - event.clientX < rightThreshold;
    return isRightSide ? -elWidth - offsetX : offsetX;
  }

  function positionFollower(el, project, event, offsetX, offsetY) {
    const rect = project.getBoundingClientRect();
    const x = event.clientX - rect.left + getFollowX(event, el.offsetWidth, offsetX);
    const y = event.clientY - rect.top + offsetY;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  const offsetX = 24;
  const offsetY = -50;

  document.querySelectorAll(".projects-container.list-view .project-item").forEach((project) => {
    const previewSrc = project.dataset.share;
    if (!previewSrc) return;

    project.addEventListener("mouseenter", (event) => {
      const reveal = () => {
        project.appendChild(preview);
        preview.style.setProperty("--preview-bg", `url("${previewSrc}")`);
        
        const tileOrder = shuffledTileOrder();
        
        // Reset tile states
        previewTiles.forEach((tile) => {
          tile.style.backgroundImage = `url("${previewSrc}")`;
          tile.style.transition = "none";
          tile.style.opacity = "0";
          tile.style.transform = "scale(0.2) rotate(-8deg)";
        });

        positionFollower(preview, project, event, offsetX, offsetY);
        preview.classList.add("is-visible");

        // Trigger staggered mosaic reveal animation
        requestAnimationFrame(() => {
          previewTiles.forEach((tile, i) => {
            tile.style.transition = "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.22s ease";
            tile.style.transitionDelay = `${tileOrder[i] * tileDelayStep}ms`;
            tile.style.opacity = "1";
            tile.style.transform = "scale(1) rotate(0deg)";
          });
        });
      };

      if (loadedPreviews.has(previewSrc)) {
        reveal();
      } else {
        const img = new Image();
        img.onload = () => {
          loadedPreviews.add(previewSrc);
          reveal();
        };
        img.src = previewSrc;
      }
    });

    project.addEventListener("mousemove", (event) => {
      positionFollower(preview, project, event, offsetX, offsetY);
    });

    project.addEventListener("mouseleave", () => {
      preview.classList.remove("is-visible");
      previewTiles.forEach((tile) => {
        tile.style.transition = "none";
        tile.style.opacity = "0";
      });
    });
  });
}

function resetFilters() {
  currentTag = "All";
  searchQuery = "";
  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.value = "";
  
  const filterContainer = document.getElementById("filter-bar");
  if (filterContainer) {
    filterContainer.querySelectorAll(".tag-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.tag === "All");
    });
  }
  
  renderProjects();
}

// Modal Details Window
function initModal() {
  const backdrop = document.getElementById("modal-backdrop");
  const closeBtn = document.getElementById("modal-close");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function openProjectModal(id) {
  const project = PROJECTS_DATA.find(p => p.id === id);
  if (!project) return;

  const backdrop = document.getElementById("modal-backdrop");
  const modalBody = document.getElementById("modal-body");

  if (modalBody) {
    modalBody.innerHTML = `
      <div style="font-size: 12px; font-weight: 700; color: var(--accent-primary); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 8px;">
        Released ${project.year} &bull; ${project.tags.join(", ")}
      </div>
      <h2 class="modal-title">${project.title}</h2>
      <p style="font-size: 18px; color: var(--text-secondary); margin-bottom: 20px; font-style: italic;">
        ${project.subtitle}
      </p>
      
      <div class="modal-description">
        <p>${project.description}</p>
      </div>

      ${project.highlights ? `
        <div style="margin-bottom: 24px;">
          <h4 style="font-family: var(--font-serif); font-size: 18px; margin-bottom: 12px;">Key Highlights</h4>
          <ul style="padding-left: 20px; font-size: 14px; color: var(--text-secondary); line-height: 1.8;">
            ${project.highlights.map(h => `<li>${h}</li>`).join("")}
          </ul>
        </div>
      ` : ''}

      <div class="modal-meta">
        ${project.demo ? `
          <a href="${project.demo}" target="_blank" rel="noopener" class="btn-primary">
            Visit Live Project &nearr;
          </a>
        ` : ''}
        ${project.github ? `
          <a href="${project.github}" target="_blank" rel="noopener" class="btn-secondary">
            View Source on GitHub
          </a>
        ` : ''}
      </div>
    `;
  }

  if (backdrop) backdrop.classList.add("open");
}

function closeModal() {
  const backdrop = document.getElementById("modal-backdrop");
  if (backdrop) backdrop.classList.remove("open");
}

// Copy Email Utility
function copyEmail() {
  const email = "sollemdev@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    showToast("Email address copied to clipboard!");
  }).catch(() => {
    showToast("Email: sollemdev@gmail.com");
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Contact Form AJAX Handler (Web3Forms API with graceful fallback)
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = document.getElementById("form-submit-btn");
  const btnText = submitBtn ? submitBtn.querySelector(".btn-submit-text") : null;
  const btnLoading = submitBtn ? submitBtn.querySelector(".btn-submit-loading") : null;
  const statusEl = document.getElementById("form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const accessKey = formData.get("access_key");

    // UI: Set loading state
    if (btnText) btnText.style.display = "none";
    if (btnLoading) btnLoading.style.display = "inline-flex";
    if (submitBtn) submitBtn.disabled = true;
    if (statusEl) {
      statusEl.className = "form-status";
      statusEl.textContent = "";
    }

    try {
      // If access key is placeholder or default
      if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
        // Fallback: simulate submission and provide mailto link
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const name = formData.get("name");
        const email = formData.get("email");
        const topic = formData.get("topic");
        const message = formData.get("message");
        
        // Open default mail client as reliable fallback
        const mailtoUri = `mailto:sollemdev@gmail.com?subject=${encodeURIComponent(`[Portfolio] ${topic} from ${name}`)}&body=${encodeURIComponent(`From: ${name} (${email})\nTopic: ${topic}\n\nMessage:\n${message}`)}`;
        
        if (statusEl) {
          statusEl.className = "form-status success";
          statusEl.innerHTML = `✓ Form ready! Opening email client or send directly to <strong>sollemdev@gmail.com</strong>.`;
        }
        window.location.href = mailtoUri;
        form.reset();
        return;
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        if (statusEl) {
          statusEl.className = "form-status success";
          statusEl.textContent = "✓ Thank you! Your message has been sent successfully. I will get back to you shortly.";
        }
        form.reset();
        showToast("Message sent successfully!");
      } else {
        throw new Error(data.message || "Failed to send message.");
      }
    } catch (err) {
      if (statusEl) {
        statusEl.className = "form-status error";
        statusEl.textContent = "Could not send message automatically. Please reach out directly to sollemdev@gmail.com.";
      }
    } finally {
      if (btnText) btnText.style.display = "inline";
      if (btnLoading) btnLoading.style.display = "none";
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
