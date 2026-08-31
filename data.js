/*
  NINJAGO MINIFIGURE VALUELIST — DATA FILE
  =========================================
  This is the only file you need to touch to update your list.
  Everything below is sample data — replace it with your own.

  HOW TABS WORK
  -------------
  Each object in TABS is one tab across the top of the site.
    id      -> short unique code, no spaces (used internally)
    label   -> what shows on the tab button
    figures -> array of minifigures in that tab

  HOW A FIGURE WORKS
  -------------------
    name    -> figure name
    rarity  -> one of: "Common", "Rare", "Epic", "Legendary", "Mythic"
    value   -> a number (used for sorting + displayed as-is)
    demand  -> one of: "Low", "Medium", "High", "Very High"
    trend   -> one of: "up", "down", "stable"
    tag     -> 1-3 letters shown as the card's icon (e.g. "KAI")
    notes   -> optional short note, shown on the card

  You can also add/rename/delete tabs and figures live on the site
  using the "+ Tab" and "+ Figure" / edit-pencil buttons — but any
  changes made in-browser only last until you reload the page unless
  you export them (Export button) and paste the result back in here.
*/

const TABS = [
  {
    id: "pilot",
    label: "Pilot",
    figures: [
      { name: "Kai (Pilot)", rarity: "Legendary", value: 240, demand: "High", trend: "up", tag: "KAI", notes: "First-ever Kai print" },
      { name: "Jay (Pilot)", rarity: "Epic", value: 150, demand: "Medium", trend: "stable", tag: "JAY", notes: "" },
      { name: "Cole (Pilot)", rarity: "Epic", value: 150, demand: "Medium", trend: "stable", tag: "COL", notes: "" },
      { name: "Zane (Pilot)", rarity: "Epic", value: 160, demand: "High", trend: "up", tag: "ZAN", notes: "" },
      { name: "Sensei Wu (Pilot)", rarity: "Rare", value: 90, demand: "Medium", trend: "stable", tag: "WU", notes: "" },
    ],
  },
  {
    id: "s1",
    label: "Season 1",
    figures: [
      { name: "Lloyd Garmadon (Child)", rarity: "Rare", value: 60, demand: "Low", trend: "stable", tag: "LLO", notes: "" },
      { name: "Lord Garmadon (4-Arm)", rarity: "Legendary", value: 210, demand: "High", trend: "up", tag: "LGN", notes: "" },
      { name: "Skales", rarity: "Rare", value: 45, demand: "Medium", trend: "stable", tag: "SKL", notes: "" },
      { name: "Nya (Samurai X)", rarity: "Epic", value: 130, demand: "High", trend: "up", tag: "NYA", notes: "" },
      { name: "Kruncha", rarity: "Common", value: 20, demand: "Low", trend: "stable", tag: "KRN", notes: "" },
    ],
  },
  {
    id: "s2",
    label: "Season 2",
    figures: [
      { name: "Lloyd (Golden Ninja)", rarity: "Mythic", value: 320, demand: "Very High", trend: "up", tag: "LGD", notes: "Chase figure" },
      { name: "Pythor P. Chumsworth", rarity: "Epic", value: 100, demand: "Medium", trend: "stable", tag: "PYT", notes: "" },
      { name: "General Kozu", rarity: "Rare", value: 55, demand: "Low", trend: "down", tag: "KOZ", notes: "" },
    ],
  },
  {
    id: "s3",
    label: "Season 3",
    figures: [
      { name: "Kai ZX", rarity: "Epic", value: 95, demand: "Medium", trend: "stable", tag: "KZX", notes: "" },
      { name: "Nindroid Warrior", rarity: "Common", value: 15, demand: "Low", trend: "stable", tag: "NDW", notes: "" },
      { name: "The Overlord", rarity: "Legendary", value: 260, demand: "Very High", trend: "up", tag: "OVL", notes: "" },
    ],
  },
];
