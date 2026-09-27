process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const axios = require('axios');
const https = require('https');

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

module.exports = async (req, res) => {
  // CORS header
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const timestampQuery = `?_t=${Date.now()}`;

    const safePost = (url, body) => 
      axios.post(url, body, { headers: reqHeaders, httpsAgent, timeout: 6000 })
        .then(r => r.data)
        .catch(err => ({ error: err.message }));

    const [infoRes, flowRes, detailRes, memberRes] = await Promise.all([
      safePost(`${BASE_URL}/InverterDetailInfoNewone${timestampQuery}`, deviceBody),
      safePost(`${BASE_URL}/getHybridFlowgraph${timestampQuery}`, deviceBody),
      safePost(`${BASE_URL}/InverterDetail${timestampQuery}`, deviceBody),
      safePost(`${BASE_URL}/GetMemberData${timestampQuery}`, memberBody)
    ]);

    res.status(200).json({
      success: true,
      serverTime: new Date().toLocaleTimeString('vi-VN'),
      summary: infoRes,
      flow: flowRes,
      detail: detailRes,
      member: memberRes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};