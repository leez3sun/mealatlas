import type { Recipe } from '../types'
import { catalogRecipes } from './catalogRecipes'

const video = (query: string) => `https://search.bilibili.com/all?keyword=${encodeURIComponent(query)}`
const article = (query: string) => `https://www.xiachufang.com/search/?keyword=${encodeURIComponent(query)}`

const featuredRecipes: Recipe[] = [
  {
    id: 'oat-congee', name: '豆浆燕麦暖粥', subtitle: '茶叶蛋 · 燕麦米 · 清爽葱香', cuisineId: 'beijing', cuisine: '北京家常', region: 'china', slot: 'breakfast',
    image: './images/oat-congee.webp', minutes: 18, difficulty: '简单', servings: 1, tags: ['高纤', '暖胃', '少油'], allergens: ['大豆', '蛋'], confidence: 'estimated',
    ingredients: [
      { name: '无糖豆浆', amount: '260 ml' }, { name: '燕麦米', amount: '45 g' }, { name: '鸡蛋', amount: '1 个（约 50 g）' },
      { name: '上海青', amount: '80 g' }, { name: '香葱', amount: '5 g' }, { name: '低钠生抽', amount: '3 ml', note: '可不放' },
    ],
    steps: ['燕麦米淘洗后与 180 ml 水煮沸，转小火加盖煮 12 分钟。', '倒入无糖豆浆，小火搅拌 3 分钟；不要大火久沸，以免糊底。', '青菜焯水 40 秒，鸡蛋提前煮 8 分钟；摆入粥面，撒葱花与少量生抽。'],
    nutrition: { kcal: 428, protein: 23, carbs: 55, fat: 13, fiber: 8.2, water: 372, sodium: 398, calcium: 294, iron: 5.1, vitaminA: 232, vitaminC: 28 },
    modification: { title: '更轻的训练前版本', summary: '保留饱腹感，把蛋黄换成额外蛋白并减半燕麦。', changes: ['燕麦米 45 g → 35 g', '全蛋 1 个 → 全蛋 1 个 + 蛋白 1 个', '不加生抽，用白胡椒提味'], nutrition: { kcal: 390, protein: 27, carbs: 44, fat: 11, fiber: 7.2, water: 382, sodium: 285, calcium: 286, iron: 4.6, vitaminA: 228, vitaminC: 28 } },
    tutorials: [{ label: 'B站视频检索', url: video('豆浆燕麦粥 做法'), type: 'video' }, { label: '下厨房图文检索', url: article('燕麦粥'), type: 'article' }],
  },
  {
    id: 'shrimp-dumplings', name: '广式虾饺早茶盘', subtitle: '虾饺 · 芥蓝 · 无糖茶', cuisineId: 'yue', cuisine: '粤菜', region: 'china', slot: 'breakfast',
    image: './images/shrimp-dumplings.webp', minutes: 28, difficulty: '适中', servings: 1, tags: ['高蛋白', '早茶', '蒸制'], allergens: ['甲壳类', '小麦'], confidence: 'estimated',
    ingredients: [{ name: '虾仁', amount: '120 g' }, { name: '澄粉', amount: '45 g' }, { name: '木薯淀粉', amount: '15 g' }, { name: '竹笋', amount: '30 g' }, { name: '芥蓝', amount: '120 g' }, { name: '芝麻油', amount: '3 g' }],
    steps: ['虾仁一半拍成虾胶，一半切丁，与竹笋、白胡椒和 1 g 盐顺向搅拌。', '澄粉与木薯淀粉混合，冲入约 70 ml 沸水揉成光滑面团，分成 6 份擀薄。', '包入虾馅，水开后中火蒸 6 分钟；芥蓝同时焯熟，滴少量芝麻油上桌。'],
    nutrition: { kcal: 446, protein: 34, carbs: 59, fat: 8, fiber: 4.3, water: 286, sodium: 712, calcium: 176, iron: 3.2, vitaminA: 242, vitaminC: 52 },
    modification: { title: '减脂点心盘', summary: '减少饺皮总量并加蔬菜，蛋白质几乎不降。', changes: ['6 只虾饺 → 5 只', '芥蓝 120 g → 200 g', '芝麻油 3 g → 1 g'], nutrition: { kcal: 374, protein: 31, carbs: 46, fat: 6, fiber: 5.8, water: 350, sodium: 628, calcium: 242, iron: 3.9, vitaminA: 371, vitaminC: 78 } },
    tutorials: [{ label: 'B站视频检索', url: video('广式虾饺 制作 教程'), type: 'video' }, { label: '下厨房图文检索', url: article('水晶虾饺'), type: 'article' }],
  },
  {
    id: 'greek-yogurt', name: '希腊酸奶晨光碗', subtitle: '莓果 · 核桃 · 燕麦', cuisineId: 'greek', cuisine: '希腊风味', region: 'world', slot: 'breakfast',
    image: './images/greek-yogurt.webp', minutes: 6, difficulty: '简单', servings: 1, tags: ['免开火', '高钙', '快手'], allergens: ['乳', '坚果'], confidence: 'estimated',
    ingredients: [{ name: '无糖希腊酸奶', amount: '220 g' }, { name: '蓝莓与草莓', amount: '120 g' }, { name: '燕麦片', amount: '35 g' }, { name: '核桃', amount: '12 g' }, { name: '奇亚籽', amount: '6 g' }],
    steps: ['酸奶装入浅碗，用勺背轻轻铺平。', '莓果洗净沥干，草莓切四瓣，与燕麦片分区铺在酸奶上。', '撒核桃和奇亚籽；若使用冷冻莓果，提前 10 分钟回温。'],
    nutrition: { kcal: 451, protein: 29, carbs: 52, fat: 16, fiber: 9.5, water: 276, sodium: 128, calcium: 344, iron: 3.1, vitaminA: 52, vitaminC: 71 },
    modification: { title: '更低能量版本', summary: '减少坚果和燕麦，莓果与蛋白质保留。', changes: ['燕麦片 35 g → 25 g', '核桃 12 g → 6 g', '奇亚籽保持 6 g'], nutrition: { kcal: 365, protein: 27, carbs: 43, fat: 11, fiber: 8.2, water: 279, sodium: 125, calcium: 332, iron: 2.6, vitaminA: 52, vitaminC: 71 } },
    tutorials: [{ label: 'B站视频检索', url: video('希腊酸奶碗 早餐'), type: 'video' }, { label: '图文检索', url: article('酸奶燕麦碗'), type: 'article' }],
  },
  {
    id: 'jiangnan-rice-roll', name: '江南菜饭蛋卷', subtitle: '糙米 · 青菜 · 菌菇', cuisineId: 'zhe', cuisine: '浙菜灵感', region: 'china', slot: 'breakfast',
    image: './images/jiangnan-rice-roll.webp', minutes: 22, difficulty: '适中', servings: 1, tags: ['全谷', '一锅出', '蔬菜'], allergens: ['蛋', '大豆'], confidence: 'estimated',
    ingredients: [{ name: '熟糙米', amount: '120 g' }, { name: '鸡蛋', amount: '2 个' }, { name: '青菜', amount: '120 g' }, { name: '香菇', amount: '50 g' }, { name: '豆腐干', amount: '35 g' }, { name: '菜籽油', amount: '5 g' }],
    steps: ['香菇、青菜与豆腐干切细丁；锅中放 3 g 油，先炒香菇，再下青菜和糙米炒匀。', '鸡蛋打散，平底锅用余油摊成薄蛋皮。', '菜饭铺在蛋皮上卷紧，静置 1 分钟后切段。'],
    nutrition: { kcal: 468, protein: 25, carbs: 51, fat: 19, fiber: 7.4, water: 274, sodium: 486, calcium: 288, iron: 5.9, vitaminA: 338, vitaminC: 36 },
    modification: { title: '轻油高蛋白版', summary: '用不粘锅减油，并增加蛋白。', changes: ['菜籽油 5 g → 2 g', '鸡蛋 2 个 → 全蛋 1 个 + 蛋白 2 个', '熟糙米 120 g → 100 g'], nutrition: { kcal: 376, protein: 28, carbs: 44, fat: 11, fiber: 6.8, water: 292, sodium: 470, calcium: 274, iron: 4.9, vitaminA: 286, vitaminC: 36 } },
    tutorials: [{ label: 'B站视频检索', url: video('菜饭 蛋卷 早餐'), type: 'video' }, { label: '下厨房图文检索', url: article('菜饭'), type: 'article' }],
  },
  {
    id: 'sichuan-chicken', name: '川味彩椒鸡胸', subtitle: '青花椒 · 彩椒 · 糙米', cuisineId: 'chuan', cuisine: '川菜', region: 'china', slot: 'lunch',
    image: './images/sichuan-chicken.webp', minutes: 24, difficulty: '简单', servings: 1, tags: ['高蛋白', '可改良', '下饭'], allergens: ['大豆'], confidence: 'estimated',
    ingredients: [{ name: '去皮鸡胸', amount: '170 g' }, { name: '彩椒', amount: '180 g' }, { name: '熟糙米', amount: '150 g' }, { name: '菜籽油', amount: '12 g' }, { name: '低钠豆瓣酱', amount: '10 g' }, { name: '青花椒', amount: '1 g' }],
    steps: ['鸡胸逆纹切块，加 5 ml 生抽和 5 g 玉米淀粉抓匀，静置 10 分钟。', '锅烧热放 8 g 油，鸡胸快速滑炒至表面变色后盛出。', '余油炒香豆瓣酱和青花椒，下彩椒大火炒 90 秒；鸡胸回锅至中心熟透，与糙米装盘。'],
    nutrition: { kcal: 682, protein: 55, carbs: 72, fat: 20, fiber: 8.6, water: 394, sodium: 968, calcium: 86, iron: 4.8, vitaminA: 286, vitaminC: 246 },
    modification: { title: '少油不寡淡', summary: '减油、换酱、加蔬菜，保留青花椒香气。', changes: ['菜籽油 12 g → 5 g', '豆瓣酱 10 g → 5 g + 醋 5 ml', '糙米 150 g → 120 g', '彩椒 180 g → 230 g'], nutrition: { kcal: 536, protein: 53, carbs: 59, fat: 12, fiber: 9.4, water: 436, sodium: 612, calcium: 91, iron: 4.7, vitaminA: 346, vitaminC: 303 } },
    tutorials: [{ label: 'B站视频检索', url: video('川味彩椒鸡胸 少油'), type: 'video' }, { label: '下厨房图文检索', url: article('彩椒鸡胸'), type: 'article' }],
  },
  {
    id: 'med-pasta', name: '全麦番茄烤蔬意面', subtitle: '番茄 · 西葫芦 · 罗勒', cuisineId: 'italian', cuisine: '意大利菜', region: 'world', slot: 'lunch',
    image: './images/med-pasta.webp', minutes: 26, difficulty: '简单', servings: 1, tags: ['地中海', '高纤', '植物友好'], allergens: ['小麦', '乳'], confidence: 'estimated',
    ingredients: [{ name: '全麦意面（干）', amount: '90 g' }, { name: '番茄', amount: '180 g' }, { name: '西葫芦与茄子', amount: '220 g' }, { name: '橄榄油', amount: '12 g' }, { name: '白芸豆', amount: '80 g' }, { name: '帕玛森', amount: '10 g' }],
    steps: ['蔬菜切 2 cm 块，拌 8 g 橄榄油和黑胡椒，220°C 烤 14 分钟。', '意面按包装少煮 1 分钟，保留 80 ml 面汤。', '番茄炒软，加入白芸豆、烤蔬菜和意面，用面汤乳化；关火拌余油和帕玛森。'],
    nutrition: { kcal: 703, protein: 28, carbs: 105, fat: 22, fiber: 19.2, water: 402, sodium: 544, calcium: 268, iron: 7.9, vitaminA: 154, vitaminC: 82 },
    modification: { title: '减脂地中海版', summary: '减少面和油，以豆类和烤蔬菜补足体积。', changes: ['全麦意面 90 g → 70 g', '橄榄油 12 g → 7 g', '白芸豆 80 g → 100 g', '蔬菜 220 g → 300 g'], nutrition: { kcal: 584, protein: 26, carbs: 91, fat: 15, fiber: 21.4, water: 482, sodium: 526, calcium: 279, iron: 8.1, vitaminA: 186, vitaminC: 98 } },
    tutorials: [{ label: 'B站视频检索', url: video('全麦番茄蔬菜意面'), type: 'video' }, { label: '下厨房图文检索', url: article('番茄蔬菜意面'), type: 'article' }],
  },
  {
    id: 'beijing-wrap', name: '北京杂粮鸡肉卷', subtitle: '甜面酱风味 · 黄瓜 · 鸡丝', cuisineId: 'beijing', cuisine: '北京菜灵感', region: 'china', slot: 'lunch',
    image: './images/beijing-wrap.webp', minutes: 20, difficulty: '简单', servings: 1, tags: ['便当', '高蛋白', '杂粮'], allergens: ['小麦', '大豆'], confidence: 'estimated',
    ingredients: [{ name: '全麦卷饼', amount: '2 张（约 90 g）' }, { name: '熟鸡胸丝', amount: '150 g' }, { name: '黄瓜', amount: '120 g' }, { name: '胡萝卜', amount: '70 g' }, { name: '低糖甜面酱', amount: '15 g' }, { name: '芝麻', amount: '5 g' }],
    steps: ['黄瓜、胡萝卜切细丝；鸡胸沿纹理撕丝。', '卷饼在干锅中每面加热 20 秒，薄薄刷甜面酱。', '铺鸡丝和蔬菜，撒芝麻，两侧折入后卷紧；切半即可装便当。'],
    nutrition: { kcal: 641, protein: 56, carbs: 76, fat: 14, fiber: 10.1, water: 308, sodium: 893, calcium: 164, iron: 5.7, vitaminA: 624, vitaminC: 18 },
    modification: { title: '低碳便当版', summary: '一张饼做开放卷，蔬菜和鸡肉不减。', changes: ['全麦卷饼 2 张 → 1 张', '甜面酱 15 g → 8 g', '增加生菜 100 g'], nutrition: { kcal: 469, protein: 51, carbs: 45, fat: 12, fiber: 9.2, water: 397, sodium: 612, calcium: 187, iron: 5.1, vitaminA: 782, vitaminC: 29 } },
    tutorials: [{ label: 'B站视频检索', url: video('杂粮鸡肉卷 便当'), type: 'video' }, { label: '下厨房图文检索', url: article('鸡肉卷'), type: 'article' }],
  },
  {
    id: 'tom-yum', name: '冬阴功海鲜汤饭', subtitle: '鲜虾 · 菌菇 · 青柠', cuisineId: 'thai', cuisine: '泰国菜', region: 'world', slot: 'lunch',
    image: './images/tom-yum.webp', minutes: 25, difficulty: '适中', servings: 1, tags: ['酸辣', '海鲜', '高蛋白'], allergens: ['甲壳类', '鱼'], confidence: 'estimated',
    ingredients: [{ name: '鲜虾', amount: '140 g' }, { name: '贝类', amount: '80 g' }, { name: '菌菇', amount: '160 g' }, { name: '番茄', amount: '120 g' }, { name: '椰奶', amount: '50 ml' }, { name: '熟糙米', amount: '130 g' }, { name: '鱼露', amount: '6 ml' }],
    steps: ['香茅拍裂切段，与南姜、柠檬叶加 500 ml 水煮 6 分钟。', '加入菌菇和番茄煮 3 分钟，再下海鲜煮至虾刚变色、贝壳张开。', '关小火加入椰奶、鱼露和青柠汁，不再大滚；与糙米分开上桌。'],
    nutrition: { kcal: 598, protein: 47, carbs: 69, fat: 17, fiber: 7.2, water: 624, sodium: 1164, calcium: 188, iron: 6.2, vitaminA: 178, vitaminC: 49 },
    modification: { title: '低钠清汤版', summary: '减鱼露与椰奶，用青柠和香草拉高风味。', changes: ['鱼露 6 ml → 3 ml', '椰奶 50 ml → 25 ml', '糙米 130 g → 110 g', '菌菇 160 g → 220 g'], nutrition: { kcal: 493, protein: 45, carbs: 60, fat: 11, fiber: 8.6, water: 684, sodium: 768, calcium: 196, iron: 6.3, vitaminA: 186, vitaminC: 53 } },
    tutorials: [{ label: 'B站视频检索', url: video('冬阴功汤 正宗 做法'), type: 'video' }, { label: '下厨房图文检索', url: article('冬阴功汤'), type: 'article' }],
  },
  {
    id: 'hunan-fish', name: '湘味剁椒蒸鱼', subtitle: '鳕鱼 · 青菜 · 糙米', cuisineId: 'xiang', cuisine: '湘菜', region: 'china', slot: 'dinner',
    image: './images/hunan-fish.webp', minutes: 24, difficulty: '简单', servings: 1, tags: ['蒸制', '高蛋白', '低脂'], allergens: ['鱼', '大豆'], confidence: 'estimated',
    ingredients: [{ name: '鳕鱼柳', amount: '190 g' }, { name: '自制低盐剁椒', amount: '22 g' }, { name: '上海青', amount: '180 g' }, { name: '熟糙米', amount: '130 g' }, { name: '菜籽油', amount: '6 g' }, { name: '姜', amount: '8 g' }],
    steps: ['鱼柳擦干，铺姜丝，水开后大火蒸 6–8 分钟，中心不透明即可。', '倒掉盘中部分蒸汁，铺低盐剁椒，再蒸 1 分钟。', '青菜焯水，鱼面淋 6 g 热油激香；与糙米和青菜装盘。'],
    nutrition: { kcal: 576, protein: 47, carbs: 55, fat: 19, fiber: 6.7, water: 454, sodium: 1048, calcium: 214, iron: 4.1, vitaminA: 342, vitaminC: 48 },
    modification: { title: '控钠减脂版', summary: '剁椒冲洗减盐，热油减半，以鲜椒和醋补香。', changes: ['剁椒 22 g → 冲洗后 12 g', '菜籽油 6 g → 3 g', '糙米 130 g → 110 g', '增加鲜红椒 30 g'], nutrition: { kcal: 494, protein: 46, carbs: 47, fat: 16, fiber: 6.9, water: 476, sodium: 648, calcium: 208, iron: 4.0, vitaminA: 376, vitaminC: 82 } },
    tutorials: [{ label: 'B站视频检索', url: video('剁椒蒸鱼 家常 少油'), type: 'video' }, { label: '下厨房图文检索', url: article('剁椒蒸鱼'), type: 'article' }],
  },
  {
    id: 'huaiyang-chicken', name: '淮扬清炖鸡腿菜饭', subtitle: '鸡腿 · 菜心 · 香菇', cuisineId: 'jiangsu', cuisine: '淮扬菜', region: 'china', slot: 'dinner',
    image: './images/huaiyang-chicken.webp', minutes: 38, difficulty: '适中', servings: 1, tags: ['清炖', '少油', '家常'], allergens: ['大豆'], confidence: 'estimated',
    ingredients: [{ name: '去皮鸡腿肉', amount: '170 g' }, { name: '菜心', amount: '180 g' }, { name: '香菇', amount: '60 g' }, { name: '熟杂粮饭', amount: '140 g' }, { name: '鸡汤', amount: '300 ml' }, { name: '芝麻油', amount: '3 g' }],
    steps: ['鸡腿冷水下锅焯至浮沫出现，捞出洗净。', '鸡腿、香菇与无盐鸡汤小火炖 22 分钟；出锅前用 2 g 盐调味。', '菜心焯熟，杂粮饭装碗，放鸡腿、香菇和菜心，淋少量芝麻油。'],
    nutrition: { kcal: 604, protein: 45, carbs: 62, fat: 21, fiber: 7.9, water: 626, sodium: 722, calcium: 226, iron: 5.6, vitaminA: 356, vitaminC: 51 },
    modification: { title: '训练日晚餐版', summary: '减少皮下脂肪，增加菌菇与青菜体积。', changes: ['彻底去皮并撇去汤面油脂', '杂粮饭 140 g → 120 g', '菜心 180 g → 240 g'], nutrition: { kcal: 519, protein: 44, carbs: 56, fat: 15, fiber: 9.1, water: 692, sodium: 698, calcium: 278, iron: 6.1, vitaminA: 468, vitaminC: 66 } },
    tutorials: [{ label: 'B站视频检索', url: video('淮扬 清炖鸡 菜饭'), type: 'video' }, { label: '下厨房图文检索', url: article('鸡腿菜饭'), type: 'article' }],
  },
  {
    id: 'american-bean-bowl', name: '美洲玉米黑豆烤碗', subtitle: '黑豆 · 玉米 · 牛油果', cuisineId: 'american', cuisine: '美洲风味', region: 'world', slot: 'dinner',
    image: './images/american-bean-bowl.webp', minutes: 25, difficulty: '简单', servings: 1, tags: ['植物蛋白', '高纤', '一碗餐'], allergens: [], confidence: 'estimated',
    ingredients: [{ name: '熟黑豆', amount: '150 g' }, { name: '玉米粒', amount: '100 g' }, { name: '熟藜麦', amount: '120 g' }, { name: '彩椒', amount: '150 g' }, { name: '牛油果', amount: '50 g' }, { name: '青柠', amount: '半个' }],
    steps: ['玉米和彩椒拌烟熏红椒粉，220°C 烤 12 分钟。', '黑豆用少量水、孜然和蒜末煮热，轻压约四分之一形成浓稠口感。', '藜麦垫底，码入黑豆与烤蔬菜，放牛油果，挤青柠汁。'],
    nutrition: { kcal: 672, protein: 27, carbs: 111, fat: 17, fiber: 27.2, water: 393, sodium: 328, calcium: 151, iron: 9.2, vitaminA: 224, vitaminC: 198 },
    modification: { title: '高蛋白轻量版', summary: '藜麦减量，补入无糖酸奶或豆腐酱。', changes: ['熟藜麦 120 g → 80 g', '牛油果 50 g → 30 g', '增加嫩豆腐酱 100 g'], nutrition: { kcal: 588, protein: 32, carbs: 95, fat: 14, fiber: 25.9, water: 484, sodium: 346, calcium: 286, iron: 9.8, vitaminA: 218, vitaminC: 198 } },
    tutorials: [{ label: 'B站视频检索', url: video('黑豆玉米藜麦碗'), type: 'video' }, { label: '图文检索', url: article('黑豆玉米沙拉'), type: 'article' }],
  },
  {
    id: 'borscht', name: '俄式甜菜牛肉汤', subtitle: '甜菜根 · 牛腱 · 黑麦面包', cuisineId: 'russian', cuisine: '俄国菜', region: 'world', slot: 'dinner',
    image: './images/borscht.webp', minutes: 52, difficulty: '适中', servings: 1, tags: ['暖汤', '铁元素', '蔬菜'], allergens: ['小麦', '乳'], confidence: 'estimated',
    ingredients: [{ name: '牛腱肉', amount: '130 g' }, { name: '甜菜根', amount: '160 g' }, { name: '卷心菜', amount: '150 g' }, { name: '番茄', amount: '120 g' }, { name: '土豆', amount: '100 g' }, { name: '黑麦面包', amount: '60 g' }, { name: '酸奶', amount: '20 g' }],
    steps: ['牛腱切 2 cm 块，冷水焯净；加 600 ml 水和月桂叶小火炖 30 分钟。', '甜菜、土豆切条，番茄切块，与卷心菜分次入锅，再煮 15 分钟。', '用黑胡椒、少量盐和醋调出酸甜平衡；盛碗后点无糖酸奶，配黑麦面包。'],
    nutrition: { kcal: 652, protein: 43, carbs: 82, fat: 18, fiber: 14.8, water: 774, sodium: 786, calcium: 189, iron: 8.6, vitaminA: 138, vitaminC: 93 },
    modification: { title: '清爽高蛋白版', summary: '土豆与面包减量，瘦牛肉和卷心菜保留。', changes: ['土豆 100 g → 60 g', '黑麦面包 60 g → 35 g', '酸奶 20 g → 40 g', '卷心菜 150 g → 220 g'], nutrition: { kcal: 540, protein: 44, carbs: 60, fat: 16, fiber: 15.7, water: 858, sodium: 748, calcium: 243, iron: 8.5, vitaminA: 142, vitaminC: 118 } },
    tutorials: [{ label: 'B站视频检索', url: video('俄式罗宋汤 甜菜根'), type: 'video' }, { label: '下厨房图文检索', url: article('俄式红菜汤'), type: 'article' }],
  },
  {
    id: 'med-fish-plate', name: '地中海香草鱼盘', subtitle: '白身鱼 · 鹰嘴豆 · 番茄', cuisineId: 'mediterranean', cuisine: '地中海饮食', region: 'world', slot: 'dinner',
    image: './images/med-fish-plate.webp', minutes: 29, difficulty: '简单', servings: 1, tags: ['高蛋白', '地中海', '橄榄油'], allergens: ['鱼'], confidence: 'estimated',
    ingredients: [{ name: '白身鱼', amount: '180 g' }, { name: '熟鹰嘴豆', amount: '120 g' }, { name: '番茄', amount: '180 g' }, { name: '菠菜', amount: '150 g' }, { name: '橄榄油', amount: '10 g' }, { name: '柠檬', amount: '半个' }],
    steps: ['鱼擦干，抹柠檬皮屑、黑胡椒和 4 g 橄榄油，200°C 烤 10–12 分钟。', '余油炒软番茄，加入鹰嘴豆和菠菜，翻炒至菠菜刚塌。', '蔬菜豆类垫底，放烤鱼，挤柠檬汁并撒欧芹。'],
    nutrition: { kcal: 591, protein: 52, carbs: 50, fat: 21, fiber: 15.1, water: 481, sodium: 486, calcium: 248, iron: 8.4, vitaminA: 714, vitaminC: 86 },
    modification: { title: '更轻的晚餐盘', summary: '橄榄油减量，增加番茄菠菜，蛋白质保持。', changes: ['橄榄油 10 g → 5 g', '鹰嘴豆 120 g → 90 g', '菠菜 150 g → 220 g'], nutrition: { kcal: 482, protein: 49, carbs: 39, fat: 15, fiber: 14.6, water: 545, sodium: 472, calcium: 306, iron: 9.4, vitaminA: 982, vitaminC: 104 } },
    tutorials: [{ label: 'B站视频检索', url: video('地中海烤鱼 鹰嘴豆'), type: 'video' }, { label: '图文检索', url: article('香草烤鱼'), type: 'article' }],
  },
]

export const recipes: Recipe[] = [...featuredRecipes, ...catalogRecipes]

export const recipeById = new Map(recipes.map((recipe) => [recipe.id, recipe]))
