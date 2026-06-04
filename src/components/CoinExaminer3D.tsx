import { useEffect, useRef, useState } from "react";
import { Coin } from "../types";
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface CoinExaminer3DProps {
  coin: Coin;
}

/**
 * Procedural Coin Engraving Texture Canvas Maker
 * Generates dynamic high-res golden, silver, bronze, & bimetallic coin reliefs
 */
export function generateCoinTexture(coin: Coin, face: "front" | "back"): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const cx = 256;
  const cy = 256;
  const r = 240;

  // Draw base metal gradient depending on coin characteristics
  const isBimetallic = coin.metalColor === "bimetallic";
  
  // Outer Ring/Gold/Bronze standard gradients
  const getMetalGradients = (colorType: string) => {
    let rim1 = "#e2e8f0";
    let rim2 = "#94a3b8";
    let body1 = "#cbd5e1";
    let body2 = "#64748b";
    let highlight = "#f8fafc";
    let shadow = "#1e293b";
    let textMat = "#475569";

    if (colorType === "gold") {
      rim1 = "#fffbeb";
      rim2 = "#b45309";
      body1 = "#fbbf24";
      body2 = "#b45309";
      highlight = "#fffbeb";
      shadow = "#451a03";
      textMat = "#78350f";
    } else if (colorType === "bimetallic") {
      // Outer brass ring
      rim1 = "#fef3c7";
      rim2 = "#b45309";
      body1 = "#fbbf24";
      body2 = "#92400e";
      highlight = "#fffbeb";
      shadow = "#451a03";
      textMat = "#78350f";
    } else if (colorType === "bronze") {
      rim1 = "#ffedd5";
      rim2 = "#c2410c";
      body1 = "#f97316";
      body2 = "#9a3412";
      highlight = "#fff7ed";
      shadow = "#431407";
      textMat = "#7c2d12";
    }

    return { rim1, rim2, body1, body2, highlight, shadow, textMat };
  };

  const currentGrads = getMetalGradients(coin.metalColor);

  // 1. Draw Outer rim (Standard for all coins)
  const mainGrad = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, r);
  mainGrad.addColorStop(0, currentGrads.body1);
  mainGrad.addColorStop(0.7, currentGrads.body2);
  mainGrad.addColorStop(1, currentGrads.shadow);

  ctx.fillStyle = mainGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Bi-metallic overlay: inside core gets silver steel texture
  if (isBimetallic) {
    const silverGrads = getMetalGradients("silver");
    const innerRadius = 155;

    // Draw inner metallic core with radial gradient
    const coreGrad = ctx.createRadialGradient(cx - 15, cy - 15, 5, cx, cy, innerRadius);
    coreGrad.addColorStop(0, silverGrads.body1);
    coreGrad.addColorStop(0.8, silverGrads.body2);
    coreGrad.addColorStop(1, silverGrads.shadow);

    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
    ctx.fill();

    // Outer border ring line for inner partition line
    ctx.strokeStyle = silverGrads.highlight;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Shadow partition indent inside ring
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius + 1.5, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 2. Draw Bezel Raised Rim Contour
  ctx.strokeStyle = currentGrads.highlight;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = currentGrads.shadow;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 8, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Classical Perimeter Beads
  const numBeads = 120;
  ctx.fillStyle = currentGrads.highlight;
  for (let i = 0; i < numBeads; i++) {
    const angle = (i / numBeads) * Math.PI * 2;
    const bx = cx + Math.cos(angle) * (r - 18);
    const by = cy + Math.sin(angle) * (r - 18);
    ctx.beginPath();
    ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Add tiny shade for 3D depth
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.arc(bx + 1, by + 1, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = currentGrads.highlight;
  }

  // Raised inner circle line
  ctx.strokeStyle = currentGrads.highlight;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 26, 0, Math.PI * 2);
  ctx.stroke();

  // Let's draw Obverse (front) vs Reverse (back) reliefs
  if (face === "front") {
    // --- OBVERSE: Dynamic National Crest & Main motif name ---
    
    // Outer arc circular ring text (such as "中华人民共和国" or origin labels)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = currentGrads.textMat;
    ctx.shadowColor = "rgba(255,255,255,0.45)";
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";

    // Text arc rotation
    const textStr = coin.country.split(" (")[0] + " · " + coin.year.split(" (")[0];
    for (let j = 0; j < textStr.length; j++) {
      const angle = -Math.PI / 1.8 + (j / textStr.length) * (Math.PI * 1.12);
      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, - (r - 45));
      ctx.fillText(textStr[j], 0, 0);
      ctx.restore();
    }
    ctx.restore();

    // Central graphic highlight: Draw large theme symbol
    ctx.shadowColor = "rgba(0,0,0,0.18)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 4;
    
    // Specially render Guangdong coin with 5 sheep
    if (coin.id === "china-guangdong") {
      ctx.font = "80px sans-serif";
      ctx.fillText("🐑", cx - 40, cy - 30);
      ctx.fillText("🐑", cx + 40, cy - 30);
      ctx.fillText("🐐", cx, cy + 30);
      ctx.fillText("🐏", cx - 50, cy + 25);
      ctx.fillText("🐏", cx + 50, cy + 25);
    } else {
      ctx.font = "140px sans-serif";
      ctx.fillText(coin.symbol, cx, cy + 35);
    }

    // Dynamic label under the main animal glyph
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = currentGrads.textMat;
    ctx.textAlign = "center";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("OFFICIAL EXPOSITION", cx, cy + 120);

  } else {
    // --- REVERSE: Elegant denomination seals & Laurel sheaves ---
    
    // Draw background security radial micro-lines for high realism
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 0.8;
    for (let k = 0; k < 60; k++) {
      const angle = (k / 60) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * (r - 30), cy + Math.sin(angle) * (r - 30));
      ctx.stroke();
    }

    // Inner circular frame line
    ctx.strokeStyle = currentGrads.highlight;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 140, 0, Math.PI * 2);
    ctx.stroke();

    // Center currency text label
    ctx.fillStyle = currentGrads.textMat;
    ctx.shadowColor = "rgba(255,255,255,0.5)";
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.textAlign = "center";
    
    ctx.font = "bold 44px Georgia, serif";
    ctx.fillText(coin.denomination, cx, cy);

    ctx.font = "bold 13px sans-serif";
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillText("FINE COLLECTORS SPECIMEN", cx, cy + 45);

    // Dynamic decorative foliage/stars around the frame
    ctx.font = "26px sans-serif";
    ctx.fillText("★ ★ ★", cx, cy - 50);

    // Draw symmetrical laurel leaves using simple canvas curves on sides
    ctx.strokeStyle = currentGrads.textMat;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 105, 0.25 * Math.PI, 0.75 * Math.PI); // Symmetrical curve bottom
    ctx.stroke();

    // Symmetrical text/mint labels under
    ctx.font = "bold 11px monospace";
    ctx.fillStyle = currentGrads.textMat;
    ctx.fillText("MINT QUALITY 100% EXQUISITE", cx, cy + 90);
  }

  // Draw ultimate shadow layer on top for pristine 3D curved lens bevel
  const domeGrad = ctx.createRadialGradient(cx - 50, cy - 50, r * 0.4, cx, cy, r);
  domeGrad.addColorStop(0, "rgba(255,255,255,0.1)");
  domeGrad.addColorStop(0.5, "rgba(255,255,255,0.0)");
  domeGrad.addColorStop(0.9, "rgba(0,0,0,0.12)");
  domeGrad.addColorStop(1, "rgba(0,0,0,0.42)");

  ctx.fillStyle = domeGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

export default function CoinExaminer3D({ coin }: CoinExaminer3DProps) {
  const frontCanvasRef = useRef<HTMLCanvasElement>(null);
  const backCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1.0);

  // Redraw the coin front and back textures whenever the coin changes
  useEffect(() => {
    setIsFlipped(false); // Reset to front face on coin switch
    
    const timer = setTimeout(() => {
      if (frontCanvasRef.current && backCanvasRef.current) {
        const frontTex = generateCoinTexture(coin, "front");
        const backTex = generateCoinTexture(coin, "back");

        // Copy front texture to front canvas
        const frontCtx = frontCanvasRef.current.getContext("2d");
        if (frontCtx) {
          frontCanvasRef.current.width = 512;
          frontCanvasRef.current.height = 512;
          frontCtx.clearRect(0, 0, 512, 512);
          frontCtx.drawImage(frontTex, 0, 0);
        }

        // Copy back texture to back canvas
        const backCtx = backCanvasRef.current.getContext("2d");
        if (backCtx) {
          backCanvasRef.current.width = 512;
          backCanvasRef.current.height = 512;
          backCtx.clearRect(0, 0, 512, 512);
          backCtx.drawImage(backTex, 0, 0);
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [coin]);

  const handleZoom = (direction: "in" | "out") => {
    setScale((prev) => {
      const next = direction === "in" ? prev + 0.15 : prev - 0.15;
      return Math.max(0.7, Math.min(1.4, next));
    });
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative w-full flex flex-col gap-5">
      {/* Immersive 3D CSS Card Flipping Containment Frame */}
      <div className="relative w-full h-[290px] bg-white border border-slate-200 rounded-3xl flex items-center justify-center overflow-hidden shadow-sm">
        {/* Helper instructions text */}
        <div className="absolute top-4 left-4 pointer-events-none text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
          <span>{isFlipped ? "背面图案 (Reverse)" : "正面图案 (Obverse)"}</span>
        </div>

        {/* CSS 3D Card Containment Workspace */}
        <div 
          className="relative w-60 h-60 cursor-pointer select-none perspective-[1000px] flex items-center justify-center transition-all duration-300"
          style={{ transform: `scale(${scale})` }}
          onClick={toggleFlip}
        >
          {/* Flipper pivot root */}
          <div 
            className="w-full h-full relative transition-transform duration-700 ease-out preserve-3d"
            style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            {/* OBVERSE FRONT FACE CANVAS */}
            <div className="absolute inset-0 backface-hidden flex items-center justify-center rounded-full bg-transparent overflow-hidden shadow-sm">
              <canvas 
                ref={frontCanvasRef} 
                className="w-52 h-52 object-contain hover:brightness-[1.03] transition-all active:scale-[0.98] duration-200" 
              />
            </div>

            {/* REVERSE BACK FACE CANVAS */}
            <div 
              className="absolute inset-0 backface-hidden flex items-center justify-center rounded-full bg-transparent overflow-hidden shadow-sm"
              style={{ transform: "rotateY(180deg)" }}
            >
              <canvas 
                ref={backCanvasRef} 
                className="w-52 h-52 object-contain hover:brightness-[1.03] transition-all active:scale-[0.98] duration-200" 
              />
            </div>
          </div>
        </div>

        {/* Hover/Click visual guidelines overlay inside map corners */}
        <div className="absolute bottom-4 left-4 text-[10px] font-medium text-slate-400 font-sans">
          提示：点选硬币即可快速翻转至另一面
        </div>

        {/* Immersive Action Bar (Extremely clean, minimalist buttons, no flashy icons) */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-slate-50 border border-slate-200/80 rounded-2xl p-1 shadow-sm">
          <button
            onClick={(e) => { e.stopPropagation(); handleZoom("in"); }}
            title="放大"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition cursor-pointer active:scale-90"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleZoom("out"); }}
            title="缩小"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition cursor-pointer active:scale-90"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFlip(); }}
            title="翻转钱币"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-xl transition cursor-pointer active:scale-90 flex items-center gap-1 font-sans text-[10px] font-bold"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>翻转</span>
          </button>
        </div>
      </div>

      {/* Structured metrics grid in neutral clean styling */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex flex-col gap-0.5 shadow-sm">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wide">发行年份</span>
          <span className="text-slate-800 font-bold font-mono">{coin.year.split(" ")[0]}</span>
        </div>
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex flex-col gap-0.5 shadow-sm">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wide">面值</span>
          <span className="text-slate-800 font-bold">{coin.denomination}</span>
        </div>
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex flex-col gap-0.5 shadow-sm">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wide">材质</span>
          <span className="text-slate-700 font-semibold truncate">{coin.material}</span>
        </div>
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex flex-col gap-0.5 shadow-sm">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wide">规制尺寸</span>
          <span className="text-slate-700 font-mono font-medium truncate">{coin.size.split("|")[0].trim()}</span>
        </div>
      </div>
    </div>
  );
}
