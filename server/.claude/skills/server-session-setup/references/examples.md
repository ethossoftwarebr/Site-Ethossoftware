# Session/passport setup — declared but not yet wired

## Currently in package.json (no usage in server/ yet)

```json
"connect-pg-simple": "^10.0.0",
"express-session": "^1.18.1",
"memorystore": "^1.6.7",
"passport": "^0.7.0",
"passport-local": "^1.0.0",
```

## The user table the LocalStrategy will read against (shared/schema.ts:6-10)

```ts
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});
```

## Storage methods already in place (server/storage.ts:7-11)

```ts
export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}
```

## Insertion order checklist for server/index.ts

```
:15  express.json (with verify → req.rawBody)
:23  express.urlencoded
↓ INSERT HERE: session + passport.initialize + passport.session
:36  request logger
:62  IIFE → registerRoutes (login/logout routes inside)
:65  global error handler
:81  dev/prod split (vite/static)
```

## Esbuild allowlist update (script/build.ts:7-33) — already present

`connect-pg-simple`, `express-session`, `memorystore`, `passport`, `passport-local`, `pg` are all in the allowlist, so they will be bundled into `dist/index.cjs` once you import them.

## When you add bcrypt

```bash
npm i bcrypt
npm i -D @types/bcrypt
# Then add "bcrypt" to allowlist in script/build.ts
```
