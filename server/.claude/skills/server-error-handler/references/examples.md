# Real error handler from server/index.ts

## Implementation (server/index.ts:65-76)

```ts
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("Internal Server Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(status).json({ message });
});
```

## Surrounding bootstrap order (server/index.ts:62-86)

```ts
(async () => {
  await registerRoutes(httpServer, app);   // routes first

  app.use((err, _req, res, next) => {       // error handler SECOND-TO-LAST
    /* ... */
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);                       // catch-all LAST
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);       // catch-all LAST
  }
  // ...
})();
```

## How a route surfaces an error

```ts
// Inside server/routes.ts handler:
app.get("/api/example", async (_req, res, next) => {
  try {
    const result = await doWork();
    res.json(result);
  } catch (err) {
    next(err); // bubbles up to the global handler
  }
});
```

## Custom HTTP error shape (suggested if you add one)

```ts
class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
// throw new HttpError(404, "Lead not found");
// Global handler reads err.status → returns 404 { message: "Lead not found" }
```
