<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <title>Senergy ESS SE 6K - Clean Monitor</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Orbitron:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #020617;
      color: #f8fafc;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }
    .font-num { font-family: 'Orbitron', monospace; }
    .font-tech { font-family: 'Chakra Petch', sans-serif; }

    /* Keyframes chuyển động chuẩn GPU */
    @keyframes animDown {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: -32; }
    }
    @keyframes animUp {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: 32; }
    }

    .flow-down {
      stroke-dasharray: 8 8 !important;
      animation: animDown 0.65s linear infinite !important;
    }
    .flow-up {
      stroke-dasharray: 8 8 !important;
      animation: animUp 0.65s linear infinite !important;
    }

    .wire-idle {
      stroke: #334155;
      stroke-dasharray: 4 6;
      stroke-width: 2.5;
      opacity: 0.7;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-start p-2 sm:p-4 pb-14">

  <div class="w-full max-w-[430px] flex flex-col gap-3">
    
    <!-- Top Header -->
    <header class="flex items-center justify-between px-1 pt-1">
      <div class="flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/40 rounded-full px-3 py-1 shadow-md shadow-emerald-950/40">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-xs font-semibold text-emerald-300 font-tech uppercase tracking-wider">Self-consumption mode</span>
      </div>

      <div class="flex items-center gap-1.5">
        <button id="btnOpenApi" class="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs font-medium flex items-center gap-1 transition-all active:scale-95">
          <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          API
        </button>
        <button id="btnOpenJson" class="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl px-2.5 py-1.5 text-xs transition-all active:scale-95 shadow-md shadow-emerald-950/40">
          JSON
        </button>
      </div>
    </header>

    <!-- Modal Cấu hình API -->
    <div id="modalApi" class="hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div class="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-3">
        <div class="flex justify-between items-center pb-2 border-b border-slate-800">
          <h3 class="text-sm font-bold text-white uppercase tracking-wider font-tech flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span> Nguồn Dữ Liệu Inverter
          </h3>
          <button id="btnCloseApi" class="text-slate-400 hover:text-white text-lg">✕</button>
        </div>
        
        <div>
          <label class="text-xs text-slate-400 mb-1 block">Chế độ kết nối:</label>
          <select id="apiModeSelect" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500">
            <option value="proxy" selected>Qua Local Proxy Server (/api/live)</option>
            <option value="direct">Trực tiếp SolarViet Cloud (Trình duyệt)</option>
          </select>
        </div>

        <div id="proxyUrlBox">
          <label class="text-xs text-slate-400 mb-1 block">Proxy URL:</label>
          <input type="text" id="proxyEndpoint" value="/api/live" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500 font-mono">
        </div>

        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-400">Chu kỳ getHybrid:</span>
          <span class="font-num text-emerald-400 font-bold">3.0 giây</span>
        </div>

        <div class="flex gap-2 mt-2">
          <button id="btnDemoLoad" class="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 py-2 rounded-xl text-xs font-semibold">Nạp Mẫu Gốc</button>
          <button id="btnConnectApi" class="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/50">Kích Hoạt 3s</button>
        </div>
        <p id="apiLog" class="text-[11px] text-slate-400 italic">Đang chạy polling mỗi 3s.</p>
      </div>
    </div>

    <!-- Modal JSON Debug -->
    <div id="modalJson" class="hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div class="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-3 max-h-[85vh]">
        <div class="flex justify-between items-center pb-2 border-b border-slate-800">
          <h3 class="text-sm font-bold text-emerald-400 font-tech uppercase tracking-wider">Merged Telemetry JSON</h3>
          <button id="btnCloseJson" class="text-slate-400 hover:text-white text-lg">✕</button>
        </div>
        <pre id="jsonViewer" class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10.5px] font-mono text-emerald-300 overflow-y-auto max-h-96 leading-relaxed select-all"></pre>
        <button id="btnCopyJson" class="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 rounded-xl border border-slate-700 font-medium">Sao chép JSON</button>
      </div>
    </div>

    <!-- 1. SƠ ĐỒ NĂNG LƯỢNG LIVE FLOW -->
    <div class="w-full bg-slate-900/90 border border-slate-800/80 rounded-3xl p-3 shadow-2xl relative overflow-hidden backdrop-blur-md">
      <svg id="topoCanvas" viewBox="0 0 380 500" class="w-full h-auto drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          <linearGradient id="gradSenergy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#064e3b" stop-opacity="0.85" />
            <stop offset="100%" stop-color="#022c22" stop-opacity="0.95" />
          </linearGradient>
          <linearGradient id="gradEboxDischarge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#075985" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#082f49" stop-opacity="0.9" />
          </linearGradient>
          <linearGradient id="gradEboxCharge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#065f46" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#022c22" stop-opacity="0.9" />
          </linearGradient>
          <linearGradient id="gradLoadAmber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#78350f" stop-opacity="0.55" />
            <stop offset="100%" stop-color="#451a03" stop-opacity="0.85" />
          </linearGradient>
          <linearGradient id="gradSolar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#713f12" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0.7" />
          </linearGradient>
          <linearGradient id="gradEVN" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#581c87" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0.8" />
          </linearGradient>
        </defs>

        <!-- ==================== CÁC TUYẾN DÂY NỀN ==================== -->
        <!-- 1. PV Solar -> Senergy -->
        <path id="wirePV" d="M 75 95 C 75 140, 150 135, 165 160" class="wire-idle" fill="none" />
        <path id="wirePVFlow" d="M 75 95 C 75 140, 150 135, 165 160" class="flow-down" fill="none" stroke="#facc15" stroke-width="4" stroke-linecap="round" style="display: none;" />

        <!-- 2. EVN <-> Senergy -->
        <path id="wireEVN" d="M 305 95 C 305 140, 230 135, 215 160" class="wire-idle" fill="none" />
        <path id="wireEVNFlow" d="M 305 95 C 305 140, 230 135, 215 160" class="flow-down" fill="none" stroke="#c084fc" stroke-width="4" stroke-linecap="round" style="display: none;" />

        <!-- 3. Pin Ebox -> Senergy -->
        <path id="wireEbox" d="M 70 345 C 70 285, 150 280, 165 250" class="wire-idle" fill="none" />
        <path id="wireEboxFlow" d="M 70 345 C 70 285, 150 280, 165 250" class="flow-down" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" filter="url(#glowBlue)" style="display: inline;" />

        <!-- 4. Senergy -> Dự phòng -->
        <path id="wireGen" d="M 215 250 C 230 280, 310 285, 310 345" class="wire-idle" fill="none" />
        <path id="wireGenFlow" d="M 215 250 C 230 280, 310 285, 310 345" class="flow-down" fill="none" stroke="#94a3b8" stroke-width="3" style="display: none;" />

        <!-- ==================== CÁC KHỐI THIẾT BỊ ==================== -->
        <!-- Tầng 1: PV Solar & EVN -->
        <g transform="translate(29, 15)">
          <rect id="svgPvCard" width="92" height="80" rx="16" fill="url(#gradSolar)" stroke="#ca8a04" stroke-width="1.5" stroke-opacity="0.6" />
          <g id="svgPvIcon" transform="translate(34, 10)">
            <rect x="2" y="2" width="20" height="15" rx="2" fill="none" stroke="#facc15" stroke-width="1.5"/>
            <line x1="12" y1="2" x2="12" y2="17" stroke="#facc15" stroke-width="1.2"/>
            <line x1="2" y1="9.5" x2="22" y2="9.5" stroke="#facc15" stroke-width="1.2"/>
            <line x1="12" y1="17" x2="12" y2="23" stroke="#facc15" stroke-width="1.5"/>
            <line x1="7" y1="23" x2="17" y2="23" stroke="#facc15" stroke-width="1.5"/>
          </g>
          <text id="svgPvTitle" x="46" y="48" fill="#facc15" font-size="11" font-weight="700" text-anchor="middle" font-family="'Chakra Petch', sans-serif">PV Solar</text>
          <text id="svgPvKw" x="46" y="62" fill="#fef08a" font-size="11" font-weight="700" text-anchor="middle" font-family="'Orbitron', monospace">0.003 kW</text>
          <text id="svgPvW" x="46" y="73" fill="#ca8a04" font-size="9" text-anchor="middle" font-family="'Orbitron', monospace">3 W</text>
        </g>

        <g transform="translate(259, 15)">
          <rect id="svgEvnCard" width="92" height="80" rx="16" fill="url(#gradEVN)" stroke="#9333ea" stroke-width="1.5" stroke-opacity="0.6" />
          <g id="svgEvnIcon" transform="translate(35, 10)">
            <path d="M11 2 L4 21 L18 21 Z" fill="none" stroke="#c084fc" stroke-width="1.5" stroke-linejoin="round"/>
            <line x1="1" y1="8" x2="21" y2="8" stroke="#c084fc" stroke-width="1.4"/>
            <line x1="3" y1="14" x2="19" y2="14" stroke="#c084fc" stroke-width="1.4"/>
            <line x1="7" y1="21" x2="4" y2="24" stroke="#c084fc" stroke-width="1.5"/>
            <line x1="15" y1="21" x2="18" y2="24" stroke="#c084fc" stroke-width="1.5"/>
          </g>
          <text id="svgEvnTitle" x="46" y="48" fill="#c084fc" font-size="11" font-weight="700" text-anchor="middle" font-family="'Chakra Petch', sans-serif">EVN</text>
          <text id="svgGridKw" x="46" y="62" fill="#f3e8ff" font-size="11" font-weight="700" text-anchor="middle" font-family="'Orbitron', monospace">0.000 kW</text>
          <text id="svgGridW" x="46" y="73" fill="#a855f7" font-size="9" text-anchor="middle" font-family="'Orbitron', monospace">0 W</text>
        </g>

        <!-- Tầng 2: Senergy -->
        <g transform="translate(135, 158)">
          <rect x="-4" y="-4" width="118" height="100" rx="26" fill="none" stroke="#10b981" stroke-width="1.5" stroke-opacity="0.3" />
          <rect width="110" height="92" rx="22" fill="url(#gradSenergy)" stroke="#10b981" stroke-width="2.2" />

          <g transform="translate(43, 10)">
            <rect x="0" y="0" width="24" height="22" rx="6" fill="#042f2e" stroke="#34d399" stroke-width="2" />
            <path d="M12 4 L12 18" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" />
            <circle cx="12" cy="11" r="2.5" fill="#a7f3d0" />
          </g>

          <text x="55" y="47" fill="#34d399" font-size="13" font-weight="800" text-anchor="middle" font-family="'Orbitron', monospace" letter-spacing="1">SENERGY</text>
          <text id="svgVolt" x="55" y="65" fill="#6ee7b7" font-size="13" font-weight="800" text-anchor="middle" font-family="'Orbitron', monospace">52.9 V</text>
          <text id="svgModel" x="55" y="79" fill="#10b981" font-size="9.5" font-weight="600" text-anchor="middle" font-family="'Chakra Petch', sans-serif">SE 6K Green</text>
        </g>

        <!-- Tầng 3: Pin Ebox -->
        <g transform="translate(22, 345)">
          <rect id="svgEboxCard" width="96" height="102" rx="20" fill="url(#gradEboxDischarge)" stroke="#0ea5e9" stroke-width="2" filter="url(#glowBlue)" />
          <g transform="translate(24, -11)">
            <rect id="svgSocBadge" width="48" height="20" rx="10" fill="#0284c7" stroke="#0369a1" stroke-width="1.5" />
            <text id="svgSoc" x="24" y="14" fill="#f0f9ff" font-size="11" font-weight="900" text-anchor="middle" font-family="'Orbitron', monospace">38%</text>
          </g>
          <g transform="translate(36, 15)">
            <rect id="svgEboxIconBody" x="1" y="2" width="22" height="14" rx="3" fill="none" stroke="#38bdf8" stroke-width="1.8"/>
            <path id="svgEboxIconCap" d="M23 6 L25 6 L25 12 L23 12 Z" fill="#38bdf8"/>
            <path id="svgEboxIconBolt" d="M12 4 L9 9 L13 9 L11 14" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </g>
          <text id="svgEboxTitle" x="48" y="47" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle" font-family="'Chakra Petch', sans-serif">Pin Ebox</text>
          <text id="svgPbatKw" x="48" y="65" fill="#e0f2fe" font-size="12" font-weight="800" text-anchor="middle" font-family="'Orbitron', monospace">0.224 kW</text>
          <rect id="svgEboxStatusPill" x="10" y="74" width="76" height="18" rx="6" fill="#0c4a6e" fill-opacity="0.8" />
          <text id="svgPbatW" x="48" y="87" fill="#7dd3fc" font-size="9" font-weight="700" text-anchor="middle" font-family="'Chakra Petch', sans-serif">Đang xả 224 W</text>
        </g>

        <!-- Tầng 3: Tải nhà -->
        <g transform="translate(141, 345)">
          <rect width="98" height="102" rx="20" fill="url(#gradLoadAmber)" stroke="#f59e0b" stroke-width="2.2" />
          <g transform="translate(27, -11)">
            <rect width="44" height="20" rx="10" fill="#f59e0b" stroke="#92400e" stroke-width="1.5" />
            <text x="22" y="14" fill="#451a03" font-size="10" font-weight="900" text-anchor="middle" font-family="'Orbitron', monospace">LIVE</text>
          </g>
          <g transform="translate(37, 14)">
            <path d="M2 11 L12 2 L22 11" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5 9 L5 21 L19 21 L19 9" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <rect x="9" y="13" width="6" height="8" rx="1" fill="#fbbf24" />
          </g>
          <text x="49" y="47" fill="#fbbf24" font-size="12" font-weight="700" text-anchor="middle" font-family="'Chakra Petch', sans-serif">Tải nhà</text>
          <text id="svgLoadKw" x="49" y="65" fill="#fef3c7" font-size="12" font-weight="800" text-anchor="middle" font-family="'Orbitron', monospace">0.224 kW</text>
          <rect x="14" y="74" width="70" height="18" rx="6" fill="#78350f" fill-opacity="0.8" />
          <text id="svgLoadW" x="49" y="87" fill="#fde68a" font-size="10" font-weight="700" text-anchor="middle" font-family="'Orbitron', monospace">224 W</text>
        </g>

        <!-- Tầng 3: Dự phòng -->
        <g transform="translate(264, 348)">
          <rect width="92" height="96" rx="18" fill="#0f172a" stroke="#475569" stroke-width="1.5" />
          <g transform="translate(34, 12)">
            <rect x="2" y="2" width="20" height="18" rx="4" fill="none" stroke="#94a3b8" stroke-width="1.6" />
            <circle cx="12" cy="11" r="4.5" fill="none" stroke="#94a3b8" stroke-width="1.5" />
            <line x1="2" y1="7" x2="22" y2="7" stroke="#94a3b8" stroke-width="1.2" />
          </g>
          <text x="46" y="47" fill="#94a3b8" font-size="11" font-weight="600" text-anchor="middle" font-family="'Chakra Petch', sans-serif">Dự phòng</text>
          <text id="svgGenKw" x="46" y="65" fill="#cbd5e1" font-size="11" font-weight="700" text-anchor="middle" font-family="'Orbitron', monospace">0.000 kW</text>
          <text id="svgGenV" x="46" y="79" fill="#64748b" font-size="9" text-anchor="middle" font-family="'Orbitron', monospace">0.0 V</text>
        </g>

        <!-- ==================== LỚP TRÊN CÙNG: DÂY DẪN TỪ SENERGY XUỐNG TẢI NHÀ ==================== -->
        <!-- Dây tĩnh nét đứt -->
        <path d="M 190 256 L 190 334" class="wire-idle" fill="none" />
        
        <!-- Tia hạt vàng sáng rực rỡ, không dùng filter để tránh bị trình duyệt cắt bỏ -->
        <path id="wireLoadFlow" d="M 190 256 L 190 334" class="flow-down" fill="none" stroke="#f59e0b" stroke-width="4.5" stroke-linecap="round" style="display: inline;" />

        <!-- Chú thích đáy -->
        <g transform="translate(20, 480)">
          <circle id="svgStatusDot" cx="8" cy="7" r="4" fill="#38bdf8" />
          <text id="svgStatusSummary" x="20" y="11" fill="#cbd5e1" font-size="11" font-weight="600" font-family="'Inter', sans-serif">Pin Ebox xả 224 W qua Senergy cấp Tải nhà (224 W)</text>
        </g>
      </svg>
    </div>

    <!-- 2. THÔNG SỐ KỸ THUẬT BMS PIN EBOX -->
    <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-sm">
      <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
        <div class="flex items-center gap-2">
          <span class="text-xs">🔋</span>
          <span class="text-xs font-bold text-white uppercase font-tech tracking-wider">Thông số Kỹ Thuật BMS Ebox</span>
        </div>
        <span class="text-[10px] text-sky-400 font-mono bg-sky-950/70 border border-sky-800/50 px-2 py-0.5 rounded">PYLON Protocol</span>
      </div>

      <div class="grid grid-cols-4 gap-2 text-center pt-1">
        <div class="bg-slate-950/60 rounded-xl p-2 border border-slate-800/60">
          <div class="text-[9.5px] text-slate-400 font-tech">Sức khỏe (SOH)</div>
          <div class="text-xs font-bold text-emerald-400 font-num mt-1" id="valSoh">100%</div>
        </div>
        <div class="bg-slate-950/60 rounded-xl p-2 border border-slate-800/60">
          <div class="text-[9.5px] text-slate-400 font-tech">Nhiệt độ Cell</div>
          <div class="text-xs font-bold text-sky-300 font-num mt-1" id="valBmsTemp">30°C</div>
        </div>
        <div class="bg-slate-950/60 rounded-xl p-2 border border-slate-800/60">
          <div class="text-[9.5px] text-slate-400 font-tech">Dung lượng</div>
          <div class="text-xs font-bold text-slate-200 font-num mt-1" id="valCapacity">294 Ah</div>
        </div>
        <div class="bg-slate-950/60 rounded-xl p-2 border border-slate-800/60">
          <div class="text-[9.5px] text-slate-400 font-tech">Dòng điện</div>
          <div class="text-xs font-bold text-amber-300 font-num mt-1" id="valCur">4.54 A</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/60 text-xs font-tech">
        <div class="flex justify-between items-center bg-slate-950/40 px-2.5 py-1.5 rounded-lg">
          <span class="text-slate-400">Pin đã nạp hôm nay:</span>
          <span class="font-num font-bold text-emerald-400" id="valBatChrg">6.30 kWh</span>
        </div>
        <div class="flex justify-between items-center bg-slate-950/40 px-2.5 py-1.5 rounded-lg">
          <span class="text-slate-400">Pin đã xả hôm nay:</span>
          <span class="font-num font-bold text-sky-400" id="valBatDischrg">11.81 kWh</span>
        </div>
      </div>
    </div>

    <!-- 3. CÂN ĐỐI NĂNG LƯỢNG (HÔM NAY / TỔNG LŨY KẾ) -->
    <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-sm">
      <div class="text-xs font-bold text-white uppercase font-tech tracking-wider mb-2.5 flex items-center justify-between">
        <span>Cân đối năng lượng</span>
        <span class="text-[10px] text-slate-400 font-normal">Hôm nay / Tổng lũy kế</span>
      </div>

      <div class="divide-y divide-slate-800/80 text-xs font-tech">
        <div class="py-2 flex justify-between items-center">
          <span class="text-slate-400 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span> Mặt trời sinh ra (PV)
          </span>
          <div class="text-right">
            <span class="font-num font-bold text-yellow-300" id="valEToday">12.71</span> <span class="text-[10px] text-slate-500">kWh</span>
            <span class="text-slate-600 mx-1">|</span>
            <span class="font-mono text-slate-400" id="valETotal">947.4 kWh</span>
          </div>
        </div>

        <div class="py-2 flex justify-between items-center">
          <span class="text-slate-400 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Phụ tải tiêu thụ
          </span>
          <div class="text-right">
            <span class="font-num font-bold text-amber-300" id="valELDay">18.10</span> <span class="text-[10px] text-slate-500">kWh</span>
            <span class="text-slate-600 mx-1">|</span>
            <span class="font-mono text-slate-400" id="valELTotal">1,888.3 kWh</span>
          </div>
        </div>

        <div class="py-2 flex justify-between items-center">
          <span class="text-slate-400 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Mua lưới EVN
          </span>
          <div class="text-right">
            <span class="font-num font-bold text-purple-300" id="valETDay">0.19</span> <span class="text-[10px] text-slate-500">kWh</span>
            <span class="text-slate-600 mx-1">|</span>
            <span class="font-mono text-slate-400" id="valETTotal">2.99 kWh</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. PHẦN CỨNG & HỆ THỐNG -->
    <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 text-xs flex flex-col gap-2 font-tech">
      <div class="flex justify-between items-center text-slate-400">
        <span>Điện áp AC / Tần số lưới:</span>
        <span class="font-mono text-slate-200" id="valGridAc">233.7 V / 50.11 Hz</span>
      </div>
      <div class="flex justify-between items-center text-slate-400">
        <span>Nhiệt độ Inverter (Tntc):</span>
        <span class="font-mono text-emerald-400" id="valTntc">37°C</span>
      </div>
      <div class="flex justify-between items-center text-slate-400">
        <span>Tín hiệu Wi-Fi:</span>
        <span class="font-mono text-sky-400" id="valWifi">62% (Rất tốt)</span>
      </div>
      <div class="flex justify-between items-center text-slate-400 pt-1.5 border-t border-slate-800/80">
        <span class="text-[11px] text-slate-500" id="valGoodsId">SN: 2547-38802597PH</span>
        <span class="text-emerald-400 font-semibold" id="lastSyncTime">--:--:--</span>
      </div>
    </div>

  </div>

  <script>
    let telemetryData = {
      "data": { "Pac": [3], "Vac": [0], "Iac": [0], "Fac": [0], "Pdc": [0.002864], "Vdc": [35.8], "Idc": [0.08] },
      "type": "4",
      "GoodsID": "2547-38802597PH",
      "GoodsName": "SE 6K Green 2547-38802597PH",
      "modelName": "SE 6K Green",
      "Operatingmode": 3,
      "Tntc": "37",
      "Peackpower": "4256.4",
      "TotalDCpower": 3,
      "EToday": "12.71",
      "ETotal": "947.43",
      "gridVac": ["233.70"],
      "gridFac": "50.11",
      "gridCurrpac": ["0.00"],
      "ETDay": "0.19",
      "ETTotal": "2.99",
      "loadVac": ["233.70"],
      "loadFac": "50.11",
      "loadCurrpac": ["224.00"],
      "ELDay": "18.10",
      "ELTotal": "1888.31",
      "capacity": "294",
      "volt": "52.90",
      "cur": "4.54",
      "fromPbat": "224",
      "toPbat": "0",
      "SOC": "38",
      "SOH": "100",
      "BMS_temp": "30",
      "batChrg": "6.3",
      "batDischrg": "11.81",
      "genVac": ["0.00"],
      "genCurrpac": ["0.00"],
      "WifiStrength": 62,
      "display": "000_100000_1_02"
    };

    const CLOUD_CONFIG = {
      token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtb25pdG9yaW5nLnNvbGFydmlldC52biIsImF1ZCI6Im1vbml0b3Jpbmcuc29sYXJ2aWV0LnZuIiwiaWF0IjoxNzkwNTE2NzU1LCJuYmYiOjE3OTA1MTY3NTUsImV4cCI6MTgyMTYyMDc1NSwiZGF0YSI6eyJNZW1iZXJBdXRvSUQiOm51bGx9fQ.Yai1vc4LuH92Idb9OhBETv0DsIzLvVg1OmhskX8I99s",
      payload: {
        sign: "EOjgep7+pHePUq8rziMbid6pUqfXmvVNsg7EIJ0GQFHheLG2xJyf1SU1fYC1hLhjDRcy3ZbbUjYts3DFyCcl3rlY2V4CdpIkMaj105gxTC0=",
        GoodsID: "2547-38802597PH",
        MemberAutoID: "1042037"
      }
    };

    let flowTimer = null;
    let detailTimer = null;

    function safeNum(val) {
      if (Array.isArray(val)) return parseFloat(val[0]) || 0;
      return parseFloat(val) || 0;
    }

    // 1. HÀM CHUYÊN TRÁCH PIN EBOX
    function applyEboxTheme(isDischarging, isIdle) {
      const card = document.getElementById('svgEboxCard');
      const badge = document.getElementById('svgSocBadge');
      const title = document.getElementById('svgEboxTitle');
      const iconBody = document.getElementById('svgEboxIconBody');
      const iconCap = document.getElementById('svgEboxIconCap');
      const iconBolt = document.getElementById('svgEboxIconBolt');
      const pill = document.getElementById('svgEboxStatusPill');
      const pbatW = document.getElementById('svgPbatW');
      const flow = document.getElementById('wireEboxFlow');
      const statusDot = document.getElementById('svgStatusDot');

      if (isIdle) {
        card.setAttribute('fill', '#0f172a');
        card.setAttribute('stroke', '#475569');
        badge.setAttribute('fill', '#334155');
        title.setAttribute('fill', '#94a3b8');
        iconBody.setAttribute('stroke', '#94a3b8');
        iconCap.setAttribute('fill', '#94a3b8');
        iconBolt.setAttribute('stroke', '#94a3b8');
        pill.setAttribute('fill', '#1e293b');
        pbatW.setAttribute('fill', '#94a3b8');
        flow.style.display = 'none';
        return;
      }

      flow.style.display = 'inline';

      if (isDischarging) {
        card.setAttribute('fill', 'url(#gradEboxDischarge)');
        card.setAttribute('stroke', '#0ea5e9');
        card.setAttribute('filter', 'url(#glowBlue)');
        badge.setAttribute('fill', '#0284c7');
        badge.setAttribute('stroke', '#0369a1');
        title.setAttribute('fill', '#38bdf8');
        iconBody.setAttribute('stroke', '#38bdf8');
        iconCap.setAttribute('fill', '#38bdf8');
        iconBolt.setAttribute('stroke', '#38bdf8');
        pill.setAttribute('fill', '#0c4a6e');
        pbatW.setAttribute('fill', '#7dd3fc');

        // Đang xả: Hạt chạy ngược từ Pin Ebox LÊN Senergy
        flow.className.baseVal = "flow-down";
        flow.setAttribute('stroke', '#38bdf8');
        statusDot.setAttribute('fill', '#38bdf8');
      } else {
        card.setAttribute('fill', 'url(#gradEboxCharge)');
        card.setAttribute('stroke', '#10b981');
        card.removeAttribute('filter');
        badge.setAttribute('fill', '#059669');
        badge.setAttribute('stroke', '#047857');
        title.setAttribute('fill', '#34d399');
        iconBody.setAttribute('stroke', '#34d399');
        iconCap.setAttribute('fill', '#34d399');
        iconBolt.setAttribute('stroke', '#34d399');
        pill.setAttribute('fill', '#064e3b');
        pbatW.setAttribute('fill', '#a7f3d0');

        // Đang sạc: Hạt đổ từ Senergy XUỐNG Pin
        flow.className.baseVal = "flow-up";
        flow.setAttribute('stroke', '#10b981');
        statusDot.setAttribute('fill', '#10b981');
      }
    }

    // 2. HÀM CHUYÊN TRÁCH EVN (2 CHIỀU)
    function applyEvnTheme(gridPower, isIdle) {
      const card = document.getElementById('svgEvnCard');
      const title = document.getElementById('svgEvnTitle');
      const icon = document.getElementById('svgEvnIcon');
      const flow = document.getElementById('wireEVNFlow');

      if (isIdle) {
        if (card) {
          card.setAttribute('fill', '#0f172a');
          card.setAttribute('stroke', '#475569');
          card.removeAttribute('filter');
        }
        if (title) title.setAttribute('fill', '#94a3b8');
        if (icon) {
          icon.querySelectorAll('line, path').forEach(el => el.setAttribute('stroke', '#94a3b8'));
        }
        if (flow) {
          flow.style.display = 'none';
          flow.className.baseVal = '';
        }
        return;
      }

      if (flow) flow.style.display = 'inline';

      if (gridPower < -5) {
        // Đẩy lưới / Bán điện: Senergy -> Cột điện EVN
        if (card) {
          card.setAttribute('fill', 'url(#gradEVN)');
          card.setAttribute('stroke', '#06b6d4');
          card.setAttribute('filter', 'url(#glowBlue)');
        }
        if (title) title.setAttribute('fill', '#22d3ee');
        if (icon) {
          icon.querySelectorAll('line, path').forEach(el => el.setAttribute('stroke', '#22d3ee'));
        }
        if (flow) {
          flow.className.baseVal = "flow-up"; // Phóng lên cột điện
          flow.setAttribute('stroke', '#22d3ee');
        }
      } else {
        // Mua lưới: Cột điện EVN -> Senergy
        if (card) {
          card.setAttribute('fill', 'url(#gradEVN)');
          card.setAttribute('stroke', '#9333ea');
          card.removeAttribute('filter');
        }
        if (title) title.setAttribute('fill', '#c084fc');
        if (icon) {
          icon.querySelectorAll('line, path').forEach(el => el.setAttribute('stroke', '#c084fc'));
        }
        if (flow) {
          flow.className.baseVal = "flow-down"; // Chảy xuôi xuống Senergy
          flow.setAttribute('stroke', '#c084fc');
        }
      }
    }

    function updateDashboard(data) {
      const displayStr = data.display || "";
      const flowMask = displayStr.includes('_') ? displayStr.split('_')[1] : "100000";
      const bitBattery = flowMask[0] === '1';
      const bitSolar   = flowMask[1] === '1';
      const bitGridIn  = flowMask[2] === '1';
      const bitGridOut = flowMask[3] === '1';

      const pPV = safeNum(data.TotalDCpower) || (data.data && safeNum(data.data.Pac)) || 0;
      const pGrid = safeNum(data.gridCurrpac);
      const pLoad = safeNum(data.loadCurrpac);
      
      const fromPbat = safeNum(data.fromPbat);
      const toPbat = safeNum(data.toPbat);
      let pBat = 0;
      if (fromPbat > 0) pBat = fromPbat;
      else if (toPbat > 0) pBat = -toPbat;
      else pBat = safeNum(data.Pbat);

      const pGen = safeNum(data.genCurrpac);
      const vGen = safeNum(data.genVac);
      const soc = Math.min(Math.max(safeNum(data.SOC) || 0, 0), 100);
      const volt = safeNum(data.volt) || 52.9;
      const cur = safeNum(data.cur) || 4.54;

      // Sơ đồ Live
      document.getElementById('svgPvKw').textContent = `${(pPV / 1000).toFixed(3)} kW`;
      document.getElementById('svgPvW').textContent = `${pPV.toFixed(0)} W`;
      document.getElementById('svgGridKw').textContent = `${(Math.abs(pGrid) / 1000).toFixed(3)} kW`;
      document.getElementById('svgGridW').textContent = `${Math.abs(pGrid).toFixed(0)} W`;

      document.getElementById('svgVolt').textContent = `${volt.toFixed(1)} V`;
      if (data.modelName) document.getElementById('svgModel').textContent = data.modelName;

      document.getElementById('svgSoc').textContent = `${soc}%`;
      document.getElementById('svgPbatKw').textContent = `${(Math.abs(pBat) / 1000).toFixed(3)} kW`;
      document.getElementById('svgPbatW').textContent = pBat >= 0 ? `Đang xả ${pBat.toFixed(0)} W` : `Đang sạc ${Math.abs(pBat).toFixed(0)} W`;

      document.getElementById('svgLoadKw').textContent = `${(pLoad / 1000).toFixed(3)} kW`;
      document.getElementById('svgLoadW').textContent = `${pLoad.toFixed(0)} W`;

      document.getElementById('svgGenKw').textContent = `${(pGen / 1000).toFixed(3)} kW`;
      document.getElementById('svgGenV').textContent = `${vGen.toFixed(1)} V`;

      // 1. Dòng Pin Ebox
      const isIdle = Math.abs(pBat) < 5 && !bitBattery;
      const isDischarging = pBat >= 0;
      applyEboxTheme(isDischarging, isIdle);

      // 2. Dòng EVN
      const isEvnIdle = Math.abs(pGrid) <= 5 && !bitGridIn && !bitGridOut;
      applyEvnTheme(pGrid, isEvnIdle);

      // 3. Dòng Tải nhà (Senergy -> Tải nhà)
      const wireLoadFlow = document.getElementById('wireLoadFlow');
      if (wireLoadFlow) {
        if (pLoad > 5 || Math.abs(pBat) > 10) {
          wireLoadFlow.style.display = 'inline';
        } else {
          wireLoadFlow.style.display = 'none';
        }
      }

      // 4. Dòng PV Solar
      const wirePVFlow = document.getElementById('wirePVFlow');
      if (wirePVFlow) {
        if (pPV > 15 || bitSolar) {
          wirePVFlow.style.display = 'inline';
        } else {
          wirePVFlow.style.display = 'none';
        }
      }

      // BMS Telemetry
      if (data.SOH) document.getElementById('valSoh').textContent = `${data.SOH}%`;
      if (data.BMS_temp) document.getElementById('valBmsTemp').textContent = `${data.BMS_temp}°C`;
      if (data.capacity) document.getElementById('valCapacity').textContent = `${data.capacity} Ah`;
      document.getElementById('valCur').textContent = `${cur.toFixed(2)} A`;
      if (data.batChrg) document.getElementById('valBatChrg').textContent = `${parseFloat(data.batChrg).toFixed(2)} kWh`;
      if (data.batDischrg) document.getElementById('valBatDischrg').textContent = `${parseFloat(data.batDischrg).toFixed(2)} kWh`;

      // Cân đối năng lượng
      if (data.EToday) document.getElementById('valEToday').textContent = data.EToday;
      if (data.ETotal) document.getElementById('valETotal').textContent = `${parseFloat(data.ETotal).toFixed(1)} kWh`;
      if (data.ELDay) document.getElementById('valELDay').textContent = data.ELDay;
      if (data.ELTotal) document.getElementById('valELTotal').textContent = `${parseFloat(data.ELTotal).toLocaleString()} kWh`;
      if (data.ETDay) document.getElementById('valETDay').textContent = data.ETDay;
      if (data.ETTotal) document.getElementById('valETTotal').textContent = `${parseFloat(data.ETTotal).toFixed(2)} kWh`;

      // Phần cứng
      const gridV = safeNum(data.gridVac);
      const gridF = data.gridFac || '50.0';
      document.getElementById('valGridAc').textContent = `${gridV.toFixed(1)} V / ${gridF} Hz`;
      if (data.Tntc) document.getElementById('valTntc').textContent = `${data.Tntc}°C`;
      if (data.WifiStrength) document.getElementById('valWifi').textContent = `${data.WifiStrength}% (Rất tốt)`;
      if (data.GoodsID) document.getElementById('valGoodsId').textContent = `SN: ${data.GoodsID}`;

      // Chú thích đáy
      if (pBat >= 5) {
        document.getElementById('svgStatusSummary').textContent = `Pin Ebox xả ${Math.abs(pBat).toFixed(0)} W qua Senergy cấp Tải nhà (${pLoad.toFixed(0)} W)`;
      } else if (pBat <= -5) {
        document.getElementById('svgStatusSummary').textContent = `Năng lượng đang nạp vào Pin Ebox (${Math.abs(pBat).toFixed(0)} W)`;
      } else {
        document.getElementById('svgStatusSummary').textContent = `Hệ thống ổn định. Phụ tải tiêu thụ: ${pLoad.toFixed(0)} W`;
      }

      const now = new Date();
      document.getElementById('lastSyncTime').textContent = now.toLocaleTimeString();
      document.getElementById('jsonViewer').textContent = JSON.stringify(data, null, 2);
    }

    async function fetchFromSolarVietCloud(endpointName) {
      const url = `https://monitoring.solarviet.vn/dist/server/api/CodeIgniter/index.php/Senergytec/web/v2/Inverterapi/${endpointName}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'accept': 'application/json, text/plain, */*',
          'authorization': CLOUD_CONFIG.token,
          'content-type': 'application/json'
        },
        body: JSON.stringify(CLOUD_CONFIG.payload)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    }

    async function pollFlowData() {
      const mode = document.getElementById('apiModeSelect').value;
      try {
        if (mode === 'proxy') {
          const proxyUrl = document.getElementById('proxyEndpoint').value.trim();
          const res = await fetch(proxyUrl);
          if (!res.ok) throw new Error(`Proxy HTTP ${res.status}`);
          const merged = await res.json();
          telemetryData = merged;
          updateDashboard(merged);
        } else {
          const flowRes = await fetchFromSolarVietCloud('getHybridFlowgraph');
          telemetryData = { ...telemetryData, ...flowRes };
          updateDashboard(telemetryData);
        }
        document.getElementById('apiLog').textContent = `Flow sync: ${new Date().toLocaleTimeString()}`;
      } catch (err) {
        document.getElementById('apiLog').textContent = `Lỗi 3s: ${err.message}`;
      }
    }

    async function pollDetailData() {
      const mode = document.getElementById('apiModeSelect').value;
      if (mode !== 'proxy') {
        try {
          const detailRes = await fetchFromSolarVietCloud('InverterDetailInfoNewone');
          telemetryData = { ...telemetryData, ...detailRes };
          updateDashboard(telemetryData);
        } catch (e) {}
      }
    }

    function startAutoPolling() {
      if (flowTimer) clearInterval(flowTimer);
      if (detailTimer) clearInterval(detailTimer);

      pollFlowData();
      pollDetailData();

      flowTimer = setInterval(pollFlowData, 3000);
      detailTimer = setInterval(pollDetailData, 15000);
    }

    const modalApi = document.getElementById('modalApi');
    const modalJson = document.getElementById('modalJson');
    const apiModeSelect = document.getElementById('apiModeSelect');
    const proxyUrlBox = document.getElementById('proxyUrlBox');

    apiModeSelect.onchange = () => {
      if (apiModeSelect.value === 'proxy') proxyUrlBox.classList.remove('hidden');
      else proxyUrlBox.classList.add('hidden');
    };

    document.getElementById('btnOpenApi').onclick = () => modalApi.classList.remove('hidden');
    document.getElementById('btnCloseApi').onclick = () => modalApi.classList.add('hidden');
    document.getElementById('btnOpenJson').onclick = () => modalJson.classList.remove('hidden');
    document.getElementById('btnCloseJson').onclick = () => modalJson.classList.add('hidden');

    document.getElementById('btnCopyJson').onclick = () => {
      navigator.clipboard.writeText(JSON.stringify(telemetryData, null, 2));
      alert('Đã sao chép gói JSON!');
    };

    document.getElementById('btnDemoLoad').onclick = () => {
      updateDashboard(telemetryData);
      modalApi.classList.add('hidden');
    };

    document.getElementById('btnConnectApi').onclick = () => {
      startAutoPolling();
      modalApi.classList.add('hidden');
    };

    updateDashboard(telemetryData);
    startAutoPolling();
  </script>
</body>
</html>
