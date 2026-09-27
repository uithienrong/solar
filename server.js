// server.js - Node.js Local Proxy bypass CORS for Senergy Monitor
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const AUTH_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtb25pdG9yaW5nLnNvbGFydmlldC52biIsImF1ZCI6Im1vbml0b3Jpbmcuc29sYXJ2aWV0LnZuIiwiaWF0IjoxNzkwNTE2NzU1LCJuYmYiOjE3OTA1MTY3NTUsImV4cCI6MTgyMTYyMDc1NSwiZGF0YSI6eyJNZW1iZXJBdXRvSUQiOm51bGx9fQ.Yai1vc4LuH92Idb9OhBETv0DsIzLvVg1OmhskX8I99s";

const REQUEST_PAYLOAD = JSON.stringify({
  sign: "EOjgep7+pHePUq8rziMbid6pUqfXmvVNsg7EIJ0GQFHheLG2xJyf1SU1fYC1hLhjDRcy3ZbbUjYts3DFyCcl3rlY2V4CdpIkMaj105gxTC0=",
  GoodsID: "2547-38802597PH",
  MemberAutoID: "1042037"
});

function postSenergyApi(apiPath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'monitoring.solarviet.vn',
      port: 443,
      path: '/dist/server/api/CodeIgniter/index.php/Senergytec/web/v2/Inverterapi/' + apiPath,
      method: 'POST',
      rejectUnauthorized: false,
      headers: {
        'accept': 'application/json, text/plain, */*',
        'authorization': AUTH_TOKEN,
        'content-type': 'application/json',
        'cookie': 'timezone=Asia/Bangkok',
        'origin': 'https://monitoring.solarviet.vn',
        'referer': 'https://monitoring.solarviet.vn/dist/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36',
        'content-length': Buffer.byteLength(REQUEST_PAYLOAD)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: 'JSON parse error', raw: data });
        }
      });
    });

    req.on('error', err => reject(err));
    req.write(REQUEST_PAYLOAD);
    req.end();
  });
}

// Bộ nhớ cache tạm thời trên server
let cachedDetail = null;
let lastDetailFetch = 0;

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Endpoint gọi nhanh cho giao diện web
  if (req.url === '/api/live') {
    try {
      const now = Date.now();
      // Detail BMS chỉ cần fetch mỗi 15s một lần
      if (!cachedDetail || now - lastDetailFetch > 15000) {
        cachedDetail = await postSenergyApi('InverterDetailInfoNewone');
        lastDetailFetch = now;
      }

      // getHybridFlowgraph gọi liên tục tức thời
      const flowData = await postSenergyApi('getHybridFlowgraph');

      const merged = { ...cachedDetail, ...flowData };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(merged));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  const filePath = path.join(__dirname, 'index.html');
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('File index.html not found');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`[OK] Server Senergy Live Monitor running at: http://localhost:${PORT}`);
});
