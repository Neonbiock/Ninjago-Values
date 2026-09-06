# Ninjago Minifigure Valuelist

A dark, cosmic-themed valuelist site for Ninjago minifigures — a Home dashboard, tabs by era (Pilot, Season 1: Rise of the Snakes, etc.), a trade Calculator, and sortable/filterable/searchable cards with rarity, value, and demand.

The site is **read-only in the browser on purpose**. Since it's hosted publicly on GitHub Pages, there's no in-page "add/edit/delete" — anyone visiting can browse and use the calculator, but the only way to change the actual list is by editing `data.js` and pushing to GitHub. That keeps the data trustworthy no matter who looks at the live link.

## Host it on GitHub Pages (free)

1. Create a new repository on GitHub, e.g. `ninjago-valuelist`.
2. Upload these files to it: `index.html`, `style.css`, `app.js`, `data.js`, `README.md` (and an `images/` folder if you add your own photos — see below).
   - Easiest way: on the repo page, click **Add file → Upload files**, drag everything in, and commit.
3. Go to **Settings → Pages** in the repo.
4. Under "Build and deployment", set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
5. Save. GitHub gives you a URL like `https://yourusername.github.io/ninjago-valuelist/` within a minute or two.

No build step, no server, no dependencies beyond a Google Font import — it's plain HTML/CSS/JS.

## Editing your list

Open `data.js`. Everything — tabs, figure names, rarity, value, demand, trend, notes, images — lives in one `TABS` array there, with comments explaining every field. Add or remove tabs/figures by copying an existing block and editing it, then commit and push. The live site updates automatically.

To rename the site itself, edit the `<h1>` text directly in `index.html`.

## Adding images

The site ships with **no built-in minifigure photos** — you provide your own, so nothing is hotlinked from a source that doesn't belong to you. In `data.js`, each figure has an `image` field:

```js
image: "images/kai-pilot.jpg"     // a photo you've added to an images/ folder in this repo
image: "https://i.imgur.com/xyz.jpg"  // or a full URL to an image you host elsewhere
```

Leave it as `""` (or delete the field) and the card falls back to a colored icon using the figure's `tag` (e.g. "KAI") — so you can add photos gradually, tab by tab.

## Features

- **Home** — collection-wide stats (seasons tracked, total figures, total value, most valuable figure) plus quick links into each season
- **Season tabs** — one per era, with figure count shown on the tab
- **Search, sort and filter** within a tab — by value, name, rarity, or demand, ascending or descending
- **Calculator** — search and add figures from any season to "Side A" / "Side B" to compare total value, useful for checking whether a trade is fair
- Rarity shown as a colored corner flag: Common / Rare / Epic / Legendary / Mythic
- Demand shown as a filled bar, plus a trend arrow (rising / stable / falling)
- Your own images, with automatic fallback to a colored icon when none is set

## Customizing the look

Colors, fonts and spacing all live in `style.css` under the `:root` block at the top — change the hex values there (e.g. `--gold`, `--teal`, rarity colors `--r-common` through `--r-mythic`) to retheme the whole site in one place.
