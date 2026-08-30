const seasonOrder=["All","Season 1","Season 2","Season 3","Season 4","Season 5","Season 6","Season 7","Season 8","Season 9","Season 10","Season 11","Season 12","The Island","Season 14"];
let currentSeason="All";
let favourites=JSON.parse(localStorage.getItem("nv-favs")||"[]");
let favOnly=false;
const rank={"Very Low":1,"Low":2,"Medium":3,"High":4,"Very High":5,"Insane":6};
const $=id=>document.getElementById(id);

function tabs(){
 $("seasonTabs").innerHTML=seasonOrder.map(s=>`<button class="season-tab ${s===currentSeason?"active":""}" data-season="${s}">${s==="All"?"All Seasons":s}</button>`).join("");
}
function artClass(name){return name.toLowerCase().replace(/[^a-z]/g,"").slice(0,10)}
function filtered(){
 const q=$("search").value.toLowerCase();
 let x=figures.filter(f=>(currentSeason==="All"||f.season===currentSeason)&&
 (!q||`${f.name} ${f.character} ${f.season}`.toLowerCase().includes(q))&&
 (!$("rarityFilter").value||f.rarity===$("rarityFilter").value)&&
 (!$("demandFilter").value||f.demand===$("demandFilter").value)&&(!favOnly||favourites.includes(f.id)));
 const sort=$("sort").value;
 x.sort((a,b)=>sort==="value-desc"?b.value-a.value:sort==="value-asc"?a.value-b.value:sort==="demand"?rank[b.demand]-rank[a.demand]||b.value-a.value:sort==="name"?a.name.localeCompare(b.name):b.year-a.year);
 return x;
}
function render(){
 const x=filtered(); $("resultCount").textContent=`${x.length} FIGURE${x.length===1?"":"S"} ${currentSeason==="All"?"ACROSS ALL SEASONS":currentSeason.toUpperCase()}`;
 $("figureList").innerHTML=x.map(f=>`<article class="figure-row" data-id="${f.id}">
   <div class="figure-name"><div class="mini-art ${artClass(f.character)}">${f.character[0]}</div><div><h3>${f.name}</h3><p>${f.character} • ${f.year}</p></div></div>
   <div><span class="rarity-badge ${f.rarity.toLowerCase()}">${f.rarity}</span></div>
   <div><span class="demand-badge ${f.demand.toLowerCase().replace(" ","-")}"><i></i>${f.demand}</span></div>
   <div class="value">${f.value}</div>
   <div class="trend ${f.trend}">${f.trend==="rising"?"↗":f.trend==="dropping"?"↘":"—"} <span>${f.change}</span></div>
   <button class="row-star ${favourites.includes(f.id)?"saved":""}" data-fav="${f.id}">★</button>
 </article>`).join("")||`<div class="empty">No figures found in this selection.</div>`;
 $("favCount").textContent=favourites.length;
}
function show(id){
 const f=figures.find(a=>a.id===id);
 $("modalContent").innerHTML=`<div class="modal-art ${artClass(f.character)}">${f.character[0]}</div><div class="modal-body">
 <span class="season-label">${f.season} • ${f.year}</span><h2>${f.name}</h2><div class="big-value">${f.value}<small>VALUE</small></div>
 <div class="detail-grid"><div><span>RARITY</span><b>${f.rarity}</b></div><div><span>DEMAND</span><b>${f.demand}</b></div><div><span>TREND</span><b>${f.trend==="rising"?"↗ Rising":f.trend==="dropping"?"↘ Dropping":"— Stable"} ${f.change}</b></div></div><p>${f.note}</p></div>`;
 $("modal").classList.remove("hidden");
}
$("seasonTabs").onclick=e=>{const b=e.target.closest("[data-season]");if(!b)return;currentSeason=b.dataset.season;tabs();render();};
$("figureList").onclick=e=>{const fav=e.target.closest("[data-fav]");if(fav){let id=fav.dataset.fav;favourites=favourites.includes(id)?favourites.filter(x=>x!==id):[...favourites,id];localStorage.setItem("nv-favs",JSON.stringify(favourites));render();return}const row=e.target.closest("[data-id]");if(row)show(row.dataset.id)};
["search","rarityFilter","demandFilter","sort"].forEach(id=>$(id).addEventListener("input",render));
$("clearBtn").onclick=()=>{$("search").value="";$("rarityFilter").value="";$("demandFilter").value="";$("sort").value="value-desc";favOnly=false;currentSeason="All";tabs();render()};
$("favBtn").onclick=()=>{favOnly=!favOnly;render()};
$("randomBtn").onclick=()=>show(figures[Math.floor(Math.random()*figures.length)].id);
$("closeModal").onclick=()=>$("modal").classList.add("hidden");
$("modal").onclick=e=>{if(e.target===$("modal"))$("modal").classList.add("hidden")};
$("themeBtn").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("nv-theme",document.body.classList.contains("light")?"light":"dark")};
if(localStorage.getItem("nv-theme")==="light")document.body.classList.add("light");
$("leftSeason").onclick=()=>{$("seasonTabs").scrollBy({left:-280,behavior:"smooth"})};$("rightSeason").onclick=()=>{$("seasonTabs").scrollBy({left:280,behavior:"smooth"})};
$("figureCount").textContent=figures.length;$("seasonCount").textContent=new Set(figures.map(f=>f.season)).size;$("highDemandCount").textContent=figures.filter(f=>rank[f.demand]>=4).length;
tabs();render();