---
name: server-session-setup
description: Use when wiring Passport authentication, adding express-session, configuring connect-pg-simple/memorystore, implementing login/logout/signup routes, or adding any auth flow. Triggers on "add login", "wire passport", "session middleware", "authentication", "passport-local", "user login", "session store". The deps are installed but currently unused — this skill enforces correct ordering and patterns when first introducing auth.
source: scan
---
<!-- mustard:generated -->
# Server Session Setup

> `passport`, `passport-local`, `express-session`, `connect-pg-simple`, and `memorystore` are declared in `package.json` but **not currently mounted** in `server/`. This skill defines the correct way to wire them.

## When to use

- First-time wiring of authentication into the app
- Adding a `POST /api/login` / `/api/logout` / `/api/signup` route
- Switching from in-memory session store to Postgres-backed
- Reviewing auth-related PRs

## Required env vars (add to `.claude/commands/stack.md` when wired)

| Var | Purpose |
|---|---|
| `SESSION_SECRET` | HMAC for signed session cookies. **Required.** |
| `DATABASE_URL` | Used by `connect-pg-simple` if you choose Postgres-backed sessions |

## Insertion point in `server/index.ts`

Place the session/passport stack **AFTER** `express.urlencoded` (`server/index.ts:23`) and **BEFORE** the request logger (`server/index.ts:36`). This way the logger captures `req.user` if you later log it.

```ts
// AFTER line 23, BEFORE line 36:
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";
import { storage } from "./storage";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required");
}

const PgStore = connectPgSimple(session);
const sessionPool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(session({
  store: new PgStore({ pool: sessionPool, createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await storage.getUserByUsername(username);
    if (!user) return done(null, false, { message: "Invalid credentials" });
    // TODO: replace with bcrypt.compare(password, user.password)
    if (user.password !== password) return done(null, false);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user || false);
  } catch (err) {
    done(err);
  }
});
```

## Rules

1. **Throw at boot if `SESSION_SECRET` is missing.** Match the pattern at `drizzle.config.ts:3-4`.
2. **`secure: true` only in production** — `http://localhost` would otherwise refuse the cookie.
3. **`saveUninitialized: false`** — don't create sessions for anonymous visitors (saves DB writes).
4. **Hash passwords.** `MemStorage.createUser` (`server/storage.ts:30-35`) currently stores plaintext. Add `bcrypt` (or `argon2`) before any real users sign up. Add to `script/build.ts:7-33` allowlist when bundling.
5. **Use the existing `storage.getUserByUsername` / `storage.getUser`** — don't reach for `pg` directly inside the strategy.
6. **For dev-only / single-process,** you may use `memorystore` instead of `connect-pg-simple` if you don't want to depend on Postgres. Switch the `store` line.
7. **Cookie defaults: `httpOnly: true, sameSite: "lax"`.** Tighten to `"strict"` only if you don't need cross-site OAuth callbacks.

## Login route shape (in `server/routes.ts`)

```ts
app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message ?? "Unauthorized" });
    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      res.json({ id: user.id, username: user.username });
    });
  })(req, res, next);
});

app.post("/api/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ ok: true });
  });
});
```

## References

- Currently unused deps: `package.json:49,55,59,61,62`
- Storage seam: `server/storage.ts`
- Examples: `references/examples.md`
