#!/usr/bin/env node
/**
 * Servidor local simple para Immersphere Asset Lab
 * Sin dependencias externas — usa solo módulos nativos de Node.js
 *
 * Uso:
 *   node scripts/serve.js          # puerto por defecto 3456
 *   node scripts/serve.js 8080     # puerto personalizado
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const PORT = Number(process.argv[2]) || 3456;

const MIME_TYPES = {
  '.html': 'text/html',
  '.htm': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.pdf': 'application/pdf',
  '.md': 'text/markdown',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function serveFile(res, filePath) {
  try {
    const data = fs.readFileSync(filePath);
    const mime = getMimeType(filePath);
    res.writeHead(200, {
      'Content-Type': mime,
      'Content-Length': data.length,
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Server error: ${err.message}`);
  }
}

function serve404(res, requestPath) {
  const notFoundPath = path.join(ROOT, 'viewer', 'index.html');
  if (fs.existsSync(notFoundPath)) {
    // SPA fallback: devuelve viewer/index.html para rutas desconocidas
    serveFile(res, notFoundPath);
    return;
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end(`Not found: ${requestPath}`);
}

function serveDirectoryListing(res, dirPath, requestPath) {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Index of ${escapeHtml(requestPath)}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #111; }
    h1 { font-size: 1.25rem; margin-bottom: 1rem; }
    ul { list-style: none; padding: 0; }
    li { padding: 6px 0; border-bottom: 1px solid #eee; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .dir { font-weight: 600; }
  </style>
</head>
<body>
  <h1>Index of ${escapeHtml(requestPath)}</h1>
  <ul>
`;
  if (requestPath !== '/') {
    html += '    <li><a href="../">../</a></li>\n';
  }
  for (const item of items.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  })) {
    const name = escapeHtml(item.name) + (item.isDirectory() ? '/' : '');
    const cls = item.isDirectory() ? 'dir' : '';
    html += `    <li><a href="${encodeURIComponent(item.name)}${item.isDirectory() ? '/' : ''}" class="${cls}">${name}</a></li>\n`;
  }
  html += `  </ul>
</body>
</html>`;
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const server = http.createServer((req, res) => {
  const decodedPath = decodeURIComponent(req.url.split('?')[0]);
  const safePath = path.normalize(decodedPath).replace(/^(\.\.(\/|$))+/, '');
  let filePath = path.join(ROOT, safePath);

  // Prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // Directory handling
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const indexPath = path.join(filePath, 'index.html');
    if (fs.existsSync(indexPath)) {
      serveFile(res, indexPath);
    } else {
      serveDirectoryListing(res, filePath, safePath || '/');
    }
    return;
  }

  // File handling
  if (fs.existsSync(filePath)) {
    serveFile(res, filePath);
    return;
  }

  // SPA fallback for viewer routes
  if (safePath.startsWith('/viewer/') || safePath === '/viewer') {
    const viewerIndex = path.join(ROOT, 'viewer', 'index.html');
    if (fs.existsSync(viewerIndex)) {
      serveFile(res, viewerIndex);
      return;
    }
  }

  serve404(res, safePath);
});

server.listen(PORT, () => {
  console.log(`🚀 Immersphere Asset Lab server running at http://localhost:${PORT}`);
  console.log(`   Root: ${ROOT}`);
  console.log(`   Press Ctrl+C to stop`);
});
