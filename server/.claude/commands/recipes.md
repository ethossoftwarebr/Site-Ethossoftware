<!-- mustard:generated -->
# Server Recipes

> Step-by-step recipes for the most common changes in `server/`. Each one points at the existing pattern to copy.

## R1 — Add a new API route

Goal: expose `GET /api/leads` (example).

1. Open `server/routes.ts`.
2. Inside `registerRoutes(httpServer, app)` (`server/routes.ts:113`), add the handler ABOVE `return httpServer`:
   ```ts
   app.get("/api/leads", async (_req, res) => {
     try {
       // ... your logic
       res.json({ leads: [] });
     } catch (err) {
       next(err); // or: res.status(500).json({ message: "..." })
     }
   });
   ```
3. **Prefix MUST be `/api`** so the request logger picks it up (`server/index.ts:49`).
4. If you need request validation, import a Zod schema from `shared/schema.ts` and `.parse()` the body.
5. If the route persists data, do NOT call `storage.*` (in-memory). First swap `MemStorage` for a Drizzle-backed implementation (see R2).
6. No registration step elsewhere — `registerRoutes` is already wired in `server/index.ts:63`.

## R2 — Add a new Drizzle entity (table)

Goal: add a `leads` table.

1. Edit `shared/schema.ts`. Add:
   ```ts
   export const leads = pgTable("leads", {
     id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
     email: text("email").notNull(),
     createdAt: timestamp("created_at").defaultNow().notNull(),
   });
   export const insertLeadSchema = createInsertSchema(leads).pick({ email: true });
   export type InsertLead = z.infer<typeof insertLeadSchema>;
   export type Lead = typeof leads.$inferSelect;
   ```
2. Add the corresponding methods to `IStorage` in `server/storage.ts:7-11` and implement them in `MemStorage` (and the eventual Drizzle class).
3. Ensure `DATABASE_URL` is set in your env, then run `npm run db:push` (uses `drizzle.config.ts`).
4. Drizzle/zod symbols are already imported at the top of `shared/schema.ts:1-4`. Add `timestamp` to the import list if used.

## R3 — Add a new middleware

Goal: e.g. add a security/CORS/rate-limit middleware.

1. In `server/index.ts`, decide ordering:
   - **Before parsers** if it inspects raw bytes (rare).
   - **After parsers, before the request logger** (`server/index.ts:23` ↔ `:36`) if it short-circuits on auth/rate-limit and you don't want failed requests to log under `/api`.
   - **After the request logger** if you want logs for every attempt.
   - **NEVER after `setupVite`/`serveStatic`** — both end in a catch-all (`server/static.ts:16`, `server/vite.ts:34`).
2. Pattern:
   ```ts
   app.use((req, res, next) => {
     // ... logic
     next(); // or res.status(429).json({ message: "..." })
   });
   ```
3. If the middleware is async with I/O, wrap it `(req, res, next) => { fn().then(next).catch(next); }`.
4. Add `try/catch` around any `await` and surface unknown failures via `next(err)` so the global error handler (`server/index.ts:65`) handles them uniformly.

## R4 — Wire Passport + sessions (currently declared, not used)

The deps already exist (`passport`, `passport-local`, `express-session`, `connect-pg-simple`).

1. In `server/index.ts`, AFTER `express.urlencoded` (`:23`) and BEFORE the request logger (`:36`):
   ```ts
   import session from "express-session";
   import passport from "passport";
   import { Strategy as LocalStrategy } from "passport-local";
   import connectPgSimple from "connect-pg-simple";

   const PgStore = connectPgSimple(session);
   app.use(session({
     store: new PgStore({ conString: process.env.DATABASE_URL }),
     secret: process.env.SESSION_SECRET!,
     resave: false,
     saveUninitialized: false,
     cookie: { httpOnly: true, secure: process.env.NODE_ENV === "production" },
   }));
   app.use(passport.initialize());
   app.use(passport.session());
   ```
2. Implement the `LocalStrategy` against `storage.getUserByUsername(...)` (`server/storage.ts:24`).
3. Add `SESSION_SECRET` to required env vars in `server/.claude/commands/stack.md`.
4. Add `passport.serializeUser` / `deserializeUser` calling `storage.getUser(id)`.

## R5 — Add a new external API proxy route

Use `POST /api/chat` (`server/routes.ts:124-172`) as the template:
1. Read the API key from `process.env.X_API_KEY` and degrade gracefully if absent.
2. Wrap `await fetch(...)` in `try/catch`; log via `console.error("X error:", err)`.
3. Return a user-friendly fallback (HTTP 200 with explanatory message) rather than 500 if the failure is non-actionable for the user.

## R6 — Make a new npm package available in the production bundle

By default esbuild keeps deps external. To bundle a dep into `dist/index.cjs`:
1. Open `script/build.ts:7-33`.
2. Add the package name to `allowlist`.
3. Re-run `npm run build`.
