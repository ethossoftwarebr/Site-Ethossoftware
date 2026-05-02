import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Static assets first — /assets/*, fonts, images, etc. Never reach the catch-all below.
  // `redirect: false` disables Express's auto-301 from /servicos → /servicos/ (which would
  // bypass the prerendered HTML resolution in the catch-all and cost an extra network hop).
  app.use(express.static(distPath, { redirect: false }));

  // Catch-all for navigations (no file extension). Try a prerendered
  // dist/public<route>/index.html first; fall back to the SPA shell.
  app.use("/{*path}", (req, res) => {
    const reqPath = req.path;
    if (reqPath !== "/" && !path.extname(reqPath)) {
      const prerendered = path.resolve(
        distPath,
        "." + reqPath,
        "index.html",
      );
      if (
        prerendered.startsWith(distPath) &&
        fs.existsSync(prerendered)
      ) {
        return res.sendFile(prerendered);
      }
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
