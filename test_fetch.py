import requests
import json

BASE_URL = "https://monitoring.solarviet.vn/dist/server/api/CodeIgniter/index.php/Senergytec/web/v2/Inverterapi"

TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtb25pdG9yaW5nLnNvbGFydmlldC52biIsImF1ZCI6Im1vbml0b3Jpbmcuc29sYXJ2aWV0LnZuIiwiaWF0IjoxNzkwNDcxOTAwLCJuYmYiOjE3OTA0NzE5MDAsImV4cCI6MTgyMTU3NTkwMCwiZGF0YSI6eyJNZW1iZXJBdXRvSUQiOm51bGx9fQ.AhvBhQPmammWJDir78pb1_blstK1SxqCdvR6mN0mopA"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "token": TOKEN,
    "Authorization": f"Bearer {TOKEN}"
}

params = {
    "MemberAutoID": "1042037",
    "GoodsID": "2547-38802597PH",
    "type": "4"
}

def check_endpoint(endpoint_name):
    url = f"{BASE_URL}/{endpoint_name}"
    # Hệ thống dùng GET hoặc POST
    try:
        res = requests.get(url, headers=headers, params=params, timeout=10)
        print(f"=== {endpoint_name} (GET: {res.status_code}) ===")
        print(json.dumps(res.json(), indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"Lỗi: {e}")

if __name__ == "__main__":
    check_endpoint("InverterDetailInfoNewone")
    check_endpoint("getHybridFlowgraph")