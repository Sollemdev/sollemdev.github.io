/**
 * SOLLEMDEV PORTFOLIO LOGIC
 * High-Performance Interactive Portfolio System
 */

// Portfolio Data
const PROJECTS_DATA = [];

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
    // Render jgthms.com Minimalist List Layout
    container.innerHTML = filtered.map(p => `
      <article class="project-item" data-id="${p.id}">
        <div class="project-header">
          <h3 class="project-title" onclick="openProjectModal('${p.id}')" style="cursor: pointer;">
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
            <button onclick="openProjectModal('${p.id}')" class="link-btn">
              Details &rarr;
            </button>
            ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener" class="link-btn">Visit &nearr;</a>` : ''}
          </div>
        </div>
      </article>
    `).join("");
  } else {
    // Render Grid Card Layout
    container.innerHTML = filtered.map(p => `
      <article class="project-item" data-id="${p.id}">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
            <span class="project-meta-top">${p.year}</span>
            <span class="project-meta-top">${p.tags[0]}</span>
          </div>
          <h3 class="project-title" onclick="openProjectModal('${p.id}')" style="cursor: pointer;">
            ${p.title}
          </h3>
          <p class="project-description">${p.subtitle}</p>
        </div>
        <div>
          <div class="project-tags" style="margin-bottom: 16px;">
            ${p.tags.map(t => `<span class="mini-tag">${t}</span>`).join("")}
          </div>
          <div class="project-links" style="justify-content: space-between;">
            <button onclick="openProjectModal('${p.id}')" class="btn-secondary" style="padding: 6px 14px; font-size: 12px;">
              Details &rarr;
            </button>
            ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener" class="link-btn">Visit &nearr;</a>` : ''}
          </div>
        </div>
      </article>
    `).join("");
  }
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
