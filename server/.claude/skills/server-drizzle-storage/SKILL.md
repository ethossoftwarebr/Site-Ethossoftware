---
name: server-drizzle-storage
description: Use when adding a new database entity, defining a Drizzle table, extending the IStorage interface, replacing MemStorage with a Postgres-backed implementation, or running drizzle-kit push. Triggers on "new entity", "new table", "Drizzle schema", "add a model", "persist data", "storage layer", "db:push", "createInsertSchema", "Postgres model".
source: scan
---
<!-- mustard:generated -->
# Server Drizzle Storage

> Schema lives in `shared/schema.ts`. Server-side data access goes through the `IStorage` seam in `server/storage.ts`. The current `MemStorage` is in-memory — replace before relying on persistence.

## When to use

- Adding a new entity (table) to the project
- Adding a CRUD method to `IStorage`
- Wiring a Postgres-backed implementation of `IStorage`
- Modifying `drizzle.config.ts` or running migrations

## The seam (server/storage.ts)

```ts
export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage { /* in-memory Map */ }

export const storage = new MemStorage();
```

## Recipe: add a new entity (`leads`)

### 1. Declare the table in `shared/schema.ts`

```ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  email: true,
  message: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
```

Pattern source: `shared/schema.ts:6-19` (users table).

### 2. Extend `IStorage` in `server/storage.ts`

```ts
export interface IStorage {
  // ... existing user methods
  createLead(lead: InsertLead): Promise<Lead>;
  listLeads(): Promise<Lead[]>;
}
```

### 3. Implement in `MemStorage` (and your future `DrizzleStorage`)

```ts
private leads: Map<string, Lead> = new Map();

async createLead(input: InsertLead): Promise<Lead> {
  const id = randomUUID();
  const lead: Lead = { ...input, id, createdAt: new Date() };
  this.leads.set(id, lead);
  return lead;
}

async listLeads(): Promise<Lead[]> {
  return Array.from(this.leads.values());
}
```

### 4. Push the schema

```bash
DATABASE_URL=postgres://... npm run db:push
```
`drizzle.config.ts:3-4` throws if `DATABASE_URL` is missing.

## Rules

1. **Schema source of truth is `shared/schema.ts`.** Don't redefine table shapes in server-only files.
2. **Always export both the insert schema (zod) and the inferred TS types** (`InsertX`, `X`).
3. **Use `.pick({...})` on `createInsertSchema`** to whitelist mutable fields (excludes `id`, `createdAt`, etc.).
4. **Use `varchar("id").primaryKey().default(sql\`gen_random_uuid()\`)`** to match the existing `users` pattern.
5. **Server imports types via the `@shared/*` alias** (`server/storage.ts:1`).
6. **Do not import `pg` or open a Drizzle connection from `server/storage.ts`** until you replace `MemStorage`. Keep the seam clean.
7. **A real `DrizzleStorage`** (when added) should accept the `db` instance via constructor for testability — do NOT instantiate `pg.Pool` at module top-level.

## Don't

- Don't call `storage.*` from a route if you need persistence today — `MemStorage` resets on restart.
- Don't run `db:push` against production from a local shell. Use a migration pipeline.
- Don't skip the Zod insert schema — Express routes should validate with it before calling `storage.createX(...)`.

## References

- Schema: `shared/schema.ts`
- Storage seam: `server/storage.ts`
- Drizzle config: `drizzle.config.ts`
- Examples: `references/examples.md`
- Recipe: `server/.claude/commands/recipes.md` §R2
