const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;
const POSTS_DIR = path.join(ROOT, "portfolio", "posts");
const INDEX_FILE = path.join(POSTS_DIR, "index.json");

const MEDIA_DIR = path.join(ROOT, "media");
const MEDIA_IMG = path.join(MEDIA_DIR, "img");
const MEDIA_FILES = path.join(MEDIA_DIR, "files");

const IMG_EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"]);

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

function sendJSON(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function readIndex() {
  try {
    return JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8"));
  } catch {
    return { posts: [] };
  }
}

function writeIndex(index) {
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
}

function extractMediaUrls(blocks) {
  const urls = [];
  for (const block of blocks) {
    const url = block.data?.file?.url;
    if (url && url.startsWith("/media/")) urls.push(url);
  }
  return urls;
}

const server = http.createServer(async (req, res) => {
  const parsed = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsed.pathname;
  const method = req.method.toUpperCase();

  // ===== CORS =====
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // ===== API routes =====

  if (pathname === "/api/save" && method === "POST") {
    try {
      const body = JSON.parse(await readBody(req));
      const { category, slug } = body;
      if (!category || !slug) return sendJSON(res, 400, { error: "Missing category or slug" });

      const index = readIndex();
      const existing = index.posts.find((p) => p.id === body.id);

      if (existing && (existing.slug !== slug || existing.category !== category)) {
        const oldFile = path.join(POSTS_DIR, existing.category, `${existing.slug}.json`);
        if (fs.existsSync(oldFile)) {
          fs.unlinkSync(oldFile);
          console.log(`Migrated: ${existing.category}/${existing.slug}.json → ${category}/${slug}.json`);
        }
      }

      // Clean up orphaned media files
      const oldPostPath = existing
        ? path.join(POSTS_DIR, existing.category, `${existing.slug}.json`)
        : path.join(POSTS_DIR, category, `${slug}.json`);
      if (fs.existsSync(oldPostPath)) {
        try {
          const oldPost = JSON.parse(fs.readFileSync(oldPostPath, "utf-8"));
          const oldUrls = extractMediaUrls(oldPost.content || []);
          const newUrls = new Set(extractMediaUrls(body.content || []));
          for (const url of oldUrls) {
            if (!newUrls.has(url)) {
              const filePath = path.join(ROOT, url);
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Deleted orphaned media: ${url}`);
              }
            }
          }
        } catch {}
      }

      const dir = path.join(POSTS_DIR, category);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(path.join(dir, `${slug}.json`), JSON.stringify(body, null, 2));

      const entry = {
        id: body.id,
        title: body.title,
        slug: body.slug,
        category: body.category,
        tags: body.tags,
        date: body.date,
        summary: body.summary,
        thumbnail: body.thumbnail,
      };
      let idx = index.posts.findIndex((p) => p.id === body.id);
      if (idx < 0) idx = index.posts.findIndex((p) => p.category === body.category && p.slug === body.slug);
      if (idx >= 0) index.posts[idx] = entry;
      else index.posts.push(entry);
      writeIndex(index);

      return sendJSON(res, 200, { ok: true });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  if (pathname === "/api/delete" && method === "POST") {
    try {
      const body = JSON.parse(await readBody(req));
      const { category, slug } = body;
      if (!category || !slug) return sendJSON(res, 400, { error: "Missing category or slug" });

      const file = path.join(POSTS_DIR, category, `${slug}.json`);
      if (fs.existsSync(file)) {
        try {
          const post = JSON.parse(fs.readFileSync(file, "utf-8"));
          for (const url of extractMediaUrls(post.content || [])) {
            const mediaPath = path.join(ROOT, url);
            if (fs.existsSync(mediaPath)) {
              fs.unlinkSync(mediaPath);
              console.log(`Deleted media with post: ${url}`);
            }
          }
        } catch {}
        fs.unlinkSync(file);
      }

      const index = readIndex();
      index.posts = index.posts.filter((p) => !(p.category === category && p.slug === slug));
      writeIndex(index);

      return sendJSON(res, 200, { ok: true });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  if (pathname === "/api/upload" && method === "POST") {
    try {
      const body = JSON.parse(await readBody(req));
      const { data, filename } = body;
      if (!data || !filename) return sendJSON(res, 400, { error: "Missing data or filename" });

      const match = data.match(/^data:(.+);base64,(.+)$/);
      if (!match) return sendJSON(res, 400, { error: "Invalid base64 data URL" });

      const buffer = Buffer.from(match[2], "base64");
      const ext = path.extname(filename).toLowerCase();
      const isImage = IMG_EXTS.has(ext);
      const destDir = isImage ? MEDIA_IMG : MEDIA_FILES;

      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

      const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const stamp = Date.now();
      const finalName = `${stamp}-${safeName}`;
      const filePath = path.join(destDir, finalName);

      fs.writeFileSync(filePath, buffer);

      const subdir = isImage ? "img" : "files";
      const url = `/media/${subdir}/${finalName}`;
      return sendJSON(res, 200, { ok: true, url, filename: finalName });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // Catch-all for unknown /api/ routes
  if (pathname.startsWith("/api/")) {
    return sendJSON(res, 404, { error: "Unknown API route" });
  }

  // ===== Static file serving =====

  let filePath = path.join(ROOT, pathname);
  if (filePath.endsWith("/")) filePath += "index.html";

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    return res.end("Not found");
  }

  const ext = path.extname(filePath);
  const mime = MIME[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": mime });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
  console.log(`Admin tool at http://localhost:${PORT}/admin/admin.html`);
});
