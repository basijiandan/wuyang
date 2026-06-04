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
    <div className="relative w-full h-[520px] bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-sm select-none">
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
        {/* Infinite subtle mapping grid or minimalist canvas lines */}
        <div className="absolute inset-0 bg-[#f9fafb] pointer-events-none" />

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
          {/* Flat World Map background image */}
          <img
            src={worldMapUrl}
            alt="World Map"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none pointer-events-none opacity-[0.92]"
          />

          {/* Calibrated Coin Markers absolute overlay */}
          {coins.map((coin) => {
            const coords = CALIBRATED_COORDS[coin.id];
            if (!coords) return null;

            const isActive = coin.id === activeCoinId;
            let markerColor = "ring-slate-400 bg-slate-600 border-white";
            if (coin.metalColor === "gold") markerColor = "ring-amber-300 bg-amber-500 border-white";
            else if (coin.metalColor === "bimetallic") markerColor = "ring-amber-400 bg-emerald-600 border-white";
            else if (coin.metalColor === "silver") markerColor = "ring-blue-300 bg-blue-500 border-white";

            return (
              <button
                key={coin.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCoin(coin.id === activeCoinId ? null : coin.id);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 pointer-events-auto"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                }}
              >
                {/* Radiant Pulsing Ring */}
                <span
                  className={`absolute inline-flex rounded-full opacity-75 animate-ping duration-1000 ${
                    isActive ? "h-10 w-10 -left-3 -top-3 bg-amber-400/40" : "h-7 w-7 -left-1.5 -top-1.5 bg-slate-300/30 group-hover:bg-slate-400/20"
                  }`}
                />

                {/* Elegant Interactive Dot Pin */}
                <div
                  className={`w-4.5 h-4.5 rounded-full border-2 shadow-md transition-all duration-300 relative z-10 flex items-center justify-center ${markerColor} ${
                    isActive ? "scale-135 ring-4 ring-amber-450/30 border-amber-500" : "hover:scale-120 hover:shadow-lg"
                  }`}
                >
                  <span className="text-[7px] text-white font-bold select-none">{coin.symbol[0]}</span>
                </div>

                {/* Minimalist floating label overlay (Visible on active or hover) */}
                <div
                  className={`absolute top-6 left-1/2 -translate-x-1/2 bg-white/95 border border-slate-200/80 px-2.5 py-1.5 rounded-xl text-[11px] font-sans text-slate-800 shadow-sm transition-all duration-200 whitespace-nowrap min-w-max pointer-events-none ${
                    isActive ? "opacity-100 translate-y-0 text-amber-600 font-bold border-amber-200 bg-amber-50/95" : "opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{coin.symbol}</span>
                    <span>{coin.name.split("（")[0]}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating minimalist controls (Reduced clutter, extremely simple layout) */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/95 border border-slate-200/80 rounded-2xl p-1 shadow-sm z-30">
        <button
          onClick={() => handleZoom(1.25)}
          title="放大"
          className="p-2 text-slate-500 hover:text-slate-800 transition rounded-xl cursor-pointer hover:bg-slate-100 active:scale-95"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(0.8)}
          title="缩小"
          className="p-2 text-slate-500 hover:text-slate-800 transition rounded-xl cursor-pointer hover:bg-slate-100 active:scale-95"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          title="复位姿态"
          className="p-2 text-slate-500 hover:text-slate-800 transition rounded-xl cursor-pointer hover:bg-slate-100 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Subtle indicator label */}
      <div className="absolute top-4 left-4 pointer-events-none bg-white/90 border border-slate-200/80 px-3 py-1.5 rounded-xl text-[10px] font-mono text-slate-400 font-semibold shadow-sm flex items-center gap-1.5 z-30">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>沉浸展厅地图 · 鼠标拖拽平移</span>
      </div>
    </div>
  );
}
