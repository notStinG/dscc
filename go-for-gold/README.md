# Go for Gold (front end)

## Run it

```bash
npm install
npm run dev
```

Open the link Vite prints (usually http://localhost:5173). Use your browser's
phone view (F12, then the device toolbar icon) since the app is mobile first.

## Where things live

```
src/
  main.jsx               starts React and the router
  App.jsx                which URL shows which page
  styles/theme.css       colours, fonts, shared classes (.card, .app-shell)
  api/mockApi.js         ALL data comes from here (fake for now)
  utils/format.js        helpers: run time "11:30", greeting, award cut-offs
  utils/progress.js      Improving / Stable / Needs work rule (threshold here)
  components/            reusable pieces: Header, BottomNav, ScoreCard, StationStepper,
                         ChangePlanModal, PerformanceChart
  pages/                 HomePage, PlanPage, StatsPage
```

## Hooking up the back end later

Only `src/api/mockApi.js` should change. Keep the function names and the JSON
shapes documented there, and replace each body with a `fetch` call. Put the
server address in a `.env` file:

```
VITE_API_URL=http://localhost:3000/api
```
