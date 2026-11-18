// Runs before any test file (and therefore before src/app.js) is required,
// so config/env.js's required-variable check passes and JWT signing works
// without needing a full .env file.
//
// DATABASE_URL is NOT set here — tests run against a real Postgres database
// (ideally a disposable Neon branch, never your production database) and
// expect DATABASE_URL to already be exported in the environment before you
// run `npm test`. See backend/README.md → "Running tests".
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-do-not-use-in-production";
process.env.JWT_EXPIRES_IN = "1h";
