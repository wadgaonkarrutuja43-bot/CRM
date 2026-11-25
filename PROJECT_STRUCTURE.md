# Project Structure

```text
CRM/
├── README.md
├── ARCHITECTURE.md          # Documentation addition
├── PROJECT_STRUCTURE.md    # Documentation addition
├── CONTRIBUTING.md          # Documentation addition
├── CHANGELOG.md             # Documentation addition
├── .env.example             # Proposed configuration template
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
└── frontend/
    ├── .gitignore
    ├── README.md
    ├── package.json
    ├── package-lock.json
    ├── public/
    │   ├── index.html
    │   ├── favicon.ico
    │   ├── logo192.png
    │   ├── logo512.png
    │   ├── manifest.json
    │   └── robots.txt
    └── src/
        ├── App.js
        ├── App.css
        ├── App.test.js
        ├── AuthForm.jsx
        ├── Dashboard.jsx
        ├── LeadsPage.jsx
        ├── ProfilePage.jsx
        ├── SettingsPage.jsx
        ├── HelpPage.jsx
        ├── PixelBlast.jsx
        ├── index.js
        ├── index.css
        ├── logo.svg
        ├── reportWebVitals.js
        └── setupTests.js
```

## File responsibilities

| File | Responsibility |
|---|---|
| backend/server.js | MySQL connection, authentication, password change, lead CRUD, statistics and activity routes |
| backend/package.json | Backend dependencies and start command |
| frontend/src/App.js | Main view selection, user state and navigation |
| AuthForm.jsx | Login and registration form |
| Dashboard.jsx | Statistics and recent activity display |
| LeadsPage.jsx | Lead CRUD, search, filters, sorting and pagination |
| ProfilePage.jsx | Profile form with simulated save |
| SettingsPage.jsx | Settings and demo team/data/security actions |
| HelpPage.jsx | Help and about interface |
| PixelBlast.jsx | Visual effect component |
| App.css, index.css | Styling |
| index.js | React application entry point |
| App.test.js, setupTests.js | Starter test and test setup |
| reportWebVitals.js | CRA performance reporting helper |
| public/ | HTML shell and static browser assets |
| package-lock.json | Locked dependency versions for each application |

Generated dependency directories are intentionally omitted from this tree. The archive includes node_modules; install dependencies with npm instead of committing these directories. No database dump or root environment loader was found.
