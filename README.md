# Inside Node.js — V8, the Event Loop & libuv

Assignment site covering the theory of how Node.js runs JavaScript
(V8, Call Stack, Event Loop, libuv) plus two runnable practical tasks
on asynchronous execution.

## Files

- `index.html` — the assignment site (theory answers + interactive practical tasks)
- `style.css` — styling
- `script.js` — powers the live "run" demos on the site
- `task1.js` — standalone script for Practical Task 1 (`node task1.js`)
- `task2.js` — standalone script for Practical Task 2 (`node task2.js`)

## Viewing the site

Open `index.html` in any browser — no build step or server required.

## Running the practical tasks in Node

```bash
node task1.js
node task2.js
```

## Publishing to GitHub

```bash
git init
git add .
git commit -m "Node.js internals assignment"
git branch -M main
git remote add origin <your-empty-repo-url>
git push -u origin main
```

Then enable GitHub Pages (Settings → Pages → Deploy from branch → main)
if you want a live link to the site in addition to the repo link.
