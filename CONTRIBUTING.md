# Contributing to Mini CRM

## Development workflow

1. Read README.md and ARCHITECTURE.md.
2. Clone the repository or use your existing local checkout. Check `git status` and synchronize a clean branch with the remote.
3. Create a feature branch, for example `git switch -c feature/lead-validation`.
4. Install dependencies with `npm ci` separately in backend and frontend.
5. Configure a disposable local MySQL database; never use real customer data in development.
6. Make focused changes and test them before committing.
7. Review `git diff` and stage only intended files. Use a descriptive commit message and open a pull request.

## Code conventions

- Follow the existing React functional-component and CommonJS backend style.
- Keep UI logic and API/database operations separate.
- Use parameterized SQL, validate input and return meaningful HTTP status codes.
- Do not rely on frontend roles for authorization. Never return password hashes or log credentials.
- Document API and database changes alongside code changes.

## Verification checklist

- Frontend builds with `npm run build`; review the starter test before relying on `npm test`.
- Backend starts and connects to a test database.
- Signup, login, lead create/read/update/delete, search, filters and dashboard counts work.
- Invalid credentials and failed API requests produce appropriate errors.
- Changes do not introduce secrets or generated files.

## Git hygiene

Recommended root ignore patterns (add separately if needed):

```gitignore
node_modules/
.env
.env.*
!.env.example
build/
*.log
```

Ignoring a file does not remove it from existing Git history. If credentials were committed, rotate them and coordinate any history cleanup. Do not force-push shared branches without agreement. Keep lockfiles tracked.

Suggested commit prefixes: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`.
