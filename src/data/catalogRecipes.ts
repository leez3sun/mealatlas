import type { MealSlot, Nutrition, Recipe } from '../types'
import { cuisines } from './cuisines'

type Profile = 'fish' | 'seafood' | 'poultry' | 'red-meat' | 'vegetable' | 'legume' | 'mixed'

interface Seed {
  cuisineId: string
  slot: MealSlot
  minutes: number
  profile: Profile
  ingredients: string
  steps: string[]
  macros: [number, number, number, number, number, number]
  tags: string[]
  allergens?: string[]
  changes: string[]
}

const microByProfile: Record<Profile, Pick<Nutrition, 'calcium' | 'iron' | 'vitaminA' | 'vitaminC'>> = {
  fish: { calcium: 146, iron: 3.4, vitaminA: 188, vitaminC: 42 },
  seafood: { calcium: 202, iron: 5.2, vitaminA: 164, vitaminC: 38 },
  poultry: { calcium: 92, iron: 3.6, vitaminA: 226, vitaminC: 44 },
  'red-meat': { calcium: 86, iron: 6.8, vitaminA: 184, vitaminC: 35 },
  vegetable: { calcium: 178, iron: 5.1, vitaminA: 612, vitaminC: 92 },
  legume: { calcium: 194, iron: 6.4, vitaminA: 284, vitaminC: 58 },
  mixed: { calcium: 158, iron: 5.0, vitaminA: 324, vitaminC: 54 },
}

const makeNutrition = (seed: Seed): Nutrition => {
  const [kcal, protein, carbs, fat, fiber, sodium] = seed.macros
  const micro = microByProfile[seed.profile]
  const isSoup = seed.tags.some((tag) => ['汤', '炖', '火锅'].includes(tag))
  return { kcal, protein, carbs, fat, fiber, sodium, water: isSoup ? 680 : 390 + seed.ingredients.split(';').length * 14, ...micro }
}

const lighten = (base: Nutrition): Nutrition => ({
  kcal: Math.round(base.kcal * 0.82),
  protein: Math.round(base.protein * 0.96),
  carbs: Math.round(base.carbs * 0.86),
  fat: Math.round(base.fat * 0.68),
  fiber: Math.round(base.fiber * 1.12 * 10) / 10,
  water: base.water + 70,
  sodium: Math.round(base.sodium * 0.62),
  calcium: Math.round(base.calcium * 1.08),
  iron: Math.round(base.iron * 1.02 * 10) / 10,
  vitaminA: Math.round(base.vitaminA * 1.15),
  vitaminC: Math.round(base.vitaminC * 1.18),
})

const seeds: Seed[] = [
  {
    cuisineId: 'lu', slot: 'dinner', minutes: 45, profile: 'seafood', ingredients: '水发海参:180 g;大葱白:90 g;低钠高汤:260 ml;菜籽油:10 g;生抽:8 ml;水淀粉:12 g',
    steps: ['海参洗净后在无盐高汤中小火煨 8 分钟，捞出沥干。', '葱白切段，以 6 g 油小火煎至金黄，放入海参和高汤。', '加生抽后小火烧 10 分钟，转大火收汁，以水淀粉薄芡包裹食材。'],
    macros: [528, 31, 34, 28, 5.1, 918], tags: ['葱烧', '海鲜', '鲁菜'], allergens: ['海鲜', '大豆'], changes: ['用不粘锅将油 10 g 减至 5 g', '高汤改为无盐版本并减半生抽', '搭配 220 g 焯青菜代替部分主食'],
  },
  {
    cuisineId: 'su', slot: 'dinner', minutes: 55, profile: 'fish', ingredients: '鳜鱼柳:220 g;青豆:30 g;番茄:80 g;米醋:18 ml;糖:12 g;淀粉:22 g;菜籽油:12 g',
    steps: ['鱼柳擦干后切交叉花刀，薄薄拍上淀粉，保持鱼皮完整。', '鱼皮朝下放入少油不粘锅煎定型，再翻面煎至鱼肉熟透。', '番茄、米醋、糖和 80 ml 水煮成酸甜汁，放青豆，淋在鱼上即食。'],
    macros: [594, 43, 55, 23, 4.8, 682], tags: ['酸甜', '鱼类', '苏菜'], allergens: ['鱼'], changes: ['传统宽油炸改为不粘锅煎', '糖 12 g 减至 6 g，以番茄增甜', '酸甜汁不勾厚芡并搭配绿叶菜'],
  },
  {
    cuisineId: 'min', slot: 'dinner', minutes: 90, profile: 'mixed', ingredients: '去皮鸡腿:100 g;鲜虾:80 g;鲍鱼菇:100 g;香菇:50 g;冬笋:80 g;低钠高汤:500 ml;绍兴酒:10 ml',
    steps: ['鸡腿焯水，虾去虾线；香菇、冬笋和鲍鱼菇分别洗净切块。', '鸡腿、香菇、冬笋与高汤入砂锅，小火加盖炖 45 分钟。', '加入鲍鱼菇和绍兴酒再炖 15 分钟，最后放虾煮至卷曲，撇净浮油。'],
    macros: [612, 57, 32, 27, 6.4, 886], tags: ['汤', '炖', '闽菜'], allergens: ['甲壳类'], changes: ['以菌菇替代高脂蹄筋和五花肉', '鸡腿彻底去皮并撇去汤面浮油', '高汤选无盐版，出锅只加 1 g 盐'],
  },
  {
    cuisineId: 'hui', slot: 'dinner', minutes: 50, profile: 'fish', ingredients: '鳜鱼柳:210 g;姜:12 g;蒜:10 g;青红椒:80 g;低钠生抽:8 ml;菜籽油:8 g;糙米饭:120 g',
    steps: ['鱼柳用流动水快速冲净表面腌味，擦干后切块。', '姜蒜用少量油炒香，放鱼块两面煎定型，加入 180 ml 热水。', '加生抽小火焖 8 分钟，放青红椒再烧 2 分钟，配糙米饭。'],
    macros: [566, 42, 48, 22, 6.1, 948], tags: ['焖', '发酵风味', '徽菜'], allergens: ['鱼', '大豆'], changes: ['咸鱼块提前冲洗，减少额外盐', '不再油炸，改少油煎焖', '糙米饭 120 g 并增加青红椒'],
  },
  {
    cuisineId: 'tianjin', slot: 'dinner', minutes: 48, profile: 'fish', ingredients: '鲤鱼柳:220 g;番茄:100 g;米醋:20 ml;糖:8 g;淀粉:18 g;菜籽油:10 g;青菜:180 g',
    steps: ['鱼柳擦干切菱形花刀，薄拍淀粉，静置 5 分钟。', '用少油煎至鱼肉定型且中心熟透；青菜另行焯熟。', '番茄、米醋、糖与 100 ml 水熬汁，收至能挂勺后淋鱼，青菜围边。'],
    macros: [548, 44, 42, 23, 6.9, 704], tags: ['酸甜', '鱼类', '津味'], allergens: ['鱼'], changes: ['整鱼宽油炸改为鱼柳少油煎', '糖减半并用番茄自然酸甜', '增加 180 g 青菜平衡餐盘'],
  },
  {
    cuisineId: 'hebei', slot: 'dinner', minutes: 50, profile: 'fish', ingredients: '鲤鱼柳:220 g;胡萝卜:50 g;青豆:30 g;米醋:18 ml;糖:8 g;淀粉:18 g;菜籽油:10 g',
    steps: ['鱼柳切细条但不切断，擦干后均匀薄拍淀粉。', '鱼条在不粘锅中少油煎至卷曲金黄，确保鱼肉熟透。', '胡萝卜、青豆煸熟，加入醋、糖和水煮汁，淋在鱼条上。'],
    macros: [536, 43, 41, 22, 5.8, 668], tags: ['鱼类', '酸甜', '冀菜'], allergens: ['鱼'], changes: ['造型保留但由炸制改为煎制', '酸甜汁减糖并不加额外盐', '胡萝卜和青豆增至 160 g'],
  },
  {
    cuisineId: 'shanxi', slot: 'lunch', minutes: 28, profile: 'red-meat', ingredients: '猪里脊:150 g;木耳:50 g;蒜薹:100 g;洋葱:70 g;生抽:8 ml;淀粉:8 g;菜籽油:8 g',
    steps: ['里脊逆纹切片，加一半生抽和淀粉抓匀，腌 10 分钟。', '热锅放 5 g 油，肉片滑炒至刚变色后盛出。', '余油炒香洋葱、蒜薹和木耳，肉片回锅，加剩余生抽快速翻匀。'],
    macros: [489, 38, 31, 23, 7.2, 746], tags: ['快炒', '瘦肉', '晋菜'], allergens: ['大豆'], changes: ['选猪里脊替代肥瘦肉', '油控制在 5 g 并省去过油步骤', '木耳和蒜薹各增加 50 g'],
  },
  {
    cuisineId: 'inner-mongolia', slot: 'dinner', minutes: 55, profile: 'red-meat', ingredients: '带骨羊腿肉:220 g;白萝卜:180 g;大葱:20 g;姜:12 g;花椒:1 g;盐:1.5 g;荞麦饭:100 g',
    steps: ['羊肉冷水浸泡 20 分钟后焯水，洗去浮沫。', '羊肉、姜、葱和花椒加足量热水，小火煮 40 分钟。', '放白萝卜再煮 12 分钟，出锅前少量盐调味，配荞麦饭。'],
    macros: [626, 49, 43, 30, 6.3, 652], tags: ['煮', '羊肉', '蒙古风味'], changes: ['选瘦羊腿并去除可见脂肪', '汤冷却后撇油再复热', '以白萝卜和荞麦饭补足纤维'],
  },
  {
    cuisineId: 'henan', slot: 'dinner', minutes: 52, profile: 'fish', ingredients: '鲤鱼柳:220 g;全麦细面:60 g;番茄:100 g;米醋:16 ml;糖:8 g;淀粉:14 g;菜籽油:10 g',
    steps: ['鱼柳切花刀并薄拍淀粉，用不粘锅少油煎熟。', '番茄、米醋、糖和 120 ml 水煮成酸甜汁，淋在鱼上。', '全麦细面煮熟后沥干，在干锅中焙至微脆，食用前铺在鱼汁旁。'],
    macros: [612, 43, 71, 21, 8.2, 706], tags: ['鱼类', '焙面', '豫菜'], allergens: ['鱼', '小麦'], changes: ['鲤鱼从油炸改为少油煎', '焙面换全麦且干锅焙香', '糖减半，番茄增加到 150 g'],
  },
  {
    cuisineId: 'hubei', slot: 'dinner', minutes: 65, profile: 'red-meat', ingredients: '猪肋排:160 g;莲藕:260 g;姜:12 g;葱:15 g;白胡椒:1 g;盐:1.5 g;青菜:120 g',
    steps: ['肋排冷水下锅焯 3 分钟，冲净浮沫；莲藕切滚刀块。', '肋排、姜和 900 ml 水入锅，小火炖 35 分钟。', '加入莲藕再炖 25 分钟，出锅前放盐和白胡椒，配焯青菜。'],
    macros: [588, 35, 51, 27, 9.1, 636], tags: ['汤', '炖', '湖北菜'], changes: ['肋排减至 120 g 并焯水去油', '莲藕增至 320 g，增加焯青菜', '汤冷藏撇油后再加热食用'],
  },
  {
    cuisineId: 'hunan-local', slot: 'dinner', minutes: 24, profile: 'red-meat', ingredients: '黄牛里脊:170 g;青辣椒:160 g;红辣椒:40 g;蒜:12 g;低钠生抽:8 ml;淀粉:6 g;菜籽油:8 g',
    steps: ['牛里脊逆纹切薄片，加一半生抽和淀粉抓匀，腌 8 分钟。', '热锅放 5 g 油，牛肉大火滑炒至刚变色，立即盛出。', '余油炒香蒜和青红椒，牛肉回锅，加剩余生抽快速翻匀后关火。'],
    macros: [478, 42, 25, 23, 7.6, 786], tags: ['快炒', '黄牛肉', '湖南地方菜'], allergens: ['大豆'], changes: ['选择瘦黄牛里脊', '油控制在 5 g，不做宽油滑炒', '辣椒增至 240 g，生抽减半'],
  },
  {
    cuisineId: 'jiangxi', slot: 'dinner', minutes: 36, profile: 'poultry', ingredients: '去皮鸡腿:180 g;杏鲍菇:120 g;九层塔:20 g;姜:15 g;蒜:12 g;低钠生抽:10 ml;米酒:12 ml;芝麻油:6 g',
    steps: ['鸡腿切块，姜切片，杏鲍菇切滚刀块。', '姜蒜用少量油煸香，鸡块下锅煎至表面变色，加入杏鲍菇。', '加生抽、米酒和 80 ml 水焖 12 分钟，收汁后关火拌九层塔。'],
    macros: [522, 42, 28, 25, 5.6, 862], tags: ['焖', '九层塔', '赣味'], allergens: ['大豆'], changes: ['鸡腿彻底去皮', '芝麻油 6 g 减至 3 g', '杏鲍菇增至 200 g 增加体积'],
  },
  {
    cuisineId: 'shanghai', slot: 'dinner', minutes: 60, profile: 'mixed', ingredients: '咸肉:45 g;鲜猪里脊:100 g;春笋:180 g;百叶结:80 g;姜:10 g;低钠高汤:650 ml;青菜:120 g',
    steps: ['咸肉用温水浸泡 20 分钟后切薄片；鲜肉焯水。', '咸肉、鲜肉、姜和高汤小火炖 25 分钟，加入春笋再炖 18 分钟。', '放百叶结煮 8 分钟，撇去浮油，搭配焯青菜，不再额外加盐。'],
    macros: [548, 44, 36, 26, 8.3, 1048], tags: ['汤', '春笋', '本帮'], allergens: ['大豆'], changes: ['咸肉减量并先浸泡去盐', '鲜肉选里脊，撇除汤面油脂', '春笋和青菜合计增至 380 g'],
  },
  {
    cuisineId: 'anhui-local', slot: 'dinner', minutes: 48, profile: 'mixed', ingredients: '去皮鸡腿:110 g;虾仁:70 g;豆腐:100 g;香菇:60 g;冬笋:80 g;青菜:120 g;低钠高汤:350 ml',
    steps: ['鸡腿切块焯水；虾仁去虾线；豆腐、冬笋切块。', '鸡腿、香菇、冬笋和高汤小火炖 22 分钟。', '放豆腐、虾仁和青菜再煮 6 分钟，以白胡椒调味。'],
    macros: [486, 48, 29, 20, 7.4, 772], tags: ['杂烩', '汤', '皖味'], allergens: ['甲壳类', '大豆'], changes: ['去掉传统杂烩中的高脂内脏', '高汤用无盐版并不勾厚芡', '豆腐与青菜提高植物蛋白和纤维'],
  },
  {
    cuisineId: 'fujian-local', slot: 'lunch', minutes: 35, profile: 'red-meat', ingredients: '猪里脊:150 g;荸荠:80 g;番茄:80 g;米醋:18 ml;糖:8 g;淀粉:12 g;菜籽油:8 g',
    steps: ['里脊切块，以刀背轻拍出花纹，薄裹淀粉。', '用不粘锅少油煎至两面金黄、中心熟透，盛出。', '番茄、米醋、糖和少量水煮汁，放荸荠与肉块快速翻匀。'],
    macros: [475, 36, 43, 19, 5.1, 622], tags: ['酸甜', '里脊', '福州味'], changes: ['油炸改为少油煎', '糖减至 4 g，用番茄补甜', '荸荠增加至 130 g'],
  },
  {
    cuisineId: 'shandong-local', slot: 'dinner', minutes: 32, profile: 'fish', ingredients: '鳕鱼柳:200 g;木耳:50 g;青豆:35 g;低钠高汤:180 ml;香糟卤:12 ml;蛋清:20 g;淀粉:8 g',
    steps: ['鱼柳斜切片，加蛋清和淀粉轻抓，静置 8 分钟。', '高汤微沸，鱼片分散下锅滑熟后捞出；木耳、青豆煮熟。', '香糟卤加入汤中，小火煮 1 分钟，以薄芡收至清亮，回放鱼片。'],
    macros: [424, 45, 28, 14, 5.2, 858], tags: ['糟香', '鱼片', '胶东'], allergens: ['鱼', '蛋'], changes: ['鱼片用水滑而不是油滑', '香糟卤减半并用高汤稀释', '加入木耳和青豆提高纤维'],
  },
  {
    cuisineId: 'liaoning', slot: 'lunch', minutes: 34, profile: 'red-meat', ingredients: '猪里脊:160 g;胡萝卜:50 g;香菜:15 g;米醋:20 ml;糖:8 g;淀粉:16 g;菜籽油:9 g',
    steps: ['里脊切薄片，轻拍淀粉至表面干爽。', '不粘锅分两批少油煎肉片，煎至边缘微脆且中心熟透。', '米醋、糖和 60 ml 水煮沸，放胡萝卜丝和肉片，大火快速裹汁，撒香菜。'],
    macros: [492, 37, 44, 20, 4.4, 642], tags: ['酸甜', '里脊', '辽菜'], changes: ['复炸改为分批煎脆', '糖从传统用量减至 8 g', '配 200 g 凉拌蔬菜食用'],
  },
  {
    cuisineId: 'jilin', slot: 'dinner', minutes: 58, profile: 'red-meat', ingredients: '去皮五花肉:90 g;血肠:100 g;酸菜:220 g;冻豆腐:100 g;姜:10 g;低钠高汤:600 ml;粉条:35 g',
    steps: ['酸菜冲洗挤干；猪肉冷水下锅煮 25 分钟后切薄片。', '酸菜、冻豆腐、肉片和高汤炖 18 分钟，加入泡软粉条。', '血肠切厚片，最后放入小火煮 5 分钟，避免猛烈翻动。'],
    macros: [604, 35, 49, 30, 9.2, 1160], tags: ['汤', '酸菜', '吉林菜'], allergens: ['大豆'], changes: ['猪肉去皮并减量至 60 g', '酸菜冲洗两次以降低钠', '血肠减至 70 g，冻豆腐增至 150 g'],
  },
  {
    cuisineId: 'heilongjiang', slot: 'dinner', minutes: 56, profile: 'poultry', ingredients: '去皮鸡腿:180 g;榛蘑:80 g;土豆:120 g;粉条:35 g;姜:10 g;低钠生抽:8 ml;菜籽油:6 g',
    steps: ['榛蘑温水泡发并清洗；鸡腿切块焯水。', '鸡块、姜、榛蘑和 450 ml 热水小火炖 25 分钟。', '放土豆和粉条再炖 15 分钟，加生抽，收至汤汁浓而不干。'],
    macros: [582, 42, 61, 21, 8.7, 748], tags: ['炖', '菌菇', '龙江菜'], allergens: ['大豆'], changes: ['鸡腿彻底去皮', '粉条 35 g 减至 20 g', '榛蘑增加到 120 g 并不额外加盐'],
  },
  {
    cuisineId: 'guangdong-local', slot: 'dinner', minutes: 30, profile: 'red-meat', ingredients: '瘦牛肉片:180 g;白萝卜:160 g;娃娃菜:180 g;鲜菌菇:120 g;低钠清汤:700 ml;沙茶酱:8 g;香菜:15 g',
    steps: ['萝卜、菌菇放清汤中先煮 10 分钟，娃娃菜洗净备用。', '牛肉按纹理分批下锅，每批涮至刚变色即捞出。', '蔬菜煮熟后与牛肉同食，沙茶酱加汤稀释作为蘸碟。'],
    macros: [536, 48, 38, 22, 8.8, 892], tags: ['火锅', '牛肉', '潮汕'], allergens: ['大豆'], changes: ['只选瘦牛肉并控制 180 g', '沙茶酱减至 8 g 且稀释使用', '蔬菜与肉的重量比提高到 2.5:1'],
  },
  {
    cuisineId: 'hakka', slot: 'dinner', minutes: 70, profile: 'red-meat', ingredients: '去皮五花肉:120 g;梅干菜:55 g;芋头:160 g;姜:10 g;低钠生抽:8 ml;米酒:10 ml;青菜:180 g',
    steps: ['梅干菜泡洗两次挤干；猪肉焯水后切薄片。', '肉片与梅干菜、姜、生抽、米酒码入碗中，上锅蒸 45 分钟。', '芋头蒸熟压成块，倒扣肉菜后撇去表面油汁，配焯青菜。'],
    macros: [636, 31, 58, 32, 10.2, 1040], tags: ['蒸', '梅菜', '客家'], allergens: ['大豆'], changes: ['五花肉去皮并减至 80 g', '梅干菜充分浸泡减盐', '用芋头和青菜替代部分肥肉体积'],
  },
  {
    cuisineId: 'guangxi', slot: 'dinner', minutes: 42, profile: 'poultry', ingredients: '去皮鸭胸:170 g;酸柠檬:25 g;酸藠头:25 g;彩椒:120 g;姜:12 g;低钠生抽:8 ml;菜籽油:6 g',
    steps: ['鸭胸去皮切块，冷水焯 2 分钟后沥干。', '姜片用少量油炒香，放鸭肉煸至表面微黄，加入 180 ml 水焖 20 分钟。', '放酸柠檬、藠头和彩椒再焖 6 分钟，以生抽调味。'],
    macros: [468, 39, 29, 22, 6.2, 886], tags: ['酸香', '鸭肉', '广西菜'], allergens: ['大豆'], changes: ['鸭胸彻底去皮', '酸料先冲洗并不再额外加盐', '彩椒增至 200 g 增加维生素 C'],
  },
  {
    cuisineId: 'hainan', slot: 'breakfast', minutes: 48, profile: 'poultry', ingredients: '去皮鸡腿:180 g;糙米:70 g;黄瓜:120 g;番茄:100 g;姜:15 g;葱:15 g;低钠鸡汤:180 ml',
    steps: ['鸡腿与姜葱放入微沸水中浸煮 18 分钟，关火焖 8 分钟，确认熟透。', '糙米用撇去浮油的鸡汤煮熟，焖 10 分钟再松散。', '鸡肉切块，与黄瓜、番茄和鸡饭装盘，蘸汁单独少量使用。'],
    macros: [602, 44, 65, 20, 7.9, 624], tags: ['鸡饭', '浸煮', '海南菜'], allergens: [], changes: ['鸡腿去皮且鸡汤撇油', '白米换 70 g 糙米', '蘸汁减半并增加黄瓜番茄'],
  },
  {
    cuisineId: 'hong-kong', slot: 'breakfast', minutes: 34, profile: 'mixed', ingredients: '鲜虾仁:90 g;瘦猪肉末:70 g;云吞皮:60 g;全麦面:65 g;青菜:160 g;低钠高汤:450 ml;葱:10 g',
    steps: ['虾仁切丁与瘦肉末同向搅拌，包入 8 张云吞皮。', '高汤微沸，云吞煮至浮起后再煮 2 分钟；青菜烫熟。', '全麦面另锅煮熟沥水，加入高汤、云吞和青菜，撒葱花。'],
    macros: [578, 39, 72, 16, 8.4, 968], tags: ['汤面', '云吞', '港式'], allergens: ['甲壳类', '小麦'], changes: ['面条用全麦且控制 65 g', '高汤改低钠并与煮面水分开', '瘦肉虾仁比例提高，青菜增量'],
  },
  {
    cuisineId: 'macau', slot: 'dinner', minutes: 55, profile: 'poultry', ingredients: '去皮鸡腿:190 g;洋葱:80 g;番茄:100 g;椰奶:45 ml;花生酱:8 g;甜椒粉:2 g;土豆:100 g',
    steps: ['鸡腿切块，以甜椒粉和一半花生酱腌 15 分钟。', '洋葱、番茄炒软，放鸡块煎至表面变色，加土豆和 180 ml 水焖 18 分钟。', '加入椰奶和剩余花生酱，小火收稠后入烤箱 210°C 烤 8 分钟。'],
    macros: [618, 43, 49, 29, 7.1, 672], tags: ['焗', '香料', '澳门菜'], allergens: ['花生'], changes: ['鸡腿去皮', '椰奶 45 ml 减至 25 ml', '花生酱减半并加入 150 g 彩椒'],
  },
  {
    cuisineId: 'taiwan', slot: 'dinner', minutes: 35, profile: 'poultry', ingredients: '去皮鸡腿:180 g;杏鲍菇:120 g;九层塔:20 g;姜:15 g;蒜:12 g;低钠酱油:10 ml;米酒:12 ml;芝麻油:6 g',
    steps: ['鸡腿切块，杏鲍菇切块；姜切片，蒜拍裂。', '少量芝麻油煸香姜蒜，下鸡块煎至表面金黄，加入杏鲍菇。', '加酱油、米酒和 80 ml 水焖 12 分钟，收汁后关火拌入九层塔。'],
    macros: [520, 42, 27, 25, 5.8, 844], tags: ['三杯', '九层塔', '台湾菜'], allergens: ['大豆'], changes: ['鸡腿去皮', '芝麻油从传统用量减至 3 g', '杏鲍菇增加到 200 g'],
  },
  {
    cuisineId: 'shaanxi', slot: 'dinner', minutes: 65, profile: 'poultry', ingredients: '去皮整鸡块:200 g;姜:12 g;葱:20 g;花椒:1 g;八角:1 枚;菜籽油:8 g;青菜:200 g',
    steps: ['鸡块冷水下锅，加姜葱煮至八成熟，捞出彻底沥干。', '鸡块薄刷 5 g 油，空气炸锅 190°C 烤 14 分钟，中途翻面。', '另以 200 ml 原汤、花椒和八角小火煨 8 分钟，鸡块回汤 2 分钟后切件。'],
    macros: [514, 49, 26, 24, 6.2, 658], tags: ['鸡肉', '先煮后烤', '陕菜'], allergens: [], changes: ['整鸡彻底去皮', '宽油炸改为空气炸', '以青菜和少量原汤组成完整餐盘'],
  },
  {
    cuisineId: 'gansu', slot: 'dinner', minutes: 50, profile: 'red-meat', ingredients: '瘦羊腿肉:190 g;胡萝卜:100 g;白萝卜:120 g;洋葱:70 g;姜:12 g;孜然:2 g;荞麦饭:100 g',
    steps: ['羊肉切块冷水焯净，胡萝卜、白萝卜切滚刀块。', '羊肉、姜和 500 ml 热水小火炖 28 分钟。', '加入双萝卜、洋葱和孜然再炖 15 分钟，配荞麦饭。'],
    macros: [594, 46, 50, 25, 8.8, 618], tags: ['炖', '羊肉', '河西'], changes: ['使用瘦羊腿并去脂', '不炒糖色、只用 3 g 油煸香', '双萝卜增至 300 g，荞麦饭 100 g'],
  },
  {
    cuisineId: 'ningxia', slot: 'dinner', minutes: 52, profile: 'red-meat', ingredients: '瘦羊腿肉:200 g;白萝卜:180 g;枸杞:8 g;姜:12 g;葱:20 g;花椒:1 g;荞麦饭:100 g',
    steps: ['羊肉浸泡 20 分钟，冷水焯净浮沫。', '羊肉、葱姜花椒和 700 ml 热水小火煮 38 分钟。', '放白萝卜和枸杞再煮 12 分钟，切片蘸食，汤单独少量饮用。'],
    macros: [586, 48, 45, 25, 6.9, 604], tags: ['煮', '羊肉', '宁夏菜'], changes: ['只选瘦羊腿并去可见脂肪', '不配高盐蘸汁', '白萝卜和荞麦饭提高纤维'],
  },
  {
    cuisineId: 'qinghai', slot: 'dinner', minutes: 48, profile: 'mixed', ingredients: '瘦牛肉:100 g;去皮鸡腿:90 g;冻豆腐:100 g;白萝卜:140 g;青菜:160 g;粉条:30 g;低钠高汤:650 ml',
    steps: ['牛肉、鸡腿分别焯水；白萝卜切片，粉条泡软。', '高汤中先煮牛肉、鸡腿和白萝卜 25 分钟。', '加入冻豆腐、粉条和青菜再煮 8 分钟，蘸料单独少量使用。'],
    macros: [576, 47, 45, 23, 8.5, 786], tags: ['火锅', '高原风味', '青海菜'], allergens: ['大豆'], changes: ['去掉高脂丸子与午餐肉', '粉条减至 20 g', '冻豆腐和青菜合计增至 350 g'],
  },
  {
    cuisineId: 'xinjiang', slot: 'dinner', minutes: 50, profile: 'poultry', ingredients: '去皮鸡腿:180 g;土豆:150 g;彩椒:150 g;洋葱:80 g;全麦宽面:55 g;番茄:120 g;菜籽油:8 g',
    steps: ['鸡腿切块焯水；土豆、彩椒、洋葱切块。', '洋葱、番茄炒软，放鸡块和 250 ml 水小火焖 18 分钟。', '加入土豆焖 12 分钟，再放彩椒；全麦宽面煮熟后垫盘。'],
    macros: [678, 45, 82, 22, 11.2, 788], tags: ['焖', '鸡肉', '新疆菜'], allergens: ['小麦'], changes: ['鸡腿去皮且不炒糖色', '油控制在 5 g', '宽面减至 40 g，彩椒增至 220 g'],
  },
  {
    cuisineId: 'sichuan-local', slot: 'dinner', minutes: 32, profile: 'red-meat', ingredients: '瘦牛里脊:170 g;豆芽:180 g;莴笋:150 g;郫县豆瓣:10 g;辣椒面:3 g;花椒:1 g;菜籽油:8 g',
    steps: ['牛里脊逆纹切片，以淀粉和少量水抓匀；豆芽、莴笋焯熟垫碗。', '豆瓣用 4 g 油炒香，加 350 ml 水煮开，分散下牛肉片。', '牛肉刚熟即连汤倒入碗中，撒辣椒花椒，以余油少量激香。'],
    macros: [492, 45, 27, 24, 8.4, 1080], tags: ['水煮', '麻辣', '巴蜀'], allergens: ['大豆'], changes: ['油从传统宽量减至 5 g', '豆瓣减半并用醋提味', '豆芽莴笋合计增至 450 g'],
  },
  {
    cuisineId: 'chongqing', slot: 'dinner', minutes: 35, profile: 'mixed', ingredients: '瘦牛肉片:120 g;鲜虾:80 g;冻豆腐:100 g;菌菇:160 g;青菜:220 g;魔芋:100 g;低钠辣汤:700 ml',
    steps: ['菌菇、魔芋先在汤中煮 6 分钟，冻豆腐再煮 4 分钟。', '虾煮至卷曲，牛肉分批涮至刚变色，青菜最后烫熟。', '蘸料用蒜泥、醋和 3 g 香油调成，避免反复喝汤。'],
    macros: [548, 52, 37, 22, 11.4, 1220], tags: ['火锅', '麻辣', '重庆菜'], allergens: ['甲壳类', '大豆'], changes: ['牛油锅底换低钠清油汤底', '加工丸子换鲜肉、虾和豆腐', '蔬菜重量不少于荤菜两倍'],
  },
  {
    cuisineId: 'guizhou', slot: 'dinner', minutes: 42, profile: 'fish', ingredients: '鲈鱼片:200 g;番茄:180 g;酸汤:120 ml;豆芽:140 g;金针菇:100 g;姜:10 g;糙米饭:110 g',
    steps: ['鱼片擦干，以少量淀粉抓匀；番茄切块。', '番茄、姜和酸汤加 350 ml 水煮 8 分钟，放豆芽、金针菇。', '汤微沸时逐片下鱼，煮至不透明立即关火，配糙米饭。'],
    macros: [566, 43, 60, 17, 9.6, 946], tags: ['汤', '酸辣', '黔菜'], allergens: ['鱼'], changes: ['酸汤稀释并不再额外加盐', '鱼片不过油', '糙米饭控制 110 g，菌菇豆芽增量'],
  },
  {
    cuisineId: 'yunnan', slot: 'dinner', minutes: 75, profile: 'poultry', ingredients: '去皮鸡腿:190 g;火腿:20 g;鲜菌菇:130 g;姜:12 g;枸杞:8 g;低钠高汤:500 ml;青菜:180 g',
    steps: ['鸡腿焯水，菌菇彻底清洗切片；火腿温水浸泡后切丝。', '鸡腿、姜、火腿和高汤放入汽锅或蒸盅，加盖蒸 55 分钟。', '加入菌菇再蒸 12 分钟，确认菌菇熟透，配焯青菜。'],
    macros: [486, 45, 25, 23, 6.8, 742], tags: ['蒸', '汤', '滇菜'], allergens: [], changes: ['鸡腿去皮', '火腿只用 20 g 提鲜并先浸泡', '增加菌菇和青菜，不饮尽全部汤汁'],
  },
  {
    cuisineId: 'tibet', slot: 'dinner', minutes: 40, profile: 'red-meat', ingredients: '瘦牦牛肉或牛里脊:180 g;青稞饭:110 g;白萝卜:160 g;洋葱:80 g;姜:10 g;花椒:1 g;菜籽油:6 g',
    steps: ['牛肉逆纹切片，白萝卜和洋葱切块。', '牛肉焯水后与姜、花椒和 450 ml 水小火煮 22 分钟。', '加入白萝卜和洋葱再煮 12 分钟，配青稞饭食用。'],
    macros: [596, 48, 58, 20, 8.1, 592], tags: ['炖', '牦牛肉', '高原风味'], allergens: [], changes: ['选择瘦肉并去可见脂肪', '不加酥油，菜籽油控制 3 g', '白萝卜增至 240 g，青稞饭 100 g'],
  },
  {
    cuisineId: 'ethnic', slot: 'lunch', minutes: 38, profile: 'mixed', ingredients: '瘦羊肉:100 g;糯玉米:100 g;黑米饭:90 g;南瓜:120 g;彩椒:100 g;香草:15 g;菜籽油:6 g',
    steps: ['羊肉切片，以孜然、少量盐和一半油腌 10 分钟。', '南瓜、糯玉米蒸熟；彩椒用余油快炒至断生。', '羊肉快速煎熟，与黑米、玉米、南瓜和彩椒组成五色拼盘。'],
    macros: [574, 32, 75, 18, 11.6, 568], tags: ['杂粮', '拼盘', '跨地域'], allergens: [], changes: ['说明：这是跨地域营养拼盘，不代表单一民族标准菜', '羊肉控制 100 g 并选瘦肉', '杂粮与蔬菜占餐盘四分之三'],
  },
  {
    cuisineId: 'french', slot: 'dinner', minutes: 42, profile: 'vegetable', ingredients: '茄子:160 g;西葫芦:160 g;番茄:180 g;彩椒:120 g;白芸豆:100 g;橄榄油:10 g;全麦面包:45 g',
    steps: ['茄子、西葫芦和彩椒切同样大小的块，番茄切碎。', '洋葱用少量橄榄油炒软，依次放茄子、彩椒和番茄炖 15 分钟。', '加入西葫芦、白芸豆和香草再炖 10 分钟，配全麦面包。'],
    macros: [548, 22, 77, 19, 20.4, 488], tags: ['炖', '蔬菜', '法国菜'], allergens: ['小麦'], changes: ['橄榄油从 10 g 减至 6 g', '白芸豆增加至 140 g 提升蛋白', '全麦面包控制 35 g'],
  },
  {
    cuisineId: 'spanish', slot: 'dinner', minutes: 45, profile: 'seafood', ingredients: '鲜虾:100 g;青口:100 g;鱿鱼:80 g;短粒米:75 g;番茄:140 g;彩椒:100 g;橄榄油:8 g',
    steps: ['番茄和彩椒切丁；青口刷净，虾去虾线，鱿鱼切圈。', '番茄、彩椒用少量油炒软，加入米和 260 ml 无盐高汤铺平。', '小火煮 12 分钟，摆上海鲜再煮 6 分钟，关火加盖焖 5 分钟。'],
    macros: [642, 44, 78, 18, 7.9, 826], tags: ['海鲜', '米饭', '西班牙菜'], allergens: ['甲壳类', '软体类'], changes: ['短粒米减至 60 g', '橄榄油控制 5 g', '彩椒番茄合计增至 320 g'],
  },
  {
    cuisineId: 'nordic', slot: 'breakfast', minutes: 16, profile: 'fish', ingredients: '黑麦面包:70 g;烟熏三文鱼:90 g;希腊酸奶:60 g;黄瓜:100 g;萝卜:70 g;莳萝:8 g;柠檬:半个',
    steps: ['希腊酸奶、莳萝和柠檬汁混合成抹酱。', '黑麦面包烤至边缘微脆，涂酸奶酱。', '铺黄瓜、萝卜和三文鱼，撒黑胡椒，立即食用。'],
    macros: [514, 33, 57, 18, 10.2, 986], tags: ['开放三明治', '鱼类', '北欧菜'], allergens: ['鱼', '小麦', '乳'], changes: ['烟熏三文鱼减至 65 g 控钠', '酸奶酱不额外加盐', '黄瓜萝卜增加到 220 g'],
  },
  {
    cuisineId: 'balkan', slot: 'dinner', minutes: 38, profile: 'red-meat', ingredients: '瘦牛肉末:140 g;洋葱:60 g;彩椒:120 g;希腊酸奶:80 g;全麦皮塔:60 g;黄瓜:100 g;橄榄油:6 g',
    steps: ['牛肉末与洋葱、甜椒粉拌匀，整形成小肉饼。', '肉饼用不粘锅煎熟，彩椒同时烤软。', '酸奶与黄瓜拌成酱，肉饼、烤椒和全麦皮塔一同装盘。'],
    macros: [628, 42, 61, 25, 8.4, 758], tags: ['烤肉', '酸奶酱', '巴尔干'], allergens: ['乳', '小麦'], changes: ['牛肉选 90% 以上瘦度', '肉饼不刷额外油', '皮塔减至 45 g，黄瓜和彩椒增量'],
  },
  {
    cuisineId: 'eastern-europe', slot: 'dinner', minutes: 55, profile: 'red-meat', ingredients: '瘦猪里脊:140 g;卷心菜:260 g;番茄:140 g;胡萝卜:80 g;土豆:100 g;洋葱:60 g;菜籽油:6 g',
    steps: ['猪里脊切块，卷心菜切粗丝，其余蔬菜切块。', '洋葱和肉块少油炒至变色，加入番茄和 300 ml 水炖 20 分钟。', '放土豆、胡萝卜和卷心菜，再炖 22 分钟至软而不烂。'],
    macros: [536, 38, 56, 20, 13.2, 648], tags: ['炖', '卷心菜', '东欧菜'], allergens: [], changes: ['瘦里脊替代香肠或肥肉', '油减至 3 g', '卷心菜增至 320 g，土豆减至 70 g'],
  },
  {
    cuisineId: 'mexican', slot: 'lunch', minutes: 28, profile: 'poultry', ingredients: '去皮鸡胸:160 g;全麦玉米饼:75 g;黑豆:100 g;番茄:100 g;生菜:120 g;牛油果:35 g;青柠:半个',
    steps: ['鸡胸切条，拌孜然和甜椒粉，在不粘锅中煎熟。', '黑豆加少量水和孜然煮热；玉米饼干锅加热。', '鸡肉、黑豆、番茄、生菜和牛油果分装入饼，挤青柠汁。'],
    macros: [628, 52, 72, 19, 16.3, 586], tags: ['塔可', '高蛋白', '墨西哥菜'], allergens: [], changes: ['每份玉米饼由 3 张减为 2 张', '牛油果控制 25 g', '生菜番茄增加到 300 g'],
  },
  {
    cuisineId: 'brazilian', slot: 'dinner', minutes: 55, profile: 'mixed', ingredients: '熟黑豆:180 g;瘦牛肉:100 g;橙子:80 g;糙米饭:100 g;羽衣甘蓝:140 g;洋葱:60 g;橄榄油:6 g',
    steps: ['瘦牛肉切块焯水，黑豆保留少量豆汤。', '洋葱少油炒香，加入牛肉、黑豆和 260 ml 水炖 30 分钟。', '羽衣甘蓝快速翻炒，与糙米和橙子一起配黑豆炖肉。'],
    macros: [654, 41, 83, 19, 19.8, 672], tags: ['黑豆', '炖', '巴西菜'], allergens: [], changes: ['去除香肠和肥猪肉', '糙米饭减至 80 g', '羽衣甘蓝增加至 200 g'],
  },
  {
    cuisineId: 'peruvian', slot: 'dinner', minutes: 28, profile: 'fish', ingredients: '可生食级海鲈鱼:180 g;青柠汁:55 ml;紫洋葱:60 g;红薯:130 g;玉米:90 g;香菜:15 g;辣椒:5 g',
    steps: ['红薯蒸熟，玉米煮熟后放凉；鱼肉全程冷藏。', '鱼切 1.5 cm 块，与青柠汁、洋葱、辣椒和少量盐拌匀。', '冷藏腌 10 分钟立即食用，搭配红薯和玉米；免疫力低下者改用熟鱼。'],
    macros: [512, 41, 68, 9, 8.8, 574], tags: ['柑橘', '冷食', '秘鲁菜'], allergens: ['鱼'], changes: ['仅使用可靠来源的可生食级鱼', '不额外加油', '红薯和玉米各减量并加 150 g 生菜'],
  },
  {
    cuisineId: 'middle-eastern', slot: 'breakfast', minutes: 24, profile: 'legume', ingredients: '熟鹰嘴豆:170 g;芝麻酱:18 g;全麦皮塔:55 g;黄瓜:120 g;番茄:120 g;胡萝卜:80 g;柠檬:半个',
    steps: ['鹰嘴豆、芝麻酱、柠檬汁、蒜和 50 ml 水搅打顺滑。', '黄瓜、番茄和胡萝卜切成可蘸食的条或块。', '鹰嘴豆泥装盘，淋 2 g 橄榄油，配蔬菜和烤热的全麦皮塔。'],
    macros: [624, 24, 82, 23, 18.6, 612], tags: ['鹰嘴豆', '拼盘', '中东菜'], allergens: ['芝麻', '小麦'], changes: ['芝麻酱减至 10 g', '皮塔减至 40 g', '蔬菜增加到 400 g'],
  },
  {
    cuisineId: 'turkish', slot: 'dinner', minutes: 40, profile: 'red-meat', ingredients: '瘦牛肉:150 g;布格麦:65 g;番茄:120 g;彩椒:120 g;黄瓜:100 g;希腊酸奶:70 g;橄榄油:6 g',
    steps: ['牛肉切块，拌甜椒粉、孜然和酸奶腌 15 分钟。', '牛肉和彩椒串起，烤箱 220°C 烤 10 分钟，中途翻面。', '布格麦煮熟，与番茄黄瓜拌匀，配烤肉和酸奶酱。'],
    macros: [632, 46, 67, 22, 10.4, 664], tags: ['烤肉', '布格麦', '土耳其菜'], allergens: ['小麦', '乳'], changes: ['使用瘦牛肉并控制 130 g', '布格麦减至 55 g', '酸奶酱无盐，蔬菜增至 400 g'],
  },
  {
    cuisineId: 'indian', slot: 'dinner', minutes: 38, profile: 'legume', ingredients: '红扁豆:75 g;番茄:160 g;菠菜:160 g;洋葱:70 g;糙米:55 g;低脂酸奶:60 g;菜籽油:6 g',
    steps: ['红扁豆冲洗，加入姜黄和 300 ml 水，小火煮 18 分钟。', '洋葱、番茄和综合香料少油炒软，倒入扁豆继续煮 8 分钟。', '拌入菠菜至刚塌，配糙米和无糖酸奶。'],
    macros: [596, 28, 91, 14, 20.2, 582], tags: ['咖喱', '扁豆', '印度菜'], allergens: ['乳'], changes: ['油控制 3 g，不用酥油', '糙米减至 45 g', '菠菜增至 220 g，酸奶保留'],
  },
  {
    cuisineId: 'japanese', slot: 'breakfast', minutes: 30, profile: 'fish', ingredients: '鲑鱼:160 g;糙米饭:120 g;西兰花:160 g;胡萝卜:80 g;味噌:8 g;海带芽:6 g;豆腐:80 g',
    steps: ['鲑鱼擦干，薄涂稀释味噌，烤箱 200°C 烤 10 至 12 分钟。', '西兰花和胡萝卜蒸熟；豆腐、海带芽加入 300 ml 热水。', '味噌用少量温汤化开后关火拌入，鱼、饭、蔬菜和汤分格装盘。'],
    macros: [628, 44, 62, 24, 10.1, 842], tags: ['定食', '烤鱼', '日本菜'], allergens: ['鱼', '大豆'], changes: ['味噌控制 8 g 且不再加盐', '糙米饭减至 100 g', '西兰花和胡萝卜增加到 300 g'],
  },
  {
    cuisineId: 'korean', slot: 'breakfast', minutes: 32, profile: 'mixed', ingredients: '瘦牛肉:100 g;糙米饭:120 g;菠菜:80 g;豆芽:100 g;胡萝卜:70 g;香菇:60 g;鸡蛋:1 个;韩式辣酱:8 g',
    steps: ['菠菜、豆芽分别焯熟，胡萝卜和香菇少油炒熟。', '瘦牛肉片快速煎熟，鸡蛋用不粘锅单面煎。', '糙米饭垫底，分区摆牛肉、蔬菜和鸡蛋，辣酱加水稀释后拌食。'],
    macros: [642, 40, 75, 21, 10.8, 922], tags: ['拌饭', '蔬菜', '韩国菜'], allergens: ['蛋', '大豆'], changes: ['糙米饭减至 100 g', '辣酱控制 5 g 并稀释', '蔬菜总量增加到 400 g'],
  },
  {
    cuisineId: 'vietnamese', slot: 'breakfast', minutes: 45, profile: 'poultry', ingredients: '去皮鸡胸:150 g;干米粉:65 g;豆芽:100 g;洋葱:60 g;青菜:120 g;香草:25 g;低钠鸡汤:500 ml',
    steps: ['鸡胸与姜、洋葱放汤中小火浸煮 15 分钟，取出切片。', '米粉另锅煮熟并冲去多余淀粉，豆芽和青菜烫熟。', '米粉、鸡肉和蔬菜装碗，冲入热汤，配青柠和香草。'],
    macros: [532, 40, 70, 10, 7.8, 836], tags: ['汤粉', '鸡肉', '越南菜'], allergens: [], changes: ['鸡汤撇油并使用低钠版', '干米粉减至 55 g', '豆芽青菜合计增至 300 g'],
  },
  {
    cuisineId: 'malay', slot: 'dinner', minutes: 38, profile: 'seafood', ingredients: '鲜虾:100 g;豆腐:100 g;干米粉:60 g;豆芽:120 g;青菜:120 g;椰奶:50 ml;叻沙酱:10 g',
    steps: ['米粉泡软；豆腐切块，虾去虾线。', '叻沙酱加 450 ml 水煮开，放豆腐、豆芽和青菜煮 4 分钟。', '加入虾和椰奶煮至虾卷曲，放米粉复热后关火。'],
    macros: [608, 36, 68, 23, 9.4, 1020], tags: ['汤面', '椰香', '叻沙'], allergens: ['甲壳类', '大豆'], changes: ['椰奶减至 30 ml', '叻沙酱减半并用香茅补香', '米粉减至 50 g，蔬菜增至 320 g'],
  },
  {
    cuisineId: 'indonesian', slot: 'breakfast', minutes: 34, profile: 'mixed', ingredients: '北豆腐:120 g;鸡蛋:1 个;土豆:100 g;豆角:100 g;卷心菜:100 g;豆芽:80 g;花生酱:15 g',
    steps: ['土豆、豆角、卷心菜和豆芽分别蒸或焯熟。', '豆腐用不粘锅煎至两面金黄，鸡蛋煮熟切半。', '花生酱以温水、青柠汁和辣椒调稀，淋在蔬菜、豆腐和鸡蛋上。'],
    macros: [584, 29, 65, 25, 15.2, 638], tags: ['沙拉', '花生酱', '印尼菜'], allergens: ['花生', '大豆', '蛋'], changes: ['花生酱减至 10 g 并用水调稀', '豆腐不油炸，改不粘锅煎', '土豆减至 70 g，蔬菜增至 350 g'],
  },
  {
    cuisineId: 'north-african', slot: 'dinner', minutes: 48, profile: 'poultry', ingredients: '去皮鸡腿:160 g;鹰嘴豆:100 g;胡萝卜:100 g;西葫芦:120 g;番茄:160 g;杏干:15 g;全麦蒸粗麦:55 g',
    steps: ['鸡腿切块，与孜然、姜黄、肉桂少量拌匀。', '番茄炒软，放鸡块、胡萝卜和 250 ml 水小火炖 22 分钟。', '加鹰嘴豆、西葫芦和杏干再炖 10 分钟，配全麦蒸粗麦。'],
    macros: [638, 43, 82, 18, 16.4, 664], tags: ['塔吉锅', '香料', '北非菜'], allergens: ['小麦'], changes: ['鸡腿去皮', '杏干控制 10 g', '蒸粗麦减至 45 g，西葫芦增加到 200 g'],
  },
  {
    cuisineId: 'east-african', slot: 'dinner', minutes: 42, profile: 'legume', ingredients: '熟红腰豆:180 g;番茄:160 g;菠菜:180 g;洋葱:70 g;椰奶:35 ml;糙米饭:100 g;综合香料:4 g',
    steps: ['洋葱和香料少油炒香，加入番茄煮至软烂。', '加入红腰豆和 220 ml 水，小火炖 18 分钟。', '拌入菠菜和椰奶再煮 4 分钟，配糙米饭。'],
    macros: [598, 25, 90, 17, 21.6, 586], tags: ['炖豆', '香料', '东非菜'], allergens: [], changes: ['椰奶减至 20 ml', '糙米饭减至 80 g', '菠菜增加到 250 g'],
  },
  {
    cuisineId: 'west-african', slot: 'dinner', minutes: 45, profile: 'legume', ingredients: '熟鹰嘴豆:150 g;去皮鸡胸:100 g;番茄:160 g;红薯:130 g;菠菜:160 g;无糖花生酱:16 g;糙米饭:80 g',
    steps: ['鸡胸切块，与番茄和 250 ml 水小火煮 12 分钟。', '加入红薯、鹰嘴豆和稀释花生酱，继续炖 18 分钟。', '红薯变软后拌入菠菜，配少量糙米饭。'],
    macros: [666, 43, 91, 19, 18.8, 648], tags: ['花生', '炖菜', '西非菜'], allergens: ['花生'], changes: ['花生酱减至 10 g', '糙米饭减至 60 g', '菠菜增至 230 g'],
  },
  {
    cuisineId: 'south-african', slot: 'dinner', minutes: 52, profile: 'red-meat', ingredients: '瘦牛肉末:150 g;洋葱:70 g;胡萝卜:90 g;全麦面包:35 g;低脂牛奶:100 ml;鸡蛋:1 个;葡萄干:12 g',
    steps: ['洋葱、胡萝卜少油炒软，加入牛肉末和咖喱香料炒散。', '全麦面包用牛奶泡软，与牛肉和葡萄干拌匀，装入烤皿。', '鸡蛋与余下牛奶打匀淋面，180°C 烤 25 分钟至凝固。'],
    macros: [612, 45, 50, 26, 7.4, 696], tags: ['烤', '香料肉派', '南非菜'], allergens: ['乳', '蛋', '小麦'], changes: ['牛肉末选 90% 以上瘦度', '葡萄干减半', '搭配 250 g 烤蔬菜并减面包'],
  },
  {
    cuisineId: 'australian', slot: 'dinner', minutes: 30, profile: 'fish', ingredients: '白身鱼柳:190 g;南瓜:160 g;西兰花:160 g;小土豆:100 g;橄榄油:8 g;柠檬:半个;混合香草:8 g',
    steps: ['南瓜、土豆切块，拌一半油，200°C 烤 15 分钟。', '鱼柳擦干，涂柠檬汁和香草，与西兰花放入烤盘。', '再烤 10 至 12 分钟至鱼肉熟透，出炉挤柠檬汁。'],
    macros: [538, 43, 53, 18, 10.5, 462], tags: ['烤鱼', '时蔬', '澳洲菜'], allergens: ['鱼'], changes: ['橄榄油减至 5 g', '土豆减至 70 g', '西兰花和南瓜增至 380 g'],
  },
  {
    cuisineId: 'polynesian', slot: 'dinner', minutes: 34, profile: 'fish', ingredients: '白身鱼柳:190 g;淡椰奶:45 ml;菠萝:80 g;青菜:180 g;糙米饭:100 g;青柠:半个;香菜:15 g',
    steps: ['鱼柳以青柠汁和香菜腌 10 分钟，烤箱预热至 200°C。', '鱼放烤盘，薄刷淡椰奶，烤 10 至 12 分钟至熟透。', '菠萝快速烤出焦边，与青菜、糙米和烤鱼装盘。'],
    macros: [566, 42, 62, 18, 8.2, 488], tags: ['椰香', '烤鱼', '波利尼西亚'], allergens: ['鱼'], changes: ['椰奶减至 25 ml', '菠萝控制 60 g', '糙米饭减至 80 g，青菜增至 250 g'],
  },
]

const ingredientList = (raw: string) => raw.split(';').map((item) => {
  const [name, amount] = item.split(':')
  return { name, amount }
})

export const catalogRecipes: Recipe[] = seeds.map((seed) => {
  const cuisine = cuisines.find((item) => item.id === seed.cuisineId)
  if (!cuisine) throw new Error(`Unknown cuisine seed: ${seed.cuisineId}`)
  const ingredients = ingredientList(seed.ingredients)
  const nutrition = makeNutrition(seed)
  const id = `catalog-${seed.cuisineId}`

  return {
    id,
    name: cuisine.representative,
    subtitle: ingredients.slice(0, 3).map((item) => item.name).join(' · '),
    cuisineId: cuisine.id,
    cuisine: cuisine.name,
    region: cuisine.region,
    slot: seed.slot,
    image: `./images/${id}.webp`,
    minutes: seed.minutes,
    difficulty: seed.minutes >= 45 ? '适中' : '简单',
    servings: 1,
    tags: seed.tags,
    allergens: seed.allergens ?? [],
    ingredients,
    steps: seed.steps,
    nutrition,
    modification: {
      title: '轻负担改良方案',
      summary: '保留代表风味与核心技法，同时减少油、盐或精制主食，并补足蔬菜体积。',
      changes: seed.changes,
      nutrition: lighten(nutrition),
    },
    tutorials: [
      { label: '限定食谱站图文检索', url: cuisine.recipeUrl, type: 'article' },
      { label: '视频做法检索', url: cuisine.videoUrl, type: 'video' },
      ...cuisine.communityLinks,
    ],
    confidence: 'estimated',
  }
})
