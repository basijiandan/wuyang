import { useState } from "react";
import { COINS_DATA, COIN_DATA_MAP } from "./data";
import CoinGlobe from "./components/CoinGlobe";
import CoinExaminer3D from "./components/CoinExaminer3D";
import CoinDetail from "./components/CoinDetail";
import { X } from "lucide-react";

export default function App() {
  const [activeCoinId, setActiveCoinId] = useState<string | null>(null);

  const activeCoin = activeCoinId ? COIN_DATA_MAP[activeCoinId] : null;

  return (
    <div className="w-screen h-screen bg-black text-slate-100 flex flex-col font-sans antialiased select-none overflow-hidden">
      
      {/* Map area - full screen */}
      <div className="flex-1 w-full overflow-hidden">
        <CoinGlobe 
          coins={COINS_DATA} 
          activeCoinId={activeCoinId} 
          onSelectCoin={setActiveCoinId} 
        />
      </div>
      
      {/* Detail panel - floating card at bottom-right */}
      {activeCoin && (
        <div className="fixed bottom-6 right-6 w-96 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-slate-700/50 rounded-lg shadow-2xl p-5 max-h-96 overflow-y-auto z-40">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-base font-bold text-slate-100">{activeCoin.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{activeCoin.country}</p>
            </div>
            <button
              onClick={() => setActiveCoinId(null)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition text-slate-400 hover:text-slate-100 shrink-0 ml-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Coin Image - smaller */}
            <div className="border border-slate-700/50 rounded-lg p-2 h-32 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a1a1a]/30 to-transparent">
              <img 
                src={activeCoin.image} 
                alt={activeCoin.name}
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Details Grid - compact */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[8px] font-mono uppercase text-slate-500">年份</span>
                <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{activeCoin.year}</p>
              </div>
              <div>
                <span className="text-[8px] font-mono uppercase text-slate-500">面值</span>
                <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{activeCoin.denomination}</p>
              </div>
              <div>
                <span className="text-[8px] font-mono uppercase text-slate-500">材质</span>
                <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{activeCoin.material}</p>
              </div>
              <div>
                <span className="text-[8px] font-mono uppercase text-slate-500">直径</span>
                <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{activeCoin.diameter}</p>
              </div>
              <div>
                <span className="text-[8px] font-mono uppercase text-slate-500">重量</span>
                <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{activeCoin.weight}</p>
              </div>
              <div>
                <span className="text-[8px] font-mono uppercase text-slate-500">背景</span>
                <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{activeCoin.background.substring(0, 20)}...</p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-700/50">
              <p className="text-[10px] text-slate-300 leading-snug line-clamp-3">{activeCoin.history.substring(0, 150)}...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
