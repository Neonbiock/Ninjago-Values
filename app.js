/* ---------- State ---------- */

let state = {
  tabs: JSON.parse(JSON.stringify(TABS)), // deep copy of seed data
  activeTab: TABS[0]?.id || null,
  search: "",
  sortKey: "value-desc",
  rarityFilter: "all",
  demandFilter: "all",
};

const RARITY_ORDER = ["Common", "Rare", "Epic", "Legendary", "Mythic"];
const DEMAND_ORDER = ["Low", "Medium", "High", "Very High"];
const DEMAND_PCT = { "Low": 25, "Medium": 50, "High": 75, "Very High": 100 };
const TREND_SYMBOL = { up: "▲", down: "▼", stable: "—" };

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* ---------- Elements ---------- */

const el = {
  tabRow: document.getElementById("tabRow"),
  cardGrid: document.getElementById("cardGrid"),
  statStrip: document.getElementById("statStrip"),
  search: document.getElementById("searchInput"),
  sortSelect: document.getElementById("sortSelect"),
  rarityFilter: document.getElementById("rarityFilter"),
  demandFilter: document.getElementById("demandFilter"),
  addFigureBtn: document.getElementById("addFigureBtn"),
  exportBtn: document.getElementById("exportBtn"),
  importBtn: document.getElementById("importBtn"),
  modalRoot: document.getElementById("modalRoot"),
  siteTitle: document.getElementById("siteTitleInput"),
};

/* ---------- Rendering ---------- */

function getActiveTab() {
  return state.tabs.find((t) => t.id === state.activeTab) || null;
}

function renderTabs() {
  el.tabRow.innerHTML = "";
  state.tabs.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = "tab" + (tab.id === state.activeTab ? " active" : "");
    btn.innerHTML = `${escapeHtml(tab.label)}<span class="count">${tab.figures.length}</span>`;
    btn.addEventListener("click", () => {
      state.activeTab = tab.id;
      renderTabs();
      renderGrid();
    });

    const editBtn = document.createElement("button");
    editBtn.className = "tab-edit-btn";
    editBtn.title = "Rename or delete this tab";
    editBtn.textContent = "✎";
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openTabModal(tab);
    });
    btn.appendChild(editBtn);

    el.tabRow.appendChild(btn);
  });

  const addBtn = document.createElement("button");
  addBtn.className = "tab-add";
  addBtn.textContent = "+ Tab";
  addBtn.addEventListener("click", () => openTabModal(null));
  el.tabRow.appendChild(addBtn);
}

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

function renderStats(figures, filtered) {
  const total = figures.length;
  const totalValue = figures.reduce((sum, f) => sum + Number(f.value || 0), 0);
  const avg = total ? Math.round(totalValue / total) : 0;
  const highest = figures.reduce((max, f) => (f.value > (max?.value ?? -Infinity) ? f : max), null);

  el.statStrip.innerHTML = `
    <div class="stat"><div class="stat-label">Figures</div><div class="stat-value">${total}</div></div>
    <div class="stat"><div class="stat-label">Showing</div><div class="stat-value">${filtered}</div></div>
    <div class="stat"><div class="stat-label">Total value</div><div class="stat-value">${totalValue.toLocaleString()}</div></div>
    <div class="stat"><div class="stat-label">Avg. value</div><div class="stat-value">${avg.toLocaleString()}</div></div>
    <div class="stat"><div class="stat-label">Top figure</div><div class="stat-value" style="font-size:1.05rem;">${highest ? escapeHtml(highest.name) : "—"}</div></div>
  `;
}

function renderGrid() {
  const tab = getActiveTab();
  el.cardGrid.innerHTML = "";

  if (!tab) {
    el.statStrip.innerHTML = "";
    el.cardGrid.innerHTML = `<div class="empty-state"><div class="big">No tabs yet</div>Add a tab to start your valuelist.</div>`;
    return;
  }

  const filtered = applyFiltersAndSort(tab.figures);
  renderStats(tab.figures, filtered.length);

  if (filtered.length === 0) {
    el.cardGrid.innerHTML = `<div class="empty-state"><div class="big">No figures match</div>Try clearing filters or search, or add a new figure.</div>`;
    return;
  }

  filtered.forEach((fig) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.rarity = fig.rarity;
    card.style.setProperty("--rarity-color", rarityColor(fig.rarity));

    const demandPct = DEMAND_PCT[fig.demand] ?? 50;
    const trendClass = "trend-" + (fig.trend || "stable");

    card.innerHTML = `
      <div class="card-top">
        <div class="card-icon">${escapeHtml(fig.tag || fig.name.slice(0, 3).toUpperCase())}</div>
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
      <div class="card-actions">
        <button class="edit-btn">Edit</button>
        <button class="danger delete-btn">Delete</button>
      </div>
    `;

    card.querySelector(".edit-btn").addEventListener("click", () => openFigureModal(fig));
    card.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm(`Delete "${fig.name}"?`)) {
        tab.figures = tab.figures.filter((f) => f !== fig);
        renderTabs();
        renderGrid();
      }
    });

    el.cardGrid.appendChild(card);
  });
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

/* ---------- Modals ---------- */

function closeModal() {
  el.modalRoot.innerHTML = "";
}

function openFigureModal(figure) {
  const isNew = !figure;
  const draft = figure
    ? { ...figure }
    : { name: "", rarity: "Common", value: 0, demand: "Low", trend: "stable", tag: "", notes: "" };

  el.modalRoot.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal">
        <h2>${isNew ? "Add figure" : "Edit figure"}</h2>
        <div class="field">
          <label>Name</label>
          <input type="text" id="f-name" value="${escapeHtml(draft.name)}" placeholder="e.g. Kai (ZX)" />
        </div>
        <div class="field-row">
          <div class="field">
            <label>Rarity</label>
            <select id="f-rarity">
              ${RARITY_ORDER.map((r) => `<option value="${r}" ${r === draft.rarity ? "selected" : ""}>${r}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label>Demand</label>
            <select id="f-demand">
              ${DEMAND_ORDER.map((d) => `<option value="${d}" ${d === draft.demand ? "selected" : ""}>${d}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label>Value</label>
            <input type="number" id="f-value" value="${draft.value}" min="0" />
          </div>
          <div class="field">
            <label>Trend</label>
            <select id="f-trend">
              <option value="up" ${draft.trend === "up" ? "selected" : ""}>Rising</option>
              <option value="stable" ${draft.trend === "stable" ? "selected" : ""}>Stable</option>
              <option value="down" ${draft.trend === "down" ? "selected" : ""}>Falling</option>
            </select>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label>Icon tag (max 4 chars)</label>
            <input type="text" id="f-tag" maxlength="4" value="${escapeHtml(draft.tag || "")}" placeholder="KAI" />
          </div>
        </div>
        <div class="field">
          <label>Notes (optional)</label>
          <input type="text" id="f-notes" value="${escapeHtml(draft.notes || "")}" placeholder="e.g. Exclusive to SDCC set" />
        </div>
        <div class="modal-actions">
          <div class="left">
            <button class="btn" id="f-cancel">Cancel</button>
          </div>
          <button class="btn btn-primary" id="f-save">${isNew ? "Add figure" : "Save changes"}</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("f-cancel").addEventListener("click", closeModal);
  document.getElementById("f-save").addEventListener("click", () => {
    const name = document.getElementById("f-name").value.trim();
    if (!name) {
      alert("Please give the figure a name.");
      return;
    }
    const updated = {
      name,
      rarity: document.getElementById("f-rarity").value,
      demand: document.getElementById("f-demand").value,
      value: Number(document.getElementById("f-value").value) || 0,
      trend: document.getElementById("f-trend").value,
      tag: document.getElementById("f-tag").value.trim().toUpperCase(),
      notes: document.getElementById("f-notes").value.trim(),
    };

    const tab = getActiveTab();
    if (isNew) {
      tab.figures.push(updated);
    } else {
      Object.assign(figure, updated);
    }
    closeModal();
    renderTabs();
    renderGrid();
  });
}

function openTabModal(tab) {
  const isNew = !tab;
  el.modalRoot.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal">
        <h2>${isNew ? "New tab" : "Edit tab"}</h2>
        <div class="field">
          <label>Tab name</label>
          <input type="text" id="t-label" value="${isNew ? "" : escapeHtml(tab.label)}" placeholder="e.g. Season 4" />
        </div>
        <div class="modal-actions">
          <div class="left">
            <button class="btn" id="t-cancel">Cancel</button>
            ${!isNew ? '<button class="btn danger" id="t-delete" style="color:var(--red);">Delete tab</button>' : ""}
          </div>
          <button class="btn btn-primary" id="t-save">${isNew ? "Create tab" : "Save"}</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("t-cancel").addEventListener("click", closeModal);

  if (!isNew) {
    document.getElementById("t-delete").addEventListener("click", () => {
      if (confirm(`Delete tab "${tab.label}" and all ${tab.figures.length} figures in it?`)) {
        state.tabs = state.tabs.filter((t) => t !== tab);
        if (state.activeTab === tab.id) {
          state.activeTab = state.tabs[0]?.id || null;
        }
        closeModal();
        renderTabs();
        renderGrid();
      }
    });
  }

  document.getElementById("t-save").addEventListener("click", () => {
    const label = document.getElementById("t-label").value.trim();
    if (!label) {
      alert("Please name the tab.");
      return;
    }
    if (isNew) {
      const newTab = { id: uid(), label, figures: [] };
      state.tabs.push(newTab);
      state.activeTab = newTab.id;
    } else {
      tab.label = label;
    }
    closeModal();
    renderTabs();
    renderGrid();
  });
}

function openExportModal() {
  const json = JSON.stringify(state.tabs, null, 2);
  const code = `const TABS = ${json};`;

  el.modalRoot.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal" style="max-width:560px;">
        <h2>Export your list</h2>
        <div class="export-note">
          In-browser edits only last until you reload the page. To make them permanent,
          copy everything below and paste it over the <code>const TABS = [...]</code> block
          in <code>data.js</code>, then commit &amp; push to GitHub.
        </div>
        <div class="export-box">
          <textarea readonly id="export-text">${escapeHtml(code)}</textarea>
        </div>
        <div class="modal-actions">
          <div class="left"><button class="btn" id="e-close">Close</button></div>
          <button class="btn btn-primary" id="e-copy">Copy to clipboard</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById("e-close").addEventListener("click", closeModal);
  document.getElementById("e-copy").addEventListener("click", () => {
    const ta = document.getElementById("export-text");
    ta.select();
    document.execCommand("copy");
    const btn = document.getElementById("e-copy");
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy to clipboard"), 1500);
  });
}

function openImportModal() {
  el.modalRoot.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal" style="max-width:560px;">
        <h2>Import a list</h2>
        <div class="export-note">
          Paste a TABS array (just the JSON part, starting with <code>[</code>) below to load it
          into the current session.
        </div>
        <div class="export-box">
          <textarea id="import-text" placeholder="[ { &quot;id&quot;: &quot;pilot&quot;, ... } ]"></textarea>
        </div>
        <div class="modal-actions">
          <div class="left"><button class="btn" id="i-close">Cancel</button></div>
          <button class="btn btn-primary" id="i-load">Load</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById("i-close").addEventListener("click", closeModal);
  document.getElementById("i-load").addEventListener("click", () => {
    try {
      const parsed = JSON.parse(document.getElementById("import-text").value);
      if (!Array.isArray(parsed)) throw new Error("not an array");
      state.tabs = parsed;
      state.activeTab = parsed[0]?.id || null;
      closeModal();
      renderTabs();
      renderGrid();
    } catch (err) {
      alert("That doesn't look like valid list data. Check the format and try again.");
    }
  });
}

/* ---------- Events ---------- */

el.search.addEventListener("input", (e) => {
  state.search = e.target.value;
  renderGrid();
});

el.sortSelect.addEventListener("change", (e) => {
  state.sortKey = e.target.value;
  renderGrid();
});

el.rarityFilter.addEventListener("change", (e) => {
  state.rarityFilter = e.target.value;
  renderGrid();
});

el.demandFilter.addEventListener("change", (e) => {
  state.demandFilter = e.target.value;
  renderGrid();
});

el.addFigureBtn.addEventListener("click", () => {
  if (!getActiveTab()) {
    alert("Create a tab first.");
    return;
  }
  openFigureModal(null);
});

el.exportBtn.addEventListener("click", openExportModal);
el.importBtn.addEventListener("click", openImportModal);

/* ---------- Init ---------- */

renderTabs();
renderGrid();
