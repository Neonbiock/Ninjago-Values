const grid = document.getElementById("figureGrid");
const search = document.getElementById("search");
const characterFilter = document.getElementById("characterFilter");
const rarityFilter = document.getElementById("rarityFilter");
const demandFilter = document.getElementById("demandFilter");
const trendFilter = document.getElementById("trendFilter");
const sort = document.getElementById("sort");
const modal = document.getElementById("modal");

let favourites = JSON.parse(localStorage.getItem("ninjago-favourites") || "[]");
let favouritesOnly = false;

const demandRank = {"Very Low":1,"Low":2,"Medium":3,"High":4,"Very High":5,"Insane":6};
const slug = s => s.toLowerCase().replace(/\s+/g,"-").replace(/\./g,"");

function populateCharacters(){
  [...new Set(figures.map(f=>f.character))].sort().forEach(c=>{
    characterFilter.insertAdjacentHTML("beforeend", `<option>${c}</option>`);
  });
}

function getFiltered(){
  const q = search.value.toLowerCase().trim();
  let list = figures.filter(f => {
    const matchesSearch = !q || [f.name,f.character,f.theme,f.year].join(" ").toLowerCase().includes(q);
    return matchesSearch &&
      (!characterFilter.value || f.character===characterFilter.value) &&
      (!rarityFilter.value || f.rarity===rarityFilter.value) &&
      (!demandFilter.value || f.demand===demandFilter.value) &&
      (!trendFilter.value || f.trend===trendFilter.value) &&
      (!favouritesOnly || favourites.includes(f.id));
  });
  list.sort((a,b)=>{
    if(sort.value==="value-desc") return b.value-a.value;
    if(sort.value==="value-asc") return a.value-b.value;
    if(sort.value==="name") return a.name.localeCompare(b.name);
    if(sort.value==="demand") return demandRank[b.demand]-demandRank[a.demand] || b.value-a.value;
    if(sort.value==="newest") return b.year-a.year;
  });
  return list;
}

function trendIcon(t){ return t==="rising" ? "📈" : t==="dropping" ? "📉" : "➖"; }

function render(){
  const list=getFiltered();
  document.getElementById("resultCount").textContent = `${list.length} figure${list.length===1?"":"s"} found`;
  grid.innerHTML=list.map(f=>`
    <article class="card" data-id="${f.id}">
      <div class="figure-art ${slug(f.character)}">${f.character.charAt(0)}</div>
      <button class="star ${favourites.includes(f.id)?"active":""}" data-fav="${f.id}">★</button>
      <div class="card-body">
        <div class="badges"><span class="rarity ${slug(f.rarity)}">${f.rarity}</span><span class="demand ${slug(f.demand)}">${f.demand} Demand</span></div>
        <h3>${f.name}</h3>
        <p>${f.theme} · ${f.year}</p>
        <div class="value-row"><strong>${f.value}</strong><span>Value</span><em class="${f.trend}">${trendIcon(f.trend)} ${f.change}</em></div>
      </div>
    </article>
  `).join("") || `<div class="empty">No minifigures match your filters.</div>`;
  document.getElementById("favCount").textContent=favourites.length;
}

function showModal(id){
  const f=figures.find(x=>x.id===id); if(!f) return;
  document.getElementById("modalContent").innerHTML=`
    <div class="modal-art ${slug(f.character)}">${f.character.charAt(0)}</div>
    <p class="eyebrow">${f.theme.toUpperCase()} · ${f.year}</p>
    <h2>${f.name}</h2>
    <div class="modal-stats">
      <div><span>VALUE</span><strong>${f.value}</strong></div>
      <div><span>DEMAND</span><strong>${f.demand}</strong></div>
      <div><span>TREND</span><strong>${trendIcon(f.trend)} ${f.change}</strong></div>
    </div>
    <p class="notes">${f.notes}</p>
    <p class="disclaimer">Value is an estimate. Always check condition, completeness and current market sales.</p>`;
  modal.classList.remove("hidden");
}

document.querySelectorAll("input, select").forEach(el=>el.addEventListener("input",render));
document.getElementById("clearFilters").onclick=()=>{
  search.value=""; characterFilter.value=""; rarityFilter.value=""; demandFilter.value=""; trendFilter.value=""; sort.value="value-desc"; favouritesOnly=false; render();
};
document.getElementById("favBtn").onclick=()=>{favouritesOnly=!favouritesOnly; render();};
document.getElementById("filterToggle").onclick=()=>document.getElementById("filters").classList.toggle("open");
document.getElementById("themeToggle").onclick=()=>{document.body.classList.toggle("light"); localStorage.setItem("ninjago-theme",document.body.classList.contains("light")?"light":"dark");};
document.getElementById("closeModal").onclick=()=>modal.classList.add("hidden");
modal.onclick=e=>{if(e.target===modal) modal.classList.add("hidden");};
grid.addEventListener("click",e=>{
  const fav=e.target.closest("[data-fav]");
  if(fav){ const id=fav.dataset.fav; favourites=favourites.includes(id)?favourites.filter(x=>x!==id):[...favourites,id]; localStorage.setItem("ninjago-favourites",JSON.stringify(favourites)); render(); return; }
  const card=e.target.closest(".card"); if(card) showModal(card.dataset.id);
});

document.getElementById("totalFigures").textContent=figures.length;
document.getElementById("totalValue").textContent=Math.max(...figures.map(f=>f.value));
document.getElementById("updatedCount").textContent=Object.keys(demandRank).length;
if(localStorage.getItem("ninjago-theme")==="light") document.body.classList.add("light");
populateCharacters(); render();