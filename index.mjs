import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const port = config.port || 3000;

const server = http.createServer((req, res) => {
  console.log(`Request for ${req.url}`);

  let filePath = '';
  let contentType = '';

  if (req.url === '/' || req.url === '/index.html') {
    filePath = path.join(__dirname, 'views', 'index.html');
    contentType = 'text/html';
  } else if (req.url.endsWith('.css')) {
    filePath = path.join(__dirname, 'views', req.url);
    contentType = 'text/css';
  } else if (req.url.endsWith('.js')) {
    filePath = path.join(__dirname, 'views', req.url);
    contentType = 'application/javascript';
  } else {
    // ถ้าไฟล์ไม่ตรงเงื่อนไข หรือไม่เจอ ให้ตอบ 404
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('404 Not Found');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Error loading file');
    } else {
      res.writeHead(200, {'Content-Type': contentType});
      res.end(data);
    }
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
