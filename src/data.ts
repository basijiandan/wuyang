import { Coin } from "./types";

// @ts-expect-error - PNG image is compiled and resolved successfully by Vite
import guangdongImg from "./assets/images/china_guangdong_coin_1780576552982.png";
// @ts-expect-error - PNG image is compiled and resolved successfully by Vite
import zodiacImg from "./assets/images/china_zodiac_coin_1780576568716.png";
// @ts-expect-error - PNG image is compiled and resolved successfully by Vite
import royalImg from "./assets/images/uk_royal_coin_1780576581862.png";
// @ts-expect-error - PNG image is compiled and resolved successfully by Vite
import ramImg from "./assets/images/australia_ram_coin_1780576595157.png";
// @ts-expect-error - PNG image is compiled and resolved successfully by Vite
import argaliImg from "./assets/images/mongolia_argali_coin_1780576612124.png";
// @ts-expect-error - PNG image is compiled and resolved successfully by Vite
import mouflonImg from "./assets/images/europe_mouflon_coin_1780576625173.png";
// @ts-expect-error - PNG image is compiled and resolved successfully by Vite
import merinoImg from "./assets/images/nz_merino_coin_1780576638748.png";

export const COINS_DATA: Coin[] = [
  {
    id: "china-guangdong",
    name: "广东五羊壹仙铜币",
    country: "中国 广东 (Guangdong, China)",
    year: "民国二十五年 (1936年)",
    denomination: "壹仙 (One Cent)",
    material: "红铜 (Copper)",
    size: "直径 21.8mm | 重量 3.2g",
    diameter: "21.8mm",
    weight: "3.2g",
    symbol: "五羊",
    metalColor: "bronze",
    coords: { lat: 23.1291, lng: 113.2644 }, // Guangzhou
    history: "民国二十五年（1936年），国民政府广州造币厂计划铸造发行一套地方铜币，其中‘壹仙’币面设计极具地方文化特色——印有广州传说中的‘五羊衔谷’图案。这五只神态各异的仙羊环绕中央，寓意‘五羊福地，岁岁丰登’。然而，随着抗日战争全面爆发，广州造币厂不久后停产，这枚硬币未及全面正式发行便胎死腹中。目前存世实物极度稀少，绝大多数为试铸样币。它是中国机制币史和广州近代城市文化的顶级名誉珍品，在各大拍卖会上皆是藏家竞相追逐的焦点。",
    background: "该币背后的历史渊源极深。民国二十五年，广东处于半自治割据状态的末期，由地方实力派主政。为稳固地方财政，造币厂特聘名雕刻师创制五羊铜币。羊在中国古文化中是和平安宁、五谷丰登的终极象征，尤其与粤地文化脉络互通。当时局势动荡，华北危机，中日全面冲突一触即发，南京国民政府实行法币改革，下令废除并收回地方铸币权。因此，这枚极尽雕工之巧的五羊仙币便留在了试铸样币阶段，未得大规模流通用世。目前传世样币珍若拱璧，成为记录近代广东金融独立、民俗图腾绝无仅有的实物见证。",
    details: "硬币正面中心为五只浮雕山羊围成环形，其间点缀稻穗麦芒，线条生动飘逸，具有极高的雕刻美学价值。背部中央为圆框，框内书篆体‘壹仙’，外圈围党徽图样及中华民国二十五年纪年词。铜币呈古朴红铜色，历经岁月包浆更显温润，立体羊角的雕工在近代机制币中罕有其匹。",
    funFact: "‘五羊城’是广州的历史雅号。此币是全中国乃至全世界唯一一枚将代表地方神话传说的‘五只羊’同时铸刻在一起的法定货币样币。",
    image: guangdongImg
  },
  {
    id: "china-zodiac",
    name: "中国生肖贺岁羊年纪念币",
    country: "中国 (China)",
    year: "乙未年 (2015年)",
    denomination: "拾圆 (10 RMB)",
    material: "双色铜合金 (Bi-metallic Ring/Core)",
    size: "直径 27.0mm | 重量 9.2g",
    diameter: "27.0mm",
    weight: "9.2g",
    symbol: "🏮",
    metalColor: "bimetallic",
    coords: { lat: 39.9042, lng: 116.4074 }, // Beijing
    history: "中国人民银行于2015年2月6日发行了2015年乙未羊年普通纪念币。这是中国第二轮生肖普通纪念币的‘领头羊’（首枚）。第一轮生肖羊币发行于2003年，面额为1元，材质为黄铜。而第二轮生肖羊币面额提升至10元，首次采用了双色铜合金（外环黄铜合金、内芯双层铜合金）的高规格制造工艺。此币的发行引发了极高的收藏热潮，寄托了中华儿女对于乙未羊年‘三阳开泰’、‘吉祥安康’的年节期许与文化敬意。",
    background: "作为中国第二轮生肖普通纪念币的领衔作品，此币的发行承载着中国悠久的生肖历法和农历乙未羊年的贺岁文化。在中华民俗中，‘未’代表未土，传统生肖属羊。羊温和顺从，具有跪乳之恩，象征孝悌；而‘羊’古通‘祥’，古语‘吉羊’即‘吉祥’，‘三阳开泰’代表了岁首迎新、冬去春来的大吉之兆。该币不仅在技术上采用内外双色铜合金工艺，更融汇中国传统的民间剪纸、石刻艺术及宫灯民俗，将国家币制防伪与中华年俗紧密结合。",
    details: "币面主景是一只神气活现、回首盘角的大绵羊，羊角弯曲有致，身上绣满中国传统祥云花卉。左侧配以中国剪纸风格的挂缀宫灯、窗花和吉祥草纹。硬币制造技术极为精湛，边缘具有交替的斜全齿与无齿防伪、硬币正面左侧有隐形微缩文字‘10’和‘YUBI’，具有多层次喷砂和精雕质感。",
    funFact: "由于是第二轮生肖纪念币的开山之作，且采用了大面值双金属币工艺，其首开的高雕刻、双色拼接视觉效果，被钱币爱好者尊称为现代贺岁币的‘颜值担当’。",
    image: zodiacImg
  },
  {
    id: "uk-royal",
    name: "英国皇家造币厂羊年金银币",
    country: "英国 (United Kingdom)",
    year: "乙未年 (2015年)",
    denomination: "2英镑 (2 GBP)",
    material: ".999足银 (Fine Silver)",
    size: "直径 38.61mm | 重量 31.1g (1oz)",
    diameter: "38.61mm",
    weight: "31.1g (1oz)",
    symbol: "🐏",
    metalColor: "silver",
    coords: { lat: 51.5074, lng: -0.1278 }, // London
    history: "为庆祝并向源远流长的中华生肖文化致敬，英国皇家造币厂（The Royal Mint）自2014年起特别推出了‘中国生肖系列’法定货币（Shengxiào Collection）。2015乙未羊年纪念银币是该系列的第二部杰作。该系列特邀英国皇家美术家协会、华裔知名艺术家何敏仪（Wuon-Gean Ho）担纲主导设计，将大不列巅传统的铸造底蕴与中国生肖之美、东方剪纸风骨有机统一，开创了欧洲造币界生肖题材的新风尚。",
    background: "英国皇家造币厂在2015年特别委托华裔剪纸兼版画艺术家何敏仪设计此款中国生肖羊年银币。该设计成功将两个截然不同的文化语境融会贯通。对于英国而言，本土约克郡绵羊不仅是乡村田园牧歌和工业羊毛重镇的经济基石，更是平和宁静、乡村美学之缩影；对中国而言，生肖羊是富足、祥和与温良的寄托。通过极其鲜明的西式木刻版画风格描绘英伦走羊，同时用流动洗练的东方云水纹与悬崖之姿承载万物和谐，是东西方钱币美学珠联璧合、跨国文化交流的里程碑代表。",
    details: "银币主题面呈现两只极为矫健、在山岗上相视而立的英国本土约克郡绵羊。画面既有木刻版画的古朴骨感，又融入了流线型的中国传统剪纸美学，展现羊群温顺笃定却坚韧不拔的性格。另一面为女王伊丽莎白二世（Elizabeth II）第五代官方标准硬币肖像。全币经精打细磨，底面如镜面般闪耀，浮雕呈致密冰沙白。",
    funFact: "设计师何敏仪本身是一位印版画艺术家兼持牌兽医！她深厚的动物解剖知识，让银币上的绵羊骨骼神态刻画得比普通生肖币更加舒展自然、野性真实。",
    image: royalImg
  },
  {
    id: "australia-ram",
    name: "澳大利亚先令美利奴公羊币",
    country: "澳大利亚 (Australia)",
    year: "乔治六世/伊丽莎白二世时期 (1937-1964年)",
    denomination: "1先令 (1 Shilling)",
    material: ".500/.925白银 (Silver)",
    size: "直径 23.5mm | 重量 5.65g",
    diameter: "23.5mm",
    weight: "5.65g",
    symbol: "🦙",
    metalColor: "silver",
    coords: { lat: -35.2809, lng: 149.1300 }, // Canberra
    history: "澳大利亚被称为‘骑在羊背上的国家’（The land that rode on the sheep's back）。自25世纪初以来，美利奴羊毛产业是该国的绝对经济支柱。为了永久表彰这一卓越功勋，澳大利亚联邦于1937年乔治六世登基后，重新设计银币，将当时的全国特等奖美利奴种公羊（名为‘Uardry 0.1’）的庄严雄姿和巨大卷曲大角铸刻在1先令硬币上。此币发行历经两代君主（乔治六世和伊丽莎白二世），直至1966年澳大利亚改行十进制币制并废除先令，是澳洲货币史黄金时代的代表作。",
    background: "澳大利亚这枚1先令硬币极具国家支柱产业的宏观背景。20世纪中期不列颠帝国羊毛贸易鼎盛期，澳大利亚培育出了举世闻名的美利奴种羊。美利奴羊毛纤维极其纤细纯净，是世界高级定制面料不可或缺的珍品。‘骑在羊背上的国家’由此得名。1937年，为向全国最杰出的‘美利奴Uardry 0.1’公羊致敬，联邦政府决定颠覆以往将政权王冠或国徽印于币背的惯例，突鼻写实羊首，凸显羊毛产业在澳洲建国与经济政治独立史中的绝对脊梁地位。",
    details: "主题面是一只纯写实主义的巨型美利奴公羊半身像。它拥有极具力量美、盘曲了数圈的重型华丽羊角，层叠茂厚、蓬松柔软的天然羊毛褶皱在微距浮雕中丝丝入扣，眼神傲视远方，透露出高贵的‘领头羊’风范。下方铸环绕文‘SHILLING’字样。",
    funFact: "币面上的公羊原型‘Uardry 0.1’在1932年的悉尼羊展上夺得至尊金奖，它的肖像自此登入硬币，由于该币流传极广，这只羊也成为了澳洲历史名气最大的‘国羊’。",
    image: ramImg
  },
  {
    id: "mongolia-argali",
    name: "蒙古阿尔加利盘羊水晶眼币",
    country: "蒙古 (Mongolia)",
    year: "丙戌年 (2006年)",
    denomination: "500图格里克 (500 Togrog)",
    material: ".999足银 (Fine Silver)",
    size: "直径 38.61mm | 重量 31.1g (1oz)",
    diameter: "38.61mm",
    weight: "31.1g (1oz)",
    symbol: "🐑",
    metalColor: "silver",
    coords: { lat: 47.8864, lng: 106.9057 }, // Ulaanbaatar
    history: "蒙古国于2006年推出了震动全球钱币收藏界的‘世界野生动物系列（Wild Conservation）’首枚硬币——阿尔加利盘羊纪念银币。阿尔加利盘羊（Argali）是地球上体型最大的野生盘羊，栖息于蒙古连绵的高原地带。该硬币一改传统纪念币扁平单一的局面，采用了极致超高浮雕（Ultra-High Relief）技术，并大胆引入两颗天然施华洛世奇黑色水晶作为盘羊双眸，在2008年荣获世界硬币大奖‘最佳创意币’与‘年度金币’提名，堪称现代纪念币史上的殿堂级里程碑。",
    background: "外蒙古广袤的戈壁与连绵的阿尔泰山脉，是地球上体格最庞大、大角最壮美的阿尔加利盘羊（Argali）的原乡。作为蒙古国野生动物生态保护的重要号召，该国于2006年倾心打造此币。它创造性地引入两颗黑色施华洛世奇水晶作为野盘羊高耸的双目，这在国际造币历史上尚属首开先河。另外，该币利用超凡的三维立体深冲技术，将高达数毫米的狂野弯角近乎裸眼3D式地‘浮出’币面，警醒人类尊重自然边界、保护野生盘羊，被学术界誉为当代雕刻写实主义与科技画具跨界融合的世纪奇迹。",
    details: "盘羊以接近90度的正面视角直冲向观者，其最具压迫感的一对超宽盘曲双角以出屏级的三维立体感浮凸于银面之上，双角上的年轮褶皱斑驳沧桑。最亮眼的点睛之笔是其嵌有一对黑曜光泽的施华洛世奇水晶瞳孔，在不同光线转动下折射出野生动物生动、野性而神秘的幽光，工艺难度令人叹为观止。",
    funFact: "由于高超的艺术设计和极低的发行量（仅2500枚），这枚银币在国际藏市的价格自发行后飙升了十数倍，被欧美币圈誉为‘21世纪最值得收藏的创意银币三甲之一’。",
    image: argaliImg
  },
  {
    id: "europe-mouflon",
    name: "欧洲塞浦路斯摩弗仑羊币",
    country: "塞浦路斯 (Cyprus / 欧洲)",
    year: "2008年至今 (欧盟欧元时代)",
    denomination: "5 欧分 (5 Euro Cents)",
    material: "铜包钢 (Copper-Plated Steel)",
    size: "直径 21.25mm | 重量 3.92g",
    diameter: "21.25mm",
    weight: "3.92g",
    symbol: "🐐",
    metalColor: "bronze",
    coords: { lat: 35.1856, lng: 33.3823 }, // Nicosia, Cyprus
    history: "塞浦路斯于2008年加入欧元区，在设计其本国版欧元辅币时，决定将塞浦路斯最引以为豪的国宝野生动物——摩弗仑羊（Mouflon）铸刻在1欧分、2欧分和5欧分硬币背面。摩弗仑羊是原产于地中海地区（塞浦路斯和撒丁岛等）的珍稀野角羊，被学术界认为是现代绝大多数温顺家养绵羊在远古时期的唯二始祖之一。在陡峭石壁上敏捷跳跃的摩弗仑羊，象征着这个岛国在漫长地中海波涛中求存、发展并融入欧洲大家庭的拼搏精神。",
    background: "地中海美丽岛国塞浦路斯于2008年加入欧元区，在面对全欧洲4亿多人口的统一大市场时，选择将其特有的野生‘摩弗仑盘角羊’铸刻于面值 1/2/5 欧分币面之上。摩弗仑羊（Mouflon）是人类一切驯化家养绵羊的远古野生始祖之一，生活在人迹罕至的塞国特罗多斯山脉森林中。中世纪以来它在陡峭岩壁自由跳跃、顽强生存的神姿，完美诠释了塞浦路斯人在地中海文明交汇处的坚毅不屈、对自由与自然的至高崇尚。这也成为欧元庞大体系中极其独特的一道‘自然物图腾’。",
    details: "币面上两只摩弗仑盘角大羚羊在象征地中海崇山峻岭的小石阶上轻盈跳跃。野羊体态轻盈精健，角质弯曲呈优雅反向弓弧度，极富动感。外圈由代表欧盟的经典的12颗星环绕。这套硬币也是极少有的在1亿以上的庞大欧元流通人口中日常传阅的‘羊’图腾法定货币。",
    funFact: "由于摩弗仑羊在19世纪一度处于灭绝边缘（仅剩十数只），塞浦路斯政府对其展开保护。如今它的形象不仅在硬币上，还是塞浦路斯国家航空的标志，是名副其实的国宝代言人。",
    image: mouflonImg
  },
  {
    id: "nz-merino",
    name: "新西兰美利奴飞羊金银币",
    country: "新西兰 (New Zealand)",
    year: "甲午-乙未年 (2013-2015年)",
    denomination: "1纽元 (1 NZD)",
    material: ".999足银 (Fine Silver)",
    size: "直径 40.0mm | 重量 31.1g (1oz)",
    diameter: "40.0mm",
    weight: "31.1g (1oz)",
    symbol: "🌾",
    metalColor: "silver",
    coords: { lat: -40.9006, lng: 174.8860 }, // Wellington, NZ
    history: "作为南半球大洋绿洲，新西兰是人均牧羊树占比最高的国家之一，牧羊与剪毛（Shearing）文化早已浸润入国民血液。新西兰邮政（New Zealand Post）在2013-2015年间发行了数套‘美利奴羊与丰收牧歌’纪念银币。这些银币用极其唯美、极具空间景深感的西方古典浪漫主义风格，记录了美利奴细毛羊在南阿尔卑斯群山下悠然栖息的历史叙事，传递出‘长白云之乡’生机盎然的农业史诗。",
    background: "新西兰被称为长白云之乡，高山牧场遍布南北双岛。19世纪初期，细羊毛之王——美利奴羊引入新西兰高海拔多岩的南阿尔卑斯山麓。由于山势严酷、高寒温差极大，在这片土地繁衍的新西兰美利奴细羊毛，逐渐进化得极度柔顺、保温御寒且轻盈坚韧，成为高档雪地及航天服饰的核心天然用料。新西兰邮政发行的本套‘美利奴羊高山牧歌’纪念币，通过经典写实油画质感的币面，描绘了人、犬、羊在雪山峻岭下和谐共生、安居乐业的自然法则，将新西兰立国之本的悠扬乡村田园牧歌情怀诉诸金属。",
    details: "银币反面精刻了一位新西兰牧羊犬在牧栏边守护肥壮美利奴细毛羊的田园风景，远景则是采用多重喷砂打磨的新西兰标志性巍峨壮丽的雪山高地与茂盛牧草，空间拉伸感极强。银币的金属浮雕将羊毛的蓬密弹性与雪山岩石的粗粝感体现得层次分明，镜面质感纯净无暇。",
    funFact: "新西兰的美利奴羊毛闻名全球高级成衣行业。由于这些羊在高山寒冷地带生活，它们的羊毛极其细密且极具弹性。在当地，剪发和羊群养殖至今是国家最崇高的社区活动之一。",
    image: merinoImg
  }
];

export const COIN_DATA_MAP = COINS_DATA.reduce((acc, coin) => {
  acc[coin.id] = coin;
  return acc;
}, {} as Record<string, Coin>);
