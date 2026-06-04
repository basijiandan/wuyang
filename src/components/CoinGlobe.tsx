import React, { useEffect, useRef, useState } from "react";
import { Coin } from "../types";
import { COINS_DATA } from "../data";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
// @ts-expect-error - PNG image is compiled and resolved successfully by Vite
import worldMapUrl from "../assets/images/world_map_pacific_1780576004329.png";

interface CoinGlobeProps {
  coins: Coin[];
  activeCoinId: string | null;
  onSelectCoin: (coinId: string | null) => void;
}

// Calibrated percentages for each of our 7 collection coins on the Pacific-centered map
const CALIBRATED_COORDS: Record<string, { x: number; y: number }> = {
  "china-guangdong": { x: 32.5, y: 44.5 }, // Guangzhou
  "china-zodiac": { x: 33.2, y: 35.5 },    // Beijing
  "mongolia-argali": { x: 31.8, y: 30.0 },   // Ulaanbaatar
  "uk-royal": { x: 7.2, y: 29.5 },         // London
  "europe-mouflon": { x: 14.8, y: 40.5 },    // Cyprus
  "australia-ram": { x: 41.5, y: 81.5 },     // Canberra
  "nz-merino": { x: 47.8, y: 86.5 },         // Wellington
};

export default function CoinGlobe({ coins, activeCoinId, onSelectCoin }: CoinGlobeProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const mapStart = useRef({ x: 0, y: 0 });

  // Map dimensions config
  const mapWidth = 1400; // base width for absolute coordinate mapping
  const mapHeight = 700;  // base height

  // Handle zooming
  const handleZoom = (factor: number) => {
    setIsTransitioning(true);
    setZoom((prev) => Math.min(3.5, Math.max(1.0, prev * factor)));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleReset = () => {
    setIsTransitioning(true);
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    onSelectCoin(null);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Drag-to-pan handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Don't start dragging if clicking on a button or interactive element
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }
    
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setIsTransitioning(false);
    dragStart.current = { x: e.clientX, y: e.clientY };
    mapStart.current = { x: pan.x, y: pan.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !viewportRef.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    const viewport = viewportRef.current;
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    
    const nextX = mapStart.current.x + dx;
    const nextY = mapStart.current.y + dy;
    
    const minX = mapWidth * zoom > vw ? vw - mapWidth * zoom : (vw - mapWidth * zoom) / 2;
    const maxX = mapWidth * zoom > vw ? 0 : (vw - mapWidth * zoom) / 2;
    const minY = mapHeight * zoom > vh ? vh - mapHeight * zoom : (vh - mapHeight * zoom) / 2;
    const maxY = mapHeight * zoom > vh ? 0 : (vh - mapHeight * zoom) / 2;
    
    const clampedX = Math.min(Math.max(nextX, minX), maxX);
    const clampedY = Math.min(Math.max(nextY, minY), maxY);
    
    setPan({
      x: clampedX,
      y: clampedY,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.85;
    handleZoom(factor);
  };

  // Autocenter on coin selection
  useEffect(() => {
    if (!activeCoinId || !viewportRef.current) return;
    const coords = CALIBRATED_COORDS[activeCoinId];
    if (!coords) return;

    const viewport = viewportRef.current;
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;

    // Target absolute position of coin inside the map scaled dimension
    const targetScale = 1.6; // elegant zooming scale for looking at a country
    const cx = (coords.x / 100) * mapWidth;
    const cy = (coords.y / 100) * mapHeight;

    // Desired pan: moves the map so the coin coordinate maps to center of viewport
    const targetPanX = vw / 2 - cx * targetScale;
    const targetPanY = vh / 2 - cy * targetScale;

    setIsTransitioning(true);
    setZoom(targetScale);
    setPan({ x: targetPanX, y: targetPanY });
    
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [activeCoinId]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      {/* Viewport wrapper with drag cursor */}
      <div
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className={`w-full h-full relative overflow-hidden select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {/* Subtle dark overlay */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* Scaled & translated Map layer */}
        <div
          className={`absolute left-0 top-0 origin-top-left ${
            isTransitioning ? "transition-transform duration-500 ease-out" : ""
          }`}
          style={{
            width: `${mapWidth}px`,
            height: `${mapHeight}px`,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {/* Flat World Map background */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0"
            }}
            className={`relative ${isTransitioning ? "transition-transform duration-500 ease-out" : ""}`}
          >
            <img src={worldMapUrl} alt="World Map" className="w-full h-auto block" style={{
              filter: 'brightness(0.3) contrast(1.1) saturate(0.5) sepia(0.2)',
              opacity: 0.8
            }} />

            {/* Subtle gradient overlay on map */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#000]/20 via-transparent to-[#000]/40 pointer-events-none" />
          </div>
          {coins.map((coin) => {
            const coords = CALIBRATED_COORDS[coin.id];
            if (!coords) return null;

            const isActive = coin.id === activeCoinId;

            return (
              <button
                key={coin.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCoin(coin.id === activeCoinId ? null : coin.id);
                }}
                type="button"
                className="absolute cursor-pointer z-20 pointer-events-auto transition-all duration-300 group"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: '24px',
                  height: '24px',
                  background: 'transparent',
                  border: 'none',
                  padding: '0',
                  margin: '0'
                }}
              >
                {/* Circular marker with dot */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Outer glow ring */}
                  <div
                    className={`absolute rounded-full transition-all duration-300 pointer-events-none ${
                      isActive ? "opacity-100" : "opacity-50 group-hover:opacity-75"
                    }`}
                    style={{
                      width: isActive ? '32px' : '24px',
                      height: isActive ? '32px' : '24px',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      boxShadow: isActive 
                        ? "0 0 20px rgba(251, 146, 60, 0.8), 0 0 40px rgba(251, 146, 60, 0.4)"
                        : "0 0 10px rgba(148, 163, 184, 0.3)"
                    }}
                  />
                  
                  {/* Dot circle */}
                  <div
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 pointer-events-none relative z-10 ${
                      isActive ? 'ring-2 ring-amber-500' : ''
                    }`}
                    style={{
                      backgroundColor: isActive ? '#f59e0b' : '#94a3b8',
                      boxShadow: isActive ? '0 0 12px rgba(251, 146, 60, 0.6)' : 'none'
                    }}
                  />
                  
                  {/* Tooltip label */}
                  <div
                    className={`absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1a1a1a]/98 border border-slate-700/50 px-2.5 py-1.5 rounded text-[10px] font-sans text-slate-100 shadow-lg transition-all duration-200 whitespace-nowrap pointer-events-none backdrop-blur-sm ${
                      isActive ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
                    }`}
                  >
                    <div className="text-amber-400 font-semibold">{coin.name}</div>
                    <div className="text-slate-400 text-[9px] mt-0.5">{coin.country.split(" (")[0]}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating minimalist controls */}
      <div className="absolute bottom-8 right-8 flex items-center gap-2 bg-black/80 border border-slate-700/50 rounded-2xl p-2.5 shadow-2xl z-30 backdrop-blur-sm">
        <button
          onClick={() => handleZoom(1.25)}
          title="放大"
          className="p-2.5 text-slate-400 hover:text-amber-400 transition rounded-lg cursor-pointer hover:bg-slate-900/50 active:scale-95"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-slate-700/30" />
        <button
          onClick={() => handleZoom(0.8)}
          title="缩小"
          className="p-2.5 text-slate-400 hover:text-amber-400 transition rounded-lg cursor-pointer hover:bg-slate-900/50 active:scale-95"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-slate-700/30" />
        <button
          onClick={handleReset}
          title="复位姿态"
          className="p-2.5 text-slate-400 hover:text-amber-400 transition rounded-lg cursor-pointer hover:bg-slate-900/50 active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Title and indicator label */}
      <div className="absolute top-8 left-8 pointer-events-none z-30">
        <div className="bg-black/80 border border-slate-700/50 backdrop-blur-sm px-5 py-4 rounded-xl shadow-2xl max-w-sm">
          <h1 className="text-xl font-bold text-slate-100 mb-1.5 flex items-center gap-2">
            🐏 羊主题全球纪念币学术博览馆
          </h1>
          <p className="text-[11px] font-mono text-slate-400 leading-relaxed">点击地图上的小圆点查看硬币详情 · 鼠标拖拽平移地图</p>
        </div>
      </div>
    </div>
  );
}
