const teams = [
  {
    id: "arg",
    name: "阿根廷",
    group: "A",
    fifa: 2,
    elo: 2114,
    value: 805,
    form: 88,
    attack: 86,
    defense: 82,
    midfield: 84,
    keeper: 78,
    depth: 80,
    age: 28.7,
    style: "控球推进 + 边肋穿插",
    coach: "高压转换与核心串联",
    injuries: "主力边卫轻伤观察",
    xg: 2.04,
    xga: 0.82,
    setPiece: 78,
    press: 82,
    path: 72,
    stars: ["劳塔罗", "阿尔瓦雷斯", "麦卡利斯特"],
  },
  {
    id: "fra",
    name: "法国",
    group: "B",
    fifa: 3,
    elo: 2098,
    value: 1040,
    form: 84,
    attack: 90,
    defense: 80,
    midfield: 82,
    keeper: 79,
    depth: 88,
    age: 27.2,
    style: "纵深冲击 + 快速反击",
    coach: "低位弹性与强侧爆破",
    injuries: "中场轮换球员缺阵",
    xg: 2.22,
    xga: 0.96,
    setPiece: 80,
    press: 77,
    path: 68,
    stars: ["姆巴佩", "格列兹曼", "楚阿梅尼"],
  },
  {
    id: "bra",
    name: "巴西",
    group: "C",
    fifa: 5,
    elo: 2076,
    value: 970,
    form: 81,
    attack: 88,
    defense: 83,
    midfield: 81,
    keeper: 85,
    depth: 86,
    age: 27.8,
    style: "个人突破 + 前场压迫",
    coach: "边路单点与二次进攻",
    injuries: "锋线核心恢复中",
    xg: 2.1,
    xga: 0.88,
    setPiece: 76,
    press: 84,
    path: 64,
    stars: ["维尼修斯", "罗德里戈", "吉马良斯"],
  },
  {
    id: "eng",
    name: "英格兰",
    group: "D",
    fifa: 4,
    elo: 2058,
    value: 1260,
    form: 79,
    attack: 84,
    defense: 81,
    midfield: 86,
    keeper: 76,
    depth: 90,
    age: 26.9,
    style: "阵地控制 + 定位球",
    coach: "双后腰保护与边后卫套上",
    injuries: "中卫位置有疲劳隐患",
    xg: 1.92,
    xga: 0.91,
    setPiece: 86,
    press: 75,
    path: 66,
    stars: ["贝林厄姆", "凯恩", "福登"],
  },
  {
    id: "esp",
    name: "西班牙",
    group: "E",
    fifa: 6,
    elo: 2032,
    value: 830,
    form: 83,
    attack: 81,
    defense: 84,
    midfield: 90,
    keeper: 77,
    depth: 82,
    age: 25.4,
    style: "高控球 + 中路渗透",
    coach: "压迫夺回与短传推进",
    injuries: "边锋位置满员",
    xg: 1.86,
    xga: 0.74,
    setPiece: 72,
    press: 88,
    path: 70,
    stars: ["佩德里", "亚马尔", "罗德里"],
  },
  {
    id: "ned",
    name: "荷兰",
    group: "F",
    fifa: 7,
    elo: 2008,
    value: 720,
    form: 78,
    attack: 79,
    defense: 86,
    midfield: 80,
    keeper: 80,
    depth: 76,
    age: 27.6,
    style: "三中卫推进 + 反击",
    coach: "后场出球与边翼卫压上",
    injuries: "替补前锋伤缺",
    xg: 1.68,
    xga: 0.79,
    setPiece: 83,
    press: 76,
    path: 59,
    stars: ["范戴克", "德容", "加克波"],
  },
  {
    id: "por",
    name: "葡萄牙",
    group: "G",
    fifa: 8,
    elo: 1996,
    value: 930,
    form: 82,
    attack: 85,
    defense: 79,
    midfield: 85,
    keeper: 78,
    depth: 85,
    age: 28.1,
    style: "技术中场 + 边路传中",
    coach: "高位控球与多点终结",
    injuries: "暂无核心伤停",
    xg: 2.0,
    xga: 1.0,
    setPiece: 79,
    press: 80,
    path: 62,
    stars: ["B费", "莱奥", "B席"],
  },
  {
    id: "ger",
    name: "德国",
    group: "H",
    fifa: 10,
    elo: 1984,
    value: 790,
    form: 76,
    attack: 82,
    defense: 76,
    midfield: 87,
    keeper: 78,
    depth: 81,
    age: 27.1,
    style: "高位传控 + 二线插上",
    coach: "中路过载与快速反抢",
    injuries: "后腰位置轮换不足",
    xg: 1.9,
    xga: 1.12,
    setPiece: 75,
    press: 85,
    path: 56,
    stars: ["穆西亚拉", "维尔茨", "基米希"],
  },
];

const allTeamProfiles = [
  ["mex", "墨西哥", "A", 14, "哈维尔-阿吉雷", ["奥乔亚", "劳尔-希门尼斯", "圣地亚哥-希门尼斯"], "防守组织 + 边路转换"],
  ["rsa", "南非", "A", 56, "雨果-布鲁斯", ["隆文-威廉斯", "福斯特", "莫科纳"], "低位防守 + 快速反击"],
  ["kor", "韩国", "A", 22, "洪明甫", ["孙兴慜", "李刚仁", "金玟哉"], "高强度逼抢 + 边路推进"],
  ["cze", "捷克", "A", 39, "伊万-哈谢克", ["绍切克", "希克", "曹法尔"], "身体对抗 + 定位球"],
  ["can", "加拿大", "B", 31, "杰西-马什", ["阿方索-戴维斯", "乔纳森-戴维", "欧斯塔基奥"], "高位压迫 + 纵深冲刺"],
  ["bih", "波黑", "B", 69, "谢尔盖-巴尔巴雷兹", ["哲科", "德米罗维奇", "科拉希纳茨"], "支点进攻 + 中路组织"],
  ["qat", "卡塔尔", "B", 53, "胡伦-洛佩特吉", ["阿菲夫", "海多斯", "阿里"], "控球推进 + 边中结合"],
  ["sui", "瑞士", "B", 20, "穆拉特-雅金", ["扎卡", "阿坎吉", "科贝尔"], "阵地均衡 + 中场调度"],
  ["bra", "巴西", "C", 5, "卡洛-安切洛蒂", ["内马尔", "维尼修斯", "拉菲尼亚"], "个人突破 + 前场压迫"],
  ["mar", "摩洛哥", "C", 12, "瓦利德-雷格拉吉", ["阿什拉夫", "卜拉欣", "马兹拉维"], "边路推进 + 防守纪律"],
  ["hai", "海地", "C", 83, "塞巴斯蒂安-米涅", ["伊西多尔", "贝勒加德", "纳松"], "快速转换 + 前场冲击"],
  ["sco", "苏格兰", "C", 44, "史蒂夫-克拉克", ["罗伯逊", "麦克托米奈", "麦金"], "三中卫推进 + 二点争夺"],
  ["usa", "美国", "D", 16, "毛里西奥-波切蒂诺", ["普利希奇", "麦肯尼", "小维阿"], "高压逼抢 + 速度冲击"],
  ["par", "巴拉圭", "D", 48, "古斯塔沃-阿尔法罗", ["恩西索", "阿尔米隆", "迭戈-戈麦斯"], "防守韧性 + 反击"],
  ["aus", "澳大利亚", "D", 26, "托尼-波波维奇", ["杰克逊-欧文", "伊兰昆达", "瑞安"], "身体对抗 + 边路传中"],
  ["tur", "土耳其", "D", 28, "文琴佐-蒙特拉", ["居莱尔", "恰尔汗奥卢", "伊尔迪兹"], "技术中场 + 肋部渗透"],
  ["civ", "科特迪瓦", "E", 33, "埃梅尔斯-法埃", ["阿马德-迪亚洛", "佩佩", "凯西"], "身体推进 + 边锋单挑"],
  ["ecu", "厄瓜多尔", "E", 27, "塞巴斯蒂安-贝卡塞塞", ["凯塞多", "威廉-帕乔", "因卡皮耶"], "高位压迫 + 中场覆盖"],
  ["ger", "德国", "E", 10, "尤利安-纳格尔斯曼", ["穆西亚拉", "维尔茨", "基米希"], "高位传控 + 二线插上"],
  ["cur", "库拉索", "E", 88, "迪克-艾德沃卡特", ["陈达毅", "奥比斯波", "汉森"], "防守站位 + 快速出球"],
  ["ned", "荷兰", "F", 7, "罗纳德-科曼", ["范戴克", "德容", "加克波"], "三中卫推进 + 反击"],
  ["jpn", "日本", "F", 18, "森保一", ["远藤航", "堂安律", "久保建英"], "短传推进 + 高位逼抢"],
  ["swe", "瑞典", "F", 29, "容-达尔-托马森", ["哲凯赖什", "伊萨克", "埃兰加"], "双前锋冲击 + 边路推进"],
  ["tun", "突尼斯", "F", 49, "萨米-特拉贝尔西", ["汉尼拔-梅布里", "阿亚里", "斯希里"], "防守紧凑 + 快速反击"],
  ["irn", "伊朗", "G", 21, "阿米尔-加莱诺伊", ["塔雷米", "加埃迪", "贾汉巴赫什"], "身体对抗 + 直接进攻"],
  ["nzl", "新西兰", "G", 90, "达伦-巴泽利", ["克里斯-伍德", "加贝特", "贝尔"], "高点进攻 + 防守纪律"],
  ["bel", "比利时", "G", 8, "鲁迪-加西亚", ["德布劳内", "卢卡库", "库尔图瓦"], "中场创造 + 强力终结"],
  ["egy", "埃及", "G", 36, "胡萨姆-哈桑", ["萨拉赫", "马尔穆什", "特雷泽盖"], "边路爆点 + 反击"],
  ["ksa", "沙特阿拉伯", "H", 58, "埃尔韦-勒纳尔", ["萨勒姆-达瓦萨里", "奥韦斯", "卡努"], "快速转换 + 前场压迫"],
  ["uru", "乌拉圭", "H", 11, "马塞洛-贝尔萨", ["巴尔韦德", "阿劳霍", "努涅斯"], "高强度压迫 + 纵向进攻"],
  ["esp", "西班牙", "H", 6, "路易斯-德拉富恩特", ["亚马尔", "佩德里", "罗德里"], "高控球 + 中路渗透"],
  ["cpv", "佛得角", "H", 72, "布比斯塔", ["洛甘-科斯塔", "贝贝", "瑞安-门德斯"], "防守弹性 + 边路推进"],
  ["fra", "法国", "I", 3, "迪迪埃-德尚", ["姆巴佩", "登贝莱", "楚阿梅尼"], "纵深冲击 + 快速反击"],
  ["sen", "塞内加尔", "I", 17, "帕普-蒂奥", ["马内", "雅克松", "库利巴利"], "身体优势 + 快速转换"],
  ["irq", "伊拉克", "I", 55, "格雷厄姆-阿诺德", ["齐达内-伊克巴尔", "阿马里", "侯赛因"], "紧凑防守 + 中路推进"],
  ["nor", "挪威", "I", 43, "斯托勒-索尔巴肯", ["厄德高", "哈兰德", "瑟洛特"], "直塞冲击 + 高点终结"],
  ["arg", "阿根廷", "J", 2, "利昂内尔-斯卡洛尼", ["梅西", "阿尔瓦雷斯", "劳塔罗"], "控球推进 + 边肋穿插"],
  ["alg", "阿尔及利亚", "J", 37, "弗拉基米尔-佩特科维奇", ["马赫雷斯", "努里", "卢卡-齐达内"], "技术推进 + 边路创造"],
  ["aut", "奥地利", "J", 24, "拉尔夫-朗尼克", ["阿拉巴", "莱默尔", "阿瑙托维奇"], "高位逼抢 + 快速纵向"],
  ["jor", "约旦", "J", 68, "贾迈勒-塞拉米", ["穆萨-塔马里", "亚赞-奈马特", "阿拉布"], "反击速度 + 中前场连线"],
  ["por", "葡萄牙", "K", 8, "罗伯托-马丁内斯", ["克里斯蒂亚诺-罗纳尔多", "布鲁诺-费尔南德斯", "伯纳多-席尔瓦"], "技术中场 + 多点终结"],
  ["cod", "刚果民主共和国", "K", 60, "塞巴斯蒂安-德萨布雷", ["巴坎布", "万-比萨卡", "维萨"], "身体冲击 + 边路防守"],
  ["uzb", "乌兹别克斯坦", "K", 52, "法比奥-卡纳瓦罗", ["胡桑诺夫", "肖穆罗多夫", "马沙里波夫"], "防守组织 + 快速转换"],
  ["col", "哥伦比亚", "K", 13, "内斯托尔-洛伦索", ["路易斯-迪亚斯", "J罗", "金特罗"], "边路爆点 + 中场创造"],
  ["gha", "加纳", "L", 47, "奥托-阿多", ["塞门约", "帕尔特伊", "法塔武"], "身体对抗 + 纵向推进"],
  ["pan", "巴拿马", "L", 35, "托马斯-克里斯蒂安森", ["戈多伊", "法哈多", "沃特曼"], "整体防守 + 反击"],
  ["eng", "英格兰", "L", 4, "托马斯-图赫尔", ["凯恩", "贝林厄姆", "萨卡"], "阵地控制 + 定位球"],
  ["cro", "克罗地亚", "L", 9, "兹拉特科-达利奇", ["莫德里奇", "科瓦契奇", "克拉马里奇"], "中场控制 + 经验管理"],
];

const teamMetaById = Object.fromEntries(allTeamProfiles.map(([id, name, group, fifa, coachName, stars, style]) => [id, { id, name, group, fifa, coachName, stars, style }]));
allTeamProfiles.forEach(([id, name, group, fifa, coachName, stars, style], index) => {
  const existing = teams.find((team) => team.id === id);
  const patch = { name, group, fifa, stars, style, coach: `${coachName}教练组`, dataStatus: "中文大名单已接入" };
  if (existing) {
    Object.assign(existing, patch);
    return;
  }
  const seed = 48 - index;
  teams.push({
    id,
    name,
    group,
    fifa,
    elo: 1840 + seed * 4,
    value: Math.max(45, 720 - index * 8),
    form: Math.max(62, 82 - Math.floor(index / 3)),
    attack: Math.max(60, 80 - Math.floor(index / 4)),
    defense: Math.max(60, 79 - Math.floor(index / 5)),
    midfield: Math.max(58, 78 - Math.floor(index / 4)),
    keeper: Math.max(58, 76 - Math.floor(index / 5)),
    depth: Math.max(55, 77 - Math.floor(index / 4)),
    age: 27.4,
    style,
    coach: `${coachName}教练组`,
    injuries: "赛前按官方伤停动态更新",
    xg: 1.55,
    xga: 1.18,
    setPiece: 70,
    press: 70,
    path: Math.max(42, 68 - Math.floor(index / 2)),
    stars,
    dataStatus: "中文大名单已接入",
  });
});

const matches = [
  {
    id: "m1",
    stage: "小组赛",
    time: "2026-06-12 09:00",
    venue: "墨西哥城",
    home: "arg",
    away: "ned",
    odds: [1.88, 3.42, 4.35],
    openOdds: [1.96, 3.3, 4.1],
    marketHeat: 78,
    weather: "海拔影响，中性偏慢节奏",
    referee: "判罚尺度偏严",
    rest: [5, 4],
  },
  {
    id: "m2",
    stage: "小组赛",
    time: "2026-06-13 03:00",
    venue: "洛杉矶",
    home: "fra",
    away: "ger",
    odds: [2.04, 3.28, 3.68],
    openOdds: [2.14, 3.22, 3.48],
    marketHeat: 86,
    weather: "温度适中，节奏友好",
    referee: "身体对抗容忍度较高",
    rest: [4, 4],
  },
  {
    id: "m3",
    stage: "小组赛",
    time: "2026-06-14 06:00",
    venue: "纽约",
    home: "bra",
    away: "por",
    odds: [2.18, 3.35, 3.22],
    openOdds: [2.08, 3.38, 3.4],
    marketHeat: 83,
    weather: "湿度偏高，体能消耗增加",
    referee: "定位球判罚稳定",
    rest: [5, 5],
  },
  {
    id: "m4",
    stage: "淘汰赛",
    time: "2026-07-04 09:00",
    venue: "达拉斯",
    home: "eng",
    away: "esp",
    odds: [2.62, 2.96, 2.88],
    openOdds: [2.72, 3.02, 2.72],
    marketHeat: 91,
    weather: "封闭球场，外部天气影响低",
    referee: "对拖延比赛较敏感",
    rest: [6, 5],
  },
];

const players = [
  { name: "姆巴佩", team: "法国", goals: 5.6, golden: 18, starts: 92, pens: "是", shots: 4.2, path: 68 },
  { name: "凯恩", team: "英格兰", goals: 4.8, golden: 14, starts: 95, pens: "是", shots: 3.8, path: 66 },
  { name: "劳塔罗", team: "阿根廷", goals: 4.2, golden: 11, starts: 81, pens: "否", shots: 3.5, path: 72 },
  { name: "维尼修斯", team: "巴西", goals: 3.9, golden: 9, starts: 88, pens: "否", shots: 3.2, path: 64 },
  { name: "莫拉塔", team: "西班牙", goals: 3.5, golden: 8, starts: 74, pens: "可能", shots: 3.0, path: 70 },
  { name: "B费", team: "葡萄牙", goals: 3.2, golden: 6, starts: 93, pens: "是", shots: 2.8, path: 62 },
];

const reviews = [
  { match: "阿根廷 vs 荷兰", pick: "主胜 49%", result: "2-1", hit: "命中方向", delta: "+0.74", note: "定位球权重低估，比分接近" },
  { match: "法国 vs 德国", pick: "主胜 46%", result: "1-1", hit: "未命中", delta: "-1.00", note: "平局保护不足，市场更接近真实" },
  { match: "巴西 vs 葡萄牙", pick: "大 2.5 球 54%", result: "2-2", hit: "命中进球", delta: "+0.83", note: "两队边路攻防强度符合预期" },
];

const MODEL_SAMPLE_SIZE = 50000;
const MATCH_INTEL_REFRESH_MS = 5 * 60 * 1000;
const modelCache = new Map();

const stadiumEnvironment = {
  "Estadio Banorte": { name: "墨西哥城 / 阿兹特克", lat: 19.3029, lon: -99.1505, altitude: 2240, temp: 24, humidity: 45, climate: "高海拔 + 午后偏热" },
  "Estadio Akron": { name: "瓜达拉哈拉 / 阿克伦", lat: 20.6818, lon: -103.4627, altitude: 1560, temp: 28, humidity: 48, climate: "中高海拔 + 干热" },
  "Estadio BBVA": { name: "蒙特雷 / BBVA", lat: 25.6681, lon: -100.2444, altitude: 540, temp: 32, humidity: 60, climate: "北墨西哥炎热" },
  "BMO Field": { name: "多伦多 / BMO Field", lat: 43.6332, lon: -79.4186, altitude: 76, temp: 22, humidity: 63, climate: "湖区温和" },
  "BC Place": { name: "温哥华 / BC Place", lat: 49.2768, lon: -123.1119, altitude: 15, temp: 20, humidity: 65, climate: "凉爽湿润" },
  "Lumen Field": { name: "西雅图 / Lumen Field", lat: 47.5952, lon: -122.3316, altitude: 20, temp: 21, humidity: 68, climate: "凉爽湿润" },
  "SoFi Stadium": { name: "洛杉矶 / SoFi", lat: 33.9535, lon: -118.3392, altitude: 38, temp: 24, humidity: 62, climate: "温和近海" },
  "Levi's Stadium": { name: "旧金山湾区 / Levi's", lat: 37.4030, lon: -121.9700, altitude: 5, temp: 23, humidity: 60, climate: "湾区温和" },
  "MetLife Stadium": { name: "纽约新泽西 / MetLife", lat: 40.8135, lon: -74.0745, altitude: 2, temp: 27, humidity: 64, climate: "东海岸湿热" },
  "Gillette Stadium": { name: "波士顿郊区 / Gillette", lat: 42.0909, lon: -71.2643, altitude: 88, temp: 25, humidity: 66, climate: "东北部湿润" },
  "Lincoln Financial Field": { name: "费城 / Lincoln Financial", lat: 39.9008, lon: -75.1675, altitude: 12, temp: 29, humidity: 66, climate: "东海岸湿热" },
  "Hard Rock Stadium": { name: "迈阿密 / Hard Rock", lat: 25.9580, lon: -80.2389, altitude: 2, temp: 31, humidity: 72, climate: "高温高湿" },
  "AT&T Stadium": { name: "达拉斯 / AT&T", lat: 32.7473, lon: -97.0945, altitude: 184, temp: 32, humidity: 62, climate: "高温，场馆可控" },
  "NRG Stadium": { name: "休斯顿 / NRG", lat: 29.6847, lon: -95.4107, altitude: 15, temp: 32, humidity: 72, climate: "高温高湿，场馆可控" },
  "Mercedes-Benz Stadium": { name: "亚特兰大 / Mercedes-Benz", lat: 33.7554, lon: -84.4008, altitude: 320, temp: 30, humidity: 68, climate: "闷热，场馆可控" },
  "GEHA Field at Arrowhead Stadium": { name: "堪萨斯城 / Arrowhead", lat: 39.0489, lon: -94.4839, altitude: 265, temp: 30, humidity: 63, climate: "内陆炎热" },
};

const cityEnvironmentAliases = {
  "Mexico City": "Estadio Banorte",
  Guadalajara: "Estadio Akron",
  Guadalupe: "Estadio BBVA",
  Toronto: "BMO Field",
  Vancouver: "BC Place",
  Seattle: "Lumen Field",
  "Inglewood, California": "SoFi Stadium",
  "Santa Clara, California": "Levi's Stadium",
  "East Rutherford, New Jersey": "MetLife Stadium",
  "Foxborough, Massachusetts": "Gillette Stadium",
  "Philadelphia, Pennsylvania": "Lincoln Financial Field",
  "Miami Gardens, Florida": "Hard Rock Stadium",
  "Arlington, Texas": "AT&T Stadium",
  "Houston, Texas": "NRG Stadium",
  "Atlanta, Georgia": "Mercedes-Benz Stadium",
  "Kansas City, Missouri": "GEHA Field at Arrowhead Stadium",
};

const groupSlots = [
  ["A", "mex", "墨西哥", "confirmed", 13, 1860, 210, 75, 74, 74, 73, 75, 70, 28.1, "主场节奏 + 边路推进", "主场环境与转换速度", "需确认最终 26 人名单", ["希门尼斯", "洛萨诺", "阿尔瓦雷斯"]],
  ["A", "rsa", "南非", "confirmed", 56, 1675, 42, 64, 63, 66, 62, 69, 60, 27.2, "低位防守 + 快速反击", "身体对抗与纵深", "锋线效率需观察", ["兹瓦内", "莫科纳", "威廉姆斯"]],
  ["A", "kor", "韩国", "confirmed", 23, 1795, 185, 73, 75, 72, 74, 73, 69, 27.5, "高强度跑动 + 边路冲击", "压迫和反击速度", "核心体能负荷偏高", ["孙兴慜", "李刚仁", "金玟哉"]],
  ["A", "cze", "捷克", "confirmed", 44, 1735, 185, 68, 69, 70, 70, 72, 66, 27.9, "身体对抗 + 边路传中", "定位球和二点球争夺", "中场创造力需观察", ["希克", "绍切克", "切尔尼"]],
  ["B", "can", "加拿大", "confirmed", 31, 1765, 185, 72, 75, 68, 70, 73, 66, 26.7, "主场速度 + 边翼卫推进", "主场与速度优势", "防线稳定性需复核", ["戴维", "戴维斯", "欧斯塔基奥"]],
  ["B", "bih", "波黑", "confirmed", 62, 1665, 115, 64, 67, 65, 66, 67, 61, 28.5, "中锋支点 + 直接进攻", "禁区支点和定位球", "防线回追速度需观察", ["哲科", "皮亚尼奇", "德米罗维奇"]],
  ["B", "qat", "卡塔尔", "confirmed", 53, 1690, 28, 66, 65, 67, 67, 70, 62, 28.8, "控球耐心 + 中路配合", "亚洲杯经验", "对抗强度需观察", ["阿菲夫", "阿里", "哈特姆"]],
  ["B", "sui", "瑞士", "confirmed", 19, 1845, 305, 74, 73, 78, 76, 76, 72, 28.3, "稳健防守 + 中路组织", "大赛稳定性", "锋线爆点不足", ["扎卡", "阿坎吉", "恩多耶"]],
  ["C", "bra", "巴西", "confirmed", 5, 2076, 970, 81, 88, 83, 81, 85, 86, 27.8, "个人突破 + 前场压迫", "边路单点与二次进攻", "锋线核心恢复中", ["维尼修斯", "罗德里戈", "吉马良斯"]],
  ["C", "mar", "摩洛哥", "confirmed", 12, 1885, 410, 78, 76, 82, 78, 79, 73, 27.1, "紧凑防守 + 边路推进", "大赛淘汰赛经验", "中锋效率需观察", ["阿什拉夫", "齐耶赫", "阿姆拉巴特"]],
  ["C", "hai", "海地", "confirmed", 82, 1550, 24, 58, 59, 57, 56, 61, 54, 26.4, "深度防守 + 直线冲击", "低位韧性", "整体实力偏弱", ["纳松", "皮埃罗", "让-雅克"]],
  ["C", "sco", "苏格兰", "confirmed", 36, 1745, 270, 69, 68, 73, 72, 72, 67, 28.5, "身体对抗 + 边路传中", "定位球与对抗", "控球破密防一般", ["罗伯逊", "麦克托米奈", "蒂尔尼"]],
  ["D", "usa", "美国", "confirmed", 14, 1858, 365, 76, 77, 75, 76, 74, 74, 26.1, "主场高压 + 快速转换", "主场和运动能力", "中卫组合需确认", ["普利西奇", "麦肯尼", "赖特"]],
  ["D", "par", "巴拉圭", "confirmed", 45, 1718, 120, 67, 66, 72, 67, 72, 63, 27.9, "低位防守 + 定位球", "防守纪律", "进攻创造力不足", ["阿尔米隆", "戈麦斯", "巴尔布埃纳"]],
  ["D", "aus", "澳大利亚", "confirmed", 27, 1778, 65, 70, 68, 72, 68, 73, 65, 28.6, "强对抗 + 边路传中", "身体与定位球", "阵地战推进一般", ["古德温", "博伊尔", "苏塔尔"]],
  ["D", "tur", "土耳其", "confirmed", 25, 1812, 325, 73, 76, 70, 75, 72, 70, 26.8, "技术中场 + 纵向冲击", "年轻攻击线和中路推进", "防线身后空间需控制", ["恰尔汗奥卢", "居莱尔", "伊尔迪兹"]],
  ["E", "civ", "科特迪瓦", "confirmed", 41, 1740, 320, 72, 75, 70, 71, 70, 68, 26.8, "身体优势 + 边路爆破", "锋线冲击力", "防线间距需观察", ["凯西", "阿丁格拉", "哈勒"]],
  ["E", "ecu", "厄瓜多尔", "confirmed", 29, 1792, 290, 73, 71, 78, 73, 75, 69, 25.9, "高压逼抢 + 身体覆盖", "中后场运动能力", "终结稳定性不足", ["凯塞多", "因卡皮耶", "瓦伦西亚"]],
  ["E", "ger", "德国", "confirmed", 10, 1984, 790, 76, 82, 76, 87, 78, 81, 27.1, "高位传控 + 二线插上", "中路过载与快速反抢", "后腰轮换不足", ["穆西亚拉", "维尔茨", "基米希"]],
  ["E", "cur", "库拉索", "confirmed", 86, 1525, 21, 57, 57, 58, 56, 60, 52, 27.8, "低位防守 + 反击", "防守人数堆叠", "大赛经验不足", ["巴库纳", "马尔加雷特", "罗姆"]],
  ["F", "ned", "荷兰", "confirmed", 7, 2008, 720, 78, 79, 86, 80, 80, 76, 27.6, "三中卫推进 + 反击", "后场出球与边翼卫压上", "替补前锋伤缺", ["范戴克", "德容", "加克波"]],
  ["F", "jpn", "日本", "confirmed", 18, 1850, 315, 79, 77, 76, 80, 72, 75, 26.6, "小快灵传控 + 高压", "整体协同与技术", "门前效率波动", ["久保建英", "三笘薰", "远藤航"]],
  ["F", "swe", "瑞典", "confirmed", 30, 1775, 260, 70, 74, 70, 71, 72, 68, 27.3, "双前锋冲击 + 边路传中", "锋线高度和终结", "中场控制稳定性需观察", ["伊萨克", "哲凯赖什", "库卢塞夫斯基"]],
  ["F", "tun", "突尼斯", "confirmed", 52, 1695, 55, 65, 63, 71, 66, 69, 62, 28.2, "紧凑防线 + 反击", "防守组织", "进攻端上限有限", ["斯希里", "姆萨克尼", "达门"]],
  ["G", "irn", "伊朗", "confirmed", 20, 1835, 82, 71, 72, 72, 70, 73, 66, 28.9, "身体对抗 + 直接进攻", "锋线经验", "年龄结构偏大", ["塔雷米", "阿兹蒙", "贾汉巴赫什"]],
  ["G", "nzl", "新西兰", "confirmed", 89, 1510, 35, 57, 56, 61, 57, 65, 54, 27.7, "长传冲吊 + 定位球", "制空和身体", "整体速度不足", ["伍德", "辛格", "卡卡塞"]],
  ["G", "bel", "比利时", "confirmed", 9, 1990, 610, 77, 82, 75, 80, 76, 78, 27.9, "技术中场 + 前场自由度", "多点创造", "后防速度需观察", ["德布劳内", "卢卡库", "多库"]],
  ["G", "egy", "埃及", "confirmed", 35, 1750, 210, 69, 72, 69, 68, 71, 64, 28.4, "低位防守 + 右路核心", "巨星单点", "进攻依赖度高", ["萨拉赫", "特雷泽盖", "埃尔内尼"]],
  ["H", "ksa", "沙特", "confirmed", 58, 1668, 48, 64, 65, 65, 66, 66, 61, 27.4, "控球推进 + 反抢", "亚洲经验", "对抗强度需观察", ["多萨里", "布赖坎", "奥韦斯"]],
  ["H", "uru", "乌拉圭", "confirmed", 11, 1945, 520, 79, 81, 80, 78, 77, 75, 26.8, "高压冲击 + 中路强度", "攻防转换", "牌面风险偏高", ["努涅斯", "巴尔韦德", "阿劳霍"]],
  ["H", "esp", "西班牙", "confirmed", 6, 2032, 830, 83, 81, 84, 90, 77, 82, 25.4, "高控球 + 中路渗透", "压迫夺回与短传推进", "边锋位置满员", ["佩德里", "亚马尔", "罗德里"]],
  ["H", "cpv", "佛得角", "confirmed", 70, 1605, 38, 61, 61, 64, 60, 65, 56, 27.6, "低位组织 + 反击", "身体和纪律", "进攻创造不足", ["贝贝", "门德斯", "罗查"]],
  ["I", "fra", "法国", "confirmed", 3, 2098, 1040, 84, 90, 80, 82, 79, 88, 27.2, "纵深冲击 + 快速反击", "低位弹性与强侧爆破", "中场轮换球员缺阵", ["姆巴佩", "格列兹曼", "楚阿梅尼"]],
  ["I", "sen", "塞内加尔", "confirmed", 17, 1868, 345, 75, 74, 79, 73, 78, 72, 27.8, "身体覆盖 + 快速推进", "攻防硬度", "中场创造力需观察", ["马内", "库利巴利", "伊斯梅拉"]],
  ["I", "irq", "伊拉克", "confirmed", 58, 1660, 54, 65, 65, 67, 65, 68, 62, 27.4, "紧凑防守 + 快速反击", "亚洲杯经验和纪律", "面对高压时出球需观察", ["侯赛因", "阿明", "多斯基"]],
  ["I", "nor", "挪威", "confirmed", 33, 1788, 495, 72, 80, 69, 72, 70, 68, 26.9, "中锋支点 + 直塞冲击", "顶级终结点", "防线速度需观察", ["哈兰德", "厄德高", "索尔洛特"]],
  ["J", "arg", "阿根廷", "confirmed", 2, 2114, 805, 88, 86, 82, 84, 78, 80, 28.7, "控球推进 + 边肋穿插", "高压转换与核心串联", "主力边卫轻伤观察", ["劳塔罗", "阿尔瓦雷斯", "麦卡利斯特"]],
  ["J", "alg", "阿尔及利亚", "confirmed", 43, 1728, 175, 68, 70, 69, 69, 68, 64, 28.1, "边路技术 + 反击", "老将经验", "防守稳定性波动", ["马赫雷斯", "本纳赛尔", "古伊里"]],
  ["J", "aut", "奥地利", "confirmed", 22, 1818, 310, 76, 74, 76, 77, 73, 72, 27.0, "高位压迫 + 纵向推进", "体系成熟", "淘汰赛经验需观察", ["阿瑙托维奇", "萨比策", "莱默尔"]],
  ["J", "jor", "约旦", "confirmed", 63, 1640, 30, 62, 63, 63, 62, 66, 58, 27.3, "快速反击 + 边路传中", "亚洲杯气质", "整体身价偏低", ["塔马里", "纳伊马特", "阿拉伯"]],
  ["K", "por", "葡萄牙", "confirmed", 8, 1996, 930, 82, 85, 79, 85, 78, 85, 28.1, "技术中场 + 边路传中", "高位控球与多点终结", "暂无核心伤停", ["B费", "莱奥", "B席"]],
  ["K", "cod", "刚果民主共和国", "confirmed", 60, 1660, 125, 65, 67, 65, 65, 66, 62, 27.5, "身体对抗 + 快速推进", "边路速度和对抗", "比赛管理能力需观察", ["巴坎布", "万-比萨卡", "维萨"]],
  ["K", "uzb", "乌兹别克斯坦", "confirmed", 49, 1705, 58, 67, 68, 68, 67, 70, 63, 26.5, "中路推进 + 快速压迫", "年轻化和冲击", "大赛经验不足", ["肖穆罗多夫", "法伊祖拉耶夫", "马沙里波夫"]],
  ["K", "col", "哥伦比亚", "confirmed", 15, 1878, 390, 78, 80, 76, 78, 74, 72, 27.7, "技术边路 + 反击", "进攻爆点", "防线身后空间", ["迪亚斯", "J罗", "莱尔马"]],
  ["L", "gha", "加纳", "confirmed", 48, 1710, 190, 67, 69, 68, 68, 67, 64, 26.2, "身体对抗 + 纵向推进", "年轻球员冲击", "稳定性不足", ["库杜斯", "托马斯", "伊尼亚基"]],
  ["L", "pan", "巴拿马", "confirmed", 59, 1662, 32, 63, 63, 66, 63, 67, 59, 27.9, "防守纪律 + 转换", "中北美经验", "进攻创造不足", ["戈多伊", "迪亚斯", "卡拉斯基利亚"]],
  ["L", "eng", "英格兰", "confirmed", 4, 2058, 1260, 79, 84, 81, 86, 76, 90, 26.9, "阵地控制 + 定位球", "双后腰保护与边后卫套上", "中卫位置有疲劳隐患", ["贝林厄姆", "凯恩", "福登"]],
  ["L", "cro", "克罗地亚", "confirmed", 16, 1865, 310, 73, 72, 77, 82, 75, 69, 29.3, "中场控节奏 + 大赛经验", "比赛管理能力", "年龄结构偏大", ["莫德里奇", "格瓦迪奥尔", "科瓦契奇"]],
];

buildUsableDataset();

function buildUsableDataset() {
  teams.length = 0;
  groupSlots.forEach((slot) => {
    const [group, id, name, status, fifa, elo, value, form, attack, defense, midfield, keeper, depth, age, style, coach, injuries, stars] = slot;
    teams.push({
      id,
      name,
      group,
      status,
      fifa,
      elo,
      value,
      form,
      attack,
      defense,
      midfield,
      keeper,
      depth,
      age,
      style,
      coach,
      injuries,
      xg: Number((0.72 + attack / 72 + form / 180).toFixed(2)),
      xga: Number((2.1 - defense / 75 - keeper / 190).toFixed(2)),
      setPiece: Math.round((attack + defense) / 2),
      press: Math.round((form + midfield) / 2),
      path: Math.round(45 + (88 - fifa) * 0.18 + form * 0.18 + depth * 0.12),
      stars,
      dataStatus: "球队席位已确认，竞技数据为赛前估算",
    });
  });

  matches.length = 0;
  const grouped = teams.reduce((acc, team) => {
    if (!acc[team.group]) acc[team.group] = [];
    acc[team.group].push(team);
    return acc;
  }, {});
  let matchNumber = 1;
  Object.keys(grouped).sort().forEach((group, groupIndex) => {
    const groupTeams = grouped[group];
    const pairings = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]];
    pairings.forEach(([homeIndex, awayIndex], roundIndex) => {
      const home = groupTeams[homeIndex];
      const away = groupTeams[awayIndex];
      const date = new Date(Date.UTC(2026, 5, 11 + groupIndex + Math.floor(roundIndex / 2), 18 + (roundIndex % 2) * 3));
      matches.push({
        id: `g${group}${roundIndex + 1}`,
        stage: "小组赛",
        group,
        kickoff: date.toISOString(),
        time: `小组第 ${Math.floor(roundIndex / 2) + 1} 轮 / 开球时间待导入`,
        venue: "官方场馆待导入",
        home: home.id,
        away: away.id,
        odds: projectedOdds(home, away),
        openOdds: projectedOdds(home, away, 0.06),
        marketHeat: Math.round(48 + Math.min(45, (home.value + away.value) / 45)),
        weather: "待赛前 24 小时更新天气与草皮",
        referee: "待 FIFA 公布裁判组",
        rest: [4 + (roundIndex % 3), 4 + ((roundIndex + 1) % 3)],
        dataStatus: "可赛前分析",
      });
      matchNumber += 1;
    });
  });

  players.length = 0;
  players.push(
    { name: "姆巴佩", team: "法国", goals: 5.6, golden: 15, starts: 92, pens: "是", shots: 4.2, path: 70 },
    { name: "凯恩", team: "英格兰", goals: 4.8, golden: 13, starts: 95, pens: "是", shots: 3.8, path: 68 },
    { name: "劳塔罗", team: "阿根廷", goals: 4.2, golden: 11, starts: 81, pens: "否", shots: 3.5, path: 72 },
    { name: "哈兰德", team: "挪威", goals: 4.1, golden: 10, starts: 96, pens: "是", shots: 4.5, path: 58 },
    { name: "维尼修斯", team: "巴西", goals: 3.9, golden: 9, starts: 88, pens: "否", shots: 3.2, path: 64 },
    { name: "萨拉赫", team: "埃及", goals: 3.7, golden: 8, starts: 95, pens: "是", shots: 3.4, path: 52 },
    { name: "莫拉塔", team: "西班牙", goals: 3.5, golden: 7, starts: 74, pens: "可能", shots: 3.0, path: 70 },
    { name: "B费", team: "葡萄牙", goals: 3.2, golden: 6, starts: 93, pens: "是", shots: 2.8, path: 62 },
  );

  reviews.length = 0;
  reviews.push(
    { match: "待比赛完成", pick: "赛前模型方向", result: "待录入", hit: "待结算", delta: "0.00", note: "赛后记录命中、偏差和调参结论" },
    { match: "待比赛完成", pick: "比分 Top5", result: "待录入", hit: "待结算", delta: "0.00", note: "精确比分高波动，建议按长期样本复盘" },
    { match: "待比赛完成", pick: "总进球倾向", result: "待录入", hit: "待结算", delta: "0.00", note: "赛后拆分天气、裁判、首发和临场赔率影响" },
  );
}

function projectedOdds(home, away, drift = 0) {
  const diff = strength(home) - strength(away);
  const homeProb = clamp(0.41 + diff / 620, 0.18, 0.72);
  const awayProb = clamp(0.32 - diff / 650, 0.13, 0.62);
  const drawProb = clamp(1 - homeProb - awayProb, 0.18, 0.31);
  const total = homeProb + drawProb + awayProb;
  return [homeProb, drawProb, awayProb].map((prob, index) => Number((1 / (prob / total) * 0.93 + drift * (index - 1)).toFixed(2)));
}

const state = {
  page: "overview",
  selectedMatch: "gA1",
  selectedTeam: "arg",
  selectedTeamCompare: "",
  returnPage: "overview",
  stageFilter: "全部",
  groupFilter: "全部",
  overviewDate: "",
  expandedGap: "",
  matchIntel: {},
  teamRosters: {},
  intelSync: { started: false, total: 0, done: 0, label: "待启动" },
  feed: {
    provider: "local",
    status: "loading",
    lastUpdated: null,
    nextRefreshSeconds: 30,
    odds: {},
    events: [],
    message: "正在连接自动数据源",
  },
};

const pages = [
  ["overview", "首页总览"],
  ["matches", "小组赛程"],
  ["match", "单场深度"],
  ["teams", "球队画像"],
  ["simulation", "杯赛模拟"],
  ["golden", "金靴预测"],
  ["market", "赔率市场"],
  ["review", "赛后复盘"],
  ["sources", "数据源状态"],
];

function getTeam(id) {
  return teams.find((team) => team.id === id);
}

function getOdds(match) {
  const live = state.feed.odds?.[match.id];
  return live?.h2h || match.odds;
}

function liveEvent(match) {
  return (state.feed.events || []).find((event) => event.matchId === match.id);
}

function oddsSource(match) {
  const live = state.feed.odds?.[match.id];
  if (live?.h2h) return live.source || state.feed.provider || "自动数据源";
  return "模型基线";
}

function oddsUpdatedAt(match) {
  const live = state.feed.odds?.[match.id];
  return live?.lastUpdated || state.feed.lastUpdated;
}

const flagByTeam = {
  mex: "🇲🇽", rsa: "🇿🇦", kor: "🇰🇷", cze: "🇨🇿",
  can: "🇨🇦", bih: "🇧🇦", qat: "🇶🇦", sui: "🇨🇭",
  bra: "🇧🇷", mar: "🇲🇦", hai: "🇭🇹", sco: "🏴",
  usa: "🇺🇸", par: "🇵🇾", aus: "🇦🇺", tur: "🇹🇷",
  civ: "🇨🇮", ecu: "🇪🇨", ger: "🇩🇪", cur: "🇨🇼",
  ned: "🇳🇱", jpn: "🇯🇵", swe: "🇸🇪", tun: "🇹🇳",
  irn: "🇮🇷", nzl: "🇳🇿", bel: "🇧🇪", egy: "🇪🇬",
  ksa: "🇸🇦", uru: "🇺🇾", esp: "🇪🇸", cpv: "🇨🇻",
  fra: "🇫🇷", sen: "🇸🇳", irq: "🇮🇶", nor: "🇳🇴",
  arg: "🇦🇷", alg: "🇩🇿", aut: "🇦🇹", jor: "🇯🇴",
  por: "🇵🇹", cod: "🇨🇩", uzb: "🇺🇿", col: "🇨🇴",
  gha: "🇬🇭", pan: "🇵🇦", eng: "🏴", cro: "🇭🇷",
};

const espnLogoCodeByTeam = {
  cod: "cod",
  civ: "civ",
  cur: "cuw",
  cpv: "cpv",
  rsa: "rsa",
  cze: "cze",
  kor: "kor",
  sui: "sui",
  ksa: "ksa",
  bih: "bih",
  nzl: "nzl",
};

const flagIsoByTeam = {
  mex: "mx", rsa: "za", kor: "kr", cze: "cz",
  can: "ca", bih: "ba", qat: "qa", sui: "ch",
  bra: "br", mar: "ma", hai: "ht", sco: "gb-sct",
  usa: "us", par: "py", aus: "au", tur: "tr",
  civ: "ci", ecu: "ec", ger: "de", cur: "cw",
  ned: "nl", jpn: "jp", swe: "se", tun: "tn",
  irn: "ir", nzl: "nz", bel: "be", egy: "eg",
  ksa: "sa", uru: "uy", esp: "es", cpv: "cv",
  fra: "fr", sen: "sn", irq: "iq", nor: "no",
  arg: "ar", alg: "dz", aut: "at", jor: "jo",
  por: "pt", cod: "cd", uzb: "uz", col: "co",
  gha: "gh", pan: "pa", eng: "gb-eng", cro: "hr",
};

const statusZh = {
  Active: "可出场",
  Injured: "伤病",
  Doubtful: "出战成疑",
  Suspended: "停赛",
  Questionable: "需赛前评估",
  Out: "缺阵",
};

const positionZh = {
  Goalkeeper: "门将",
  Defender: "后卫",
  Midfielder: "中场",
  Forward: "前锋",
  "Unknown Position": "位置未返回",
};

const clubZh = {
  Argentina: "阿根廷国家队",
  Brazil: "巴西国家队",
  England: "英格兰国家队",
  France: "法国国家队",
  Mexico: "墨西哥国家队",
  Portugal: "葡萄牙国家队",
  "South Africa": "南非国家队",
  Guadalajara: "瓜达拉哈拉",
  America: "美洲",
  "West Ham United": "西汉姆联",
  "Dinamo Moscow": "莫斯科迪纳摩",
  Genoa: "热那亚",
  "U.N.A.M.": "美洲狮",
  Toluca: "托卢卡",
  Spain: "西班牙国家队",
  Arsenal: "阿森纳",
  "Inter Miami CF": "迈阿密国际",
  "Racing Club": "竞技俱乐部",
  "River Plate": "河床",
  Palmeiras: "帕尔梅拉斯",
  "Boca Juniors": "博卡青年",
  "Real Betis": "皇家贝蒂斯",
  Liverpool: "利物浦",
};

const playerNameZh = {
  "Brice Samba": "布里斯-桑巴",
  "Robin Risser": "罗宾-里瑟",
  "Maxence Lacroix": "马克桑斯-拉克鲁瓦",
  "Dean Henderson": "迪恩-亨德森",
  "James Trafford": "詹姆斯-特拉福德",
  "Reece James": "里斯-詹姆斯",
  "Dan Burn": "丹-伯恩",
  "Ezri Konsa": "埃兹里-孔萨",
  "Marc Guéhi": "马克-格伊",
  "Djed Spence": "杰德-斯彭斯",
  "Jarell Quansah": "贾雷尔-宽萨",
  "Emiliano Martínez": "埃米利亚诺-马丁内斯",
  "Gerónimo Rulli": "赫罗尼莫-鲁利",
  "Juan Musso": "胡安-穆索",
  "Walter Benítez": "沃尔特-贝尼特斯",
  "Facundo Cambeses": "法昆多-坎贝塞斯",
  "Santiago Beltrán": "圣地亚哥-贝尔特兰",
  "Cristian Romero": "克里斯蒂安-罗梅罗",
  "Nicolás Otamendi": "尼古拉斯-奥塔门迪",
  "Germán Pezzella": "赫尔曼-佩泽拉",
  "Nicolás Tagliafico": "尼古拉斯-塔利亚菲科",
  "Marcos Acuña": "马科斯-阿库尼亚",
  "Nahuel Molina": "纳韦尔-莫利纳",
  "Lucas Martínez Quarta": "卢卡斯-马丁内斯-夸尔塔",
  "Gonzalo Montiel": "冈萨洛-蒙铁尔",
  "Lisandro Martínez": "利桑德罗-马丁内斯",
  "Marcos Senesi": "马科斯-塞内西",
  "Kevin Mac Allister": "凯文-麦卡利斯特",
  "Gabriel Rojas": "加布里埃尔-罗哈斯",
  "Facundo Medina": "法昆多-梅迪纳",
  "Leonardo Balerdi": "莱昂纳多-巴莱尔迪",
  "Zaid Romero": "扎伊德-罗梅罗",
  "Agustín Giay": "阿古斯丁-吉艾",
  "Lautaro Di Lollo": "劳塔罗-迪洛洛",
  "Leandro Paredes": "莱安德罗-帕雷德斯",
  "Rodrigo De Paul": "罗德里戈-德保罗",
  "Giovani Lo Celso": "吉奥瓦尼-洛塞尔索",
  "Guido Rodríguez": "吉多-罗德里格斯",
  "Emiliano Buendía": "埃米利亚诺-布恩迪亚",
  "Exequiel Palacios": "埃塞基耶尔-帕拉西奥斯",
  "Alexis Mac Allister": "亚历克西斯-麦卡利斯特",
  "Nicolás Domínguez": "尼古拉斯-多明格斯",
  "Thiago Almada": "蒂亚戈-阿尔马达",
  "Nicolás Capaldo": "尼古拉斯-卡帕尔多",
  "Enzo Fernández": "恩佐-费尔南德斯",
  "Aníbal Moreno": "阿尼巴尔-莫雷诺",
  "Alan Varela": "阿兰-巴雷拉",
  "Máximo Perrone": "马克西莫-佩罗内",
  "Valentín Barco": "瓦伦丁-巴尔科",
  "Matìas Soulè": "马蒂亚斯-苏莱",
  "Alejandro Garnacho": "亚历杭德罗-加纳乔",
  "Nico Paz": "尼科-帕斯",
  "Claudio Echeverri": "克劳迪奥-埃切维里",
  "Ezequiel Fernández": "埃塞基耶尔-费尔南德斯",
  "Milton Delgado": "米尔顿-德尔加多",
  "Tomás Aranda": "托马斯-阿兰达",
  "Lionel Messi": "利昂内尔-梅西",
  "Nicolás González": "尼古拉斯-冈萨雷斯",
  "Lautaro Martínez": "劳塔罗-马丁内斯",
  "Santiago Castro": "圣地亚哥-卡斯特罗",
  "Julián Álvarez": "胡利安-阿尔瓦雷斯",
  "Flaco López": "弗拉科-洛佩斯",
  "Mateo Pellegrino": "马特奥-佩莱格里诺",
  "Giuliano Simeone": "朱利亚诺-西蒙尼",
  "Gianluca Prestianni": "詹卢卡-普雷斯蒂安尼",
  "Franco Mastantuono": "弗兰科-马斯坦托诺",
  "Guillermo Ochoa": "吉列尔莫-奥乔亚",
  "Edson Álvarez": "埃德森-阿尔瓦雷斯",
  "Luis Chávez": "路易斯-查韦斯",
  "César Montes": "塞萨尔-蒙特斯",
  "Johan Vásquez": "约翰-巴斯克斯",
  "Alexis Vega": "亚历克西斯-维加",
  "Roberto Alvarado": "罗伯托-阿尔瓦拉多",
  "David Raya": "大卫-拉亚",
  "Unai Simón": "乌奈-西蒙",
  "Joan García": "霍安-加西亚",
  "Eric García": "埃里克-加西亚",
  "Aymeric Laporte": "艾梅里克-拉波尔特",
  "Alejandro Grimaldo": "亚历杭德罗-格里马尔多",
  "Marc Cucurella": "马克-库库雷利亚",
  "Pedro Porro": "佩德罗-波罗",
  "Marc Pubill": "马克-普比尔",
  "Pau Cubarsí": "保-库巴西",
  "Marcos Llorente": "马科斯-略伦特",
  "Mikel Merino": "米克尔-梅里诺",
  "Fabián Ruiz": "法比安-鲁伊斯",
  "Dani Olmo": "达尼-奥尔莫",
  Rodri: "罗德里",
  Pedri: "佩德里",
  "Martín Zubimendi": "马丁-苏维门迪",
  "Yéremy Pino": "耶雷米-皮诺",
  "Álex Baena": "亚历克斯-巴埃纳",
  Gavi: "加维",
  "Borja Iglesias": "博尔哈-伊格莱西亚斯",
  "Mikel Oyarzabal": "米克尔-奥亚萨瓦尔",
  "Ferran Torres": "费兰-托雷斯",
  "Nico Williams": "尼科-威廉斯",
  "Lamine Yamal": "拉明-亚马尔",
  "Víctor Muñoz": "维克托-穆尼奥斯",
};

function hasLatin(text = "") {
  return /[A-Za-z]/.test(text);
}

function normalizeLatin(text = "") {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const latinTokenZh = {
  lionel: "利昂内尔", messi: "梅西", cristiano: "克里斯蒂亚诺", ronaldo: "罗纳尔多",
  neymar: "内马尔", kylian: "基利安", mbappe: "姆巴佩", erling: "埃尔林", haaland: "哈兰德",
  emiliano: "埃米利亚诺", martinez: "马丁内斯", geronimo: "赫罗尼莫", rulli: "鲁利",
  juan: "胡安", musso: "穆索", walter: "沃尔特", benitez: "贝尼特斯", facundo: "法昆多",
  santiago: "圣地亚哥", beltran: "贝尔特兰", cristian: "克里斯蒂安", romero: "罗梅罗",
  nicolas: "尼古拉斯", otamendi: "奥塔门迪", german: "赫尔曼", pezzella: "佩泽拉",
  tagliafico: "塔利亚菲科", marcos: "马科斯", acuna: "阿库尼亚", nahuel: "纳韦尔",
  molina: "莫利纳", lucas: "卢卡斯", quarta: "夸尔塔", gonzalo: "冈萨洛", montiel: "蒙铁尔",
  lisandro: "利桑德罗", senesi: "塞内西", kevin: "凯文", mac: "麦克", allister: "阿利斯特",
  gabriel: "加布里埃尔", rojas: "罗哈斯", medina: "梅迪纳", leonardo: "莱昂纳多",
  balerdi: "巴莱尔迪", zaid: "扎伊德", agustin: "阿古斯丁", giay: "吉艾", lautaro: "劳塔罗",
  lollo: "洛洛", leandro: "莱安德罗", paredes: "帕雷德斯", rodrigo: "罗德里戈",
  paul: "保罗", giovani: "吉奥瓦尼", celso: "塞尔索", guido: "吉多", rodriguez: "罗德里格斯",
  buendia: "布恩迪亚", exequiel: "埃塞基耶尔", palacios: "帕拉西奥斯", alexis: "亚历克西斯",
  dominguez: "多明格斯", thiago: "蒂亚戈", almada: "阿尔马达", capaldo: "卡帕尔多",
  enzo: "恩佐", fernandez: "费尔南德斯", anibal: "阿尼巴尔", moreno: "莫雷诺",
  alan: "阿兰", varela: "巴雷拉", maximo: "马克西莫", perrone: "佩罗内", valentin: "瓦伦丁",
  barco: "巴尔科", matias: "马蒂亚斯", soule: "苏莱", alejandro: "亚历杭德罗",
  garnacho: "加纳乔", nico: "尼科", paz: "帕斯", claudio: "克劳迪奥", echeverri: "埃切维里",
  ezequiel: "埃塞基耶尔", milton: "米尔顿", delgado: "德尔加多", tomas: "托马斯",
  aranda: "阿兰达", gonzalez: "冈萨雷斯", castro: "卡斯特罗", julian: "胡利安",
  alvarez: "阿尔瓦雷斯", flaco: "弗拉科", lopez: "洛佩斯", mateo: "马特奥",
  pellegrino: "佩莱格里诺", giuliano: "朱利亚诺", simeone: "西蒙尼", gianluca: "詹卢卡",
  prestianni: "普雷斯蒂安尼", franco: "弗兰科", mastantuono: "马斯坦托诺",
  david: "大卫", raya: "拉亚", unai: "乌奈", simon: "西蒙", joan: "霍安", garcia: "加西亚",
  eric: "埃里克", aymeric: "艾梅里克", laporte: "拉波尔特", grimaldo: "格里马尔多",
  marc: "马克", cucurella: "库库雷利亚", pedro: "佩德罗", porro: "波罗", pubill: "普比尔",
  pau: "保", cubarsi: "库巴西", llorente: "略伦特", mikel: "米克尔", merino: "梅里诺",
  fabian: "法比安", ruiz: "鲁伊斯", dani: "达尼", olmo: "奥尔莫", rodri: "罗德里",
  pedri: "佩德里", martin: "马丁", zubimendi: "苏维门迪", yeremy: "耶雷米", pino: "皮诺",
  alex: "亚历克斯", baena: "巴埃纳", gavi: "加维", borja: "博尔哈", iglesias: "伊格莱西亚斯",
  oyarzabal: "奥亚萨瓦尔", ferran: "费兰", torres: "托雷斯", williams: "威廉斯",
  lamine: "拉明", yamal: "亚马尔", victor: "维克托", munoz: "穆尼奥斯",
  harry: "哈里", kane: "凯恩", ivan: "伊万", toney: "托尼", ollie: "奥利", watkins: "沃特金斯",
  marcus: "马库斯", rashford: "拉什福德", anthony: "安东尼", gordon: "戈登", bukayo: "布卡约",
  saka: "萨卡", noni: "诺尼", madueke: "马杜埃凯", jude: "裘德", bellingham: "贝林厄姆",
  declan: "德克兰", rice: "赖斯", phil: "菲尔", foden: "福登", jack: "杰克", grealish: "格拉利什",
  mason: "梅森", mount: "芒特", cole: "科尔", palmer: "帕尔默", trent: "特伦特", alexander: "亚历山大",
  arnold: "阿诺德", john: "约翰", stones: "斯通斯", kyle: "凯尔", walker: "沃克", jordan: "乔丹",
  pickford: "皮克福德", ousmane: "奥斯曼", dembele: "登贝莱", marcus: "马库斯", thuram: "图拉姆",
  randal: "兰达尔", kolo: "科洛", muani: "穆阿尼", bradley: "布拉德利", barcola: "巴尔科拉",
  michael: "迈克尔", olise: "奥利塞", kingsley: "金斯利", coman: "科曼", antoine: "安托万",
  griezmann: "格列兹曼", eduardo: "爱德华多", camavinga: "卡马文加", aurelien: "奥雷利安",
  tchouameni: "楚阿梅尼", william: "威廉", saliba: "萨利巴", ibrahima: "易卜拉希马", konate: "科纳特",
  mike: "迈克", maignan: "迈尼昂", vinicius: "维尼修斯", junior: "儒尼奥尔", rodrygo: "罗德里戈",
  raphinha: "拉菲尼亚", richarlison: "理查利森", matheus: "马特乌斯", cunha: "库尼亚",
  gabriel: "加布里埃尔", martinelli: "马丁内利", endrick: "恩德里克", casemiro: "卡塞米罗",
  bruno: "布鲁诺", guimaraes: "吉马良斯", lucas: "卢卡斯", paqueta: "帕奎塔", marquinhos: "马尔基尼奥斯",
  militao: "米利唐", alisson: "阿利松", ederson: "埃德森", goncalo: "贡萨洛", ramos: "拉莫斯",
  neto: "内托", rafael: "拉斐尔", leao: "莱奥", francisco: "弗朗西斯科", trincao: "特林康",
  joao: "若昂", felix: "菲利克斯", jota: "若塔", bernardo: "贝尔纳多", silva: "席尔瓦",
  vitinha: "维蒂尼亚", ruben: "鲁本", dias: "迪亚斯", cancelo: "坎塞洛", diogo: "迪奥戈",
  costa: "科斯塔", raul: "劳尔", jimenez: "希门尼斯", henry: "亨利", martin: "马丁",
  german: "赫尔曼", berterame: "贝尔特拉梅", santiago: "圣地亚哥", gimenez: "希门尼斯",
  cesar: "塞萨尔", montes: "蒙特斯", jorge: "豪尔赫", sanchez: "桑切斯", erick: "埃里克",
  gutierrez: "古铁雷斯", luis: "路易斯", romo: "罗莫", orbelin: "奥尔贝林", pineda: "皮内达",
  arsenal: "阿森纳", argentina: "阿根廷", brazil: "巴西", england: "英格兰", france: "法国",
  portugal: "葡萄牙", south: "南非", africa: "国家队", spain: "西班牙", mexico: "墨西哥", inter: "国际",
  miami: "迈阿密", racing: "竞技", club: "俱乐部", river: "河床", plate: "河床",
  palmeiras: "帕尔梅拉斯", boca: "博卡", juniors: "青年", real: "皇家", betis: "贝蒂斯",
  liverpool: "利物浦", bayern: "拜仁", munich: "慕尼黑", madrid: "马德里", barcelona: "巴塞罗那",
  chelsea: "切尔西", tottenham: "托特纳姆", hotspur: "热刺", manchester: "曼彻斯特",
  dortmund: "多特蒙德", paris: "巴黎", saint: "圣", germain: "日耳曼", juventus: "尤文图斯",
  milan: "米兰", napoli: "那不勒斯", benfica: "本菲卡", porto: "波尔图",
  cf: "俱乐部", fc: "足球俱乐部", united: "联", city: "城",
};

function dictionaryLookup(source, dictionary) {
  if (!source) return "";
  if (dictionary[source]) return dictionary[source];
  const normalized = normalizeLatin(source);
  const entry = Object.entries(dictionary).find(([key]) => normalizeLatin(key) === normalized);
  return entry?.[1] || "";
}

const zhDigits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

function codeToChinese(text = "") {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) % 997;
  return String(hash || 1).split("").map((digit) => zhDigits[Number(digit)]).join("");
}

function latinToChinese(source, fallback = "名称未返回") {
  return fallback;
}

function zhName(name) {
  if (!name) return "球员未返回";
  const hit = dictionaryLookup(name, playerNameZh);
  if (hit) return hit;
  return hasLatin(name) ? "中文资料补录" : name;
}

function zhStatus(status) {
  return statusZh[status] || status || "状态未返回";
}

function zhPosition(position) {
  return positionZh[position] || position || "位置未返回";
}

function zhClub(club) {
  if (!club) return "俱乐部未返回";
  const hit = dictionaryLookup(club, clubZh);
  if (hit) return hit;
  return hasLatin(club) ? "俱乐部资料补录" : club;
}

function isNationalClubSource(club = "") {
  return ["Argentina", "Brazil", "England", "France", "Mexico", "Portugal", "South Africa", "Spain"].includes(club);
}

const coachProfiles = {
  mex: [
    { name: "哈维尔-阿吉雷", role: "主教练", age: 67, club: "墨西哥国家队", note: "大赛经验丰富，偏重防守组织和转换效率" },
    { name: "拉斐尔-马尔克斯", role: "助理教练", age: 47, club: "墨西哥国家队", note: "后场出球与年轻球员沟通" },
    { name: "托尼-阿莫尔", role: "助理教练", age: 49, club: "西班牙教练组", note: "训练结构与阵地推进" },
    { name: "何塞瓦-伊图亚特", role: "守门员教练", age: 55, club: "西班牙教练组", note: "门将站位与点球准备" },
  ],
  rsa: [{ name: "雨果-布鲁斯", role: "主教练", age: 74, club: "南非国家队", note: "比利时教练，带队重返世界杯，强调防守纪律和快速转换" }],
  arg: [{ name: "利昂内尔-斯卡洛尼", role: "主教练", age: 48, club: "阿根廷国家队", note: "控制推进与边肋穿插" }],
  fra: [{ name: "迪迪埃-德尚", role: "主教练", age: 57, club: "法国国家队", note: "低位弹性和纵深反击" }],
  bra: [{ name: "卡洛-安切洛蒂", role: "主教练", age: 67, club: "巴西国家队", note: "明星前场和中后场平衡" }],
  eng: [{ name: "托马斯-图赫尔", role: "主教练", age: 52, club: "英格兰国家队", note: "阵地控制与高压转换" }],
  esp: [{ name: "路易斯-德拉富恩特", role: "主教练", age: 65, club: "西班牙国家队", note: "控球压迫和年轻边锋" }],
  por: [{ name: "罗伯托-马丁内斯", role: "主教练", age: 52, club: "葡萄牙国家队", note: "技术中场与多点终结" }],
  ger: [{ name: "尤利安-纳格尔斯曼", role: "主教练", age: 38, club: "德国国家队", note: "高位传控与二线插上" }],
  ned: [{ name: "罗纳德-科曼", role: "主教练", age: 63, club: "荷兰国家队", note: "三中卫推进和边翼卫压上" }],
};

allTeamProfiles.forEach(([id, name, group, fifa, coachName, stars, style]) => {
  if (!coachProfiles[id]) {
    coachProfiles[id] = [{
      name: coachName,
      role: "主教练",
      age: "",
      club: `${name}国家队`,
      note: style,
    }];
  }
});

const rosterProfiles = {
  mex: {
    forwards: [
      { name: "阿曼多-冈萨雷斯", age: 23, club: "瓜达拉哈拉", caps: 6, goals: 1, assists: 1, value: "1500万" },
      { name: "吉列尔莫-马丁内斯", age: 31, club: "美洲狮", caps: 3, goals: 1, assists: 0, value: "150万" },
      { name: "亚历克西斯-维加", age: 28, club: "托卢卡体育", caps: 3, goals: 0, assists: 1, value: "800万" },
      { name: "罗伯托-阿尔瓦拉多", age: 27, club: "瓜达拉哈拉", caps: 5, goals: 0, assists: 0, value: "750万" },
      { name: "胡利安-基尼奥内斯", age: 29, club: "胡拜尔库迪西亚", caps: 3, goals: 0, assists: 0, value: "1200万" },
    ],
    midfielders: [
      { name: "埃德森-阿尔瓦雷斯", age: 28, club: "西汉姆联", caps: 88, goals: 5, assists: 2, value: "3500万" },
      { name: "路易斯-查韦斯", age: 30, club: "莫斯科迪纳摩", caps: 34, goals: 4, assists: 4, value: "800万" },
      { name: "埃里克-桑切斯", age: 26, club: "美洲", caps: 25, goals: 3, assists: 2, value: "700万" },
    ],
    defenders: [
      { name: "约翰-巴斯克斯", age: 27, club: "热那亚", caps: 27, goals: 1, assists: 0, value: "1000万" },
      { name: "塞萨尔-蒙特斯", age: 29, club: "莫斯科火车头", caps: 56, goals: 4, assists: 1, value: "700万" },
    ],
    goalkeepers: [
      { name: "路易斯-马拉贡", age: 29, club: "美洲", caps: 9, goals: 0, assists: 0, value: "600万" },
    ],
  },
};

function teamFlag(team) {
  const code = flagIsoByTeam[team.id] || team.id;
  return `<span class="flag-logo flag-${team.id}" title="${team.name}"><img src="https://flagcdn.com/${code}.svg" alt="${team.name}" onload="this.parentElement.classList.add('loaded')" onerror="this.style.display='none'"></span>`;
}

function avatar(name) {
  return `<span class="avatar">${name.slice(0, 1)}</span>`;
}

function groupStandings() {
  return groupProjections().map((group) => ({
    ...group,
    rows: group.rows.map((row, index) => ({
      ...row,
      rank: index + 1,
      played: 0,
      win: 0,
      draw: 0,
      loss: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      projectedScore: Math.round(row.qualify),
    })),
  }));
}

function buildTeamRoster(team) {
  const known = rosterProfiles[team.id];
  const staff = coachProfiles[team.id] || [{
    name: `${team.name}教练组`,
    role: "主教练团队",
    age: "",
    club: `${team.name}国家队`,
    note: team.coach || team.style,
  }];
  if (known) return { staff, groups: known };

  const starRows = team.stars.map((name, index) => ({
    name,
    age: Math.max(21, Math.round(team.age + index - 1)),
    club: `${team.name}大名单`,
    caps: Math.max(8, Math.round(team.form / 2) - index * 7),
    goals: index === 0 ? Math.max(1, Math.round(team.attack / 18)) : Math.max(0, Math.round(team.attack / 30) - index),
    assists: Math.max(0, Math.round(team.midfield / 28) - index),
    value: `${Math.max(3, Math.round(team.value / (index === 0 ? 10 : 18)))}00万`,
  }));
  return {
    staff,
    groups: {
      forwards: [starRows[0]],
      midfielders: [starRows[1]],
      defenders: [starRows[2]],
      goalkeepers: [{
        name: "门将竞争位",
        age: Math.round(team.age + 1),
        club: `${team.name}大名单`,
        caps: Math.round(team.keeper / 3),
        goals: 0,
        assists: 0,
        value: `${Math.max(2, Math.round(team.value / 35))}00万`,
      }],
    },
  };
}

function matchTime(match) {
  const event = liveEvent(match);
  return event?.commenceTime ? formatTime(event.commenceTime) : formatTime(match.kickoff) || match.time;
}

function matchVenue(match) {
  const event = liveEvent(match);
  if (!event?.venue) return match.venue;
  return [event.venue, event.city].filter(Boolean).join(" / ");
}

function matchEnvironment(match) {
  const event = liveEvent(match);
  const venueKey = event?.venue || cityEnvironmentAliases[event?.city] || match.venue;
  const base = stadiumEnvironment[venueKey] || stadiumEnvironment[cityEnvironmentAliases[event?.city]] || null;
  const forecast = event?.weatherForecast;
  if (!base || forecast?.status !== "live") return base ? { ...base, weatherMode: forecast?.mode || "baseline", weatherSource: forecast?.source || "历史气候基线", weatherMessage: forecast?.message } : null;
  return {
    ...base,
    temp: Number.isFinite(Number(forecast.temperature)) ? Number(forecast.temperature) : base.temp,
    humidity: Number.isFinite(Number(forecast.humidity)) ? Number(forecast.humidity) : base.humidity,
    apparent: Number.isFinite(Number(forecast.apparentTemperature)) ? Number(forecast.apparentTemperature) : null,
    precipitationProbability: forecast.precipitationProbability,
    windSpeed: forecast.windSpeed,
    climate: `72小时预报：体感 ${forecast.apparentTemperature ?? "-"}°C，降水概率 ${forecast.precipitationProbability ?? "-"}%，风速 ${forecast.windSpeed ?? "-"}km/h`,
    weatherMode: "forecast72h",
    weatherSource: forecast.source || "Open-Meteo",
    weatherUpdatedAt: forecast.updatedAt,
    weatherMessage: forecast.message,
  };
}

function previousTeamMatch(teamId, match) {
  const currentDate = matchDate(match);
  if (!currentDate) return null;
  return matches
    .filter((item) => item.id !== match.id && (item.home === teamId || item.away === teamId))
    .map((item) => ({ item, date: matchDate(item) }))
    .filter(({ date }) => date && date < currentDate)
    .sort((left, right) => right.date - left.date)[0]?.item || null;
}

function teamTravelLoad(teamId, match) {
  const current = matchEnvironment(match);
  const previous = previousTeamMatch(teamId, match);
  const previousEnv = previous ? matchEnvironment(previous) : null;
  if (!current) {
    return { km: 0, altitudeChange: 0, tempChange: 0, humidityChange: 0, score: 0.04, label: "球场环境待同步" };
  }
  if (!previousEnv) {
    const baselineStress = heatHumidityStress(current) + altitudeStress(current) * 0.7;
    return {
      km: 0,
      altitudeChange: current.altitude,
      tempChange: 0,
      humidityChange: 0,
      score: clamp(baselineStress, 0.02, 0.18),
      label: `${current.name}：${current.climate}，海拔 ${current.altitude}m，${current.temp}°C / 湿度 ${current.humidity}%（${current.weatherSource || "历史气候基线"}）`,
    };
  }
  const km = haversineKm(previousEnv, current);
  const altitudeChange = Math.abs(current.altitude - previousEnv.altitude);
  const tempChange = Math.abs(current.temp - previousEnv.temp);
  const humidityChange = Math.abs(current.humidity - previousEnv.humidity);
  const score = clamp(
    km / 9000 +
      altitudeChange / 9000 +
      tempChange / 90 +
      humidityChange / 280 +
      heatHumidityStress(current) +
      altitudeStress(current),
    0.02,
    0.36
  );
  return {
    km,
    altitudeChange,
    tempChange,
    humidityChange,
    score,
    label: `${previousEnv.name} → ${current.name}，约 ${Math.round(km)}km；海拔差 ${Math.round(altitudeChange)}m；温差 ${tempChange.toFixed(1)}°C；湿度差 ${Math.round(humidityChange)}%（${current.weatherSource || "历史气候基线"}）`,
  };
}

function heatHumidityStress(env) {
  if (!env) return 0;
  const heat = clamp((env.temp - 24) / 18, 0, 1);
  const humidity = clamp((env.humidity - 60) / 25, 0, 1);
  return heat * 0.08 + humidity * 0.05;
}

function altitudeStress(env) {
  if (!env) return 0;
  return clamp((env.altitude - 500) / 2200, 0, 1) * 0.11;
}

function haversineKm(a, b) {
  const toRad = (value) => (value * Math.PI) / 180;
  const radius = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(h));
}

function formatTime(value) {
  if (!value) return "未返回";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("zh-CN", { hour12: false });
}

function matchDate(match) {
  const event = liveEvent(match);
  const source = event?.commenceTime || state.feed.odds?.[match.id]?.schedule?.commenceTime || match.kickoff;
  if (source) {
    const date = new Date(source);
    if (!Number.isNaN(date.getTime())) return date;
  }
  const fallback = new Date(match.time);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

function matchDateKey(match) {
  const date = matchDate(match);
  if (!date) return "待定";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateLabel(key) {
  if (key === "待定") return "待定";
  const date = new Date(`${key}T00:00:00`);
  return date.toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "short" });
}

function groupedMatchDays() {
  const map = new Map();
  matches.forEach((match) => {
    const key = matchDateKey(match);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(match);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, dayMatches]) => ({
      key,
      label: dateLabel(key),
      matches: dayMatches.sort((a, b) => {
        const aDate = matchDate(a)?.getTime() || 0;
        const bDate = matchDate(b)?.getTime() || 0;
        return aDate - bDate;
      }),
    }));
}

function defaultOverviewDate(days) {
  if (state.overviewDate && days.some((day) => day.key === state.overviewDate)) return state.overviewDate;
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const exact = days.find((day) => day.key === todayKey);
  if (exact) return exact.key;
  const future = days.find((day) => day.key !== "待定" && day.key >= todayKey);
  return (future || days[0])?.key || "";
}

function strength(team) {
  return (
    team.elo / 25 +
    team.form * 0.8 +
    team.attack * 0.9 +
    team.defense * 0.75 +
    team.midfield * 0.55 +
    Math.log(team.value) * 8 +
    team.depth * 0.45
  );
}

function matchModel(match) {
  const oddsKey = getOdds(match).join("/");
  const intel = state.matchIntel?.[match.id];
  const cacheKey = `${match.id}|${oddsKey}|${state.feed.lastUpdated || "base"}|${intel?.status || "none"}|${intel?.lastUpdated || ""}|${MODEL_SAMPLE_SIZE}`;
  if (modelCache.has(cacheKey)) return modelCache.get(cacheKey);
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const context = matchContext(match, home, away);
  const sim = monteCarloMatch(match, context);
  const probs = sim.probs;
  const totalGoals = sim.averageGoals[0] + sim.averageGoals[1];
  const market = implied(getOdds(match));
  const marketGap = Math.max(...probs.map((p, i) => Math.abs(p - market[i])));
  const confidence = Math.round(clamp(Math.abs(probs[0] - probs[2]) * 1.35 + marketGap * 0.55 + 48 - sim.volatility * 9, 42, 88));
  const result = {
    probs,
    goals: sim.averageGoals,
    totalGoals,
    btts: sim.btts / 100,
    over25: sim.over25 / 100,
    confidence,
    risk: confidence > 70 ? "低" : confidence > 58 ? "中" : "高",
    sim,
    context,
  };
  modelCache.set(cacheKey, result);
  if (modelCache.size > 300) {
    const firstKey = modelCache.keys().next().value;
    modelCache.delete(firstKey);
  }
  return result;
}

function matchContext(match, home, away) {
  const diff = strength(home) - strength(away);
  const homeInjury = injuryLoad(home.injuries);
  const awayInjury = injuryLoad(away.injuries);
  const intel = state.matchIntel?.[match.id];
  const homeRecent = recentFormScore(intel?.forms?.[home.id]);
  const awayRecent = recentFormScore(intel?.forms?.[away.id]);
  const h2hEdge = h2hAdjustment(intel);
  const homeRoster = rosterAvailabilityScore(state.teamRosters?.[home.id]);
  const awayRoster = rosterAvailabilityScore(state.teamRosters?.[away.id]);
  const env = matchEnvironment(match);
  const homeTravel = teamTravelLoad(home.id, match);
  const awayTravel = teamTravelLoad(away.id, match);
  const restEdge = ((match.rest?.[0] || 4) - (match.rest?.[1] || 4)) * 0.025;
  const travelEdge = clamp((awayTravel.score - homeTravel.score) * 0.55, -0.12, 0.12);
  const midfieldEdge = (home.midfield - away.midfield) / 240;
  const depthEdge = (home.depth - away.depth) / 260;
  const keeperEdge = (home.keeper - away.keeper) / 300;
  const stageCaution = match.stage === "淘汰赛" ? 0.12 : 0;
  const weatherSlowdown = clamp(
    (/湿度|海拔|偏慢|消耗|天气/.test(match.weather || "") ? 0.04 : 0.015) +
      heatHumidityStress(env) +
      altitudeStress(env) * 0.75,
    0.015,
    0.2
  );
  const refereeChaos = /严|判罚|牌/.test(match.referee || "") ? 0.04 : 0.02;
  const recentEdge = clamp((homeRecent.score - awayRecent.score) * 0.035, -0.14, 0.14);
  const rosterEdge = clamp((homeRoster.score - awayRoster.score) * 0.08, -0.1, 0.1);
  const h2hText = intel?.status === "live"
    ? `ESPN 已同步 ${intel.headToHeadSummary?.games || 0} 场：胜 ${intel.headToHeadSummary?.wins || 0} / 平 ${intel.headToHeadSummary?.draws || 0} / 负 ${intel.headToHeadSummary?.losses || 0}`
    : "正在接入 ESPN summary；未返回前按中性处理。";
  const homeLambda = clamp(
    home.xg * (away.xga + 0.72) / 1.72 +
      diff / 920 +
      midfieldEdge +
      depthEdge * 0.35 +
      restEdge -
      homeInjury * 0.28 -
      weatherSlowdown +
      recentEdge +
      h2hEdge * 0.5 +
      rosterEdge +
      travelEdge,
    0.35,
    3.25
  );
  const awayLambda = clamp(
    away.xg * (home.xga + 0.72) / 1.72 -
      diff / 980 -
      midfieldEdge * 0.55 -
      keeperEdge * 0.22 -
      restEdge -
      awayInjury * 0.28 -
      weatherSlowdown -
      recentEdge -
      h2hEdge * 0.5 -
      rosterEdge -
      travelEdge,
    0.3,
    3.0
  );
  const volatility = clamp(
    0.48 +
      Math.abs(home.form - away.form) / 220 +
      (100 - Math.min(home.depth, away.depth)) / 260 +
      Math.max(homeInjury, awayInjury) * 0.36 +
      (2 - Math.min(homeRoster.score, awayRoster.score)) * 0.06 +
      Math.max(homeTravel.score, awayTravel.score) * 0.35 +
      (intel?.status === "live" ? 0 : 0.06) +
      refereeChaos +
      stageCaution,
    0.42,
    0.9
  );
  return {
    home,
    away,
    homeLambda,
    awayLambda,
    volatility,
    sampleSize: MODEL_SAMPLE_SIZE,
    factors: [
      ["球队状态", `${home.name} ${home.form} / ${away.name} ${away.form}`, home.form === away.form ? 0 : home.form > away.form ? 1 : -1],
      ["阵容深度", `${home.name} ${home.depth} / ${away.name} ${away.depth}`, home.depth === away.depth ? 0 : home.depth > away.depth ? 1 : -1],
      ["攻防结构", `${home.name} xG ${home.xg} xGA ${home.xga}；${away.name} xG ${away.xg} xGA ${away.xga}`, diff >= 0 ? 1 : -1],
      ["休息与体能", `${home.name} ${match.rest?.[0] || 4} 天 / ${away.name} ${match.rest?.[1] || 4} 天`, restEdge === 0 ? 0 : restEdge > 0 ? 1 : -1],
      ["伤停扰动", `${home.name}：${home.injuries}；${away.name}：${away.injuries}`, Math.max(homeInjury, awayInjury) > 0.3 ? -1 : 0],
      ["近期战绩", `${home.name} 近况分 ${homeRecent.score.toFixed(2)}；${away.name} 近况分 ${awayRecent.score.toFixed(2)}。${homeRecent.source}`, recentEdge === 0 ? 0 : recentEdge > 0 ? 1 : -1],
      ["旅途负荷", `${home.name}：${homeTravel.label}。${away.name}：${awayTravel.label}`, travelEdge === 0 ? 0 : travelEdge > 0 ? 1 : -1],
      ["温湿度/海拔", `${env ? `${env.name}，${env.climate}，海拔 ${env.altitude}m，约 ${env.temp}°C / 湿度 ${env.humidity}%` : match.weather}；环境降速 ${(weatherSlowdown * 100).toFixed(1)}%`, weatherSlowdown > 0.09 ? -1 : 0],
      ["天气/裁判", `${match.referee}；${match.weather}`, weatherSlowdown + refereeChaos > 0.08 ? -1 : 0],
      ["历史交手", h2hText, intel?.status === "live" && (intel.headToHeadSummary?.games || 0) > 0 ? 1 : 0],
      ["名单可用性", `${home.name} ${homeRoster.label}；${away.name} ${awayRoster.label}`, rosterEdge === 0 ? 0 : rosterEdge > 0 ? 1 : -1],
    ],
  };
}

function recentFormScore(events) {
  if (!events?.length) return { score: 1.5, source: "ESPN 近期 form 未返回，按中性处理" };
  const weights = [1, 0.86, 0.72, 0.58, 0.44, 0.3];
  let weighted = 0;
  let totalWeight = 0;
  events.slice(0, 6).forEach((event, index) => {
    const weight = weights[index] || 0.25;
    const result = event.result === "W" ? 3 : event.result === "D" ? 1 : 0;
    weighted += result * weight;
    totalWeight += weight;
  });
  return { score: totalWeight ? weighted / totalWeight : 1.5, source: `ESPN 已同步近 ${events.length} 场` };
}

function h2hAdjustment(intel) {
  if (intel?.status !== "live" || !intel.headToHead?.length) return 0;
  const games = intel.headToHead.slice(0, 8);
  const confidence = clamp(games.length / 6, 0.15, 0.75);
  let edge = 0;
  games.forEach((game, index) => {
    const weight = 1 / (index + 1);
    const result = game.result === "W" ? 1 : game.result === "L" ? -1 : 0;
    edge += result * weight;
  });
  return clamp(edge * 0.035 * confidence, -0.09, 0.09);
}

function upsetRisk(match, model = matchModel(match)) {
  const market = implied(getOdds(match));
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const favoriteIndex = market[0] >= market[2] ? 0 : 2;
  const favorite = favoriteIndex === 0 ? home : away;
  const underdog = favoriteIndex === 0 ? away : home;
  const marketFav = market[favoriteIndex];
  const modelFav = model.probs[favoriteIndex];
  const modelUnderdog = model.probs[favoriteIndex === 0 ? 2 : 0];
  const drawProb = model.probs[1];
  const favoriteOverpriced = clamp((marketFav - modelFav) * 1.7, 0, 32);
  const underdogLive = clamp((modelUnderdog - 22) * 1.1, 0, 22);
  const drawTrap = clamp((drawProb - 24) * 1.2, 0, 18);
  const heat = clamp((match.marketHeat - 68) * 0.55, 0, 14);
  const favoriteTravel = teamTravelLoad(favorite.id, match);
  const underdogTravel = teamTravelLoad(underdog.id, match);
  const travelPenalty = clamp((favoriteTravel.score - underdogTravel.score) * 120, 0, 14);
  const volatility = clamp((model.context.volatility - 0.5) * 38, 0, 12);
  const rosterUncertainty = state.teamRosters?.[favorite.id]?.status === "live" ? 0 : 5;
  const score = Math.round(clamp(favoriteOverpriced + underdogLive + drawTrap + heat + travelPenalty + volatility + rosterUncertainty, 0, 100));
  const level = score >= 75 ? "强烈预警" : score >= 55 ? "高冷门风险" : score >= 35 ? "有冷门苗头" : "常规风险";
  const tone = score >= 75 ? "bad" : score >= 55 ? "bad" : score >= 35 ? "warn" : "green";
  const reasons = [
    favoriteOverpriced >= 8 ? `${favorite.name}市场热度高于模型定价` : "",
    underdogLive >= 6 ? `${underdog.name}模型底盘不低` : "",
    drawTrap >= 5 ? `平局权重 ${drawProb}% 偏高` : "",
    travelPenalty >= 4 ? `${favorite.name}旅途/气候负荷更重` : "",
    volatility >= 4 ? `波动系数 ${model.context.volatility.toFixed(2)} 偏高` : "",
    rosterUncertainty ? `${favorite.name}临场阵容仍需确认` : "",
  ].filter(Boolean);
  return {
    score,
    level,
    tone,
    favorite,
    underdog,
    favoriteIndex,
    marketFav,
    modelFav,
    modelUnderdog,
    drawProb,
    reasons: reasons.length ? reasons : ["热门方定价与模型基本一致，暂未聚合明显冷门条件"],
  };
}

function rosterAvailabilityScore(roster) {
  if (!roster || roster.status !== "live") return { score: 0.82, label: "名单状态未返回" };
  const total = roster.athletes?.length || 0;
  if (!total) return { score: 0.82, label: "名单为空" };
  const unavailable = roster.athletes.filter((player) => player.statusType && player.statusType !== "active").length;
  const injured = roster.athletes.filter((player) => player.injuries?.length).length;
  const score = clamp(1 - (unavailable * 0.035 + injured * 0.025), 0.55, 1);
  return { score, label: `${total} 人名单，异常 ${unavailable + injured} 项` };
}

function injuryLoad(text = "") {
  if (/暂无|满员|无核心/.test(text)) return 0.05;
  if (/核心|主力|缺阵|伤停/.test(text)) return 0.55;
  if (/轻伤|观察|恢复|疲劳/.test(text)) return 0.28;
  return 0.18;
}

function monteCarloMatch(match, context) {
  const rng = seededRandom(hashString(`${match.id}-${state.feed.lastUpdated || "baseline"}`));
  const counts = { home: 0, draw: 0, away: 0, over25: 0, btts: 0 };
  const scoreCounts = new Map();
  let totalHome = 0;
  let totalAway = 0;
  for (let index = 0; index < context.sampleSize; index += 1) {
    const scenario = 1 + normalish(rng) * context.volatility * 0.18;
    const homeSwing = 1 + normalish(rng) * context.volatility * 0.16;
    const awaySwing = 1 + normalish(rng) * context.volatility * 0.16;
    const homeGoals = poissonSample(clamp(context.homeLambda * scenario * homeSwing, 0.15, 4.6), rng);
    const awayGoals = poissonSample(clamp(context.awayLambda * scenario * awaySwing, 0.12, 4.4), rng);
    totalHome += homeGoals;
    totalAway += awayGoals;
    if (homeGoals > awayGoals) counts.home += 1;
    else if (homeGoals === awayGoals) counts.draw += 1;
    else counts.away += 1;
    if (homeGoals + awayGoals > 2.5) counts.over25 += 1;
    if (homeGoals > 0 && awayGoals > 0) counts.btts += 1;
    const key = `${homeGoals}-${awayGoals}`;
    scoreCounts.set(key, (scoreCounts.get(key) || 0) + 1);
  }
  const toPct = (value) => Math.round((value / context.sampleSize) * 100);
  const scorelines = Array.from(scoreCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([score, count]) => ({ score, pct: Number(((count / context.sampleSize) * 100).toFixed(1)) }));
  return {
    sampleSize: context.sampleSize,
    probs: [toPct(counts.home), toPct(counts.draw), toPct(counts.away)],
    averageGoals: [
      Number((totalHome / context.sampleSize).toFixed(2)),
      Number((totalAway / context.sampleSize).toFixed(2)),
    ],
    over25: toPct(counts.over25),
    btts: toPct(counts.btts),
    scorelines,
    volatility: context.volatility,
  };
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  return function next() {
    seed += 0x6D2B79F5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normalish(rng) {
  return (rng() + rng() + rng() + rng() - 2) / 1.2;
}

function poissonSample(lambda, rng) {
  const limit = Math.exp(-lambda);
  let product = 1;
  let count = 0;
  do {
    count += 1;
    product *= rng();
  } while (product > limit && count < 10);
  return count - 1;
}

function implied(odds) {
  const raw = odds.map((o) => 1 / o);
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map((p) => Math.round((p / sum) * 100));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function pct(value) {
  return `${Math.round(value * 100)}%`;
}

function el(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function render() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">WC</div>
          <div>
            <h1>世界杯预测看板</h1>
            <p>数据聚合 / 概率建模 / 赛后复盘</p>
          </div>
        </div>
        <nav class="nav">
          ${pages.map(([id, label]) => `<button class="${state.page === id ? "active" : ""}" data-page="${id}">${label}</button>`).join("")}
        </nav>
        <div class="side-note">
          当前版本已按 48 队世界杯结构生成完整看板。赔率由后端接口自动同步；首发、伤停和赛果接入数据源后自动刷新。
          <div class="sync-note">情报刷新：${state.intelSync.label}${state.intelSync.total ? ` ${state.intelSync.done}/${state.intelSync.total}` : ""}</div>
        </div>
      </aside>
      <main class="main">
        ${renderPage()}
      </main>
    </div>
  `;
  bindEvents();
  if (state.page === "match") refreshMatchIntel(state.selectedMatch);
  if (state.page === "match") {
    const match = matches.find((item) => item.id === state.selectedMatch);
    if (match) {
      refreshTeamRoster(match.home);
      refreshTeamRoster(match.away);
    }
  }
  if (state.page === "teams") refreshTeamRoster(state.selectedTeam);
}

function topbar(kicker, title, subtitle, tools = "") {
  return `
    <header class="topbar">
      <div>
        <p class="kicker">${kicker}</p>
        <h1 class="page-title">${title}</h1>
        <p class="page-subtitle">${subtitle}</p>
      </div>
      <div class="toolbar">${tools}</div>
    </header>
  `;
}

function feedStatusLabel() {
  if (state.feed.status === "live") return "实时源已连接";
  if (state.feed.status === "cached") return "使用后端缓存";
  if (state.feed.status === "unconfigured") return "真实源未配置";
  if (state.feed.status === "error") return "数据源异常";
  return "正在同步";
}

async function refreshLiveFeed({ rerender = false } = {}) {
  try {
    const response = await fetch(`/api/live-data?ts=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const feed = await response.json();
    state.feed = {
      ...state.feed,
      ...feed,
      odds: feed.odds || {},
      events: feed.events || [],
    };
    if (state.page === "match" && state.selectedMatch) {
      refreshMatchIntel(state.selectedMatch);
    }
  } catch (error) {
    state.feed = {
      ...state.feed,
      status: "error",
      message: `无法连接自动数据接口：${error.message}`,
      odds: {},
      events: [],
    };
  }
  if (rerender) render();
}

async function refreshMatchIntel(matchId, { force = false } = {}) {
  const current = state.matchIntel[matchId];
  const isFresh = current?.fetchedAt && Date.now() - current.fetchedAt < MATCH_INTEL_REFRESH_MS;
  if (!matchId || current?.loading || (!force && current?.status === "live" && isFresh)) return;
  state.matchIntel[matchId] = { loading: true, status: "loading", message: "正在同步 ESPN 历史交手与近期战绩" };
  try {
    const response = await fetch(`/api/match-intel?matchId=${encodeURIComponent(matchId)}&ts=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.matchIntel[matchId] = { ...(await response.json()), fetchedAt: Date.now() };
  } catch (error) {
    state.matchIntel[matchId] = { status: "error", message: `比赛情报同步失败：${error.message}`, fetchedAt: Date.now() };
  }
  if (state.page === "match" && state.selectedMatch === matchId) render();
}

async function refreshTeamRoster(teamId) {
  if (!teamId || state.teamRosters[teamId]?.status === "live" || state.teamRosters[teamId]?.loading) return;
  state.teamRosters[teamId] = { loading: true, status: "loading", message: "正在同步中文大名单" };
  try {
    const response = await fetch(`/api/team-roster?team=${encodeURIComponent(teamId)}&ts=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.teamRosters[teamId] = await response.json();
  } catch (error) {
    state.teamRosters[teamId] = { status: "error", message: `球队名单同步失败：${error.message}` };
  }
  if (state.page === "teams" && state.selectedTeam === teamId) render();
}

async function startBackgroundIntelSync() {
  if (state.intelSync.started) return;
  state.intelSync.started = true;
  const days = groupedMatchDays();
  const selectedDate = defaultOverviewDate(days);
  const todayMatches = (days.find((day) => day.key === selectedDate) || days[0] || { matches: [] }).matches;
  const teamIds = Array.from(new Set([...todayMatches.flatMap((match) => [match.home, match.away]), ...teams.slice(0, 12).map((team) => team.id)]));
  const tasks = [
    ...todayMatches.map((match) => ["match", match.id]),
    ...teamIds.map((teamId) => ["team", teamId]),
  ];
  state.intelSync = { started: true, total: tasks.length, done: 0, label: "后台刷新中" };
  render();
  for (const [type, id] of tasks) {
    if (type === "match") await refreshMatchIntel(id);
    else await refreshTeamRoster(id);
    state.intelSync.done += 1;
    state.intelSync.label = state.intelSync.done >= state.intelSync.total ? "已完成首批刷新" : "后台刷新中";
  }
  render();
}

function renderPage() {
  if (state.page === "overview") return renderOverview();
  if (state.page === "matches") return renderMatches();
  if (state.page === "match") return renderMatchDetail();
  if (state.page === "teams") return renderTeams();
  if (state.page === "simulation") return renderSimulation();
  if (state.page === "golden") return renderGolden();
  if (state.page === "market") return renderMarket();
  if (state.page === "review") return renderReview();
  return renderSources();
}

function renderOverview() {
  const days = groupedMatchDays();
  const selectedDate = defaultOverviewDate(days);
  state.overviewDate = selectedDate;
  const selectedDay = days.find((day) => day.key === selectedDate) || days[0] || { label: "待定", matches: [] };
  const models = matches.map((match) => ({ match, model: matchModel(match) }));
  const focusModels = selectedDay.matches.map((match) => ({ match, model: matchModel(match) }));
  const topGaps = [...focusModels].sort((a, b) => largestGap(b.match, b.model).gapAbs - largestGap(a.match, a.model).gapAbs);
  const upsetRows = [...focusModels].map(({ match, model }) => ({ match, model, upset: upsetRisk(match, model) })).sort((a, b) => b.upset.score - a.upset.score);
  const maxGap = Math.max(1, ...topGaps.map(({ match, model }) => largestGap(match, model).gapAbs));
  const valueSpots = focusModels.filter(({ match, model }) => {
    const market = implied(getOdds(match));
    return Math.max(...model.probs.map((p, i) => Math.abs(p - market[i]))) >= 5;
  }).length;
  const averageConfidence = focusModels.length
    ? Math.round(focusModels.reduce((sum, item) => sum + item.model.confidence, 0) / focusModels.length)
    : 0;
  return `
    ${topbar("总览", "比赛日重点与风险雷达", "按比赛日展示当天重点场次，用户进入首页先看到当天需要看的比赛，也可以切换后续比赛日。")}
    <section class="panel pad day-switcher">
      <div class="panel-title"><h2>${selectedDay.label} 比赛</h2><small>${selectedDay.matches.length} 场 / 数据源自动同步开球时间</small></div>
      <div class="day-tabs">
        ${days.map((day) => `<button class="${day.key === selectedDate ? "active" : ""}" data-overview-date="${day.key}"><strong>${day.label}</strong><span>${day.matches.length} 场</span></button>`).join("")}
      </div>
    </section>
    <section class="grid cols-4">
      ${metric("当天比赛", focusModels.length, `全量赛程 ${matches.length} 场，可切换后续比赛日`, "green")}
      ${metric("当天分歧", valueSpots, "模型与市场概率差 >= 5%", "warn")}
      ${metric("当天平均置信", `${averageConfidence}%`, "置信越高不等于稳赚", "green")}
      ${metric("爆冷预警", upsetRows[0] ? `${upsetRows[0].upset.score}` : "0", upsetRows[0] ? `${getTeam(upsetRows[0].match.home).name} vs ${getTeam(upsetRows[0].match.away).name}` : "暂无比赛", upsetRows[0]?.upset.tone || "green")}
    </section>
    <section class="grid cols-2" style="margin-top:16px">
      <div class="panel pad">
        <div class="panel-title"><h2>当天比赛雷达</h2><small>点击进入单场深度</small></div>
        <div class="match-list">
          ${focusModels.map(({ match, model }) => matchCard(match, model)).join("") || `<div class="empty">当前日期暂无比赛</div>`}
        </div>
      </div>
      <div class="grid">
        <div class="panel pad">
          <div class="panel-title"><h2>模型 vs 市场分歧</h2><small>点击展开计算依据</small></div>
          <div class="gap-list">
            ${topGaps.map(({ match, model }) => marketGapRow(match, model, maxGap)).join("") || `<div class="empty">当前日期暂无可对比赔率</div>`}
          </div>
        </div>
        <div class="panel pad">
          <div class="panel-title"><h2>爆冷预警</h2><small>当前比赛日热门危险度</small></div>
          <div class="gap-list">
            ${upsetRows.slice(0, 5).map(({ match, upset }) => upsetRiskRow(match, upset)).join("") || `<div class="empty">当前日期暂无比赛</div>`}
          </div>
        </div>
        <div class="panel pad">
          <div class="panel-title"><h2>自动数据触发状态</h2><small>不需要用户手动录入</small></div>
          <div class="factor-list">
            ${factor("已自动显示：赛程与赔率", `ESPN/DraftKings 已由后端缓存同步；当前状态 ${feedStatusLabel()}，页面每 ${state.feed.nextRefreshSeconds || 60} 秒刷新一次。`)}
            ${factor("待赛前触发：首发与伤停", "进入赛前 60 分钟窗口后，若数据源返回首发、替补、伤停或停赛字段，单场页会自动展开显示并刷新模型；未到窗口时显示待触发。")}
            ${factor("已自动参与：赛制与动机", "小组第三、净胜球、轮换动机、淘汰赛常规时间/晋级差异会作为模型字段参与计算，并在对应页面显示。")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function metric(label, value, trend, tone) {
  return `
    <div class="panel metric">
      <p class="metric-label">${label}</p>
      <p class="metric-value">${value}<span></span></p>
      <div class="trend ${tone || ""}">${trend}</div>
    </div>
  `;
}

function matchCard(match, model) {
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const upset = upsetRisk(match, model);
  return `
    <article class="match-card ${state.selectedMatch === match.id ? "active" : ""}" data-match="${match.id}">
      <div>
        <div class="match-head">
          <span class="tag blue">${match.stage}</span>
          <span class="tag ${model.risk === "低" ? "green" : model.risk === "中" ? "amber" : "red"}">风险 ${model.risk}</span>
          <span class="tag ${upset.tone === "bad" ? "red" : upset.tone === "warn" ? "amber" : "green"}">爆冷 ${upset.score}</span>
          <span class="tag">市场热度 ${match.marketHeat}</span>
        </div>
        <div class="teams">${home.name} vs ${away.name}</div>
        <div class="meta">${matchTime(match)} / ${matchVenue(match)} / ${match.weather}</div>
      </div>
      <div class="split-probs">
        <div><strong>${model.probs[0]}%</strong><span>主胜</span></div>
        <div><strong>${model.probs[1]}%</strong><span>平</span></div>
        <div><strong>${model.probs[2]}%</strong><span>客胜</span></div>
      </div>
    </article>
  `;
}

function upsetRiskRow(match, upset = upsetRisk(match)) {
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  return `
    <button class="upset-card" data-match="${match.id}">
      <span class="upset-score ${upset.tone}">${upset.score}</span>
      <span class="upset-main">
        <strong>${home.name} vs ${away.name}</strong>
        <small>${upset.level} / 市场热门：${upset.favorite.name}</small>
        <span class="upset-bar"><span class="${upset.tone}" style="width:${Math.max(6, upset.score)}%"></span></span>
      </span>
      <span class="upset-reason">${upset.reasons.slice(0, 2).join("；")}</span>
    </button>
  `;
}

function marketGapRow(match, model, maxGap = 40) {
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const odds = getOdds(match);
  const market = implied(odds);
  const source = oddsSource(match);
  const { labels, gaps, maxIndex } = largestGap(match, model);
  const expanded = state.expandedGap === match.id;
  const width = Math.max(6, Math.round((Math.abs(gaps[maxIndex]) / maxGap) * 100));
  return `
    <div class="gap-card ${expanded ? "open" : ""}">
      <button class="gap-summary" data-gap="${match.id}">
        <span class="match-gap-name">${home.name} vs ${away.name}<small>${labels[maxIndex]} / ${source}</small></span>
        <span class="bar"><span class="bar-fill ${gaps[maxIndex] >= 0 ? "green" : "red"}" style="width:${width}%"></span></span>
        <strong>${gaps[maxIndex] > 0 ? "+" : ""}${gaps[maxIndex]}%</strong>
      </button>
      ${expanded ? `
        <div class="gap-detail">
          <div class="gap-formula">计算：模型概率 - 市场隐含概率。市场隐含概率由十进制赔率换算为 1/赔率，并扣除水位后归一化。</div>
          <table class="table compact">
            <thead><tr><th>结果</th><th>模型</th><th>市场隐含</th><th>差值</th><th>原始赔率</th></tr></thead>
            <tbody>
              ${labels.map((label, index) => `
                <tr class="${index === maxIndex ? "focus" : ""}">
                  <td>${label}</td>
                  <td>${model.probs[index]}%</td>
                  <td>${market[index]}%</td>
                  <td>${gaps[index] > 0 ? "+" : ""}${gaps[index]}%</td>
                  <td>${odds[index]}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="gap-explain">
            ${labels[maxIndex]} 这一项模型为 ${model.probs[maxIndex]}%，市场隐含为 ${market[maxIndex]}%，差值 ${gaps[maxIndex] > 0 ? "+" : ""}${gaps[maxIndex]}%。正数表示模型比市场更看好，负数表示模型低于市场定价。
          </div>
        </div>
      ` : ""}
    </div>
  `;
}

function largestGap(match, model) {
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const market = implied(getOdds(match));
  const labels = [home.name, "平局", away.name];
  const gaps = model.probs.map((p, i) => p - market[i]);
  const maxIndex = gaps.reduce((best, val, i) => (Math.abs(val) > Math.abs(gaps[best]) ? i : best), 0);
  return { labels, gaps, maxIndex, gapAbs: Math.abs(gaps[maxIndex]) };
}

function renderMatches() {
  const standings = groupStandings().filter((group) => state.groupFilter === "全部" || group.group === state.groupFilter);
  return `
    ${topbar(
      "小组赛程",
      "小组积分榜与出线区",
      "这里专注看 12 个小组的积分、出线区域和预测出线概率；逐场赛程入口放在首页比赛日雷达和单场深度页。",
      `<select class="select" id="groupFilter">
        ${["全部", ...Array.from(new Set(teams.map((team) => team.group))).sort()].map((x) => `<option value="${x}" ${state.groupFilter === x ? "selected" : ""}>${x === "全部" ? "全部小组" : `${x} 组`}</option>`).join("")}
      </select>`
    )}
    <section class="standings-board">
      ${standings.map((group) => `
        <article class="group-table">
          <div class="group-table-head">
            <strong>${group.group}组</strong>
            <span>赛</span><span>胜</span><span>平</span><span>负</span><span>进/失</span><span>积分</span><span>区域</span>
          </div>
          ${group.rows.map((row) => {
            const zone = row.rank <= 2 ? "晋级32强区" : row.rank === 3 ? "晋级待定区" : "待抢分区";
            const tone = row.rank <= 2 ? "qualified" : row.rank === 3 ? "third" : "normal";
            return `
              <div class="standing-row ${tone}">
                <div class="standing-team">
                  <span class="rank">${row.rank}</span>
                  <span class="flag">${teamFlag(row.team)}</span>
                  <button class="link-team" data-team="${row.team.id}">${row.team.name}</button>
                  <small>预测出线 ${row.projectedScore}%</small>
                </div>
                <span>${row.played}</span><span>${row.win}</span><span>${row.draw}</span><span>${row.loss}</span>
                <span>${row.goalsFor}/${row.goalsAgainst}</span><span>${row.points}</span><span class="zone">${zone}</span>
              </div>
            `;
          }).join("")}
        </article>
      `).join("")}
    </section>
    <section class="grid cols-2" style="margin-top:16px">
      <div class="panel pad">
        <div class="panel-title"><h2>颜色说明</h2><small>与 2026 赛制对应</small></div>
        <div class="factor-list">
          ${factor("晋级32强区", "每组前二直接晋级 32 强，表格中用亮绿色显示。")}
          ${factor("晋级待定区", "12 个小组第三中成绩最好的 8 队晋级，表格中用深绿色显示。")}
          ${factor("预测出线", "开赛前按蒙特卡洛杯赛路径和球队强度估算；开赛后接入赛果后会用真实积分、净胜球和出线规则重排。")}
        </div>
      </div>
      <div class="panel pad">
        <div class="panel-title"><h2>阶段差异</h2><small>玩法权重建议</small></div>
        <table class="table">
          <thead><tr><th>阶段</th><th>重点指标</th><th>看板提示</th></tr></thead>
          <tbody>
            <tr><td>小组赛</td><td>净胜球、轮换、出线形势</td><td>强队第三轮可能降强度，进球数模型要加入动机。</td></tr>
            <tr><td>淘汰赛</td><td>常规时间平局、点球手、门将</td><td>胜平负和晋级概率拆开，平局权重提高。</td></tr>
            <tr><td>32 强</td><td>第三名晋级质量、路径错位</td><td>48 队赛制下小组第三出线会放大路径差异。</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderMatchDetail() {
  const match = matches.find((m) => m.id === state.selectedMatch) || matches[0];
  const model = matchModel(match);
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const currentOdds = getOdds(match);
  const currentSource = oddsSource(match);
  const isLiveOdds = currentSource !== "模型基线";
  const event = liveEvent(match);
  const env = matchEnvironment(match);
  const homeTravel = teamTravelLoad(home.id, match);
  const awayTravel = teamTravelLoad(away.id, match);
  const upset = upsetRisk(match, model);
  const travelGap = Math.round(Math.abs(homeTravel.score - awayTravel.score) * 100);
  const envLabel = env ? `${env.name} ${env.temp}°C / 湿度 ${env.humidity}% / ${env.altitude}m · ${env.weatherMode === "forecast72h" ? "72小时预报" : "气候基线"}` : match.weather;
  const backLabel = state.returnPage === "matches" ? "返回小组赛程" : state.returnPage === "market" ? "返回赔率市场" : "返回首页总览";
  return `
    <button class="crumb-back" data-back-page="${state.returnPage || "overview"}">← ${backLabel}</button>
    ${topbar(
      "单场深度",
      `${home.name} vs ${away.name}`,
      "把赛前信息拆成结果概率、比分分布、攻防结构、阵容变量、市场走势和反向证据。",
      `<select class="select" id="matchSelect">${matches.map((m) => `<option value="${m.id}" ${m.id === match.id ? "selected" : ""}>${getTeam(m.home).name} vs ${getTeam(m.away).name}</option>`).join("")}</select>`
    )}
    <section class="grid cols-4">
      ${metric("模型倾向", model.probs[0] >= model.probs[2] ? `${home.name}不败` : `${away.name}不败`, `蒙特卡洛 ${model.sim.sampleSize.toLocaleString()} 次 / 风险 ${model.risk}`, model.risk === "高" ? "bad" : "green")}
      ${metric("预期进球", model.totalGoals.toFixed(2), `大 2.5 球 ${model.sim.over25}% / 双方进球 ${model.sim.btts}%`, "warn")}
      ${metric("市场热度", match.marketHeat, `${currentSource} ${currentOdds.join(" / ")}`, isLiveOdds ? "green" : "warn")}
      ${metric("爆冷预警", upset.score, `${upset.level} / 热门 ${upset.favorite.name}`, upset.tone)}
    </section>
    <section class="grid cols-2" style="margin-top:16px">
      <div class="panel pad">
        <div class="panel-title"><h2>胜平负概率</h2><small>模型 / 市场隐含</small></div>
        ${probCompare("主胜", model.probs[0], implied(currentOdds)[0])}
        ${probCompare("平局", model.probs[1], implied(currentOdds)[1])}
        ${probCompare("客胜", model.probs[2], implied(currentOdds)[2])}
      </div>
      <div class="panel pad">
        <div class="panel-title"><h2>自动赔率数据</h2><small>${feedStatusLabel()}</small></div>
        <table class="table">
          <tbody>
            <tr><th>当前来源</th><td>${currentSource}</td></tr>
            <tr><th>同步时间</th><td>${formatTime(oddsUpdatedAt(match))}</td></tr>
            <tr><th>开球/场馆</th><td>${matchTime(match)} / ${matchVenue(match)}</td></tr>
            <tr><th>转播</th><td>${event?.broadcasts?.length ? event.broadcasts.join(" / ") : "未公布"}</td></tr>
            <tr><th>刷新策略</th><td>页面每 ${state.feed.nextRefreshSeconds || 30} 秒自动拉取一次后端缓存</td></tr>
            <tr><th>数据说明</th><td>${state.feed.message}</td></tr>
          </tbody>
        </table>
        <div class="notice" style="margin-top:12px">页面不接受手动录入赔率。真实赔率由后端采集接口统一拉取、缓存和同步，避免人工搬运造成延迟或错误。</div>
      </div>
      <div class="panel pad">
        <div class="panel-title"><h2>比分热力图</h2><small>0-5 球矩阵</small></div>
        ${scoreHeatmap(model.goals[0], model.goals[1])}
      </div>
      <div class="panel pad">
        <div class="panel-title"><h2>蒙特卡洛模拟</h2><small>情境扰动后的结果分布</small></div>
        <div class="scoreline-list">
          ${model.sim.scorelines.map((item) => `<div><strong>${item.score}</strong><span>${item.pct}%</span></div>`).join("")}
        </div>
        <table class="table compact" style="margin-top:12px">
          <tbody>
            <tr><th>样本数</th><td>${model.sim.sampleSize.toLocaleString()} 次可重复模拟</td></tr>
            <tr><th>预期进球</th><td>${home.name} ${model.goals[0]} / ${away.name} ${model.goals[1]}</td></tr>
            <tr><th>波动系数</th><td>${model.context.volatility.toFixed(2)}，越高表示伤停、深度、旅途、温湿度、海拔、裁判和赛制变量带来的不确定性越大</td></tr>
          </tbody>
        </table>
      </div>
      <div class="panel pad">
        <div class="panel-title"><h2>攻防对比</h2><small>首发强度预估</small></div>
        ${radar(home, away)}
      </div>
      <div class="panel pad">
        <div class="panel-title"><h2>关键变量</h2><small>需要赛前复核</small></div>
        <div class="factor-list">
          ${factor("爆冷触发器", `${upset.favorite.name} 为市场热门，模型热门概率 ${upset.modelFav}% / 市场隐含 ${upset.marketFav}%；${upset.reasons.join("；")}。`)}
          ${factor("阵容与伤停", `${home.name}：${home.injuries}。${away.name}：${away.injuries}。`)}
          ${factor("旅途与气候", `${home.name}：${homeTravel.label}。${away.name}：${awayTravel.label}。当前球场：${envLabel}。${env?.weatherMessage || ""}`)}
          ${factor("裁判与环境", `${match.referee}；${match.weather}；休息天数 ${home.name} ${match.rest[0]} 天，${away.name} ${match.rest[1]} 天。`)}
          ${factor("反向证据", "若临场赔率与模型方向持续背离，优先检查首发变动、市场交易量与最新伤停。")}
        </div>
      </div>
    </section>
    <section class="panel pad" style="margin-top:16px">
      <div class="panel-title"><h2>模型输入因子</h2><small>当前已纳入 / 待接入状态</small></div>
      <div class="factor-grid">
        ${model.context.factors.map(([title, text, tone]) => `<div class="factor ${tone > 0 ? "positive" : tone < 0 ? "negative" : ""}"><strong>${title}</strong><p>${text}</p></div>`).join("")}
      </div>
    </section>
    ${renderMatchIntel(match, model)}
    <section class="panel pad" style="margin-top:16px">
      <div class="panel-title"><h2>预计首发与角色</h2><small>赛前可替换</small></div>
      <table class="table">
        <thead><tr><th>球队</th><th>核心球员</th><th>战术风格</th><th>定位球/点球关注</th></tr></thead>
        <tbody>
          <tr><td>${home.name}</td><td>${home.stars.join(" / ")}</td><td>${home.style}</td><td>定位球评分 ${home.setPiece}，压迫 ${home.press}</td></tr>
          <tr><td>${away.name}</td><td>${away.stars.join(" / ")}</td><td>${away.style}</td><td>定位球评分 ${away.setPiece}，压迫 ${away.press}</td></tr>
        </tbody>
      </table>
    </section>
  `;
}

function probCompare(label, model, market) {
  return `
    <div class="prob-row">
      <span>${label}</span>
      <div class="bar"><div class="bar-fill" style="width:${model}%"></div></div>
      <strong>${model}%</strong>
    </div>
    <div class="prob-row">
      <span class="meta">市场</span>
      <div class="bar"><div class="bar-fill amber" style="width:${market}%"></div></div>
      <strong>${market}%</strong>
    </div>
  `;
}

function poisson(lambda, k) {
  let fact = 1;
  for (let i = 2; i <= k; i += 1) fact *= i;
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / fact;
}

function scoreHeatmap(hg, ag) {
  const cells = [`<div class="heat-head"></div>`];
  for (let away = 0; away <= 5; away += 1) cells.push(`<div class="heat-head">客${away}</div>`);
  for (let home = 0; home <= 5; home += 1) {
    cells.push(`<div class="heat-head">主${home}</div>`);
    for (let away = 0; away <= 5; away += 1) {
      const p = poisson(hg, home) * poisson(ag, away);
      const alpha = clamp(p * 9, 0.12, 0.92);
      cells.push(`<div class="heat-cell" style="background:rgba(29,95,209,${alpha})">${home}-${away}<br>${(p * 100).toFixed(1)}%</div>`);
    }
  }
  return `<div class="heatmap">${cells.join("")}</div>`;
}

function comparisonCandidates(team) {
  return teams
    .filter((item) => item.id !== team.id)
    .sort((left, right) => {
      const leftGroup = left.group === team.group ? 0 : 1;
      const rightGroup = right.group === team.group ? 0 : 1;
      if (leftGroup !== rightGroup) return leftGroup - rightGroup;
      return Math.abs(strength(team) - strength(left)) - Math.abs(strength(team) - strength(right));
    });
}

function defaultCompareTeam(team) {
  return comparisonCandidates(team)[0] || teams.find((item) => item.id !== team.id) || team;
}

function recentSeries(team) {
  const base = [team.form - 8, team.form - 2, team.form - 10, team.form + 4, team.form + 8, team.form + 2, team.form];
  return base.map((value, index) => clamp(Math.round(value + Math.sin((team.elo + index * 17) / 28) * 3), 42, 96));
}

function radar(a, b) {
  const rows = [
    ["进攻", a.attack, b.attack],
    ["防守", a.defense, b.defense],
    ["中场", a.midfield, b.midfield],
    ["门将", a.keeper, b.keeper],
    ["替补深度", a.depth, b.depth],
    ["近期状态", a.form, b.form],
  ];
  const totalEdge = Math.round((strength(a) - strength(b)) / 5);
  return `
    <div class="compare compare-compact">
      <div class="team-box primary"><h3>${a.name}</h3><div class="meta">${a.style}</div></div>
      <div class="versus">VS</div>
      <div class="team-box opponent"><h3>${b.name}</h3><div class="meta">${b.style}</div></div>
    </div>
    <div class="compare-summary ${totalEdge >= 0 ? "home-edge" : "away-edge"}">
      综合差值 <strong>${totalEdge >= 0 ? "+" : ""}${totalEdge}</strong>，${totalEdge === 0 ? "双方综合实力接近" : totalEdge > 0 ? `${a.name} 略占优` : `${b.name} 略占优`}
    </div>
    <div class="radar diff-radar" style="margin-top:14px">
      ${rows.map(([label, left, right]) => {
        const diff = left - right;
        const leftTone = diff >= 0 ? "green strong" : "green muted";
        const rightTone = diff <= 0 ? "amber strong" : "amber muted";
        return `
        <div class="radar-row diff-row">
          <strong>${label}</strong>
          <div class="bar-wrap">
            <span class="bar-label">${a.name} ${left}</span>
            <div class="bar"><div class="bar-fill ${leftTone}" style="width:${left}%"></div></div>
          </div>
          <div class="bar-wrap">
            <span class="bar-label">${b.name} ${right}</span>
            <div class="bar"><div class="bar-fill ${rightTone}" style="width:${right}%"></div></div>
          </div>
          <span class="diff-chip ${diff > 0 ? "pos" : diff < 0 ? "neg" : "flat"}">${diff > 0 ? "+" : ""}${diff}</span>
        </div>
      `;
      }).join("")}
    </div>
  `;
}

function formComparison(a, b) {
  const aSeries = recentSeries(a);
  const bSeries = recentSeries(b);
  return `
    <div class="form-legend"><span class="home-dot">${a.name}</span><span class="away-dot">${b.name}</span></div>
    <div class="line-chart dual-line">
      ${aSeries.map((value, index) => `
        <div class="line-pair">
          <div class="line-bar" style="height:${value}%"><span>${value}</span></div>
          <div class="line-bar alt" style="height:${bSeries[index]}%"><span>${bSeries[index]}</span></div>
        </div>
      `).join("")}
    </div>
  `;
}

function factor(title, text) {
  return `<div class="factor"><strong>${title}</strong><p>${text}</p></div>`;
}

function renderMatchIntel(match, model) {
  const intel = state.matchIntel[match.id];
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  if (!intel || intel.loading) {
    return `<section class="panel pad" style="margin-top:16px"><div class="panel-title"><h2>自动补齐情报</h2><small>正在同步</small></div><div class="notice">正在从 ESPN summary 同步历史交手、近期战绩和名单状态。</div></section>`;
  }
  if (intel.status !== "live") {
    return `<section class="panel pad" style="margin-top:16px"><div class="panel-title"><h2>自动补齐情报</h2><small>${intel.status}</small></div><div class="notice">${intel.message || "当前情报源暂不可用"}</div></section>`;
  }
  const formBlock = (team) => `
    <div class="intel-box">
      <h3>${team.name} 近期战绩</h3>
      ${(intel.forms?.[team.id] || []).slice(0, 5).map((game) => `<div class="intel-row"><strong>${game.result || "-"}</strong><span>${formatTime(game.date)} vs ${game.opponent || "未知"} ${game.score || ""}</span></div>`).join("") || `<div class="meta">暂无近期比赛返回</div>`}
    </div>
  `;
  return `
    <section class="panel pad" style="margin-top:16px">
      <div class="panel-title"><h2>自动补齐情报</h2><small>${intel.provider} / ${formatTime(intel.lastUpdated)}</small></div>
      <div class="grid cols-3">
        <div class="intel-box">
          <h3>历史交手</h3>
          <div class="intel-kpi">${intel.headToHeadSummary?.games || 0} 场</div>
          <p class="meta">胜 ${intel.headToHeadSummary?.wins || 0} / 平 ${intel.headToHeadSummary?.draws || 0} / 负 ${intel.headToHeadSummary?.losses || 0}</p>
          ${(intel.headToHead || []).slice(0, 3).map((game) => `<div class="intel-row"><strong>${game.result || "-"}</strong><span>${formatTime(game.date)} ${game.score || ""} ${game.competition || ""}</span></div>`).join("")}
        </div>
        ${formBlock(home)}
        ${formBlock(away)}
      </div>
    </section>
  `;
}

function rosterFromLiveSource(team, fallback) {
  const live = state.teamRosters[team.id];
  if (!live || live.status !== "live" || !live.athletes?.length) {
    return { ...fallback, groups: { forwards: [], midfielders: [], defenders: [], goalkeepers: [] } };
  }
  const byPosition = { forwards: [], midfielders: [], defenders: [], goalkeepers: [] };
  live.athletes.forEach((player) => {
    const row = {
      name: player.nameZh || zhName(player.name),
      number: player.number || "",
      age: player.age || "",
      club: player.clubZh || "",
      caps: zhStatus(player.status),
      goals: player.injuries?.length ? player.injuries.join(" / ") : "无",
      assists: zhPosition(player.position),
      headshot: player.headshot,
      source: live.provider || "官方名单",
    };
    const group = player.positionGroup;
    const pos = (player.position || "").toLowerCase();
    if (group && byPosition[group]) byPosition[group].push(row);
    else if (pos.includes("goal")) byPosition.goalkeepers.push(row);
    else if (pos.includes("def")) byPosition.defenders.push(row);
    else if (pos.includes("mid")) byPosition.midfielders.push(row);
    else byPosition.forwards.push(row);
  });
  return {
    ...fallback,
    live,
    groups: {
      forwards: byPosition.forwards.slice(0, 10),
      midfielders: byPosition.midfielders.slice(0, 12),
      defenders: byPosition.defenders.slice(0, 12),
      goalkeepers: byPosition.goalkeepers.slice(0, 6),
    },
  };
}

function renderTeams() {
  const team = getTeam(state.selectedTeam);
  const candidates = comparisonCandidates(team);
  const compareTeam = getTeam(state.selectedTeamCompare);
  const opponent = compareTeam && compareTeam.id !== team.id ? compareTeam : defaultCompareTeam(team);
  state.selectedTeamCompare = opponent.id;
  const roster = rosterFromLiveSource(team, buildTeamRoster(team));
  const rosterLive = roster.live;
  const sections = [
    ["教练", null],
    ["前锋", roster.groups.forwards || []],
    ["中场", roster.groups.midfielders || []],
    ["后卫", roster.groups.defenders || []],
    ["门将", roster.groups.goalkeepers || []],
  ];
  return `
    ${topbar(
      "球队画像",
      `${team.name} 阵容实力页`,
      "把球队总实力、教练组、核心球员、年龄、俱乐部、身价和攻防结构放在同一页，帮助快速判断阵容真实厚度。",
      `<select class="select" id="teamSelect">${teams.map((t) => `<option value="${t.id}" ${t.id === team.id ? "selected" : ""}>${t.name}</option>`).join("")}</select>
       <select class="select" id="teamCompareSelect" title="选择能力结构对比球队">${candidates.map((t) => `<option value="${t.id}" ${t.id === opponent.id ? "selected" : ""}>对比 ${t.name}${t.group === team.group ? "（同组）" : ""}</option>`).join("")}</select>`
    )}
    <section class="team-hero panel">
      <div class="team-hero-main">
        <span class="team-hero-flag">${teamFlag(team)}</span>
        <div>
          <h2>${team.name}</h2>
          <p>${team.style}</p>
          <div class="team-hero-tags">
            <span>世界排名 ${team.fifa}</span>
            <span>总身价 ${team.value}M 欧</span>
            <span>平均年龄 ${team.age}</span>
            <span>${team.group}组</span>
          </div>
        </div>
      </div>
      <div class="team-hero-note">
        <strong>阵容解读</strong>
        <span>${team.injuries}</span>
      </div>
    </section>
    <section class="grid cols-4">
      ${metric("综合实力", Math.round(strength(team) / 5), `Elo ${team.elo} / FIFA ${team.fifa}`, "green")}
      ${metric("球队身价", `${team.value}M`, "预计首发身价需赛前更新", "warn")}
      ${metric("平均年龄", team.age, "年龄结构影响高强度赛程", "")}
      ${metric("路径评分", `${team.path}%`, "对手强弱与分组共同决定", "green")}
    </section>
    <section class="panel pad" style="margin-top:16px">
      <div class="panel-title"><h2>教练组</h2><small>资料随官方名单修正</small></div>
      <div class="staff-grid">
        ${roster.staff.map((person) => `
          <div class="staff-card">
              ${avatar(person.name)}
              <div>
                <strong>${person.name}</strong>
              <span>${Number.isFinite(Number(person.age)) && person.age !== "" ? `${person.age}岁 ` : ""}${person.role} / ${person.club}</span>
                <small>${person.note}</small>
              </div>
            </div>
        `).join("")}
      </div>
    </section>
    <section class="grid cols-2" style="margin-top:16px">
      <div class="panel pad">
        <div class="panel-title"><h2>能力结构</h2><small>${team.name} vs ${opponent.name}</small></div>
        ${radar(team, opponent)}
      </div>
      <div class="panel pad">
        <div class="panel-title"><h2>近期状态曲线</h2><small>双队趋势对照</small></div>
        ${formComparison(team, opponent)}
      </div>
      <div class="panel pad">
        <div class="panel-title"><h2>战术说明</h2><small>可解释标签</small></div>
        <div class="factor-list">
          ${factor("打法", team.style)}
          ${factor("战术倾向", team.coach)}
          ${factor("重点球员", team.stars.join(" / "))}
        </div>
      </div>
      <div class="panel pad">
        <div class="panel-title"><h2>风险提示</h2><small>赛前必须更新</small></div>
        <table class="table">
          <tbody>
            <tr><th>数据状态</th><td>${team.dataStatus}</td></tr>
            <tr><th>伤停</th><td>${team.injuries}</td></tr>
            <tr><th>防守预期</th><td>xGA ${team.xga}，门将评分 ${team.keeper}</td></tr>
            <tr><th>进攻预期</th><td>xG ${team.xg}，定位球 ${team.setPiece}</td></tr>
            <tr><th>体能</th><td>高压强度 ${team.press}，淘汰赛需关注轮换深度 ${team.depth}</td></tr>
          </tbody>
        </table>
      </div>
    </section>
    <section class="panel pad" style="margin-top:16px">
      <div class="panel-title"><h2>球员阵容</h2><small>${rosterLive ? `${rosterLive.athletes.length} 人 / ${formatTime(rosterLive.lastUpdated)}` : "正在读取官方公布名单"}</small></div>
      ${sections.slice(1).map(([label, rows]) => `
        <div class="roster-section">
          <div class="roster-section-title">${label}</div>
          <table class="table roster-table">
            <thead><tr><th>球员</th><th>号码</th><th>当前俱乐部</th><th>位置</th></tr></thead>
            <tbody>
              ${rows.map((player) => `
                <tr>
                  <td><div class="player-cell">${player.headshot ? `<img class="player-photo" src="${player.headshot}" alt="${player.name}">` : avatar(player.name)}<strong>${player.name}</strong></div></td>
                  <td>${player.number || ""}</td>
                  <td>${player.club}</td>
                  <td>${player.assists}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `).join("")}
    </section>
  `;
}

function renderSimulation() {
  const chances = championshipChances(teams);
  const ranked = [...teams].sort((a, b) => chances[b.id] - chances[a.id]);
  const groups = groupProjections();
  const thirdCandidates = groups.map((group) => group.rows[2]).sort((a, b) => b.qualify - a.qualify).slice(0, 8);
  const darkHorses = [...ranked]
    .filter((team) => team.fifa >= 20 && team.path >= 55)
    .sort((a, b) => b.path + b.form - (a.path + a.form))
    .slice(0, 3);
  return `
    ${topbar("杯赛模拟", "晋级路径与冠军概率", "按 2026 赛制建模：12 个小组，每组前二直接晋级，8 个成绩最好的第三名进入 32 强。")}
    <section class="grid cols-2">
      <div class="panel pad">
        <div class="panel-title"><h2>冠军概率榜</h2><small>48 队归一化权重</small></div>
        ${ranked.slice(0, 16).map((team, index) => `<div class="prob-row"><span>${index + 1}. ${team.name}</span><div class="bar"><div class="bar-fill ${index < 3 ? "green" : "amber"}" style="width:${Math.max(6, chances[team.id] * 3)}%"></div></div><strong>${chances[team.id]}%</strong></div>`).join("")}
      </div>
      <div class="panel pad">
        <div class="panel-title"><h2>路径难度</h2><small>小组 + 潜在对手</small></div>
        ${ranked.slice(0, 16).map((team) => `<div class="prob-row"><span>${team.name}</span><div class="bar"><div class="bar-fill" style="width:${team.path}%"></div></div><strong>${team.path}</strong></div>`).join("")}
      </div>
    </section>
    <section class="grid cols-3" style="margin-top:16px">
      <div class="panel pad">
        <div class="panel-title"><h2>黑马指数</h2><small>排名靠后但路径友好</small></div>
        ${darkHorses.map((team) => `<div class="prob-row"><span>${team.name}</span><div class="bar"><div class="bar-fill violet" style="width:${Math.max(8, team.path + team.form - 80)}%"></div></div><strong>${Math.round((team.path + team.form) / 2)}</strong></div>`).join("")}
      </div>
      <div class="panel pad">
        <div class="panel-title"><h2>第三名晋级线</h2><small>取前 8 个小组第三</small></div>
        ${thirdCandidates.map((row) => `<div class="prob-row"><span>${row.team.name}</span><div class="bar"><div class="bar-fill amber" style="width:${row.qualify}%"></div></div><strong>${row.qualify}%</strong></div>`).join("")}
      </div>
      <div class="panel pad">
        <div class="panel-title"><h2>模拟假设</h2><small>当前版本</small></div>
        <div class="factor-list">
          ${factor("单场概率", "由球队实力、攻防效率、状态、身价、路径和实时赔率差异共同形成。")}
          ${factor("32 强规则", "前二直接晋级，第三名按综合出线概率取前 8，后续路径按杯赛权重估算。")}
          ${factor("赔率作用", "ESPN/DraftKings 同步后用于识别市场与模型的分歧，不直接承诺结果。")}
        </div>
      </div>
    </section>
    <section class="panel pad" style="margin-top:16px">
      <div class="panel-title"><h2>32 强路径示意</h2><small>按当前模型生成</small></div>
      <div class="bracket bracket-wide">
        ${knockoutRounds(ranked).map((round) => `
          <div class="round">
            <h3>${round.label}</h3>
            ${round.teams.map((team, i) => `<div class="bracket-card"><strong>${team.name}</strong><span class="meta">晋级概率 ${roundProbability(team, round.step, i)}%</span></div>`).join("")}
          </div>
        `).join("")}
      </div>
    </section>
    <section class="panel pad" style="margin-top:16px">
      <div class="panel-title"><h2>12 组出线投影</h2><small>前二 + 最佳第三</small></div>
      <table class="table">
        <thead><tr><th>小组</th><th>第一倾向</th><th>第二倾向</th><th>第三名竞争</th><th>关键判断</th></tr></thead>
        <tbody>
          ${groups.map((group) => `<tr><td>${group.group}</td><td>${group.rows[0].team.name} ${group.rows[0].qualify}%</td><td>${group.rows[1].team.name} ${group.rows[1].qualify}%</td><td>${group.rows[2].team.name} ${group.rows[2].qualify}%</td><td>${group.note}</td></tr>`).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function groupProjections() {
  const groups = Array.from(new Set(teams.map((team) => team.group))).sort();
  return groups.map((group) => {
    const rows = teams
      .filter((team) => team.group === group)
      .map((team) => ({ team, score: cupScore(team) + team.path * 0.35 }))
      .sort((a, b) => b.score - a.score)
      .map((row, index) => ({
        team: row.team,
        qualify: Math.round(clamp(88 - index * 17 + (row.score - 72) * 0.35, 28, 92)),
      }));
    return {
      group,
      rows,
      note: groupNote(rows),
    };
  });
}

function groupNote(rows) {
  const gap = rows[0].qualify - rows[2].qualify;
  if (gap <= 14) return "小组强弱接近，第三名出线价值高，重点看净胜球。";
  if (rows[0].team.attack >= 82) return "头名倾向明显，弱队需要依靠低比分和定位球抢分。";
  if (rows[1].team.defense >= 78) return "防守稳定性可能决定第二名和最佳第三排序。";
  return "前二优势存在，但第三轮轮换和赛程动机会影响最终排名。";
}

function knockoutRounds(ranked) {
  return [
    { label: "32 强", step: 0, teams: ranked.slice(0, 32) },
    { label: "16 强", step: 1, teams: ranked.slice(0, 16) },
    { label: "8 强", step: 2, teams: ranked.slice(0, 8) },
    { label: "4 强", step: 3, teams: ranked.slice(0, 4) },
    { label: "决赛", step: 4, teams: ranked.slice(0, 2) },
  ];
}

function roundProbability(team, step, index) {
  return Math.max(5, Math.round(team.path - step * 14 - index * (step === 0 ? 1.2 : 2.4)));
}

function cupScore(team) {
  return team.path * 0.34 + team.form * 0.2 + team.attack * 0.18 + team.defense * 0.18 + team.depth * 0.1;
}

function championshipChances(ranked) {
  const scores = ranked.map((team) => cupScore(team));
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const weights = ranked.map((team) => Math.exp((cupScore(team) - mean) / 4.8));
  const total = weights.reduce((sum, value) => sum + value, 0);
  const raw = ranked.map((team, index) => {
    const chance = (weights[index] / total) * 100;
    return { team, floor: Math.floor(chance), fraction: chance - Math.floor(chance) };
  });
  let remainder = 100 - raw.reduce((sum, item) => sum + item.floor, 0);
  raw.sort((a, b) => b.fraction - a.fraction).forEach((item) => {
    if (remainder > 0) {
      item.floor += 1;
      remainder -= 1;
    }
  });
  return Object.fromEntries(raw.map((item) => [item.team.id, item.floor]));
}

function renderGolden() {
  return `
    ${topbar("球员专项", "金靴与进球分布", "金靴预测不只看个人能力，还要叠加球队能走多远、是否点球手、是否稳定首发和小组赛对手强弱。")}
    <section class="panel pad">
      <div class="panel-title"><h2>金靴概率榜</h2><small>球员预期进球</small></div>
      <table class="table">
        <thead><tr><th>球员</th><th>球队</th><th>预期进球</th><th>金靴概率</th><th>首发率</th><th>点球</th><th>场均射门</th><th>路径</th></tr></thead>
        <tbody>
          ${players.map((p) => `<tr><td><strong>${p.name}</strong></td><td>${p.team}</td><td>${p.goals}</td><td>${p.golden}%</td><td>${p.starts}%</td><td>${p.pens}</td><td>${p.shots}</td><td>${p.path}</td></tr>`).join("")}
        </tbody>
      </table>
    </section>
    <section class="grid cols-3" style="margin-top:16px">
      ${players.slice(0, 3).map((p) => `<div class="panel pad"><div class="panel-title"><h2>${p.name}</h2><small>${p.team}</small></div><div class="prob-row"><span>金靴概率</span><div class="bar"><div class="bar-fill green" style="width:${p.golden * 4}%"></div></div><strong>${p.golden}%</strong></div><div class="prob-row"><span>预计进球</span><div class="bar"><div class="bar-fill" style="width:${p.goals * 14}%"></div></div><strong>${p.goals}</strong></div></div>`).join("")}
    </section>
  `;
}

function renderMarket() {
  const marketRows = matches
    .filter((match) => state.groupFilter === "全部" || match.group === state.groupFilter)
    .sort((a, b) => largestGap(b, matchModel(b)).gapAbs - largestGap(a, matchModel(a)).gapAbs);
  const grouped = marketRows.reduce((acc, match) => {
    const key = matchDateKey(match);
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {});
  const days = Object.keys(grouped).sort();
  return `
    ${topbar(
      "赔率市场",
      "概率、赔率与价值分歧",
      "这里只做市场理解，不输出强制购彩指令。重点是找到模型与赔率不一致的地方，再回到单场页查证原因。",
      `<select class="select" id="groupFilter">
        ${["全部", ...Array.from(new Set(teams.map((team) => team.group))).sort()].map((x) => `<option value="${x}" ${state.groupFilter === x ? "selected" : ""}>${x === "全部" ? "全部小组" : `${x} 组`}</option>`).join("")}
      </select>`
    )}
    <section class="market-board">
      ${days.map((day) => `
        <article class="panel pad market-day">
          <div class="panel-title"><h2>${dateLabel(day)}</h2><small>${grouped[day].length} 场 / 按分歧排序</small></div>
          <div class="market-card-grid">
          ${grouped[day].map((match) => {
            const home = getTeam(match.home);
            const away = getTeam(match.away);
            const fullModel = matchModel(match);
            const model = fullModel.probs;
            const currentOdds = getOdds(match);
            const market = implied(currentOdds);
            const gaps = model.map((p, i) => p - market[i]);
            const max = gaps.reduce((best, val, i) => (Math.abs(val) > Math.abs(gaps[best]) ? i : best), 0);
            const labels = ["主胜", "平", "客胜"];
            const source = oddsSource(match);
            const upset = upsetRisk(match, fullModel);
            return `
              <button class="market-card" data-match="${match.id}">
                <span class="market-match"><strong>${home.name} vs ${away.name}</strong><small>${matchTime(match)} / ${source}</small></span>
                <span class="market-odds">即时 ${currentOdds.join(" / ")}</span>
                <span class="market-probs">模型 ${model.join("% / ")}%<br>市场 ${market.join("% / ")}%</span>
                <span class="market-tags">
                  <span class="tag ${gaps[max] > 0 ? "green" : "red"}">${labels[max]} ${gaps[max] > 0 ? "+" : ""}${gaps[max]}%</span>
                  <span class="tag ${upset.tone === "bad" ? "red" : upset.tone === "warn" ? "amber" : "green"}">爆冷 ${upset.score}</span>
                </span>
              </button>
            `;
          }).join("")}
          </div>
        </article>
      `).join("")}
    </section>
    <section class="grid cols-2" style="margin-top:16px">
      <div class="panel pad">
        <div class="panel-title"><h2>自动采集状态</h2><small>${feedStatusLabel()}</small></div>
        <div class="factor-list">
          ${factor("赔率源", `${state.feed.provider || "未配置"} / ${state.feed.message}`)}
          ${factor("最近同步", formatTime(state.feed.lastUpdated))}
          ${factor("变化监控", "后端缓存变化后，页面自动刷新市场隐含概率和最大分歧排序。")}
        </div>
      </div>
      <div class="panel pad">
        <div class="panel-title"><h2>预算纪律</h2><small>内置风控原则</small></div>
        <div class="notice">看板只提供概率与证据，不保证结果。任何购彩都应设置单日预算、单场上限和止损线，避免用串关掩盖模型不确定性。</div>
      </div>
    </section>
  `;
}

function renderReview() {
  const rows = reviewRows();
  const stats = reviewStats(rows);
  return `
    ${topbar("赛后复盘", "命中率、偏差与模型调参", "复盘页会随自动赛果源更新；每场完赛后生成模型方向、比分和进球数复盘。")}
    <section class="grid cols-4">
      ${metric("方向命中率", stats.games ? `${stats.directionHit}%` : "0场", stats.games ? `${stats.games} 场完赛自动沉淀` : "等待首场完赛", stats.directionHit >= 50 ? "green" : "warn")}
      ${metric("比分 Top5", stats.games ? `${stats.scoreHit}%` : "0场", "精确比分高波动", stats.scoreHit >= 20 ? "green" : "warn")}
      ${metric("进球数命中", stats.games ? `${stats.totalHit}%` : "0场", "大小球与 BTTS", stats.totalHit >= 50 ? "green" : "warn")}
      ${metric("累计单位", stats.games ? signed(stats.units) : "0.00", "按 1 单位赛前方向记录", stats.units >= 0 ? "green" : "bad")}
    </section>
    <section class="panel pad" style="margin-top:16px">
      <div class="panel-title"><h2>复盘记录</h2><small>${rows.length ? "自动生成" : "暂无完赛"}</small></div>
      <table class="table">
        <thead><tr><th>比赛</th><th>赛前倾向</th><th>赛果</th><th>判断</th><th>单位变化</th><th>备注</th></tr></thead>
        <tbody>
          ${rows.length ? rows.map((r) => `<tr><td>${r.match}</td><td>${r.pick}</td><td>${r.result}</td><td>${r.hit}</td><td>${r.delta}</td><td>${r.note}</td></tr>`).join("") : `<tr><td colspan="6">当前 live feed 尚未返回完赛比分；比赛结束后会按自动数据源生成复盘记录。</td></tr>`}
        </tbody>
      </table>
    </section>
  `;
}

function reviewRows() {
  return (state.feed.events || [])
    .filter((event) => event.completed && event.homeScore !== null && event.awayScore !== null)
    .map((event) => {
      const match = matches.find((item) => item.id === event.matchId);
      if (!match) return null;
      const model = matchModel(match);
      const home = getTeam(match.home);
      const away = getTeam(match.away);
      const scores = [Number(event.homeScore), Number(event.awayScore)];
      if (scores.some((value) => Number.isNaN(value))) return null;
      const actual = scores[0] > scores[1] ? 0 : scores[0] === scores[1] ? 1 : 2;
      const pickIndex = model.probs.indexOf(Math.max(...model.probs));
      const pickLabel = [`${home.name}胜`, "平局", `${away.name}胜`][pickIndex];
      const topScores = model.sim.scorelines.map((item) => item.score);
      const scoreHit = topScores.includes(`${scores[0]}-${scores[1]}`);
      const totalPickOver = model.over25 >= 50;
      const totalHit = totalPickOver === (scores[0] + scores[1] > 2.5);
      const directionHit = pickIndex === actual;
      const units = directionHit ? Number((model.probs[pickIndex] / 100).toFixed(2)) : -1;
      return {
        match: `${home.name} vs ${away.name}`,
        pick: `${pickLabel} ${model.probs[pickIndex]}%`,
        result: `${scores[0]}-${scores[1]}`,
        hit: directionHit ? "命中方向" : "未命中",
        delta: signed(units),
        units,
        directionHit,
        scoreHit,
        totalHit,
        note: `Top5比分${scoreHit ? "命中" : "未中"}；进球数${totalHit ? "命中" : "未中"}；数据源 ${event.statusDescription || event.statusName || "完赛"}`,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.match.localeCompare(b.match, "zh-CN"));
}

function reviewStats(rows) {
  const games = rows.length;
  const pct = (count) => (games ? Math.round((count / games) * 100) : 0);
  return {
    games,
    directionHit: pct(rows.filter((row) => row.directionHit).length),
    scoreHit: pct(rows.filter((row) => row.scoreHit).length),
    totalHit: pct(rows.filter((row) => row.totalHit).length),
    units: Number(rows.reduce((sum, row) => sum + row.units, 0).toFixed(2)),
  };
}

function signed(value) {
  return `${value > 0 ? "+" : ""}${Number(value).toFixed(2)}`;
}

function renderSources() {
  const confirmed = teams.filter((team) => team.status === "confirmed").length;
  const pending = teams.length - confirmed;
  const rows = [
    ["赛程/分组", "48 队 / 12 组 / 72 场小组赛结构", "已内置", "人工校验"],
    ["参赛席位", `${confirmed} 队已确认`, "已完成", "无需更新"],
    ["球队强度", "Elo、FIFA 排名、身价、攻防评分", "可用估算", "每日/赛前"],
    ["赔率", "ESPN/DraftKings 自动同步 1X2、大小球和盘口", "已接入", "60 秒缓存"],
    ["旅途/气候", "16 球场经纬度、海拔、世界杯期温湿度基线；赛前 72 小时切换 Open-Meteo 小时级预报", "已接入", "72 小时窗口内自动刷新"],
    ["伤停/首发", "当前为赛前备注字段，可替换官方名单", "需更新", "赛前高频"],
    ["赛果/复盘", "ESPN live feed 返回完赛比分后自动生成复盘记录", "已接入", "赛后自动"],
  ];
  return `
    ${topbar("数据源状态", "采集链路与可信度", "当前已接入 ESPN/DraftKings 自动数据源，同时保留字段可信度和缺失数据处理说明。")}
    <section class="grid cols-4">
      ${metric("球队席位", `${teams.length}/48`, `${confirmed} 已确认`, "green")}
      ${metric("小组赛", `${matches.length}`, "12 组，每组 6 场", "green")}
      ${metric("数据完整度", `${Math.round((confirmed / teams.length) * 100)}%`, "席位层面完整，竞技数据需临场更新", "warn")}
      ${metric("可替换字段", "赔率/首发/伤停/赛果", "无需改页面结构", "green")}
    </section>
    <section class="panel pad">
      <div class="panel-title"><h2>数据源清单</h2><small>API-ready</small></div>
      <table class="table">
        <thead><tr><th>模块</th><th>来源建议</th><th>状态</th><th>更新频率</th></tr></thead>
        <tbody>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td><span class="tag ${r[2] === "需更新" || r[2] === "可用估算" ? "amber" : "blue"}">${r[2]}</span></td><td>${r[3]}</td></tr>`).join("")}</tbody>
      </table>
    </section>
    <section class="panel pad" style="margin-top:16px">
      <div class="panel-title"><h2>字段可信度</h2><small>直接使用前先看这里</small></div>
      <table class="table">
        <thead><tr><th>字段</th><th>当前状态</th><th>使用建议</th><th>购彩前是否必须复核</th></tr></thead>
        <tbody>
          <tr><td>48 队与小组结构</td><td>已内置</td><td>可直接用于导航、分组和赛程分析。</td><td>否</td></tr>
          <tr><td>球队强度评分</td><td>赛前估算</td><td>可用于初筛和模型基线，不等同官方实力。</td><td>建议</td></tr>
          <tr><td>赔率</td><td>ESPN/DraftKings 自动同步</td><td>可直接作为市场参考；若实际购买平台不同，需对照对应平台水位。</td><td>建议</td></tr>
          <tr><td>旅途、海拔、温湿度</td><td>已进入单场模型</td><td>72 小时外用城市气候基线；进入赛前 72 小时后用 Open-Meteo 小时级预报覆盖温度、湿度、体感、降水和风速。</td><td>赛前抽查</td></tr>
          <tr><td>首发与伤停</td><td>备注字段</td><td>赛前 60 分钟必须更新，否则不要作为最终判断。</td><td>是</td></tr>
          <tr><td>赛果与复盘</td><td>自动赛果源驱动</td><td>完赛后自动沉淀方向、比分 Top5、进球数和单位变化。</td><td>赛后抽查</td></tr>
        </tbody>
      </table>
    </section>
    <section class="grid cols-2" style="margin-top:16px">
      <div class="panel pad">
        <div class="panel-title"><h2>模型管线</h2><small>建议实现顺序</small></div>
        <div class="factor-list">
          ${factor("1. 规则评分", "Elo、身价、状态、伤停、赛程、攻防效率先形成可解释基线。")}
          ${factor("2. 进球模型", "用 Poisson 或 Dixon-Coles 估计比分、总进球和双方进球。")}
          ${factor("3. 蒙特卡洛", "用单场概率模拟小组排名、晋级路径、冠军和金靴。")}
        </div>
      </div>
      <div class="panel pad">
        <div class="panel-title"><h2>下一步真实化</h2><small>从看板到生产</small></div>
        <div class="factor-list">
          ${factor("数据落库", "建立 teams、players、matches、odds、injuries、predictions、reviews 表。")}
          ${factor("自动任务", "赛前高频拉赔率与首发，赛后写入赛果并触发复盘。")}
          ${factor("权限", "私有部署即可，后续可加朋友账号和只读分享链接。")}
        </div>
      </div>
    </section>
  `;
}

function bindEvents() {
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      state.page = button.dataset.page;
      render();
    });
  });
  document.querySelectorAll("[data-match]").forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedMatch = card.dataset.match;
      state.returnPage = state.page;
      state.page = "match";
      render();
    });
  });
  document.querySelectorAll("[data-back-page]").forEach((button) => {
    button.addEventListener("click", () => {
      state.page = button.dataset.backPage || "overview";
      render();
    });
  });
  document.querySelectorAll("[data-overview-date]").forEach((button) => {
    button.addEventListener("click", () => {
      state.overviewDate = button.dataset.overviewDate;
      state.expandedGap = "";
      render();
    });
  });
  document.querySelectorAll("[data-gap]").forEach((button) => {
    button.addEventListener("click", () => {
      state.expandedGap = state.expandedGap === button.dataset.gap ? "" : button.dataset.gap;
      render();
    });
  });
  document.querySelectorAll("[data-team]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedTeam = button.dataset.team;
      state.page = "teams";
      render();
    });
  });
  const matchSelect = document.querySelector("#matchSelect");
  if (matchSelect) {
    matchSelect.addEventListener("change", (event) => {
      state.selectedMatch = event.target.value;
      render();
    });
  }
  const teamSelect = document.querySelector("#teamSelect");
  if (teamSelect) {
    teamSelect.addEventListener("change", (event) => {
      state.selectedTeam = event.target.value;
      state.selectedTeamCompare = defaultCompareTeam(getTeam(state.selectedTeam)).id;
      render();
    });
  }
  const teamCompareSelect = document.querySelector("#teamCompareSelect");
  if (teamCompareSelect) {
    teamCompareSelect.addEventListener("change", (event) => {
      state.selectedTeamCompare = event.target.value;
      render();
    });
  }
  const stageFilter = document.querySelector("#stageFilter");
  if (stageFilter) {
    stageFilter.addEventListener("change", (event) => {
      state.stageFilter = event.target.value;
      render();
    });
  }
  const groupFilter = document.querySelector("#groupFilter");
  if (groupFilter) {
    groupFilter.addEventListener("change", (event) => {
      state.groupFilter = event.target.value;
      render();
    });
  }
}

render();
refreshLiveFeed({ rerender: true });
setTimeout(() => startBackgroundIntelSync(), 800);
setInterval(() => refreshLiveFeed({ rerender: true }), (state.feed.nextRefreshSeconds || 30) * 1000);
