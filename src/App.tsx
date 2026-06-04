import { useState } from "react";
import { COINS_DATA, COIN_DATA_MAP } from "./data";
import CoinGlobe from "./components/CoinGlobe";
import CoinExaminer3D from "./components/CoinExaminer3D";
import CoinDetail from "./components/CoinDetail";

export default function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCoinId, setActiveCoinId] = useState<string | null>(null);

  // Filter coins on search
  const filteredCoins = COINS_DATA.filter(coin => 
    coin.name.includes(searchTerm) || 
    coin.country.includes(searchTerm) ||
    coin.denomination.includes(searchTerm)
  );

  const activeCoin = activeCoinId ? COIN_DATA_MAP[activeCoinId] : null;

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-slate-800 flex flex-col font-sans antialiased overflow-x-hidden select-none">
      
      {/* Primary Immersive Gallery Container (Very high-end, clean, and spacious) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 relative z-10">
        
        {/* Upper interactive zone: 2D Panning Map & Catalogue Index */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main 2D Interactive map workspace */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            <CoinGlobe 
              coins={COINS_DATA} 
              activeCoinId={activeCoinId} 
              onSelectCoin={setActiveCoinId} 
            />
          </div>

          {/* Minimalist Right Sidebar (Museum spec index listing, completely icon-free and clean) */}
          <div className="lg:col-span-1 flex flex-col gap-3.5 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                馆藏通卷目录 (COIN INDEX)
              </span>
              <span className="text-xs text-slate-500">点选硬币快速飞渡定位聚焦：</span>
            </div>

            {/* Specimen search input input layer */}
            <div className="relative">
              <input
                id="search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索名称或地缘主国..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-400 rounded-xl text-slate-800 outline-none transition placeholder-slate-400"
              />
              {searchTerm && (
                <button 
                  id="reset-search"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-2 text-slate-400 hover:text-slate-800 transition cursor-pointer text-xs font-bold"
                >
                  ×
                </button>
              )}
            </div>

            {/* Scrollable listing buttons (Removed arrow icons for minimalist compliance) */}
            <div className="flex-1 min-h-[180px] max-h-[380px] overflow-y-auto space-y-1.5 scrollbar-none">
              {filteredCoins.map((coin) => {
                const isActive = coin.id === activeCoinId;
                return (
                  <button
                    id={`sidebar-item-${coin.id}`}
                    key={coin.id}
                    onClick={() => setActiveCoinId(coin.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden flex items-center justify-between gap-3 ${
                      isActive 
                        ? "bg-slate-800 border-slate-800 text-white shadow-sm" 
                        : "bg-slate-50 hover:bg-slate-100/70 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="text-lg shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/5 shadow-xs">
                        {coin.symbol}
                      </span>
                      <div className="flex flex-col truncate">
                        <span className={`text-xs font-bold font-sans tracking-tight ${isActive ? "text-white" : "text-slate-800"}`}>
                          {coin.name}
                        </span>
                        <span className={`text-[10px] font-sans ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                          {coin.country.split(" (")[0]}
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono tracking-wider opacity-60">
                      {isActive ? "FOCUS" : "VIEW"}
                    </div>
                  </button>
                );
              })}

              {filteredCoins.length === 0 && (
                <div className="text-center py-10 text-xs text-slate-400 font-mono">
                  没有匹配的羊币藏卷
                </div>
              )}
            </div>
            
            {/* Minimal tracker metrics badge */}
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold">
              <span>ACTIVE SPECIMENS</span>
              <span className="text-slate-700">{filteredCoins.length} / {COINS_DATA.length} 枚</span>
            </div>
          </div>
        </div>

        {/* Lower interactive desk: Examiner Canvas Flipping Card & Detail Text Modules */}
        <div className="relative mt-2">
          {activeCoin ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                  钱币微距考学台 / COIN SPECIMEN INSPECTION
                </span>
                <button
                  onClick={() => setActiveCoinId(null)}
                  className="text-xs text-slate-400 hover:text-slate-800 font-bold transition cursor-pointer"
                >
                  [ 退出钱币聚焦 ]
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Close-up interactive CSS 3D Flipping coin Card */}
                <div className="lg:col-span-2">
                  <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest font-mono">
                        二维超清微距鉴赏
                      </h3>
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                        Coin texture flipper
                      </span>
                    </div>
                    
                    <CoinExaminer3D coin={activeCoin} />
                  </div>
                </div>

                {/* Classical tabbed description detail panels & scholar AI Advisor */}
                <div className="lg:col-span-3">
                  <CoinDetail coin={activeCoin} />
                </div>

              </div>
            </div>
          ) : (
            /* Intro placeholder card when no coin is active */
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 rounded-3xl shadow-xs">
              <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 text-xl shadow-xs select-none">
                🐏
              </div>
              <h3 className="text-sm font-bold font-sans text-slate-800 tracking-tight">羊主题全球纪念币学术博览馆</h3>
              <p className="text-xs text-slate-400 max-w-lg mt-2 leading-relaxed font-normal">
                请点击上方交互地图上的硬币标识面标，即可激活专属微距考究展示台。解锁展示包含该钱币的<b>完整名称、详尽历史变迁、铸作直径大小、近代政经背景、学术质量重量、合金工艺材质</b>六大核心要素，并为您精准配对<b>真币高真写真图片</b>进行同屏比对，更有钱币学AI顾问随身为您答疑。
              </p>
              
              {/* Quick interactive shortcut list (Removed icons for compliance) */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-2xl">
                {COINS_DATA.map((coin) => (
                  <button
                    key={coin.id}
                    onClick={() => setActiveCoinId(coin.id)}
                    className="text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-650 border border-slate-200 px-3.5 py-2 rounded-xl cursor-pointer transition active:scale-95 shadow-xs"
                  >
                    <span>{coin.symbol}</span>
                    <span> {coin.name.split("（")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sublimely simple footer copyright notice */}
      <footer className="shrink-0 relative z-10 border-t border-slate-200 bg-white py-6 text-center text-[10px] font-mono text-slate-400 font-medium tracking-wider">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>经典羊年生肖题材及野生羊币全球学术巡展</span>
          <span className="uppercase text-slate-400">interactive numismatic exhibition portfolio</span>
        </div>
      </footer>
    </div>
  );
}
