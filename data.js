/*
  NINJAGO MINIFIGURE VALUELIST — DATA FILE
  =========================================
  This is the ONLY file you should need to touch. The site is read-only
  on purpose (no in-browser add/edit/delete) so that anyone visiting your
  GitHub Pages link can browse and use the calculator, but only you —
  editing this file and pushing to GitHub — can change the list.

  HOW TABS WORK
  -------------
  Each object in TABS is one tab across the top of the site.
    id      -> short unique code, no spaces, no punctuation (used internally, keep it stable)
    label   -> what shows on the tab button, e.g. "Season 3: Rebooted"
    figures -> array of minifigures in that tab

  HOW A FIGURE WORKS
  -------------------
    name    -> figure name
    rarity  -> one of: "Common", "Rare", "Epic", "Legendary", "Mythic"
    value   -> a number (used for sorting, filtering and the calculator)
    demand  -> one of: "Low", "Medium", "High", "Very High"
    trend   -> one of: "up", "down", "stable"
    tag     -> 1-4 letters shown when there's no image, e.g. "KAI"
    notes   -> optional short note, shown on the card
    image   -> optional URL/path to an image (see IMAGES below). Leave
               it out (or set "") to fall back to the colored tag icon.

  IMAGES
  ------
  The site does NOT ship with any built-in minifigure photos — you provide
  your own, so you're never relying on hotlinking someone else's images.
  Two easy options:

  1. Put your own photos in a folder in this same repo, e.g. "images/",
     and reference them as a relative path:
        image: "images/kai-pilot.jpg"

  2. Link to an image you host elsewhere (BrickLink, Imgur, your own
     site, etc.) by pasting the full URL:
        image: "https://i.imgur.com/example.jpg"

  If a figure has no image (or the field is missing), the card just shows
  its "tag" as a colored icon instead — so it's fine to add images
  gradually.

  ADDING / REMOVING TABS AND FIGURES
  -----------------------------------
  Just add or remove entries from the arrays below — copy an existing
  tab or figure block, tweak the values, done. Order in the array is the
  order they appear on the site.
  Common - £3, Rare - £6, Epic - £12, Legendary - £30, Mythic - £60, Celestial
*/

const TABS = [
  {
    id: "pilot",
    label: "Pilot Episodes",
    figures: [
      { name: "Kai: Golden Weapons", rarity: "Legendary", value: 240, demand: "High", trend: "up", tag: "KAI", notes: "First-ever Kai print", image: "images/kai-pilot.jpg" },
      { name: "Jay (Pilot)", rarity: "Epic", value: 150, demand: "Average", trend: "stable", tag: "JAY", notes: "", image: "" },
      { name: "Cole (Pilot)", rarity: "Epic", value: 150, demand: "Medium", trend: "stable", tag: "COL", notes: "", image: "" },
      { name: "Zane (Pilot)", rarity: "Epic", value: 160, demand: "High", trend: "up", tag: "ZAN", notes: "", image: "" },
      { name: "Sensei Wu (Pilot)", rarity: "Rare", value: 90, demand: "Medium", trend: "stable", tag: "WU", notes: "", image: "" },
    ],
  },
  {
    id: "s1",
    label: "Season 1: Rise of the Snakes",
    figures: [
      { name: "Lloyd Garmadon (Child)", rarity: "Rare", value: 60, demand: "Low", trend: "stable", tag: "LLO", notes: "", image: "" },
      { name: "Lord Garmadon (4-Arm)", rarity: "Legendary", value: 210, demand: "High", trend: "up", tag: "LGN", notes: "", image: "" },
      { name: "Skales", rarity: "Rare", value: 45, demand: "Medium", trend: "stable", tag: "SKL", notes: "", image: "" },
      { name: "Nya (Samurai X)", rarity: "Epic", value: 130, demand: "High", trend: "up", tag: "NYA", notes: "", image: "" },
      { name: "Kruncha", rarity: "Common", value: 20, demand: "Low", trend: "stable", tag: "KRN", notes: "", image: "" },
    ],
  },
  {
    id: "s2",
    label: "Season 2: Legacy of the Green Ninja",
    figures: [
      { name: "Lloyd (Golden Ninja)", rarity: "Mythic", value: 320, demand: "Very High", trend: "up", tag: "LGD", notes: "Chase figure", image: "" },
      { name: "Pythor P. Chumsworth", rarity: "Epic", value: 100, demand: "Medium", trend: "stable", tag: "PYT", notes: "", image: "" },
      { name: "General Kozu", rarity: "Rare", value: 55, demand: "Low", trend: "down", tag: "KOZ", notes: "", image: "" },
    ],
  },
  {
    id: "s3",
    label: "Season 3: Rebooted",
    figures: [
      { name: "Kai ZX", rarity: "Epic", value: 95, demand: "Medium", trend: "stable", tag: "KZX", notes: "", image: "" },
      { name: "Nindroid Warrior", rarity: "Common", value: 15, demand: "Low", trend: "stable", tag: "NDW", notes: "", image: "" },
      { name: "The Overlord", rarity: "Legendary", value: 260, demand: "Very High", trend: "up", tag: "OVL", notes: "", image: "" },
    ],
  },
  {
    id: "s7",
    label: "Season 7: The Hands of Time",
    figures: [
      { name: "Cole (Airjitzu)", rarity: "Rare", value: 50, demand: "Medium", trend: "stable", tag: "CAJ", notes: "", image: "" },
      { name: "Master Chen", rarity: "Epic", value: 110, demand: "Medium", trend: "stable", tag: "CHN", notes: "", image: "" },
      { name: "Krux", rarity: "Legendary", value: 180, demand: "High", trend: "up", tag: "KRX", notes: "", image: "" },
    ],
  },
];
