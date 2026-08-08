(function () {
  'use strict';

  var catalogGrid = document.getElementById('catalog-grid');
  var newGrid = document.getElementById('new-grid');
  var popularGrid = document.getElementById('popular-grid');
  var categoryGrid = document.getElementById('category-grid');
  var makerGrid = document.getElementById('maker-grid');
  var loadStatus = document.getElementById('load-status');
  var searchInput = document.getElementById('product-search');
  var clearFilter = document.getElementById('clear-filter');
  var savedFilter = document.getElementById('saved-filter');
  var savedCount = document.getElementById('saved-count');
  var resultCount = document.getElementById('result-count');
  var heroVisual = document.getElementById('hero-visual');
  var simulatorJumpLinks = document.querySelectorAll('.js-simulator-jump');
  var simulatorSourceInputs = document.querySelectorAll('input[name="simulator-source"]');
  var simulatorUploadPanel = document.getElementById('simulator-upload-panel');
  var simulatorSamplePanel = document.getElementById('simulator-sample-panel');
  var gardenPhotoInput = document.getElementById('garden-photo-input');
  var simulatorUploadPreview = document.getElementById('simulator-upload-preview');
  var simulatorUploadName = document.getElementById('simulator-upload-name');
  var simulatorSceneList = document.getElementById('simulator-scene-list');
  var simulatorItemList = document.getElementById('simulator-item-list');
  var simulatorCount = document.getElementById('simulator-count');
  var simulatorLimitMessage = document.getElementById('simulator-limit-message');
  var placementReferenceImage = document.getElementById('placement-reference-image');
  var simulatorPlacementList = document.getElementById('simulator-placement-list');
  var simulatorSelectedPriceList = document.getElementById('simulator-selected-price-list');
  var simulatorTotalPrice = document.getElementById('simulator-total-price');
  var simulatorConsultText = document.getElementById('simulator-consult-text');
  var simulatorCopyConsult = document.getElementById('simulator-copy-consult');
  var simulatorConsultResult = document.getElementById('simulator-consult-result');
  var simulatorLineConsult = document.getElementById('simulator-line-consult');
  var simulatorPrompt = document.getElementById('simulator-prompt');
  var simulatorCopy = document.getElementById('simulator-copy');
  var simulatorGenerate = document.getElementById('simulator-generate');
  var simulatorResult = document.getElementById('simulator-result');
  var simulatorGeneratedImageWrap = document.getElementById('simulator-generated-image-wrap');
  var simulatorGeneratedImage = document.getElementById('simulator-generated-image');
  var simulatorGeneratedCaption = document.getElementById('simulator-generated-caption');
  var simulatorGeneratedWatermark = document.querySelector('.generated-watermark');
  var simulatorLoading = document.getElementById('simulator-loading');
  var simulatorErrorBox = document.getElementById('simulator-error-box');
  var simulatorErrorMessage = document.getElementById('simulator-error-message');
  var simulatorRetry = document.getElementById('simulator-retry');
  var legacySimulatorSection = document.getElementById('ai-simulator');
  var legacySimulatorEnabled = !!(legacySimulatorSection && !legacySimulatorSection.hidden);
  var sampleGardenGrid = document.getElementById('sample-garden-grid');
  var carportEnabled = document.getElementById('carport-enabled');
  var carportProductName = document.getElementById('carport-product-name');
  var carportProductSummary = document.getElementById('carport-product-summary');
  var carportOptionGrid = document.getElementById('carport-option-grid');
  var carportSize = document.getElementById('carport-size');
  var carportHeight = document.getElementById('carport-height');
  var carportBodyColor = document.getElementById('carport-body-color');
  var carportRoof = document.getElementById('carport-roof');
  var carportDrainage = document.getElementById('carport-drainage');
  var carportPricePreview = document.getElementById('carport-price-preview');
  var carportDisplayPrice = document.getElementById('carport-display-price');
  var carportPriceNote = document.getElementById('carport-price-note');

  var PRODUCT_SOURCES = [];
  var G20_SOURCES = ['json/g20-material-candidates.json'];
  var EXTERIOR_SOURCES = {
    products: ['json/exterior-products.json'],
    aiSpecs: ['json/ai-product-specs.json'],
    options: ['json/product-option-master.json'],
    prices: ['json/product-price-matrix.json'],
  };
  var NESCA_TEST_VARIANT_ID = 'NESCA-F-WIDE-2CAR-54-50-H22-SG-STANDARD-NO-LIGHT';
  var TARGET_CATEGORIES = [
    '車止め',
    'サイクルスタンド',
    'アメリカンフェンス',
    '機能門柱',
    '宅配ボックス',
    'ポスト',
    'ガビオン',
    '立水栓',
    '人工芝',
    '防草シート',
    'ピザ窯',
  ];
  var CATEGORY_META = {
    '車止め': '愛車を美しく守るデザイン車止め',
    'サイクルスタンド': '自転車置き場をすっきり整えるスタンド',
    'アメリカンフェンス': '庭に抜け感をつくるラフなフェンス',
    '機能門柱': '玄関を彩るデザイン門柱',
    '宅配ボックス': '不在時も安心。',
    'ポスト': '毎日使うものだから、こだわりたい。',
    'ガビオン': '庭を彩るストーンウォール',
    '立水栓': '庭の使い勝手をもっと快適に。',
    '人工芝': '一年中美しい緑。',
    '防草シート': '雑草対策をプロ仕様で。',
    'ピザ窯': '庭で過ごす時間をもっと楽しく。',
  };
  var CATEGORY_VISUALS = {
    '車止め': 'images/g20-material/carstop-flute-six.webp',
    'サイクルスタンド': 'images/g20-material/cycle-stand-type-a-fixed-stainless.jpg',
    'アメリカンフェンス': 'images/lifestyle/categories/category-american-fence.png',
    '機能門柱': 'images/g20-material/function-post/gm1-aon-a-b.jpg',
    '宅配ボックス': 'images/g20-material/delivery-box/koln-double-a-slate-black-left.jpg',
    'ポスト': 'images/g20-material/post/macaron-one-stand-matte-black.jpg',
    'ガビオン': 'images/lifestyle/categories/category-gabion.jpg',
    '立水栓': 'images/lifestyle/categories/category-water-stand.png',
    '人工芝': 'images/lifestyle/garden-living-hero-final-photo.png',
    '防草シート': 'images/g20-material/weed-sheet/nax-ex-weed-sheet-product.jpg',
    'ピザ窯': 'images/lifestyle/hero-evening-garden-pizza.jpg',
  };
  var MAKERS = ['OnlyOneClub', 'LIXIL', 'YKK AP', '三協アルミ', '四国化成', 'タカショー', 'ユニソン'];
  var DEFAULT_IMAGE = 'images/lifestyle/hero-evening-garden-pizza.jpg';
  var HERO_IMAGE = 'images/lifestyle/garden-living-hero-final-photo.png';
  var STORAGE_KEY = 'garden_living_saved_products_v1';
  var SITE_ORIGIN = 'https://gardenliving-ex.net';
  var GARDEN_SIMULATOR_CONFIG = {
    id: 'garden-living',
    title: 'デザインシミュレーション',
    description: 'お庭の写真をもとに、ピザ窯・タイルデッキ・人工芝などを配置した完成イメージを作成できます。',
    watermark: 'Garden Living by EXた組',
    lineUrl: 'https://line.me/R/ti/p/@953wnidc',
    consultTitle: '【Garden Living デザインシミュレーション相談】',
    concept: '庭で過ごす時間、アウトドアリビング、ピザ窯、サウナ、ドッグランなど',
    imageApiEndpoint: window.GARDEN_IMAGE_API_ENDPOINT || '/api/generate-garden-image',
    imageModel: 'gpt-image-1',
    promptPolicy: '既存の建物・窓・外壁・敷地形状はできるだけ維持し、現実的な外構施工として違和感のない完成イメージにしてください。選択していない商品・素材・植栽・床仕上げは追加せず、写真全体の明るさと素材感だけを必要最小限で整えてください。',
    maxItems: 5,
    priceMaster: window.GARDEN_SIMULATOR_PRICE_MASTER || window.GARDEN_LIVING_ITEM_PRICE_MASTER || {},
    referenceProducts: {
      'アメリカンフェンス': {
        product_id: 'OOC-AMERICAN-FENCE-REFERENCE',
        product_name: 'Only One American fence',
        category: 'アメリカンフェンス',
        image_url: 'images/g20-material/american-fence/onlyone-american-fence-reference.jpg',
        size: '900×900系フェンスを組み合わせる想定',
        color: 'シルバー',
        features: [
          'シルバーの丸パイプフレーム',
          'チェーンリンク金網',
          '角が丸いパネル形状',
          '縦横に連結できる支柱構成',
          'ドッグランや庭の仕切りに合う抜け感',
        ],
      },
      'ピザ窯': {
        product_id: 'EG3-AB-PK-REFERENCE',
        product_name: 'アンティークブリックス ピザ窯 EG3-AB-PK',
        category: 'ピザ窯',
        main_image: 'images/g20-material/pizza-oven/antique-bricks-pizza-oven-eg3-ab-pk.jpg',
        ai_reference_images: [
          'images/g20-material/pizza-oven/antique-bricks-pizza-oven-eg3-ab-pk-door-detail.jpg',
          'images/g20-material/pizza-oven/antique-bricks-pizza-oven-eg3-ab-pk-wood-storage-detail.jpg',
        ],
        size: '家庭用屋外ピザ窯',
        color: 'ブラウン系耐火レンガ、濃茶の鉄扉',
        ai_features: [
          '耐火レンガを積んだアーチ型の窯本体',
          '前面に濃茶の大きな鉄扉',
          '扉上部に小さな丸窓',
          '下部に薪を収納できる開口',
          '重厚感のあるアンティークブリックス仕上げ',
        ],
        ai_prompt: '参照画像のピザ窯本体を優先してください。丸いドーム型ではなく、耐火レンガのアーチ、濃茶の鉄扉、小さな丸窓、下部の薪収納を商品特徴として再現してください。',
      },
      '立水栓': {
        product_id: 'WATER-STAND-SCENE-REFERENCE',
        product_name: '立水栓 ガーデンパン施工イメージ',
        category: '立水栓',
        main_image: 'images/g20-material/water-stand-reference/water-stand-full-column-pan.jpg',
        ai_reference_images: [
          'images/g20-material/water-stand-reference/water-stand-two-faucet-detail.jpg',
          'images/g20-material/water-stand-reference/water-stand-square-pan-detail.jpg',
        ],
        size: '庭用立水栓とガーデンパン',
        color: 'ダークグレー角柱、ブラック水栓、ダークグレー角型パン',
        ai_features: [
          '細身の角柱型水栓柱',
          '柱上部に黒い主蛇口',
          '柱下部に黒い補助蛇口',
          '低く厚みのある四角形のガーデンパン',
          'ガーデンパンは深さがあり内側もダークグレー',
          '植栽やガビオンと馴染む施工イメージ',
          '落ち着いたダークグレー系の庭水まわり',
        ],
        ai_prompt: '参照画像の立水栓とガーデンパンの形を優先してください。細身の角柱、上部の黒い主蛇口、下部の黒い補助蛇口、低く厚みのある角型ガーデンパンを商品特徴として再現してください。丸い水鉢、陶器風の鉢、白い受け皿、装飾的な水栓柱にはしないでください。',
      },
      'ガビオン': {
        product_id: 'GABION-WALL-SCENE-REFERENCE',
        product_name: 'ガビオン ストーンウォール施工イメージ',
        category: 'ガビオン',
        main_image: 'images/g20-material/gabion-reference/gabion-product-angled-1200x300x900.jpg',
        ai_reference_images: [
          'images/g20-material/gabion-reference/gabion-mesh-stone-detail.jpg',
          'images/g20-material/gabion-reference/gabion-real-scene-depth.jpg',
        ],
        size: '1200×900×300mm系の箱型ガビオン',
        color: 'グレー系自然石、スチールメッシュ',
        ai_features: [
          '直方体のワイヤーメッシュボックス',
          '正方形グリッドの亜鉛メッキ風スチール金網',
          '金網の内側にグレー系の割栗石がぎっしり詰まっている',
          '厚みのある箱型フレームで上面と側面の金網も見える',
          '普通の石積み塀ではなく金網越しに石が見える構造',
          '庭の景観アクセントや低いストーンウォールとして使う',
        ],
        ai_prompt: '参照画像の箱型ワイヤーメッシュ構造を最優先してください。石だけの壁、ブロック塀、コンクリート塀、乱形石貼りにはしないでください。必ず外側に正方形グリッドの金属メッシュが見え、その内側にグレー系の割栗石が詰まったガビオンとして再現してください。上面・側面にも金網の厚みが分かるようにしてください。',
      },
    },
    scenes: ['裏庭', '前庭・駐車場', 'ドッグラン', 'アウトドアリビング'],
    scenePurposes: {
      '裏庭': '家族で楽しめる落ち着いた裏庭',
      '前庭・駐車場': '玄関まわりと駐車場が使いやすい外構空間',
      'ドッグラン': '犬が安心して遊べるドッグラン',
      'アウトドアリビング': '食事やくつろぎを楽しめるアウトドアリビング',
    },
    items: [
      'ピザ窯',
      'BBQスペース',
      'タイルデッキ',
      '人工芝',
      'ウッドデッキ',
      '目隠しフェンス',
      'エコモックフェンス',
      'アメリカンフェンス',
      'カーポート',
      'サイクルポート',
      'ガーデンファニチャー',
      '植栽',
      '照明',
      'サウナ',
      '物置',
      '宅配ボックス',
    ],
    scenePriority: {
      '裏庭': ['タイルデッキ', '人工芝', 'ピザ窯', 'BBQスペース', 'ウッドデッキ', 'ガーデンファニチャー', '植栽', '照明', '目隠しフェンス'],
      '前庭・駐車場': ['カーポート', 'サイクルポート', '宅配ボックス', '目隠しフェンス', 'エコモックフェンス', '植栽', '照明', '物置', 'アメリカンフェンス'],
      'ドッグラン': ['人工芝', 'アメリカンフェンス', '立水栓', '目隠しフェンス', '植栽', '照明', 'ガーデンファニチャー', '物置'],
      'アウトドアリビング': ['ピザ窯', 'BBQスペース', 'タイルデッキ', 'ガーデンファニチャー', '照明', 'サウナ', 'ウッドデッキ', '植栽', '目隠しフェンス'],
    },
    areaCodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    areaLabels: {
      A: '左奥',
      B: '中央奥',
      C: '右奥',
      D: '左中央',
      E: '中央',
      F: '右中央',
      G: '左手前',
      H: '中央手前',
      I: '右手前',
    },
    sampleGardens: [
      {
        id: 'modern-house',
        title: '新築住宅（モダン）',
        description: '新築外構に庭アイテムを足す想定。',
        image: HERO_IMAGE,
      },
      {
        id: 'simple-backyard',
        title: 'シンプルな裏庭',
        description: '人工芝やデッキを考えやすい庭。',
        image: 'images/lifestyle/categories/category-american-fence.png',
      },
      {
        id: 'outdoor-living',
        title: 'アウトドアリビング',
        description: '食事やくつろぎを中心に検討。',
        image: 'images/lifestyle/hero-evening-garden-pizza.jpg',
      },
      {
        id: 'dog-run',
        title: 'ドッグラン向けの庭',
        description: 'フェンスと人工芝の相性を確認。',
        image: HERO_IMAGE,
      },
      {
        id: 'parking-house',
        title: '駐車場付き住宅',
        description: '前庭と駐車場まわりの相談向け。',
        image: 'images/g20-material/carstop-flute-six.webp',
      },
    ],
  };
  // EXた組HPへ移植するときは、同じ形の EX_TAKUMI_SIMULATOR_CONFIG を先に読み込めば差し替えられます。
  window.GARDEN_SIMULATOR_CONFIG = window.GARDEN_SIMULATOR_CONFIG || GARDEN_SIMULATOR_CONFIG;
  var SIMULATOR_CONFIG = window.EX_TAKUMI_SIMULATOR_CONFIG || window.GARDEN_SIMULATOR_CONFIG || GARDEN_SIMULATOR_CONFIG;
  var LINE_URL = SIMULATOR_CONFIG.lineUrl || 'https://line.me/R/ti/p/@953wnidc';
  var ITEM_PRICE_MASTER = SIMULATOR_CONFIG.priceMaster || {};
  var SIMULATOR_MAX_ITEMS = SIMULATOR_CONFIG.maxItems || 5;
  var SIMULATOR_SCENES = SIMULATOR_CONFIG.scenes || [];
  var SIMULATOR_ITEMS = SIMULATOR_CONFIG.items || [];
  var SIMULATOR_SCENE_PRIORITY = SIMULATOR_CONFIG.scenePriority || {};
  var SIMULATOR_AREA_CODES = SIMULATOR_CONFIG.areaCodes || [];
  var SIMULATOR_AREA_LABELS = SIMULATOR_CONFIG.areaLabels || {};
  var SAMPLE_GARDENS = SIMULATOR_CONFIG.sampleGardens || [];

  var state = {
    products: [],
    activeCategory: 'すべて',
    query: '',
    showSaved: false,
    showCatalog: false,
    savedIds: [],
    exteriorProducts: [],
    exteriorSpecs: [],
    exteriorOptionGroups: [],
    exteriorPriceMatrices: [],
  };

  var simulatorState = {
    source: 'upload',
    scene: '裏庭',
    uploadedName: '',
    uploadedImageUrl: '',
    selectedSample: SAMPLE_GARDENS[0].id,
    selectedItems: [],
    placements: {},
    lastGenerationInput: null,
    lastGeneratedImageUrl: '',
    selectedCarport: {
      enabled: false,
      product_id: 'LIXIL-CARPORT-NESCA-F-WIDE',
      variant_id: NESCA_TEST_VARIANT_ID,
      options: {
        size: '54-50',
        height: 'H22',
        body_color: 'SG',
        roof_material: 'STANDARD',
        lighting: 'NO-LIGHT',
        drainage_direction: 'FRONT_LOW',
      },
    },
  };

  function text(value) {
    return value === null || value === undefined || value === '' ? '未確認' : String(value);
  }

  function normalize(value) {
    return text(value).toLowerCase();
  }

  function escapeHtml(value) {
    return text(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function track(eventName, params) {
    if (window.gtag) {
      window.gtag('event', eventName, params || {});
    }
  }

  function readSavedIds() {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.filter(Boolean).map(String) : [];
    } catch (error) {
      return [];
    }
  }

  function writeSavedIds(ids) {
    state.savedIds = ids.filter(function (id, index, array) {
      return id && array.indexOf(id) === index;
    });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedIds));
    updateSavedCount();
  }

  function isSaved(productId) {
    return state.savedIds.indexOf(String(productId)) !== -1;
  }

  function productParams(product) {
    return {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      maker: product.maker,
    };
  }

  function updateSavedCount() {
    if (savedCount) savedCount.textContent = String(state.savedIds.length);
    if (savedFilter) {
      savedFilter.classList.toggle('is-active', state.showSaved);
      savedFilter.setAttribute('aria-pressed', state.showSaved ? 'true' : 'false');
    }
  }

  function formatYen(value) {
    if (typeof value !== 'number' || !isFinite(value) || value <= 0) {
      return '相談価格';
    }
    return '¥' + value.toLocaleString('ja-JP') + '（税込）';
  }

  function formatPublicPrice(value, label) {
    if (label) return label;
    if (typeof value !== 'number' || !isFinite(value) || value <= 0) return '相談価格';
    return 'EXた組価格 ' + formatYen(value);
  }

  function formatSimulatorYen(value) {
    if (typeof value !== 'number' || !isFinite(value) || value < 0) return '価格未設定';
    return '¥' + value.toLocaleString('ja-JP');
  }

  function simulatorItemPrice(itemName) {
    var priceData = ITEM_PRICE_MASTER[itemName] || {};
    var price = priceData.reference_price_tax_included;
    return typeof price === 'number' && isFinite(price) ? price : null;
  }

  function findExteriorProduct(productId) {
    return state.exteriorProducts.find(function (product) {
      return product.product_id === productId;
    }) || null;
  }

  function findExteriorSpec(aiSpecId) {
    return state.exteriorSpecs.find(function (spec) {
      return spec.ai_spec_id === aiSpecId;
    }) || null;
  }

  function findOptionGroup(groupId) {
    return state.exteriorOptionGroups.find(function (group) {
      return group.option_group_id === groupId;
    }) || null;
  }

  function findOption(groupId, code) {
    var group = findOptionGroup(groupId);
    var options = group && Array.isArray(group.options) ? group.options : [];
    return options.find(function (option) {
      return option.code === code;
    }) || null;
  }

  function findPriceMatrix(matrixId) {
    return state.exteriorPriceMatrices.find(function (matrix) {
      return matrix.price_matrix_id === matrixId;
    }) || null;
  }

  function findCarportVariant() {
    var product = findExteriorProduct(simulatorState.selectedCarport.product_id);
    if (!product) return null;
    var matrix = findPriceMatrix(product.price_matrix_id);
    var variants = matrix && Array.isArray(matrix.variants) ? matrix.variants : [];
    var selected = simulatorState.selectedCarport.options || {};
    var matched = variants.find(function (variant) {
      var codes = variant.option_codes || {};
      return codes.size === selected.size &&
        codes.height === selected.height &&
        codes.body_color === selected.body_color &&
        codes.roof_material === selected.roof_material &&
        codes.lighting === selected.lighting;
    });
    if (matched) return matched;
    return variants.find(function (variant) {
      return variant.variant_id === simulatorState.selectedCarport.variant_id;
    }) || null;
  }

  function activeVariantPriceBlock(variant) {
    if (!variant) return null;
    var override = variant.override_price || {};
    var standard = variant.standard_price || {};
    return override.enabled ? override : standard;
  }

  function computedBasicTotal(priceBlock) {
    if (!priceBlock) return null;
    var productPrice = priceBlock.product_price_in_tax;
    var installFee = priceBlock.standard_installation_fee_in_tax;
    if (typeof productPrice !== 'number' || typeof installFee !== 'number') return null;
    return productPrice + installFee;
  }

  function carportDisplayAmount() {
    return computedBasicTotal(activeVariantPriceBlock(findCarportVariant()));
  }

  function carportLabel(groupId, code, fallback) {
    var option = findOption(groupId, code);
    return (option && option.customer_label) || fallback || code || '未選択';
  }

  function selectedCarportDetails() {
    if (!simulatorState.selectedCarport.enabled) return null;
    var product = findExteriorProduct(simulatorState.selectedCarport.product_id);
    var variant = findCarportVariant();
    var spec = product ? findExteriorSpec(product.ai_spec_id) : null;
    var options = simulatorState.selectedCarport.options || {};
    return {
      product: product,
      variant: variant,
      spec: spec,
      product_id: product && product.product_id,
      variant_id: variant && variant.variant_id,
      ai_spec_id: product && product.ai_spec_id,
      product_name: product ? product.public_name : 'LIXIL ネスカF ワイド',
      size: carportLabel('CARPORT_SIZE_NESCA_F_WIDE', options.size, '2台用 標準サイズ'),
      height: carportLabel('CARPORT_HEIGHT_BASIC', options.height, '標準高さ'),
      bodyColor: carportLabel('CARPORT_BODY_COLOR_BASIC', options.body_color, 'シャイングレー'),
      roof: carportLabel('CARPORT_POLYCA_ROOF_BASIC', options.roof_material, '標準ポリカ'),
      drainage: carportLabel('CARPORT_DRAINAGE_DIRECTION', options.drainage_direction, '前側水下'),
      price: carportDisplayAmount(),
      priceLabel: '参考価格（税込・標準施工費込）',
      selected_options: Object.assign({}, options),
    };
  }

  function loadJson(sources) {
    return sources.reduce(function (promise, source) {
      return promise.catch(function () {
        return fetch(source, { cache: 'no-store' }).then(function (response) {
          if (!response.ok) throw new Error(source + ' load failed');
          return response.json();
        });
      });
    }, Promise.reject());
  }

  function loadOptionalJson(sources, fallback) {
    return loadJson(sources).catch(function (error) {
      console.warn('[Garden Living] optional json load failed:', sources, error);
      return fallback || {};
    });
  }

  function oldProductIsPublished(product) {
    var gl = product.garden_living || {};
    var basic = product.basic || {};
    return gl.publish !== false && basic.status !== '廃番';
  }

  function oldProductImage(product) {
    var photos = product.photos || {};
    if (photos.main && photos.main.url) return photos.main.url;
    var gallery = Array.isArray(photos.gallery) ? photos.gallery : [];
    var first = gallery.find(function (item) { return item && item.url; });
    var scene = product.garden_living && product.garden_living.scene;
    return (first && first.url) || (scene && scene.image) || DEFAULT_IMAGE;
  }

  function formatOldSize(product) {
    var size = product.size || {};
    var parts = [];
    if (size.width_mm) parts.push('W' + size.width_mm);
    if (size.depth_mm) parts.push('D' + size.depth_mm);
    if (size.height_mm) parts.push('H' + size.height_mm);
    return parts.length ? parts.join(' × ') + 'mm' : '仕様はお問い合わせください';
  }

  function convertOldProduct(product, index) {
    var basic = product.basic || {};
    var seo = product.seo || {};
    var pricing = product.pricing || {};
    return {
      id: product.id,
      source: 'products',
      name: text(basic.product_name),
      model: text(basic.model_number),
      category: g20Category(basic.category || 'その他'),
      maker: text(basic.manufacturer || 'OnlyOneClub'),
      image: oldProductImage(product),
      price: pricing.extakumi_price || null,
      priceLabel: '',
      description: text(seo.description_100 || seo.catch_copy || (product.garden_living && product.garden_living.index_copy) || ''),
      size: formatOldSize(product),
      colors: [],
      install: text(product.installation && product.installation.installation_method),
      priority: 80,
      order: index,
      detailUrl: SITE_ORIGIN + '/garden-products/' + encodeURIComponent(product.id) + '.html',
    };
  }

  function g20Category(category) {
    var value = text(category);
    if (value.indexOf('車止め') !== -1 || value.indexOf('カーストッパー') !== -1) return '車止め';
    if (value.indexOf('サイクル') !== -1) return 'サイクルスタンド';
    if (value.indexOf('アメリカンフェンス') !== -1) return 'アメリカンフェンス';
    if (value.indexOf('機能門柱') !== -1) return '機能門柱';
    if (value.indexOf('宅配') !== -1) return '宅配ボックス';
    if (value.indexOf('ポスト') !== -1) return 'ポスト';
    if (value.indexOf('ガビオン') !== -1) return 'ガビオン';
    if (value.indexOf('立水栓') !== -1 || value.indexOf('水栓') !== -1 || value.indexOf('ガーデンシンク') !== -1) return '立水栓';
    if (value.indexOf('人工芝') !== -1 || value.indexOf('芝') !== -1) return '人工芝';
    if (value.indexOf('防草') !== -1) return '防草シート';
    if (value.indexOf('ピザ') !== -1 || value.indexOf('BBQ') !== -1 || value.indexOf('バーベキュー') !== -1 || value.indexOf('燻製') !== -1) return 'ピザ窯';
    return TARGET_CATEGORIES.indexOf(value) !== -1 ? value : 'その他';
  }

  function g20Image(product) {
    var file = product.image_file_name || product.product_image || product.image;
    if (!file || file === '未確認') return DEFAULT_IMAGE;
    if (/^(https?:)?\/\//.test(file) || file.charAt(0) === '/') return file;
    if (file.indexOf('/') !== -1) return 'images/g20-material/' + file.replace(/^images\/g20-material\//, '');
    return 'images/g20-material/' + file;
  }

  function g20Price(product) {
    return product.extakumi_price || null;
  }

  function convertG20Product(product, index) {
    var category = g20Category(product.category);
    return {
      id: product.product_id,
      source: 'g20',
      name: text(product.product_name),
      model: text(product.model_number || product.representative_product_code),
      category: category,
      maker: text(product.manufacturer || 'OnlyOneClub'),
      image: g20Image(product),
      price: g20Price(product),
      priceLabel: product.extakumi_price_label || '',
      description: text(product.comment || product.series_name || ''),
      size: text(product.size_label || product.size),
      colors: Array.isArray(product.colors) ? product.colors : [],
      install: text(product.install_type),
      priority: product.sales_priority === 'A' ? 100 : product.sales_priority === 'B' ? 70 : 40,
      order: 10000 + index,
      detailUrl: SITE_ORIGIN + '/outdoor-kitchen-detail.html?id=' + encodeURIComponent(product.product_id),
    };
  }

  function publishedG20(product) {
    if (!product || !product.product_id || !product.product_name) return false;
    return TARGET_CATEGORIES.indexOf(g20Category(product.category)) !== -1;
  }

  function dedupe(products) {
    var seen = {};
    return products.filter(function (product) {
      if (!product.id || seen[product.id]) return false;
      seen[product.id] = true;
      return true;
    });
  }

  function productSearchText(product) {
    return [
      product.id,
      product.name,
      product.model,
      product.category,
      product.maker,
      product.size,
      product.install,
      product.colors.join(' '),
    ].map(normalize).join(' ');
  }

  function filteredProducts() {
    return state.products.filter(function (product) {
      var savedOk = !state.showSaved || isSaved(product.id);
      var categoryOk = state.showSaved || state.activeCategory === 'すべて' || product.category === state.activeCategory;
      var queryOk = !state.query || productSearchText(product).indexOf(normalize(state.query)) !== -1;
      return savedOk && categoryOk && queryOk;
    });
  }

  function createCard(product) {
    var saved = isSaved(product.id);
    var lineSource = state.showSaved ? 'saved_list' : 'product_card';
    var article = document.createElement('article');
    article.className = 'shop-card';
    article.innerHTML =
      '<div class="shop-card-inner">' +
        '<figure class="shop-card-image"><img src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.name) + '" loading="lazy"></figure>' +
        '<div class="shop-card-body">' +
          '<p class="product-model">' + escapeHtml(product.category) + '</p>' +
          '<h3>' + escapeHtml(product.name) + '</h3>' +
          '<p class="shop-card-price">' + escapeHtml(formatPublicPrice(product.price, product.priceLabel)) + '</p>' +
          '<div class="shop-card-actions">' +
            '<button class="favorite-btn js-favorite" type="button" data-product-id="' + escapeHtml(product.id) + '" aria-pressed="' + (saved ? 'true' : 'false') + '">' + (saved ? '♥ 保存済み' : '♡ 気になる') + '</button>' +
            '<a class="product-cta" href="' + escapeHtml(product.detailUrl) + '">詳細を見る</a>' +
            '<a class="product-consult js-line-track" href="' + LINE_URL + '" target="_blank" rel="noopener noreferrer" data-product-id="' + escapeHtml(product.id) + '" data-source="' + lineSource + '">LINEで相談</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    return article;
  }

  function renderCards(container, products) {
    if (!container) return;
    container.textContent = '';
    if (!products.length) {
      container.innerHTML = '<p class="empty-message">該当する商品がありません。</p>';
      return;
    }
    products.forEach(function (product) {
      container.appendChild(createCard(product));
    });
  }

  function renderCatalog(list) {
    if (!catalogGrid) return;
    if (!state.showCatalog) {
      catalogGrid.innerHTML =
        '<div class="catalog-intro">' +
          '<p class="eyebrow">Select First</p>' +
          '<h3>カテゴリや検索から、必要な商品だけ表示します。</h3>' +
          '<p>トップでは商品カードを並べすぎず、庭の使い方やカテゴリを選ぶ入口として整理しています。</p>' +
        '</div>';
      if (resultCount) resultCount.textContent = 'カテゴリを選ぶか、検索すると商品一覧を表示します。';
      return;
    }
    renderCards(catalogGrid, list);
  }

  function categoryCount(category) {
    if (category === 'すべて') return state.products.length;
    return state.products.filter(function (product) { return product.category === category; }).length;
  }

  function renderCategories() {
    if (!categoryGrid) return;
    var categories = TARGET_CATEGORIES;
    categoryGrid.innerHTML = categories.map(function (category) {
      var active = state.activeCategory === category ? ' is-active' : '';
      var imageProduct = state.products.find(function (product) {
        return product.category === category && product.image && product.image !== DEFAULT_IMAGE;
      }) || state.products.find(function (product) { return product.category === category; });
      var image = CATEGORY_VISUALS[category] || (imageProduct ? imageProduct.image : DEFAULT_IMAGE);
      return '<button class="category-card category-card-large' + active + '" type="button" data-category="' + category + '">' +
        '<figure><img src="' + image + '" alt="' + category + '" loading="lazy"></figure>' +
        '<span class="category-label">Category</span>' +
        '<span class="category-name">' + category + '</span>' +
        '<small>' + (CATEGORY_META[category] || '庭まわりの商品を探せます。') + '</small>' +
        '<strong>' + categoryCount(category) + '件</strong>' +
      '</button>';
    }).join('');
    categoryGrid.querySelectorAll('button').forEach(function (button) {
      button.addEventListener('click', function () {
        state.activeCategory = button.dataset.category || 'すべて';
        state.showSaved = false;
        state.showCatalog = true;
        track('gl_category_click', {
          category: state.activeCategory,
          category_count: categoryCount(state.activeCategory),
        });
        renderAll();
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function makerLabel(name) {
    return name === 'オンリーワンクラブ' ? 'OnlyOneClub' : name;
  }

  function renderMakers() {
    if (!makerGrid) return;
    makerGrid.innerHTML = MAKERS.map(function (maker) {
      var count = state.products.filter(function (product) {
        return makerLabel(product.maker) === maker;
      }).length;
      return '<button class="maker-card" type="button" data-maker="' + maker + '">' +
        '<span>' + maker + '</span><strong>' + count + '</strong>' +
      '</button>';
    }).join('');
    makerGrid.querySelectorAll('button').forEach(function (button) {
      button.addEventListener('click', function () {
        state.query = button.dataset.maker || '';
        if (searchInput) searchInput.value = state.query;
        state.activeCategory = 'すべて';
        state.showSaved = false;
        state.showCatalog = true;
        renderAll();
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function renderHero() {
    if (!heroVisual) return;
    heroVisual.innerHTML =
      '<figure class="hero-lifestyle">' +
        '<img src="' + HERO_IMAGE + '" alt="アメリカンフェンスと人工芝のある庭で過ごすGarden Livingのイメージ">' +
        '<figcaption>' +
          '<strong>庭で過ごす時間から、商品を選ぶ。</strong>' +
          '<span>フェンス・人工芝・水まわり・ガーデンアイテムまで</span>' +
        '</figcaption>' +
      '</figure>';
  }

  function renderAll() {
    var list = filteredProducts();
    renderCategories();
    renderCatalog(list);
    if (resultCount) {
      if (state.showCatalog) {
        var prefix = state.showSaved ? '保存した商品 ' : state.activeCategory === 'すべて' ? '' : state.activeCategory + ' ';
        resultCount.textContent = prefix + list.length + '件の商品を表示中';
      }
    }
    if (newGrid) renderCards(newGrid, state.products.slice().sort(function (a, b) { return b.order - a.order; }).slice(0, 6));
    if (popularGrid) renderCards(popularGrid, state.products.slice().sort(function (a, b) { return b.priority - a.priority; }).slice(0, 6));
    renderMakers();
    updateSavedCount();
  }

  function bindSearch() {
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        state.query = searchInput.value.trim();
        state.showSaved = false;
        state.activeCategory = 'すべて';
        state.showCatalog = state.query.length > 0;
        renderAll();
      });
    }
    if (savedFilter) {
      savedFilter.addEventListener('click', function () {
        state.showSaved = true;
        state.activeCategory = 'すべて';
        state.showCatalog = true;
        renderAll();
        track('gl_saved_list_view', { saved_count: state.savedIds.length });
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    if (clearFilter) {
      clearFilter.addEventListener('click', function () {
        state.query = '';
        state.activeCategory = 'すべて';
        state.showSaved = false;
        state.showCatalog = true;
        if (searchInput) searchInput.value = '';
        renderAll();
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  function findProduct(productId) {
    return state.products.find(function (product) { return product.id === productId; });
  }

  function bindProductActions() {
    document.addEventListener('click', function (event) {
      var favoriteButton = event.target.closest('.js-favorite');
      if (favoriteButton) {
        var product = findProduct(favoriteButton.dataset.productId);
        if (!product) return;
        if (isSaved(product.id)) {
          writeSavedIds(state.savedIds.filter(function (id) { return id !== product.id; }));
          track('gl_product_unlike', productParams(product));
        } else {
          writeSavedIds(state.savedIds.concat(product.id));
          track('gl_product_like', productParams(product));
        }
        renderAll();
        return;
      }

      var sceneCategoryButton = event.target.closest('.scene-category-button');
      if (sceneCategoryButton) {
        state.activeCategory = sceneCategoryButton.dataset.category || 'すべて';
        state.showSaved = false;
        state.showCatalog = true;
        if (searchInput) {
          state.query = '';
          searchInput.value = '';
        }
        track('gl_category_click', {
          category: state.activeCategory,
          category_count: categoryCount(state.activeCategory),
        });
        renderAll();
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      var lineLink = event.target.closest('.js-line-track');
      if (lineLink) {
        var lineProduct = findProduct(lineLink.dataset.productId);
        var params = lineProduct ? productParams(lineProduct) : {};
        params.source = lineLink.dataset.source || 'unknown';
        track('gl_line_click', params);
      }
    });
  }

  function simulatorSample() {
    return SAMPLE_GARDENS.find(function (sample) {
      return sample.id === simulatorState.selectedSample;
    }) || SAMPLE_GARDENS[0];
  }

  function simulatorOrderedItems() {
    var priority = SIMULATOR_SCENE_PRIORITY[simulatorState.scene] || [];
    return SIMULATOR_ITEMS.slice().sort(function (a, b) {
      var aIndex = priority.indexOf(a);
      var bIndex = priority.indexOf(b);
      if (aIndex === -1) aIndex = 999;
      if (bIndex === -1) bIndex = 999;
      if (aIndex !== bIndex) return aIndex - bIndex;
      return SIMULATOR_ITEMS.indexOf(a) - SIMULATOR_ITEMS.indexOf(b);
    });
  }

  function scenePurpose() {
    var scenePurposes = SIMULATOR_CONFIG.scenePurposes || {};
    return scenePurposes[simulatorState.scene] || '庭まわりの外構空間';
  }

  function photoPromptLabel() {
    if (simulatorState.source === 'sample') {
      return '選択した「' + simulatorSample().title + '」のサンプル庭写真';
    }
    if (simulatorState.uploadedName) {
      return 'アップロードされた庭写真';
    }
    return 'アップロード予定の庭写真';
  }

  function areaLabel(code) {
    return SIMULATOR_AREA_LABELS[code] || code;
  }

  function areaDisplay(codes) {
    if (!Array.isArray(codes) || !codes.length) return 'おまかせ';
    return codes.map(function (code) {
      return code + '（' + areaLabel(code) + '）';
    }).join('・');
  }

  function areaPromptText(item, codes) {
    if (!Array.isArray(codes) || !codes.length) return item + 'を自然な位置に';
    if (codes.length === 1) {
      return item + 'をエリア' + codes[0] + '（' + areaLabel(codes[0]) + '）へ';
    }
    return item + 'をエリア' + codes.map(function (code) {
      return code + '（' + areaLabel(code) + '）';
    }).join('・') + 'へ';
  }

  function consultPhotoLabel() {
    if (simulatorState.source === 'sample') {
      return 'サンプル庭（' + simulatorSample().title + '）';
    }
    if (simulatorState.uploadedName) {
      return '自宅写真（' + simulatorState.uploadedName + '）';
    }
    return '自宅写真';
  }

  function carportPromptText() {
    var details = selectedCarportDetails();
    if (!details) return '';
    return details.product_name + '（' +
      details.size + '、' +
      details.height + '、' +
      details.bodyColor + '、' +
      details.roof + '、' +
      details.drainage +
      '）を、駐車場範囲内へ施工済みの完成イメージとして自然に配置してください。' +
      ' カーポート以外の外構要素は追加しないでください。人工芝、植栽、タイル、土間コンクリートの打ち替え、フェンス、照明、門柱など、選択していない商品や素材は新しく足さないでください。' +
      ' 既存の床面、擁壁、側溝、階段、周囲の建物、植栽は、カーポート施工に直接干渉しない限りそのまま維持してください。';
  }

  function buildSimulatorPrompt() {
    var selected = simulatorState.selectedItems;
    var itemText = selected.length
      ? selected.map(function (item) {
        return areaPromptText(item, simulatorState.placements[item]);
      }).join('、') + '配置してください。'
      : '必要な庭アイテムを自然に提案して配置してください。';
    var carportText = carportPromptText();
    if (carportText) {
      itemText += ' ' + carportText;
    }

    return photoPromptLabel() + 'をもとに、' + simulatorState.scene + 'を' + scenePurpose() + 'にしてください。' +
      itemText +
      (SIMULATOR_CONFIG.promptPolicy || '既存の建物・窓・外壁・敷地形状はできるだけ維持し、現実的な外構施工として違和感のない完成イメージにしてください。');
  }

  function renderSimulatorSources() {
    if (simulatorUploadPanel) simulatorUploadPanel.hidden = simulatorState.source !== 'upload';
    if (simulatorSamplePanel) simulatorSamplePanel.hidden = simulatorState.source !== 'sample';
    simulatorSourceInputs.forEach(function (input) {
      var method = input.closest('.simulator-method');
      input.checked = input.value === simulatorState.source;
      if (method) method.classList.toggle('is-active', input.checked);
    });
  }

  function updatePlacementReferenceImage() {
    if (!placementReferenceImage) return;
    placementReferenceImage.src = simulatorSourceImage();
  }

  function renderSampleGardens() {
    if (!sampleGardenGrid) return;
    sampleGardenGrid.innerHTML = SAMPLE_GARDENS.map(function (sample) {
      var active = sample.id === simulatorState.selectedSample ? ' is-active' : '';
      return '<button class="sample-garden-card' + active + '" type="button" data-sample-id="' + escapeHtml(sample.id) + '">' +
        '<img src="' + escapeHtml(sample.image) + '" alt="' + escapeHtml(sample.title) + '" loading="lazy">' +
        '<span>' + escapeHtml(sample.title) + '</span>' +
        '<small>' + escapeHtml(sample.description) + '</small>' +
      '</button>';
    }).join('');
  }

  function renderSimulatorScenes() {
    if (!simulatorSceneList) return;
    simulatorSceneList.innerHTML = SIMULATOR_SCENES.map(function (scene) {
      var active = scene === simulatorState.scene ? ' is-active' : '';
      return '<button class="scene-choice' + active + '" type="button" data-scene="' + escapeHtml(scene) + '">' + escapeHtml(scene) + '</button>';
    }).join('');
  }

  function renderSimulatorItems() {
    if (!simulatorItemList) return;
    simulatorItemList.innerHTML = simulatorOrderedItems().map(function (item) {
      var selected = simulatorState.selectedItems.indexOf(item) !== -1;
      return '<button class="simulator-item' + (selected ? ' is-selected' : '') + '" type="button" data-item="' + escapeHtml(item) + '" aria-pressed="' + (selected ? 'true' : 'false') + '">' +
        '<span>' + escapeHtml(item) + '</span>' +
      '</button>';
    }).join('');
  }

  function optionHtml(groupId, selectedCode) {
    var group = findOptionGroup(groupId);
    var options = group && Array.isArray(group.options) ? group.options : [];
    return options.filter(function (option) {
      return option.enabled !== false;
    }).map(function (option) {
      return '<option value="' + escapeHtml(option.code) + '"' + (option.code === selectedCode ? ' selected' : '') + '>' +
        escapeHtml(option.customer_label || option.code) +
      '</option>';
    }).join('');
  }

  function renderCarportBlock() {
    if (!carportEnabled) return;
    var product = findExteriorProduct(simulatorState.selectedCarport.product_id);
    var variant = findCarportVariant();
    var details = selectedCarportDetails();
    var options = simulatorState.selectedCarport.options;

    if (carportProductName) carportProductName.textContent = product ? product.public_name : 'LIXIL ネスカF ワイド';
    if (carportProductSummary) carportProductSummary.textContent = product ? product.summary : '2台用カーポートの完成イメージを作成します。';
    carportEnabled.checked = simulatorState.selectedCarport.enabled;
    if (carportOptionGrid) carportOptionGrid.hidden = !simulatorState.selectedCarport.enabled;
    if (carportPricePreview) carportPricePreview.hidden = !simulatorState.selectedCarport.enabled;

    if (carportSize) carportSize.innerHTML = optionHtml('CARPORT_SIZE_NESCA_F_WIDE', options.size);
    if (carportHeight) carportHeight.innerHTML = optionHtml('CARPORT_HEIGHT_BASIC', options.height);
    if (carportBodyColor) carportBodyColor.innerHTML = optionHtml('CARPORT_BODY_COLOR_BASIC', options.body_color);
    if (carportRoof) carportRoof.innerHTML = optionHtml('CARPORT_POLYCA_ROOF_BASIC', options.roof_material);
    if (carportDrainage) carportDrainage.innerHTML = optionHtml('CARPORT_DRAINAGE_DIRECTION', options.drainage_direction);

    if (carportDisplayPrice) {
      carportDisplayPrice.textContent = details ? formatSimulatorYen(details.price) : '価格未設定';
    }
    if (carportPriceNote) {
      carportPriceNote.textContent = variant && variant.price_status === 'temporary'
        ? '仮価格です。特殊施工・現場条件により別途。'
        : '特殊施工・現場条件により別途。';
    }
  }

  function renderSimulatorPlacements() {
    if (!simulatorPlacementList) return;
    if (!simulatorState.selectedItems.length) {
      simulatorPlacementList.innerHTML = '<p class="empty-message">アイテムを選ぶと、配置指定が表示されます。</p>';
      return;
    }
    simulatorPlacementList.innerHTML = simulatorState.selectedItems.map(function (item) {
      var current = Array.isArray(simulatorState.placements[item]) ? simulatorState.placements[item] : [];
      return '<div class="placement-row">' +
        '<div class="placement-row-head">' +
          '<span>' + escapeHtml(item) + '</span>' +
          '<small>配置：' + escapeHtml(areaDisplay(current)) + '</small>' +
        '</div>' +
        '<div class="placement-button-grid" data-placement-item="' + escapeHtml(item) + '">' +
          '<button type="button" class="placement-area-button placement-auto' + (!current.length ? ' is-selected' : '') + '" data-area="">おまかせ</button>' +
          SIMULATOR_AREA_CODES.map(function (code) {
            return '<button type="button" class="placement-area-button' + (current.indexOf(code) !== -1 ? ' is-selected' : '') + '" data-area="' + escapeHtml(code) + '">' +
              '<strong>' + escapeHtml(code) + '</strong><small>' + escapeHtml(areaLabel(code)) + '</small>' +
            '</button>';
          }).join('') +
        '</div>' +
      '</div>';
    }).join('');
  }

  function renderSimulatorPriceSummary() {
    if (!simulatorSelectedPriceList || !simulatorTotalPrice) return;
    var carport = selectedCarportDetails();
    if (!simulatorState.selectedItems.length && !carport) {
      simulatorSelectedPriceList.innerHTML = '<p class="empty-message">商品を選ぶと、参考価格が表示されます。</p>';
      simulatorTotalPrice.textContent = '¥0';
      return;
    }

    var total = 0;
    var rows = simulatorState.selectedItems.map(function (item) {
      var price = simulatorItemPrice(item);
      if (price !== null) total += price;
      return '<div class="selected-price-row">' +
        '<span>' + escapeHtml(item) + '</span>' +
        '<strong>' + escapeHtml(formatSimulatorYen(price)) + '</strong>' +
      '</div>';
    });
    if (carport) {
      total += carport.price || 0;
      rows.push('<div class="selected-price-row selected-price-row-carport">' +
        '<span>' + escapeHtml(carport.product_name) + '<small>' + escapeHtml(carport.size + ' / ' + carport.height + ' / ' + carport.bodyColor + ' / ' + carport.roof) + '</small></span>' +
        '<strong>' + escapeHtml(formatSimulatorYen(carport.price)) + '</strong>' +
      '</div>');
    }
    simulatorSelectedPriceList.innerHTML = rows.join('');
    simulatorTotalPrice.textContent = formatSimulatorYen(total);
  }

  function simulatorTotalAmount() {
    var itemTotal = simulatorState.selectedItems.reduce(function (sum, item) {
      var price = simulatorItemPrice(item);
      return sum + (price !== null ? price : 0);
    }, 0);
    var carport = selectedCarportDetails();
    return itemTotal + (carport && carport.price ? carport.price : 0);
  }

  function buildSimulatorConsultText() {
    var selectedLines = simulatorState.selectedItems.length
      ? simulatorState.selectedItems.map(function (item) {
        var placement = areaDisplay(simulatorState.placements[item]);
        return '・' + item + '　配置：' + placement + '　' + formatSimulatorYen(simulatorItemPrice(item));
      }).join('\n')
      : '・未選択';
    var carport = selectedCarportDetails();
    var carportLines = carport
      ? '\n\n施工商品：\n' +
        '・商品名：' + carport.product_name + '\n' +
        '・サイズ：' + carport.size + '\n' +
        '・柱高さ：' + carport.height + '\n' +
        '・本体色：' + carport.bodyColor + '\n' +
        '・屋根材：' + carport.roof + '\n' +
        '・水下方向：' + carport.drainage + '\n' +
        '・参考価格：' + formatSimulatorYen(carport.price) + '（税込・標準施工費込）\n' +
        '・生成画像：' + (simulatorState.lastGeneratedImageUrl ? '参考イメージあり（画面上の生成画像をご確認ください）' : '未生成') + '\n' +
        '※生成画像は完成イメージです。実際の施工可否・正式価格は現地条件を確認してから確定します。'
      : '';

    return (SIMULATOR_CONFIG.consultTitle || '【Garden Living デザインシミュレーション相談】') + '\n\n' +
      'シーン：' + simulatorState.scene + '\n' +
      '使用写真：' + consultPhotoLabel() + '\n\n' +
      '選択商品：\n' + selectedLines + carportLines + '\n\n' +
      '参考価格合計（税込）：' + formatSimulatorYen(simulatorTotalAmount()) + '\n\n' +
      '※Garden Living商品は商品代の参考価格です。施工商品は標準施工費込みの参考価格です。特殊施工・現場条件により価格は変動します。\n\n' +
      '完成イメージ用指示文：\n' + buildSimulatorPrompt() + '\n\n' +
      'この内容で相談したいです。';
  }

  function simulatorSourceImage() {
    if (simulatorState.source === 'sample') return simulatorSample().image;
    return simulatorState.uploadedImageUrl || HERO_IMAGE;
  }

  function simulatorGenerationInput() {
    var carport = selectedCarportDetails();
    var selectedItems = simulatorState.selectedItems.slice();
    if (carport) selectedItems.push(carport.product_name);
    return {
      image_url: simulatorSourceImage(),
      image_source: simulatorState.source,
      simulator_id: SIMULATOR_CONFIG.id || 'garden-simulator',
      prompt: buildSimulatorPrompt(),
      selected_items: selectedItems,
      reference_products: simulatorReferenceProducts(selectedItems),
      placements: Object.assign({}, simulatorState.placements),
      scene: simulatorState.scene,
      concept: SIMULATOR_CONFIG.concept || '',
      image_model: SIMULATOR_CONFIG.imageModel || 'gpt-image-1',
      product_id: carport && carport.product_id,
      variant_id: carport && carport.variant_id,
      ai_spec_id: carport && carport.ai_spec_id,
      selected_options: carport && carport.selected_options,
      exterior_product: carport ? {
        product_name: carport.product_name,
        size: carport.size,
        height: carport.height,
        body_color: carport.bodyColor,
        roof_material: carport.roof,
        drainage_direction: carport.drainage,
        reference_price_in_tax: carport.price,
      } : null,
    };
  }

  function simulatorReferenceProducts(selectedItems) {
    var referenceMap = SIMULATOR_CONFIG.referenceProducts || {};
    return selectedItems.map(function (item) {
      return referenceMap[item];
    }).filter(Boolean);
  }

  function dataUrlFromBlob(blob) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(String(reader.result || '')); };
      reader.onerror = function () { reject(new Error('画像を読み込めませんでした。')); };
      reader.readAsDataURL(blob);
    });
  }

  function imageBlobFromUrl(imageUrl) {
    return fetch(imageUrl).then(function (response) {
      if (!response.ok) throw new Error('元画像を読み込めませんでした。');
      return response.blob();
    });
  }

  function resizeImageBlob(blob) {
    if (!blob.type || blob.type.indexOf('image/') !== 0) return Promise.resolve(blob);
    var maxSize = 1600;
    return new Promise(function (resolve) {
      var objectUrl = URL.createObjectURL(blob);
      var image = new Image();
      image.onload = function () {
        var scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        var width = Math.max(1, Math.round(image.width * scale));
        var height = Math.max(1, Math.round(image.height * scale));
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d');
        if (!context) {
          URL.revokeObjectURL(objectUrl);
          resolve(blob);
          return;
        }
        context.drawImage(image, 0, 0, width, height);
        canvas.toBlob(function (resizedBlob) {
          URL.revokeObjectURL(objectUrl);
          resolve(resizedBlob || blob);
        }, 'image/jpeg', 0.88);
      };
      image.onerror = function () {
        URL.revokeObjectURL(objectUrl);
        resolve(blob);
      };
      image.src = objectUrl;
    });
  }

  function generationErrorMessage(error) {
    if (error && error.userMessage) return error.userMessage;
    if (error && error.message) return error.message;
    return '生成に失敗しました。時間をおいて再試行してください。';
  }

  function prepareGardenImagePayload(input) {
    return imageBlobFromUrl(input.image_url || HERO_IMAGE).then(resizeImageBlob).then(function (blob) {
      return dataUrlFromBlob(blob).then(function (dataUrl) {
        return {
          simulator_id: input.simulator_id,
          image_source: input.image_source,
          scene: input.scene,
          concept: input.concept,
          prompt: input.prompt,
          selected_items: input.selected_items,
          placements: input.placements,
          image_model: input.image_model,
          product_id: input.product_id,
          variant_id: input.variant_id,
          ai_spec_id: input.ai_spec_id,
          selected_options: input.selected_options,
          exterior_product: input.exterior_product,
          source_image: {
            data_url: dataUrl,
            mime_type: blob.type || 'image/png',
            name: input.image_source === 'sample' ? 'sample-garden.png' : 'garden-photo.png',
          },
        };
      });
    });
  }

  function generateGardenImage(input) {
    simulatorState.lastGenerationInput = input;
    var endpoint = SIMULATOR_CONFIG.imageApiEndpoint || '/api/generate-garden-image';

    return prepareGardenImagePayload(input).then(function (payload) {
      console.info('[Garden Living Simulator] generation payload:', {
        product_id: payload.product_id,
        variant_id: payload.variant_id,
        ai_spec_id: payload.ai_spec_id,
        selected_options: payload.selected_options,
        selected_items: payload.selected_items,
      });
      return fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }).then(function (response) {
      return response.json().catch(function () {
        return {};
      }).then(function (data) {
        if (!response.ok || data.error) {
          var message = data.message || (data.error && data.error.message) || '画像生成APIでエラーが発生しました。';
          var error = new Error(message);
          error.userMessage = message;
          throw error;
        }
        if (!data.image_url) {
          var missingImageError = new Error('生成画像を取得できませんでした。');
          missingImageError.userMessage = '生成画像を取得できませんでした。時間をおいて再試行してください。';
          throw missingImageError;
        }
        return {
          image_url: data.image_url,
        message: data.message || '完成イメージを生成しました。',
          model: data.model,
          provider: data.provider,
          generation_time_ms: data.generation_time_ms,
        };
      });
    });
  }

  function setSimulatorGenerating(isGenerating) {
    if (simulatorGenerate) simulatorGenerate.disabled = isGenerating;
    if (simulatorRetry) simulatorRetry.disabled = isGenerating;
    if (simulatorLoading) simulatorLoading.hidden = !isGenerating;
    if (isGenerating && simulatorResult) {
      simulatorResult.textContent = '完成イメージを作成中です…';
    }
  }

  function showSimulatorGenerationError(message) {
    if (simulatorErrorBox) simulatorErrorBox.hidden = false;
    if (simulatorErrorMessage) simulatorErrorMessage.textContent = message || '生成に失敗しました。時間をおいて再試行してください。';
  }

  function hideSimulatorGenerationError() {
    if (simulatorErrorBox) simulatorErrorBox.hidden = true;
    if (simulatorErrorMessage) simulatorErrorMessage.textContent = '';
  }

  function startGardenImageGeneration(input) {
    var generationInput = input || simulatorGenerationInput();
    hideSimulatorGenerationError();
    setSimulatorGenerating(true);

    generateGardenImage(generationInput)
      .then(function (result) {
        simulatorState.lastGeneratedImageUrl = result.image_url || '';
        if (simulatorGeneratedImage) {
          simulatorGeneratedImage.src = result.image_url || HERO_IMAGE;
        }
        if (simulatorGeneratedCaption) {
          simulatorGeneratedCaption.textContent = result.message || '完成イメージの生成が完了しました。';
        }
        if (simulatorResult) {
          simulatorResult.textContent = result.message || '完成イメージを生成しました。';
        }
        updateSimulatorPrompt();
      })
      .catch(function (error) {
        showSimulatorGenerationError(generationErrorMessage(error));
      })
      .finally(function () {
        setSimulatorGenerating(false);
      });
  }

  function updateSimulatorPrompt() {
    if (simulatorCount) {
      simulatorCount.textContent = '選択中：' + simulatorState.selectedItems.length + ' / ' + SIMULATOR_MAX_ITEMS;
    }
    if (simulatorPrompt) {
      simulatorPrompt.value = buildSimulatorPrompt();
    }
    if (simulatorConsultText) {
      simulatorConsultText.value = buildSimulatorConsultText();
    }
  }

  function renderSimulator() {
    renderSimulatorSources();
    updatePlacementReferenceImage();
    renderSampleGardens();
    renderSimulatorScenes();
    renderSimulatorItems();
    renderCarportBlock();
    renderSimulatorPlacements();
    renderSimulatorPriceSummary();
    updateSimulatorPrompt();
  }

  function toggleSimulatorItem(item) {
    var index = simulatorState.selectedItems.indexOf(item);
    if (index !== -1) {
      simulatorState.selectedItems.splice(index, 1);
      delete simulatorState.placements[item];
      if (simulatorLimitMessage) simulatorLimitMessage.textContent = '';
      renderSimulator();
      return;
    }
    if (simulatorState.selectedItems.length >= SIMULATOR_MAX_ITEMS) {
      if (simulatorLimitMessage) simulatorLimitMessage.textContent = '選択できるのは最大5個までです';
      return;
    }
    simulatorState.selectedItems.push(item);
    simulatorState.placements[item] = [];
    if (simulatorLimitMessage) simulatorLimitMessage.textContent = '';
    renderSimulator();
  }

  function copySimulatorPrompt() {
    if (!simulatorPrompt) return;
    var value = simulatorPrompt.value;
    var copied = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(function () {
        if (simulatorResult) simulatorResult.textContent = '指示文をコピーしました。';
      }).catch(function () {
        simulatorPrompt.select();
        document.execCommand('copy');
        if (simulatorResult) simulatorResult.textContent = '指示文をコピーしました。';
      });
      copied = true;
    }
    if (!copied) {
      simulatorPrompt.select();
      document.execCommand('copy');
      if (simulatorResult) simulatorResult.textContent = '指示文をコピーしました。';
    }
  }

  function copyTextToClipboard(value, callback) {
    var fallbackCopy = function () {
      var helper = document.createElement('textarea');
      helper.value = value;
      helper.setAttribute('readonly', '');
      helper.style.position = 'fixed';
      helper.style.top = '-999px';
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      document.body.removeChild(helper);
      if (callback) callback();
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(function () {
        if (callback) callback();
      }).catch(fallbackCopy);
      return;
    }
    fallbackCopy();
  }

  function initSimulator() {
    simulatorJumpLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        var target = document.getElementById('template01-showroom');
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    if (!legacySimulatorEnabled || !simulatorItemList || !simulatorPrompt) return;
    if (simulatorGeneratedWatermark) {
      simulatorGeneratedWatermark.textContent = SIMULATOR_CONFIG.watermark || 'Garden Living by EXた組';
    }
    renderSimulator();

    simulatorSourceInputs.forEach(function (input) {
      input.addEventListener('change', function () {
        simulatorState.source = input.value;
        if (simulatorResult) simulatorResult.textContent = '';
        renderSimulator();
      });
    });

    if (gardenPhotoInput) {
      gardenPhotoInput.addEventListener('change', function () {
        var file = gardenPhotoInput.files && gardenPhotoInput.files[0];
        if (!file) return;
        simulatorState.uploadedName = file.name;
        if (simulatorUploadName) simulatorUploadName.textContent = file.name;
        if (simulatorUploadPreview) {
          var img = simulatorUploadPreview.querySelector('img');
          if (img) {
            if (simulatorState.uploadedImageUrl) URL.revokeObjectURL(simulatorState.uploadedImageUrl);
            simulatorState.uploadedImageUrl = URL.createObjectURL(file);
            img.src = simulatorState.uploadedImageUrl;
          }
          simulatorUploadPreview.hidden = false;
        }
        updateSimulatorPrompt();
        updatePlacementReferenceImage();
      });
    }

    if (sampleGardenGrid) {
      sampleGardenGrid.addEventListener('click', function (event) {
        var button = event.target.closest('.sample-garden-card');
        if (!button) return;
        simulatorState.selectedSample = button.dataset.sampleId || SAMPLE_GARDENS[0].id;
        renderSimulator();
      });
    }

    if (simulatorSceneList) {
      simulatorSceneList.addEventListener('click', function (event) {
        var button = event.target.closest('.scene-choice');
        if (!button) return;
        simulatorState.scene = button.dataset.scene || '裏庭';
        renderSimulator();
      });
    }

    if (carportEnabled) {
      carportEnabled.addEventListener('change', function () {
        simulatorState.selectedCarport.enabled = carportEnabled.checked;
        if (simulatorState.selectedCarport.enabled) {
          simulatorState.scene = '前庭・駐車場';
        }
        renderSimulator();
      });
    }

    [
      [carportSize, 'size'],
      [carportHeight, 'height'],
      [carportBodyColor, 'body_color'],
      [carportRoof, 'roof_material'],
      [carportDrainage, 'drainage_direction'],
    ].forEach(function (pair) {
      var input = pair[0];
      var key = pair[1];
      if (!input) return;
      input.addEventListener('change', function () {
        simulatorState.selectedCarport.options[key] = input.value;
        var variant = findCarportVariant();
        if (variant) simulatorState.selectedCarport.variant_id = variant.variant_id;
        renderSimulator();
      });
    });

    simulatorItemList.addEventListener('click', function (event) {
      var button = event.target.closest('.simulator-item');
      if (!button) return;
      toggleSimulatorItem(button.dataset.item);
    });

    if (simulatorPlacementList) {
      simulatorPlacementList.addEventListener('click', function (event) {
        var button = event.target.closest('.placement-area-button');
        if (!button) return;
        var group = button.closest('[data-placement-item]');
        if (!group) return;
        var item = group.dataset.placementItem;
        var area = button.dataset.area || '';
        simulatorState.placements[item] = area ? [area] : [];
        renderSimulatorPlacements();
        updateSimulatorPrompt();
      });
    }

    if (simulatorCopy) {
      simulatorCopy.addEventListener('click', copySimulatorPrompt);
    }

    if (simulatorCopyConsult) {
      simulatorCopyConsult.addEventListener('click', function () {
        copyTextToClipboard(buildSimulatorConsultText(), function () {
          if (simulatorConsultResult) simulatorConsultResult.textContent = '相談内容をコピーしました';
        });
      });
    }

    if (simulatorLineConsult) {
      simulatorLineConsult.href = LINE_URL || '#contact';
    }

    if (simulatorGeneratedImageWrap) {
      simulatorGeneratedImageWrap.addEventListener('contextmenu', function (event) {
        event.preventDefault();
      });
      simulatorGeneratedImageWrap.addEventListener('dragstart', function (event) {
        event.preventDefault();
      });
      simulatorGeneratedImageWrap.addEventListener('selectstart', function (event) {
        event.preventDefault();
      });
    }

    if (simulatorGenerate) {
      simulatorGenerate.addEventListener('click', function () {
        startGardenImageGeneration();
      });
    }

    if (simulatorRetry) {
      simulatorRetry.addEventListener('click', function () {
        startGardenImageGeneration(simulatorState.lastGenerationInput || simulatorGenerationInput());
      });
    }
  }

  function initTemplate01Showroom() {
    var root = document.getElementById('template01-showroom');
    if (!root) return;

    var preview = document.getElementById('template01-preview-image');
    var caption = document.getElementById('template01-preview-caption');
    var imageNote = document.getElementById('template01-image-note');
    var afterThumb = document.getElementById('template01-after-thumb');
    var turfInput = document.getElementById('template01-turf');
    var tileEnabled = document.getElementById('template01-tile-enabled');
    var tileColor = document.getElementById('template01-tile-color');
    var tileSize = document.getElementById('template01-tile-size');
    var tileStep = document.getElementById('template01-tile-step');
    var fenceSelect = document.getElementById('template01-fence');
    var furnitureInput = document.getElementById('template01-furniture');
    var pizzaInput = document.getElementById('template01-pizza');
    var totalPrice = document.getElementById('template01-total-price');
    var selectedList = document.getElementById('template01-selected-list');
    var consultText = document.getElementById('template01-consult-text');
    var copyConsult = document.getElementById('template01-copy-consult');
    var copyResult = document.getElementById('template01-copy-result');
    var lineConsult = document.getElementById('template01-line-consult');
    var presetButtons = Array.prototype.slice.call(root.querySelectorAll('[data-template01-preset]'));
    var controlCards = {
      turf: document.getElementById('template01-card-turf'),
      tile: document.getElementById('template01-card-tile'),
      fence: document.getElementById('template01-card-fence'),
      furniture: document.getElementById('template01-card-furniture'),
      pizza: document.getElementById('template01-card-pizza'),
    };

    var IMAGE_BASE = 'images/templates/template01/';
    var SHOWROOM_BASE = IMAGE_BASE + 'showroom/';
    var TEMPLATE01_IMAGES = {
      before: IMAGE_BASE + 'template01-before.jpg',
      turf: IMAGE_BASE + 'template01-turf-after.jpg',
      soilPizza: SHOWROOM_BASE + 'soil-pizza.jpg',
      soilFence: SHOWROOM_BASE + 'soil-fence.jpg',
      turfFence: SHOWROOM_BASE + 'turf-fence.jpg',
      turfDogrunFence: SHOWROOM_BASE + 'turf-dogrun-fence.jpg',
      turfFencePizza: SHOWROOM_BASE + 'turf-fence-pizza.jpg',
      turfTileFurniture: SHOWROOM_BASE + 'turf-tile-furniture.jpg',
      turfTileFurniturePizza: SHOWROOM_BASE + 'turf-tile-furniture-pizza.jpg',
      fullCalm: SHOWROOM_BASE + 'full-calm.jpg',
    };

    var TEMPLATE01_PRICE = {
      turf: 180000,
      furniture: 120000,
      pizza: 230000,
      fence: {
        straight: 220000,
        dogrun: 360000,
      },
      tile: {
        natural: {
          standard: { one: 320000, two: 390000 },
          wide: { one: 460000, two: 540000 },
        },
        greige: {
          standard: { one: 340000, two: 410000 },
          wide: { one: 480000, two: 560000 },
        },
      },
    };

    var stateTemplate = {
      turf: false,
      tile: {
        enabled: false,
        color: 'natural',
        size: 'standard',
        step: 'one',
      },
      fence: 'none',
      furniture: false,
      pizza: false,
    };

    function yen(value) {
      return '￥' + Number(value || 0).toLocaleString('ja-JP');
    }

    function tileLabel() {
      var color = stateTemplate.tile.color === 'greige' ? 'グレージュ' : 'ナチュラルベージュ';
      var size = stateTemplate.tile.size === 'wide' ? '広めサイズ' : '標準サイズ';
      var step = stateTemplate.tile.step === 'two' ? '本体＋ステップ' : '1段';
      return color + ' / ' + size + ' / ' + step;
    }

    function tilePrice() {
      if (!stateTemplate.tile.enabled) return 0;
      return TEMPLATE01_PRICE.tile[stateTemplate.tile.color][stateTemplate.tile.size][stateTemplate.tile.step] || 0;
    }

    function selectedItems() {
      var items = [];
      if (stateTemplate.turf) {
        items.push({ key: 'turf', label: '人工芝', detail: '固定After素材', price: TEMPLATE01_PRICE.turf });
      }
      if (stateTemplate.tile.enabled) {
        items.push({ key: 'tile', label: 'タイルデッキ', detail: tileLabel(), price: tilePrice() });
      }
      if (stateTemplate.fence !== 'none') {
        items.push({
          key: 'fence',
          label: 'アメリカンフェンス',
          detail: stateTemplate.fence === 'dogrun' ? 'ドッグラン向け囲い＋ゲート' : '直線フェンス',
          price: TEMPLATE01_PRICE.fence[stateTemplate.fence] || 0,
        });
      }
      if (stateTemplate.furniture) {
        items.push({ key: 'furniture', label: 'ガーデンファニチャー', detail: 'ダイニングテーブル＋チェア', price: TEMPLATE01_PRICE.furniture });
      }
      if (stateTemplate.pizza) {
        items.push({ key: 'pizza', label: 'ピザ窯', detail: 'レンガ造り・アーチ型・薪収納付き', price: TEMPLATE01_PRICE.pizza });
      }
      return items;
    }

    function chooseImage() {
      var turf = stateTemplate.turf;
      var tile = stateTemplate.tile.enabled;
      var fence = stateTemplate.fence !== 'none';
      var dogrun = stateTemplate.fence === 'dogrun';
      var furniture = stateTemplate.furniture;
      var pizza = stateTemplate.pizza;

      if (!turf && !tile && !fence && !furniture && !pizza) {
        return { src: TEMPLATE01_IMAGES.before, label: 'Before（土の庭）', exact: true, note: '' };
      }
      if (turf && tile && furniture && fence && pizza) {
        return { src: TEMPLATE01_IMAGES.fullCalm, label: '人工芝＋タイルデッキ＋フェンス＋家具＋ピザ窯', exact: true, note: '' };
      }
      if (turf && tile && furniture && pizza && !fence) {
        return { src: TEMPLATE01_IMAGES.turfTileFurniturePizza, label: '人工芝＋タイルデッキ＋家具＋ピザ窯', exact: true, note: '' };
      }
      if (turf && fence && pizza && !tile && !furniture) {
        return { src: TEMPLATE01_IMAGES.turfFencePizza, label: '人工芝＋アメリカンフェンス＋ピザ窯', exact: true, note: '' };
      }
      if (turf && dogrun && !tile && !furniture && !pizza) {
        return { src: TEMPLATE01_IMAGES.turfDogrunFence, label: '人工芝＋ドッグラン向け囲い', exact: true, note: '' };
      }
      if (turf && fence && !tile && !furniture && !pizza) {
        return { src: TEMPLATE01_IMAGES.turfFence, label: '人工芝＋アメリカンフェンス', exact: true, note: '' };
      }
      if (turf && tile && furniture && !fence && !pizza) {
        return { src: TEMPLATE01_IMAGES.turfTileFurniture, label: '人工芝＋タイルデッキ＋家具', exact: true, note: '' };
      }
      if (!turf && !tile && fence && !furniture && !pizza) {
        return { src: TEMPLATE01_IMAGES.soilFence, label: '土＋アメリカンフェンス', exact: true, note: '' };
      }
      if (!turf && !tile && !fence && !furniture && pizza) {
        return { src: TEMPLATE01_IMAGES.soilPizza, label: '土＋ピザ窯', exact: true, note: '' };
      }
      if (turf && !tile && !fence && !furniture && !pizza) {
        return { src: TEMPLATE01_IMAGES.turf, label: '人工芝', exact: true, note: '' };
      }
      return {
        src: TEMPLATE01_IMAGES.before,
        label: '個別イメージ未制作',
        exact: false,
        note: 'この組み合わせの個別完成イメージは未制作です。選択内容は相談文に反映されます。',
      };
    }

    function total() {
      return selectedItems().reduce(function (sum, item) {
        return sum + item.price;
      }, 0);
    }

    function buildConsult() {
      var items = selectedItems();
      var lines = [
        '【Garden Living 展示場1号 相談】',
        '',
        'テンプレート：Template01 標準的な建売住宅の裏庭',
        '表示画像：' + chooseImage().label,
        '',
        '選択商品：',
      ];

      if (!items.length) {
        lines.push('・未選択（外構前の土の庭）');
      } else {
        items.forEach(function (item) {
          lines.push('・' + item.label + ' / ' + item.detail + ' / ' + yen(item.price));
        });
      }

      lines = lines.concat([
        '',
        '商品代合計（税込参考）：' + yen(total()),
        '',
        chooseImage().exact ? '' : '※この組み合わせの個別完成イメージは未制作です。相談時に内容確認します。',
        '',
        '※設置費・基礎工事・運搬費等は含まれておりません。',
        '※正式なご提案・お見積りは現地確認後となります。',
        '',
        'この内容で相談したいです。',
      ]);
      return lines.join('\n');
    }

    function syncInputs() {
      if (turfInput) turfInput.checked = stateTemplate.turf;
      if (tileEnabled) tileEnabled.checked = stateTemplate.tile.enabled;
      if (tileColor) tileColor.value = stateTemplate.tile.color;
      if (tileSize) tileSize.value = stateTemplate.tile.size;
      if (tileStep) tileStep.value = stateTemplate.tile.step;
      if (fenceSelect) fenceSelect.value = stateTemplate.fence;
      if (furnitureInput) furnitureInput.checked = stateTemplate.furniture;
      if (pizzaInput) pizzaInput.checked = stateTemplate.pizza;
      if (tileColor) tileColor.disabled = !stateTemplate.tile.enabled;
      if (tileSize) tileSize.disabled = !stateTemplate.tile.enabled;
      if (tileStep) tileStep.disabled = !stateTemplate.tile.enabled;
      var tileOptions = document.getElementById('template01-tile-options');
      if (tileOptions) tileOptions.classList.toggle('is-disabled', !stateTemplate.tile.enabled);
      if (controlCards.turf) controlCards.turf.classList.toggle('is-selected', stateTemplate.turf);
      if (controlCards.tile) controlCards.tile.classList.toggle('is-selected', stateTemplate.tile.enabled);
      if (controlCards.fence) controlCards.fence.classList.toggle('is-selected', stateTemplate.fence !== 'none');
      if (controlCards.furniture) controlCards.furniture.classList.toggle('is-selected', stateTemplate.furniture);
      if (controlCards.pizza) controlCards.pizza.classList.toggle('is-selected', stateTemplate.pizza);
    }

    function updatePresetActive(activePreset) {
      presetButtons.forEach(function (button) {
        button.classList.toggle('is-active', button.dataset.template01Preset === activePreset);
      });
    }

    function renderTemplate01(activePreset) {
      var started = performance && performance.now ? performance.now() : Date.now();
      var image = chooseImage();
      var items = selectedItems();
      var totalValue = total();
      syncInputs();

      if (preview) {
        preview.src = image.src;
        preview.alt = 'Template01 ' + image.label;
      }
      if (afterThumb) afterThumb.src = image.src;
      if (caption) caption.textContent = image.label;
      if (imageNote) {
        imageNote.textContent = image.note || '';
        imageNote.classList.toggle('is-visible', !image.exact && !!image.note);
      }
      if (totalPrice) totalPrice.textContent = yen(totalValue);
      if (selectedList) {
        selectedList.innerHTML = items.length
          ? items.map(function (item) {
            return '<li><span>' + item.label + '<small> ' + item.detail + '</small></span><strong>' + yen(item.price) + '</strong></li>';
          }).join('')
          : '<li><span>商品未選択</span><strong>' + yen(0) + '</strong></li>';
      }
      if (consultText) consultText.value = buildConsult();
      updatePresetActive(activePreset || '');
      if (copyResult) copyResult.textContent = '';
      window.__template01LastSwitchMs = Math.round((performance && performance.now ? performance.now() : Date.now()) - started);
    }

    function setPreset(name) {
      stateTemplate.turf = false;
      stateTemplate.tile.enabled = false;
      stateTemplate.tile.color = 'natural';
      stateTemplate.tile.size = 'standard';
      stateTemplate.tile.step = 'one';
      stateTemplate.fence = 'none';
      stateTemplate.furniture = false;
      stateTemplate.pizza = false;

      if (name === 'family') {
        stateTemplate.turf = true;
        stateTemplate.tile.enabled = true;
        stateTemplate.tile.size = 'wide';
        stateTemplate.tile.step = 'two';
        stateTemplate.furniture = true;
      }
      if (name === 'dogrun') {
        stateTemplate.turf = true;
        stateTemplate.fence = 'dogrun';
      }
      if (name === 'pizza') {
        stateTemplate.pizza = true;
      }
      renderTemplate01(name);
    }

    function bindInput(input, handler) {
      if (!input) return;
      input.addEventListener('change', function () {
        handler();
        renderTemplate01('');
      });
    }

    bindInput(turfInput, function () { stateTemplate.turf = !!turfInput.checked; });
    bindInput(tileEnabled, function () { stateTemplate.tile.enabled = !!tileEnabled.checked; });
    bindInput(tileColor, function () { stateTemplate.tile.color = tileColor.value || 'natural'; });
    bindInput(tileSize, function () { stateTemplate.tile.size = tileSize.value || 'standard'; });
    bindInput(tileStep, function () { stateTemplate.tile.step = tileStep.value || 'one'; });
    bindInput(fenceSelect, function () { stateTemplate.fence = fenceSelect.value || 'none'; });
    bindInput(furnitureInput, function () { stateTemplate.furniture = !!furnitureInput.checked; });
    bindInput(pizzaInput, function () { stateTemplate.pizza = !!pizzaInput.checked; });

    presetButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        setPreset(button.dataset.template01Preset || 'reset');
      });
    });

    if (copyConsult) {
      copyConsult.addEventListener('click', function () {
        copyTextToClipboard(buildConsult(), function () {
          if (copyResult) copyResult.textContent = '相談内容をコピーしました';
        });
      });
    }

    if (lineConsult) {
      lineConsult.href = LINE_URL || lineConsult.href || '#contact';
    }

    renderTemplate01('reset');
  }

  Promise.allSettled([
    loadJson(PRODUCT_SOURCES),
    loadJson(G20_SOURCES),
    loadOptionalJson(EXTERIOR_SOURCES.products, { products: [] }),
    loadOptionalJson(EXTERIOR_SOURCES.aiSpecs, { specs: [] }),
    loadOptionalJson(EXTERIOR_SOURCES.options, { option_groups: [] }),
    loadOptionalJson(EXTERIOR_SOURCES.prices, { price_matrices: [] }),
  ])
    .then(function (results) {
      var oldData = results[0].status === 'fulfilled' ? results[0].value : {};
      var g20Data = results[1].status === 'fulfilled' ? results[1].value : {};
      var exteriorData = results[2].status === 'fulfilled' ? results[2].value : {};
      var aiSpecData = results[3].status === 'fulfilled' ? results[3].value : {};
      var optionData = results[4].status === 'fulfilled' ? results[4].value : {};
      var priceData = results[5].status === 'fulfilled' ? results[5].value : {};
      var oldProducts = (Array.isArray(oldData.products) ? oldData.products : [])
        .filter(oldProductIsPublished)
        .map(convertOldProduct);
      var g20Products = (Array.isArray(g20Data.products) ? g20Data.products : [])
        .filter(publishedG20)
        .map(convertG20Product);
      state.savedIds = readSavedIds();
      state.exteriorProducts = Array.isArray(exteriorData.products) ? exteriorData.products : [];
      state.exteriorSpecs = Array.isArray(aiSpecData.specs) ? aiSpecData.specs : [];
      state.exteriorOptionGroups = Array.isArray(optionData.option_groups) ? optionData.option_groups : [];
      state.exteriorPriceMatrices = Array.isArray(priceData.price_matrices) ? priceData.price_matrices : [];
      state.products = dedupe(oldProducts.concat(g20Products));
      renderHero();
      bindSearch();
      bindProductActions();
      initSimulator();
      initTemplate01Showroom();
      renderAll();
      if (loadStatus) {
        loadStatus.textContent = state.products.length + '件の商品を読み込みました。';
        window.setTimeout(function () { loadStatus.classList.add('is-hidden'); }, 1600);
      }
      console.info('[Garden Living] loaded shop products:', state.products.length);
    })
    .catch(function (error) {
      if (loadStatus) loadStatus.textContent = '商品を読み込めませんでした。';
      if (resultCount) resultCount.textContent = '商品を読み込めませんでした。';
      console.error('[Garden Living] product load failed', error);
    });
})();
