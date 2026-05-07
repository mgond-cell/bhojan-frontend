# 🍱 BHOJAN — Ghar Jaisa Khana

A React-based tiffin subscription web app for working professionals and students.

---

## 🚀 How to run locally

### Step 1 — Make sure Node.js is installed
Open your terminal and type:
```
node -v
```
If you see a version number (like v18.x.x), you're good.
If not, download Node.js from: https://nodejs.org

### Step 2 — Navigate to the project folder
```
cd bhojan
```

### Step 3 — Install dependencies
```
npm install
```
This downloads React, React Router, and everything else. Takes ~1 minute.

### Step 4 — Start the app
```
npm start
```
Your browser will open automatically at http://localhost:3000

---

## 📁 Project structure

```
bhojan/
├── public/
│   └── index.html          ← The one HTML file (React fills this)
│
├── src/
│   ├── index.js            ← Entry point (mounts React)
│   ├── App.jsx             ← Router — connects URL to pages
│   │
│   ├── styles/
│   │   └── global.css      ← CSS variables, colors, shared utilities
│   │
│   ├── data/
│   │   └── plans.js        ← All subscription plans & content data
│   │
│   ├── components/
│   │   ├── Navbar.jsx/.css ← Top navigation bar (shared)
│   │   └── PlanCard.jsx/.css ← Reusable plan card component
│   │
│   └── pages/
│       ├── Home.jsx/.css       ← Landing page
│       ├── Plans.jsx/.css      ← Subscription plans page
│       └── Dashboard.jsx/.css  ← Customer dashboard
```

---

## 🧠 Key React concepts used in this project

| Concept | Where used |
|---|---|
| `useState` | Toggle weekly/monthly, skip days, preferences, tabs |
| `useNavigate` | Button clicks that go to another page |
| `useLocation` | Navbar highlights the active page |
| Props | `PlanCard` receives a `plan` object from parent |
| Component reuse | `PlanCard` is used in both Plans page and can be extended |
| React Router | `<Routes>` / `<Route>` for multi-page navigation |

---

## 🗺️ What to build next

1. **Login / Signup page** — React form + validation
2. **Cook/Provider panel** — Form to list meals, manage orders
3. **Order tracker** — Real-time status updates
4. **Backend API** — Node.js + Express to store real data
5. **Database** — MongoDB or PostgreSQL for users & subscriptions

---

## 💡 Learning tip
Start by changing text in `src/data/plans.js` — the whole site updates automatically.
Then try changing colors in `src/styles/global.css`.
