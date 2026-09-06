/* ---------- State ---------- */
/* This site is read-only in the browser by design — all data comes
   straight from data.js. To change the list, edit data.js and push
   to GitHub. See that file's comments for the format. */

const state = {
  tabs: TABS,
  view: TABS[0] ? TABS[0].id : "home", // "home" | "calculator" | a tab id
  search: "",
  sortKey: "value-desc",
  rarityFilter: "all",
  demandFilter: "all",
  calc: {
    a: [], // array of figure refs on side A
    b: [], // array of figure refs on side B
  },
};

const RARITY_ORDER = ["Common", "Rare", "Epic", "Legendary", "Mythic"];
const DEMAND_ORDER = ["Low", "Medium", "High", "Very High"];
const DEMAND_PCT = { "Low": 25, "Medium": 50, "High": 75, "Very High": 100 };
const TREND_SYMBOL = { up: "▲", down: "▼", stable: "—" };

/* ---------- Elements ---------- */

const el = {
  navRow: document.getElementById("navRow"),
  toolbar: document.getElementById("toolbar"),
  content: document.getElementById("content"),
  search: document.getElementById("searchInput"),
  sortSelect: document.getElementById("sortSelect"),
  rarityFilter: document.getElementById("rarityFilter"),
  demandFilter: document.getElementById("demandFilter"),
};

/* ---------- Helpers ---------- */

function allFigures() {
  const out = [];
  state.tabs.forEach((tab) => {
    tab.figures.forEach((fig) => out.push({ ...fig, tabLabel: tab.label, tabId: tab.id }));
  });
  return out;
}

function getActiveTab() {
  return state.tabs.find((t) => t.id === state.view) || null;
}

function rarityColor(rarity) {
  return {
    Common: "var(--r-common)",
    Rare: "var(--r-rare)",
    Epic: "var(--r-epic)",
    Legendary: "var(--r-legendary)",
    Mythic: "var(--r-mythic)",
  }[rarity] || "var(--r-common)";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function figureIcon(fig, size) {
  size = size || 44;
  if (!fig.image) return figureFallbackIcon(fig, size);

  const tag = escapeHtml(fig.tag || fig.name.slice(0, 3).toUpperCase());
  const color = rarityColor(fig.rarity);

  // Both the image and its fallback are rendered together. If the image
  // fails to load, onerror hides it and reveals the fallback icon next
  // to it — kept simple (no nested quotes) so it can't break the markup.
  return `
    <div class="card-icon-wrap" style="width:${size}px;height:${size}px;">
      <img class="card-icon-img" src="${escapeHtml(fig.image)}" alt="${escapeHtml(fig.name)}" style="width:${size}px;height:${size}px;border-color:${color}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
      <div class="card-icon" style="width:${size}px;height:${size}px;border-color:${color};color:${color};display:none;">${tag}</div>
    </div>
  `;
}

function figureFallbackIcon(fig, size) {
  const tag = escapeHtml(fig.tag || fig.name.slice(0, 3).toUpperCase());
  const color = rarityColor(fig.rarity);
  return `<div class="card-icon" style="width:${size}px;height:${size}px;border-color:${color};color:${color}">${tag}</div>`;
}

/* ---------- Nav ---------- */

function renderNav() {
  el.navRow.innerHTML = "";

  const pinned = [
    { id: "home", label: "Home" },
    { id: "calculator", label: "Calculator" },
  ];

  pinned.forEach((p) => {
    const btn = document.createElement("button");
    btn.className = "tab pinned" + (state.view === p.id ? " active" : "");
    btn.textContent = p.label;
    btn.addEventListener("click", () => {
      state.view = p.id;
      renderAll();
    });
    el.navRow.appendChild(btn);
  });

  const divider = document.createElement("div");
  divider.className = "tab-divider";
  el.navRow.appendChild(divider);

  state.tabs.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = "tab" + (state.view === tab.id ? " active" : "");
    btn.innerHTML = `${escapeHtml(tab.label)}<span class="count">${tab.figures.length}</span>`;
    btn.addEventListener("click", () => {
      state.view = tab.id;
      renderAll();
    });
    el.navRow.appendChild(btn);
  });
}

/* ---------- Home ---------- */

function renderHome() {
  el.toolbar.style.display = "none";

  const figures = allFigures();
  const totalValue = figures.reduce((s, f) => s + Number(f.value || 0), 0);
  const top = figures.reduce((max, f) => (f.value > (max?.value ?? -Infinity) ? f : max), null);

  const seasonCards = state.tabs
    .map((tab) => {
      const tv = tab.figures.reduce((s, f) => s + Number(f.value || 0), 0);
      return `
        <button class="season-card" data-tab="${tab.id}">
          <div class="season-card-label">${escapeHtml(tab.label)}</div>
          <div class="season-card-stats">
            <span>${tab.figures.length} figure${tab.figures.length === 1 ? "" : "s"}</span>
            <span>${tv.toLocaleString()} total</span>
          </div>
        </button>
      `;
    })
    .join("");

  el.content.innerHTML = `
    <div class="home-hero">
      <div class="home-hero-title">Your collection, at a glance</div>
      <div class="home-hero-sub">Browse by era using the tabs above, or jump into the calculator to weigh up a trade.</div>
    </div>
    <div class="stat-strip">
      <div class="stat"><div class="stat-label">Seasons tracked</div><div class="stat-value">${state.tabs.length}</div></div>
      <div class="stat"><div class="stat-label">Total figures</div><div class="stat-value">${figures.length}</div></div>
      <div class="stat"><div class="stat-label">Collection value</div><div class="stat-value">${totalValue.toLocaleString()}</div></div>
      <div class="stat"><div class="stat-label">Most valuable</div><div class="stat-value" style="font-size:1.05rem;">${top ? escapeHtml(top.name) : "—"}</div></div>
    </div>
    <div class="section-heading">Browse by season</div>
    <div class="season-grid">${seasonCards}</div>
  `;

  el.content.querySelectorAll(".season-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.view = btn.dataset.tab;
      renderAll();
    });
  });
}

/* ---------- Tab (browse) view ---------- */

function applyFiltersAndSort(figures) {
  let list = figures.slice();

  if (state.search.trim()) {
    const q = state.search.trim().toLowerCase();
    list = list.filter((f) => f.name.toLowerCase().includes(q));
  }
  if (state.rarityFilter !== "all") {
    list = list.filter((f) => f.rarity === state.rarityFilter);
  }
  if (state.demandFilter !== "all") {
    list = list.filter((f) => f.demand === state.demandFilter);
  }

  const [key, dir] = state.sortKey.split("-");
  list.sort((a, b) => {
    let cmp = 0;
    if (key === "value") cmp = a.value - b.value;
    else if (key === "name") cmp = a.name.localeCompare(b.name);
    else if (key === "rarity") cmp = RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity);
    else if (key === "demand") cmp = DEMAND_ORDER.indexOf(a.demand) - DEMAND_ORDER.indexOf(b.demand);
    return dir === "desc" ? -cmp : cmp;
  });

  return list;
}

function renderTabView() {
  el.toolbar.style.display = "flex";
  const tab = getActiveTab();

  if (!tab) {
    el.content.innerHTML = `<div class="empty-state"><div class="big">No tabs yet</div>Add one in data.js.</div>`;
    return;
  }

  const filtered = applyFiltersAndSort(tab.figures);
  const totalValue = tab.figures.reduce((s, f) => s + Number(f.value || 0), 0);
  const avg = tab.figures.length ? Math.round(totalValue / tab.figures.length) : 0;
  const highest = tab.figures.reduce((max, f) => (f.value > (max?.value ?? -Infinity) ? f : max), null);

  let statsHtml = `
    <div class="stat-strip">
      <div class="stat"><div class="stat-label">Figures</div><div class="stat-value">${tab.figures.length}</div></div>
      <div class="stat"><div class="stat-label">Showing</div><div class="stat-value">${filtered.length}</div></div>
      <div class="stat"><div class="stat-label">Total value</div><div class="stat-value">${totalValue.toLocaleString()}</div></div>
      <div class="stat"><div class="stat-label">Avg. value</div><div class="stat-value">${avg.toLocaleString()}</div></div>
      <div class="stat"><div class="stat-label">Top figure</div><div class="stat-value" style="font-size:1.05rem;">${highest ? escapeHtml(highest.name) : "—"}</div></div>
    </div>
  `;

  if (filtered.length === 0) {
    el.content.innerHTML = statsHtml + `<div class="empty-state"><div class="big">No figures match</div>Try clearing filters or search.</div>`;
    return;
  }

  const cards = filtered
    .map((fig) => {
      const demandPct = DEMAND_PCT[fig.demand] ?? 50;
      const trendClass = "trend-" + (fig.trend || "stable");
      return `
        <div class="card" data-rarity="${escapeHtml(fig.rarity)}" style="--rarity-color:${rarityColor(fig.rarity)}">
          <div class="card-top">
            ${figureIcon(fig)}
            <div>
              <div class="card-name">${escapeHtml(fig.name)}</div>
              <div class="card-rarity-label">${escapeHtml(fig.rarity)}</div>
            </div>
          </div>
          <div class="card-value-row">
            <div class="card-value">${Number(fig.value).toLocaleString()}</div>
            <div class="card-trend ${trendClass}">${TREND_SYMBOL[fig.trend] || "—"}</div>
          </div>
          <div class="card-demand">
            <div class="demand-label">Demand · ${escapeHtml(fig.demand)}</div>
            <div class="demand-bar"><div class="demand-fill" style="width:${demandPct}%"></div></div>
          </div>
          <div class="card-notes">${fig.notes ? escapeHtml(fig.notes) : ""}</div>
        </div>
      `;
    })
    .join("");

  el.content.innerHTML = statsHtml + `<div class="card-grid">${cards}</div>`;
}

/* ---------- Calculator ---------- */

function calcTotal(side) {
  return state.calc[side].reduce((s, f) => s + Number(f.value || 0), 0);
}

function renderCalculator() {
  el.toolbar.style.display = "none";

  const totalA = calcTotal("a");
  const totalB = calcTotal("b");
  const diff = totalA - totalB;

  let verdict;
  if (state.calc.a.length === 0 && state.calc.b.length === 0) {
    verdict = "Add figures to both sides to compare.";
  } else if (diff === 0) {
    verdict = "Dead even — a fair trade by value.";
  } else if (diff > 0) {
    verdict = `Side A is ahead by ${diff.toLocaleString()} in value.`;
  } else {
    verdict = `Side B is ahead by ${Math.abs(diff).toLocaleString()} in value.`;
  }

  el.content.innerHTML = `
    <div class="section-heading">Trade calculator</div>
    <p class="calc-sub">Search and add figures to each side to compare total value — handy for checking whether a trade is fair.</p>
    <div class="calc-grid">
      ${calcSideHtml("a", "Side A", totalA)}
      ${calcSideHtml("b", "Side B", totalB)}
    </div>
    <div class="calc-verdict">
      <div class="calc-verdict-diff">${diff === 0 ? "0" : (diff > 0 ? "+" : "") + diff.toLocaleString()}</div>
      <div class="calc-verdict-text">${verdict}</div>
    </div>
  `;

  ["a", "b"].forEach((side) => {
    const input = document.getElementById(`calc-search-${side}`);
    const results = document.getElementById(`calc-results-${side}`);

    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        results.innerHTML = "";
        results.classList.remove("open");
        return;
      }
      const matches = allFigures()
        .filter((f) => f.name.toLowerCase().includes(q))
        .slice(0, 8);

      if (matches.length === 0) {
        results.innerHTML = `<div class="calc-result-empty">No matches</div>`;
      } else {
        results.innerHTML = matches
          .map(
            (f, i) => `
            <button class="calc-result" data-side="${side}" data-idx="${i}">
              <span>${escapeHtml(f.name)}</span>
              <span class="calc-result-meta">${escapeHtml(f.tabLabel)} · ${f.value.toLocaleString()}</span>
            </button>
          `
          )
          .join("");
        results.dataset.matches = JSON.stringify(matches);
      }
      results.classList.add("open");
    });

    results.addEventListener("click", (e) => {
      const btn = e.target.closest(".calc-result");
      if (!btn) return;
      const matches = JSON.parse(results.dataset.matches || "[]");
      const fig = matches[Number(btn.dataset.idx)];
      if (fig) {
        state.calc[side].push(fig);
        input.value = "";
        results.innerHTML = "";
        results.classList.remove("open");
        renderCalculator();
      }
    });

    document.querySelectorAll(`.calc-remove[data-side="${side}"]`).forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.idx);
        state.calc[side].splice(idx, 1);
        renderCalculator();
      });
    });

    const clearBtn = document.getElementById(`calc-clear-${side}`);
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        state.calc[side] = [];
        renderCalculator();
      });
    }
  });
}

function calcSideHtml(side, title, total) {
  const items = state.calc[side];
  const rows = items
    .map(
      (f, i) => `
      <div class="calc-item">
        ${figureIcon(f, 30)}
        <div class="calc-item-name">${escapeHtml(f.name)}</div>
        <div class="calc-item-value">${Number(f.value).toLocaleString()}</div>
        <button class="calc-remove" data-side="${side}" data-idx="${i}" title="Remove">×</button>
      </div>
    `
    )
    .join("");

  return `
    <div class="calc-side">
      <div class="calc-side-head">
        <span>${title}</span>
        <span class="calc-side-total">${total.toLocaleString()}</span>
      </div>
      <div class="calc-search-wrap">
        <input type="text" id="calc-search-${side}" placeholder="Search a figure to add..." autocomplete="off" />
        <div class="calc-results" id="calc-results-${side}"></div>
      </div>
      <div class="calc-items">
        ${items.length ? rows : '<div class="calc-empty">No figures added yet</div>'}
      </div>
      ${items.length ? `<button class="btn calc-clear" id="calc-clear-${side}">Clear side</button>` : ""}
    </div>
  `;
}

/* ---------- Router ---------- */

function renderAll() {
  renderNav();
  if (state.view === "home") renderHome();
  else if (state.view === "calculator") renderCalculator();
  else renderTabView();
}

/* ---------- Toolbar events (tab view only) ---------- */

el.search.addEventListener("input", (e) => {
  state.search = e.target.value;
  renderTabView();
});
el.sortSelect.addEventListener("change", (e) => {
  state.sortKey = e.target.value;
  renderTabView();
});
el.rarityFilter.addEventListener("change", (e) => {
  state.rarityFilter = e.target.value;
  renderTabView();
});
el.demandFilter.addEventListener("change", (e) => {
  state.demandFilter = e.target.value;
  renderTabView();
});

/* ---------- Init ---------- */

renderAll();
