# Ninjago Minifigure Valuelist

A dark, cosmic-themed valuelist site for Ninjago minifigures — tabs by era (Pilot, Season 1, Season 2, ...), sortable/filterable/searchable cards, rarity flags, demand meters, and full in-browser editing.

## Host it on GitHub Pages (free)

1. Create a new repository on GitHub, e.g. `ninjago-valuelist`.
2. Upload these files to it: `index.html`, `style.css`, `app.js`, `data.js`, `README.md`.
   - Easiest way: on the repo page, click **Add file → Upload files**, drag all of them in, and commit.
3. Go to **Settings → Pages** in the repo.
4. Under "Build and deployment", set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
5. Save. GitHub gives you a URL like `https://yourusername.github.io/ninjago-valuelist/` within a minute or two.

No build step, no server, no dependencies beyond a Google Font import — it's plain HTML/CSS/JS.

## Editing your list

**Permanent edits (recommended):** open `data.js` and edit the `TABS` array directly — add tabs, add figures, change values/rarity/demand. Commit the change on GitHub and the live site updates automatically. The comments at the top of `data.js` explain every field.

**Quick edits on the live site:** use the "+ Tab" and "+ Figure" buttons, or click **Edit** on any card. These changes exist only in your browser tab and are lost on reload — use the **Export** button afterward, which gives you a ready-to-paste `const TABS = [...]` block to drop into `data.js`, then commit it.

**Import:** the **Import** button lets you paste a `TABS`-shaped JSON array back in, useful for testing or merging lists.

## Features

- Tabs across the top, one per era — rename or delete via the pencil icon, add new ones with "+ Tab"
- Search by name within the active tab
- Sort by value, name, rarity, or demand (ascending or descending)
- Filter by rarity and by demand
- Per-tab stats: figure count, shown count, total value, average value, top figure
- Rarity shown as a colored corner flag: Common / Rare / Epic / Legendary / Mythic
- Demand shown as a filled bar, plus a trend arrow (rising / stable / falling)
- Fully editable in-browser: add, edit, delete figures and tabs

## Customizing the look

Colors, fonts and spacing all live in `style.css` under the `:root` block at the top — change the hex values there (e.g. `--gold`, `--teal`, rarity colors `--r-common` through `--r-mythic`) to retheme the whole site in one place.
