# Site Ethossoftware - Project Context

> Framework rules: See [.claude/CLAUDE.md](./.claude/CLAUDE.md)

## Project Structure

| Subproject | Technology | Port | CLAUDE.md |
|------------|------------|------|-----------|
| client | React 19 + Vite 7 + Tailwind v4 + Wouter + shadcn/ui | 5000 (dev) | [client](./client/CLAUDE.md) |
| server | Express 5 + TypeScript, no ORM (static site + AI chat proxy) | 5000 (prod, single port) | [server](./server/CLAUDE.md) |

**Note**: Single root `package.json` drives the whole monorepo. Server serves both API (`/api/*`) and the built client on the same port (`PORT` env, default 5000).

## Entity Registry

**CRITICAL:** Before searching for ANY entity, read `.claude/entity-registry.json` first.

## Ignore Paths

Never search in:
- `node_modules/`, `dist/`, `.next/`, `attached_assets/` (binary brand assets)
