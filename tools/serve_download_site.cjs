const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "dist");
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".epub": "application/epub+zip"
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
}

http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
  const safePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[\\/])+/, "");
  let file = path.join(root, safePath);
  if (safePath === path.sep || safePath === "/" || safePath === ".") file = path.join(root, "index.html");
  if (!file.startsWith(root)) return send(res, 403, "Forbidden");
  fs.stat(file, (statErr, stat) => {
    if (statErr || !stat.isFile()) return send(res, 404, "Not found");
    const type = types[path.extname(file).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(file).pipe(res);
  });
}).listen(port, "127.0.0.1", () => {
  console.log(`A Ultima Ascencao downloads: http://127.0.0.1:${port}/`);
});
