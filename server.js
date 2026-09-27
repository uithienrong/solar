process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const https = require('https');

const app = express();
app.use(cors());
// Tự động chuyển người dùng trên điện thoại sang mobile.html
app.get('/', (req, res, next) => {
  const ua = req.headers['user-agent'] || '';
  const isMobile = /mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(ua);
  if (isMobile) {
    return res.sendFile(__dirname + '/public/mobile.html');
  }
  next();
});

app.use(express.static('public'));

const BASE_URL = 'https://monitoring.solarviet.vn/dist/server/api/CodeIgniter/index.php/Senergytec/web/v2/Inverterapi';

const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtb25pdG9yaW5nLnNvbGFydmlldC52biIsImF1ZCI6Im1vbml0b3Jpbmcuc29sYXJ2aWV0LnZuIiwiaWF0IjoxNzkwNDcxOTAwLCJuYmYiOjE3OTA0NzE5MDAsImV4cCI6MTgyMTU3NTkwMCwiZGF0YSI6eyJNZW1iZXJBdXRvSUQiOm51bGx9fQ.AhvBhQPmammWJDir78pb1_blstK1SxqCdvR6mN0mopA';

const reqHeaders = {
  'accept': 'application/json, text/plain, */*',
  'authorization': TOKEN,
  'content-type': 'application/json',
  'origin': 'https://monitoring.solarviet.vn',
  'referer': 'https://monitoring.solarviet.vn/dist/',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'cookie': 'timezone=Asia%2FBangkok'
};

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const deviceBody = {
  sign: 'EOjgep7+pHePUq8rziMbid6pUqfXmvVNsg7EIJ0GQFHheLG2xJyf1SU1fYC1hLhjDRcy3ZbbUjYts3DFyCcl3rlY2V4CdpIkMaj105gxTC0=',
  GoodsID: '2547-38802597PH',
  MemberAutoID: '1042037'
};

const memberBody = {
  sign: '6zMP60ejkVajQHf9p2pChQUMncREt1DiOnOQMf4zzBaQEO15tuW9JS20Uo3XjAF3lSh6yMg9LpmHUoTDoURN4EXBqtcu9OF65u0XL07yiRg=',
  MemberAutoID: '1042037',
  language: 'null'
};

const errorBody = {
  sign: 'EOjgep7+pHePUq8rziMbidenpdf4FhTZ+e3E1/22UTnKMuNWjAm9TuOLtsJ6vKoVAapEDpkNZHMenstXYq9y2g==',
  GoodsID: '2547-38802597PH'
};

app.get('/api/live', async (req, res) => {
  try {
    const timestampQuery = `?_t=${Date.now()}`;

    const [infoRes, flowRes, detailRes, memberRes, errorRes] = await Promise.all([
      axios.post(`${BASE_URL}/InverterDetailInfoNewone${timestampQuery}`, deviceBody, { headers: reqHeaders, httpsAgent }),
      axios.post(`${BASE_URL}/getHybridFlowgraph${timestampQuery}`, deviceBody, { headers: reqHeaders, httpsAgent }),
      axios.post(`${BASE_URL}/InverterDetail${timestampQuery}`, deviceBody, { headers: reqHeaders, httpsAgent }),
      axios.post(`${BASE_URL}/GetMemberData${timestampQuery}`, memberBody, { headers: reqHeaders, httpsAgent }),
      axios.post(`${BASE_URL}/getPvierrorRealtime${timestampQuery}`, errorBody, { headers: reqHeaders, httpsAgent })
    ]);

    res.json({
      success: true,
      serverTime: new Date().toLocaleTimeString('vi-VN'),
      summary: infoRes.data,
      flow: flowRes.data,
      detail: detailRes.data,
      member: memberRes.data,
      errors: errorRes.data
    });
  } catch (error) {
    console.error('Lỗi API SolarViet:', error.response ? error.response.status : error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      detail: error.response ? error.response.data : null
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Solar Realtime Dashboard: http://localhost:${PORT}`);
});