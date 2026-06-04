import { useState, useEffect, useRef } from "react";
import { Coin, ChatMessage } from "../types";

interface CoinDetailProps {
  coin: Coin;
}

export default function CoinDetail({ coin }: CoinDetailProps) {
  const [activeTab, setActiveTab] = useState<"history" | "background" | "details" | "trivia" | "chat">("history");
  
  // Chat console states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isAiLoading]);

  // Reset chat if the user switches active coin
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "model",
        text: `您好！我是您的本币馆同屏钱币学AI顾问。关于这枚 ${coin.name}，我已经将其地缘志要、金属成分、近代变迁和历史背景读存入脑。您可以向我提问任何有关这枚币的问题，或是点击下方推荐议题：`,
        timestamp: new Date()
      }
    ]);
  }, [coin]);

  // Quick suggestions based on selected coin type
  const coinQuestions: Record<string, string[]> = {
    "china-guangdong": [
      "这枚钱币目前在藏市的稀有度和价值如何？",
      "广州得名‘五羊城’的瑞兽传说究竟是怎样的？",
      "当时民国二十五年中日战事对该币发行有何直接影响？"
    ],
    "china-zodiac": [
      "双金属拼接工艺对这枚10元币防伪有哪些提升？",
      "第二轮生肖贺岁币在设计上与第一轮有什么核心变化？",
      "生肖‘羊’字在中华传统吉祥话里为何通‘祥’？"
    ],
    "uk-royal": [
      "华裔设计师何敏仪在这枚银币中融入了怎样的东方剪纸手法？",
      "这只英国约克郡绵羊在描绘上有何特别的动物神姿？",
      "英国皇家造币厂的中国生肖系列纪念币哪年开始发行的？"
    ],
    "australia-ram": [
      "为什么把一只叫 Uardry 0.1 的美利奴公羊铸进法定货币？",
      "澳大利亚为何被称为‘骑在羊背上的国家’？",
      "先令 Shilling 是什么面值系统，1966年为何废止？"
    ],
    "mongolia-argali": [
      "超高浮雕（Ultra-High Relief）在这枚币上是实现什么逼真感觉的？",
      "施华洛世奇黑色水晶眼对这枚币的艺术表现有何点睛效果？",
      "蒙古野生阿尔加利大盘羊目前的生态状况怎么样？"
    ],
    "europe-mouflon": [
      "什么是摩弗仑羊，它为什么被称作人类驯化绵羊的始祖？",
      "塞浦路斯发行的欧分硬币上为什么用两只羊代表自己的文化？",
      "这套欧元硬币目前在欧洲哪些区域日常流转最广？"
    ],
    "nz-merino": [
      "新西兰美利奴飞羊银币绘制了怎样的高山牧歌田园景象？",
      "美利奴精细羊毛对新西兰国家经济作出了什么特殊贡献？",
      "硬币雕刻的远景山峰是新西兰的哪座著名雪山？"
    ]
  };

  const getSuggestions = () => {
    return coinQuestions[coin.id] || [
      "这枚羊币的设计师是谁？",
      "它的铸造工艺和普通硬币有什么区别？",
      "羊在这个国家的文化中代表了什么？"
    ];
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isAiLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsAiLoading(true);

    try {
      const formattedHistoryForApi = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({
          role: m.role,
          text: m.text
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: textToSend,
          coinId: coin.id,
          chatHistory: formattedHistoryForApi
        })
      });

      if (!res.ok) {
        throw new Error("后端连接失败");
      }

      const data = await res.json();
      
      const modelMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "model",
        text: data.text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err: any) {
      console.error("Failed to query Coin AI:", err);
      const errMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "model",
        text: "【顾问提示】：连接有些延迟，请确保运行了后端API，再次尝试连线我哦！",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "model",
        text: `已重置研讨。让我们重新围绕这枚 ${coin.name} 展开交流，您可以随时点选下方推荐议题：`,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="w-full flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      
      {/* Upper Grid Area: Multi-column view combining metadata, spec badges, and its paired photo */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Column A: High-Definition Paired Realist Photograph (4 of 12 cols) */}
          <div className="md:col-span-4 flex flex-col gap-2">
            <div className="aspect-square w-full relative bg-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs flex items-center justify-center group">
              <img
                src={coin.image}
                alt={`${coin.name} 官方高真写实图像`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-[9px] font-mono text-white/95 px-2 py-0.5 rounded-lg">
                馆藏真品写真
              </span>
            </div>
            <span className="text-[10px] text-center text-slate-400 font-sans font-medium">
              配对真币材质质感摄影
            </span>
          </div>

          {/* Column B: Primary metadata + key specs (8 of 12 cols) */}
          <div className="md:col-span-8 flex flex-col justify-between h-full gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl p-1 bg-white rounded-xl shadow-xs border border-slate-150">
                  {coin.symbol}
                </span>
                
                <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans" id="coin-detail-name">
                  {coin.name}
                </h2>

                <span className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans font-bold ${
                  coin.metalColor === "gold" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                  coin.metalColor === "silver" ? "bg-slate-50 text-slate-600 border border-slate-200" :
                  coin.metalColor === "bimetallic" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                  "bg-orange-50 text-orange-600 border border-orange-200"
                }`}>
                  {coin.metalColor === "gold" ? "金质" :
                   coin.metalColor === "silver" ? "银质" :
                   coin.metalColor === "bimetallic" ? "双金属" : "铜质古币"}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium font-sans">
                区域归属: <span className="text-slate-600 font-bold">{coin.country}</span> · {coin.year}
              </p>
            </div>

            {/* Crucial requested specs: Weight, Size, Material, Face Value */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider">
                  钱币材质 | Material
                </span>
                <span className="text-xs text-slate-800 font-bold truncate mt-0.5" id="spec-material">
                  {coin.material}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider">
                  大小直径 | Size
                </span>
                <span className="text-xs text-slate-800 font-bold truncate mt-0.5" id="spec-size">
                  {coin.diameter}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl flex flex-col col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider">
                  钱币重量 | Weight
                </span>
                <span className="text-xs text-slate-800 font-bold truncate mt-0.5" id="spec-weight">
                  {coin.weight}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider">
                  发行面值 | Denomination
                </span>
                <span className="text-sm text-slate-800 font-black truncate mt-0.5">
                  {coin.denomination}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl flex flex-col col-span-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider">
                  钱币编号 | Index Code
                </span>
                <span className="text-xs text-slate-500 font-mono font-bold mt-0.5">
                  {coin.id.toUpperCase()}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Tab Menu Selection Row */}
      <div className="flex border-b border-slate-100 bg-slate-50/20 p-1">
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all duration-200 ${
            activeTab === "history"
              ? "bg-slate-800 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          历史变迁 (History)
        </button>
        <button
          onClick={() => setActiveTab("background")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all duration-200 ${
            activeTab === "background"
              ? "bg-slate-800 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          文化背景 (Background)
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all duration-200 ${
            activeTab === "details"
              ? "bg-slate-800 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          雕刻考证 (Engraving)
        </button>
        <button
          onClick={() => setActiveTab("trivia")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all duration-200 ${
            activeTab === "trivia"
              ? "bg-slate-800 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          馆藏逸闻
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all duration-200 ${
            activeTab === "chat"
              ? "bg-slate-800 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          AI学者顾问
        </button>
      </div>

      {/* Detail window containing requested textual information */}
      <div className="flex-1 p-5 min-h-[220px] max-h-[350px] overflow-y-auto bg-white">
        
        {activeTab === "history" && (
          <div className="flex flex-col gap-3 leading-relaxed font-sans text-sm text-slate-600">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block" id="section-history-title">
              Numismatic History & Chronicle / 历史变迁
            </span>
            <p className="text-justify leading-relaxed whitespace-pre-line text-slate-700 font-normal">
              {coin.history}
            </p>
          </div>
        )}

        {activeTab === "background" && (
          <div className="flex flex-col gap-3 leading-relaxed font-sans text-sm text-slate-600">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block" id="section-background-title">
              Cultural Background & Context / 文化背景与学术渊源
            </span>
            <p className="text-justify leading-relaxed whitespace-pre-line text-slate-700 font-normal">
              {coin.background}
            </p>
          </div>
        )}

        {activeTab === "details" && (
          <div className="flex flex-col gap-3 leading-relaxed font-sans text-sm text-slate-600 font-normal">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
              Engraving Details & Artwork / 币面雕刻细节考证
            </span>
            <p className="text-justify leading-relaxed text-slate-700">
              {coin.details}
            </p>
          </div>
        )}

        {activeTab === "trivia" && (
          <div className="flex flex-col gap-3.5 leading-relaxed font-sans text-sm text-slate-600">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
              Collector Trivia / 馆藏趣闻与民间逸事
            </span>
            <div className="bg-slate-50 border border-slate-200/85 p-4 rounded-2xl flex gap-3 items-start">
              <span className="text-xl mt-0.5 select-none">💡</span>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">
                  Did You Know / 藏物趣话
                </span>
                <p className="text-slate-700 text-sm leading-relaxed font-normal">
                  {coin.funFact}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="h-[280px] flex flex-col gap-3">
            {/* Scrollable messages container */}
            <div 
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs font-sans"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed text-sm border ${
                    msg.role === "user" 
                      ? "bg-slate-800 text-white border-slate-700 rounded-tr-none font-semibold shadow-sm" 
                      : "bg-slate-50 text-slate-700 border-slate-200 rounded-tl-none font-normal shadow-xs"
                  }`}>
                    {msg.role === "model" && msg.id !== "welcome" && (
                      <div className="text-[9px] text-slate-400 font-mono font-bold uppercase mb-1 border-b border-slate-100 pb-1">
                        <span>AI 专家学术解读</span>
                      </div>
                    )}
                    <div className="whitespace-pre-line text-justify leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 text-slate-400 border border-slate-200/80 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-xs flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI专家正在研究学术史要...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Queries Suggestion block */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 shrink-0 border-t border-slate-100 pt-2.5 scrollbar-none">
              <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap uppercase tracking-wider pr-1">
                追问议题:
              </span>
              {getSuggestions().map((q, idx) => (
                <button
                  id={`suggestion-btn-${idx}`}
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  disabled={isAiLoading}
                  className="shrink-0 text-[10px] bg-slate-50 hover:bg-slate-100 active:scale-95 disabled:opacity-50 transition border border-slate-200 text-slate-650 px-2.5 py-1 rounded-lg cursor-pointer font-semibold"
                >
                  {q.slice(0, 16)}...
                </button>
              ))}
            </div>

            {/* Input form */}
            <form 
              id="coin-ask-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputVal);
              }}
              className="flex items-center gap-2 shrink-0 border-t border-slate-100 pt-2"
            >
              <button
                type="button"
                id="clear-chat-btn"
                onClick={clearChat}
                className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer active:scale-90"
              >
                重置
              </button>

              <input
                id="chat-input-field"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isAiLoading}
                placeholder="向AI专家对话提问学术事实..."
                className="flex-1 text-sm bg-slate-50 text-slate-800 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl px-3.5 py-2 focus:outline-none transition font-sans placeholder-slate-400 disabled:opacity-50"
              />

              <button
                type="submit"
                id="submit-chat-btn"
                disabled={!inputVal.trim() || isAiLoading}
                className="px-4 py-2 bg-slate-800 text-white disabled:opacity-40 hover:bg-slate-900 font-bold rounded-xl transition cursor-pointer active:scale-95 shrink-0"
              >
                发送
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
