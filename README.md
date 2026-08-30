# Ninjago Values

A static Ninjago minifigure value list website designed for GitHub Pages.

## Quick setup
1. Upload all files to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose `main` and `/ (root)`.
5. Save.

## Adding minifigures
Open `js/figures.js` and add another object:

```js
{
  id:"unique-id",
  name:"Figure Name",
  character:"Character",
  year:2026,
  theme:"Theme Name",
  rarity:"Rare",
  demand:"High",
  value:50,
  trend:"rising",
  change:"+5%",
  notes:"Description here."
}
```

Demand options:
- Very Low
- Low
- Medium
- High
- Very High
- Insane

Trend options:
- rising
- stable
- dropping

The website automatically updates search, filters, sorting and statistics.
