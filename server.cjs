const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const { join } = require('node:path');

const port = Number(process.env['API_PORT'] ?? 3000);
const productsFile = join(__dirname, 'data', 'products.json');

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;

  if (pathname !== '/api/products') {
    response.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  if (request.method !== 'GET') {
    response.writeHead(405, {
      Allow: 'GET',
      'Content-Type': 'application/json; charset=utf-8',
    });
    response.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const products = await readFile(productsFile, 'utf8');
    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    });
    response.end(products);
  } catch (error) {
    console.error('Could not read the products JSON file:', error);
    response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ error: 'Could not load products' }));
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Mock products API listening on http://127.0.0.1:${port}/api/products`);
});

server.on('error', (error) => {
  console.error('Mock products API failed to start:', error);
  process.exitCode = 1;
});
