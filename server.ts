import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Replicating a robust coin dictionary inside server context to create deep context-aware system instructions for Gemini
const SYSTEM_COIN_DATA: Record<string, any> = {
  "china-guangdong": {
    name: "广东五羊壹仙铜币",
    country: "中国广东广州",
    year: "民国二十五年 (1936年)",
    denomination: "壹仙",
    material: "红铜",
    size: "直径 21.8mm | 重量 3.2g",
    history: "民国二十五年（1936年），广州造币厂计划铸造发行“五羊壹仙”铜币。因广州传颂着“五羊衔谷”瑞兽神话（传说周代有五位仙人骑着五色仙羊，衔着谷穗降临广州，祝愿此地永无饥荒，随后化为石羊留在广州越秀山，因而广州得名五羊城、穗城）。但在批量铸造、准备全面发行时，发生了抗日战争变故，造币厂不得不停产，导致大部分钱币未投入商业流通便被销毁，只保留了极少量的试铸样币。现存世极为罕见，是中国近代铜元界传说般的顶级名誉品。",
    details: "硬币正面中间雕刻五只腾跃其间、栩栩如生的仙羊环绕谷穗，姿态秀丽灵动。外框写有“中华民国二十五年”字样，背面上书篆书“壹仙”，并装饰有传统的党徽和麦穗装饰。做工极为精湛，属于中国机制币浮雕艺术之杰作。"
  },
  "china-zodiac": {
    name: "中国生肖贺岁羊年银双金属币",
    country: "中国",
    year: "2015年 (乙未属羊年)",
    denomination: "10元 (RMB)",
    material: "双色铜合金 (外圈黄铜合金，内芯双层铜合金)",
    size: "直径 27.0mm | 重量 9.2g",
    history: "由中国人民银行于2015年发行的第二轮生肖普通纪念币首发币（也是首枚10元大面额生肖普通纪念币）。中国生肖文化寄托着全国人民对岁末迎新、祥瑞安康的美好期许，2015年适逢农历乙未羊年，‘羊’字在中国传统中与‘祥’、‘美’、‘善’字相通，三阳开泰。采用双金属高精密拼接铸造，防伪极高，深受老百姓和收藏爱好者的喜爱。",
    details: "币面刻有一只打扮喜庆的昂首盘羊，盘角巍峨。全身雕刻有细腻的祥云花卉图案，背景左侧采用中国剪纸风格的宫灯悬挂、窗花装点，洋溢着喜气洋洋的中国新年氛围。具有交替斜全齿及双面微缩浮雕文字技术。"
  },
  "uk-royal": {
    name: "英国皇家造币厂生肖羊年银币",
    country: "英国",
    year: "2015年",
    denomination: "2英镑 (GBP)",
    material: ".999足银",
    size: "直径 38.61mm | 重量 31.1g (1盎司)",
    history: "英国皇家造币厂为了彰显中英友谊、致敬华人传统生肖文化，特别发行的法定货币生肖系列（Shengxiào Collection）。羊年银币是该系列的第二枚。英国皇家特邀华裔卓越印版画艺术家、持牌兽医何敏仪（Wuon-Gean Ho）主导设计，将欧洲古老造币传统与东方写意剪纸完美融合，是西方法定货品呈现中国文化的最高水准之一。",
    details: "币面上两只英国本地约克郡大角绵羊在山坡上互相对望嬉戏。羊毛卷曲丰满、质感纯良。硬币背负英国女王伊丽莎白二世官方肖像画。币底精磨抛光，有镜面闪亮质感，浮雕洁白微砂。"
  },
  "australia-ram": {
    name: "澳大利亚先令美利奴公羊币",
    country: "澳大利亚",
    year: "1937-1964年间发行",
    denomination: "1先令",
    material: "白银",
    size: "直径 23.5mm | 重量 5.65g",
    history: "澳大利亚被世人誉为“骑在羊背上的国家”，20世纪初羊毛牧业是维系整个澳洲国家命运的绝对经济支柱。为了永远感激并纪念美利奴绵羊对澳洲建国与出口做出的不拔之功，联邦政府于1937年决定重新设计1先令辅币。钱币设计师以当年全国羊展夺冠的殿堂级美利奴种公羊“Uardry 0.1”的傲人雄姿为图案。这只羊被称为澳洲货币史上曝光度最高、家喻户晓的“澳洲第一神羊”。",
    details: "极具写实主义的种公羊半身像。其羊角盘曲盘叠、层次密致、重实，饱含力量美感；羊毛蓬松繁茂，在微雕雕版中丝丝清晰。彰显了当时全澳洲蓬勃畜牧农业的万千气象。"
  },
  "mongolia-argali": {
    name: "蒙古阿尔加利盘羊水晶眼币",
    country: "蒙古国",
    year: "2006年 (丙戌年)",
    denomination: "500图格里克",
    material: ".999足银",
    size: "直径 38.61mm | 重量 31.1g (1盎司)",
    history: "蒙古国发行的“世界野生动物级保护系列”首发银币，由于使用了震惊硬币界的极端超高浮雕技术，配合在盘羊眼睛部位镶嵌了两颗黑色施华洛世奇大水晶，在2006年面市后即在欧美及亚洲引发收藏狂热，并在2008年荣获世界硬币最佳创意大奖，是硬币收藏界的无上名誉和传奇币种。阿尔加利盘羊（Argali Sheep）是地球上体量最丰庞的野山羊，栖身于蒙古国的高原陡山间。",
    details: "主视图为野盘羊头部几乎近90度的正面撞色浮雕。粗壮巍峨的盘羊弯月羊角带着沧桑的年轮，几欲刺破币面向外突起，立体感震慑心魄。羊眼中嵌入两颗曜石黑水晶，在光源转动下爆发出深邃野性的魂芒，非常唯美。"
  },
  "europe-mouflon": {
    name: "欧洲塞浦路斯摩弗仑大角羊币",
    country: "塞浦路斯 (欧盟时代)",
    year: "2008年至今每年发行",
    denomination: "1 / 2 / 5 欧分",
    material: "铜包钢",
    size: "直径 16.25mm-21.25mm",
    history: "塞浦路斯加入欧盟区后发行的塞国版欧元流通硬币。塞国有感于人与万物合一，将濒临灭绝、原产于地中海塞浦路斯群山的国家保护一等保护神兽——摩弗仑野山羊（Mouflon）印制在硬币面上。摩弗仑羊身手敏捷矫健，在历史绝壁上跃迁，被认为是家养绵羊最始祖的野性种，代表着塞浦路斯人民在地中海浪涛里建国的勤勉坚毅与对生态万象的热诚守护。",
    details: "硬币绘制双羊在塞国山谷间跳跃穿行的活泼简练构图，野羊的大羊角弯曲出优雅的大满月半圆。硬币边缘环绕有星旗的欧式十二颗环星。本系列是目前欧洲大陆唯一在流通货币中日常抚摸、流转最广的羊主题硬币。"
  },
  "nz-merino": {
    name: "新西兰美利奴飞羊与雪山金银币",
    country: "新西兰",
    year: "2013-2015年",
    denomination: "1纽元",
    material: ".999足银",
    size: "直径 40.0mm | 重量 31.1g (1盎司)",
    history: "放眼全球，新西兰属于羊跟人口占比最瞩目、农业畜牧文明登峰造极的国家。新西兰出产的美利奴高山羊毛代表了最顶尖的轻奢面料。新西兰邮政在2013-2015年纪念放牧丰盛岁月特别推出此币。其将剪羊毛文化、牧羊犬守候、漫山雪原景致绘入钱币，讴歌羊群对建国、农业创汇和人民美好生活的非凡贡献，散发出诗情画意的新西兰牧歌情调。",
    details: "银币采用了多梯度的微细喷沙打磨，在前景描摹出饱满蓬勃的美利奴大羊，牧羊犬在草垛旁守护；背景则是巍峨皑皑的新西兰南阿尔卑斯雪山山峰，云雾掩映，将风光的透视空间演绎得层级宽广，好似一幅经典的西方铜版田园组油画。"
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Coins Historian Chat Gateway (Server-Side proxying of Gemini requests)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, coinId, chatHistory } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      // Lazy check and fallback
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({ 
          text: "【博览馆助理提示】：当前未配置有效的 `GEMINI_API_KEY`。请通过 AI Studio 的 Settings -> Secrets 菜单将您的 Gemini 密钥填入 `GEMINI_API_KEY` 中，保存后即可开启智能同声同屏 AI 钱币学家陪同讲解服务！\n\n当前我将为您预制静态的专业学术解答：这款羊币拥有极为悠久的历史，羊角代表了中华文脉与西方希腊神话中的‘丰饶之角’(Cornucopia)，展现了人类畜牧与文明发展的奇妙交汇。" 
        });
      }

      // Initialize brand new GoogleGenAI SDK client
      const ai = new GoogleGenAI({ apiKey });

      const coinDetail = coinId ? SYSTEM_COIN_DATA[coinId] : null;

      // Setting up master expert persona
      let systemInstruction = "你是一位享誉国际的钱币学家、资深收藏家、十二生肖与世界历史文化专家。你正在温雅祥和的“世界羊币三维探索博览馆”中担任金牌人工智能导览员。";
      systemInstruction += "\n你的职责是：使用温柔优雅、知识渊博、学富五车、极其耐心的专业学者语气去细致入微地回答访客提出的各种硬币历史、制造工艺、艺术雕章、以及羊生肖文化背景知识。";
      systemInstruction += "\n请时刻做到通俗易懂与严谨求实相辅相成。回答时不需要主动罗列冗长枯燥的数据（除非客人在追问），而是讲出硬币背后的‘人文历史故事’和‘铸币厂工艺细节’。";

      if (coinDetail) {
        systemInstruction += `\n访客当前正捧在手心并全屏放大端详这枚硬币: 【${coinDetail.name}】。
以下是关于它的权威绝密钱币档案：
- 地缘国家: ${coinDetail.country}
- 发行年代: ${coinDetail.year}
- 钱币面值: ${coinDetail.denomination}
- 材质质地: ${coinDetail.material}
- 重量外尺: ${coinDetail.size}
- 历史背景: ${coinDetail.history}
- 工艺美感: ${coinDetail.details}

请优先结合此份权威档案，以饱满热情深挖细节，向访客详细介绍此币的历史源流、铸造难点、存世状况，让他们发出惊叹。你可以适当延伸，但必须紧扣事实，避免胡说八道。回答请一律使用中文。`;
      } else {
        systemInstruction += "\n访客当前正在漫游三维星空地图。你可以解答他们关于本馆展示的任何羊题材硬币（包括罕见的1936广东五羊壹仙、双金属10元生肖币、英国两只羊、澳洲银先令、蒙古超高浮雕、欧洲摩弗仑、新西兰牧歌飞羊）的通识概念、世界铸币史常识等。";
      }

      // Reformat standard chat histories
      const contents: any[] = [];
      if (chatHistory && Array.isArray(chatHistory)) {
        for (const turn of chatHistory) {
          contents.push({
            role: turn.role === "user" ? "user" : "model",
            parts: [{ text: turn.text }]
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      // Call modern gemini-3.5-flash
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.75,
          maxOutputTokens: 2048,
        }
      });

      res.json({ text: response.text || "历史学教授陷入了沉思，请稍后重试。" });
    } catch (err: any) {
      console.error("Gemini server error detail:", err);
      res.status(500).json({ error: err.message || "后端助理连接拥堵，暂时停运" });
    }
  });

  // Integration of Vite development server OR serving built index.html
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[羊硬币馆] Express dev/static server initialized successfully on: http://localhost:${PORT}`);
  });
}

startServer();
