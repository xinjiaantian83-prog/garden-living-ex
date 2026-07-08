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
  var sampleGardenGrid = document.getElementById('sample-garden-grid');

  var PRODUCT_SOURCES = [];
  var G20_SOURCES = ['json/g20-material-candidates.json'];
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
    title: 'AIガーデンシミュレーター β版',
    description: 'お庭の写真をもとに、ピザ窯・タイルデッキ・人工芝などを配置した完成イメージを作成できます。',
    watermark: 'Garden Living by EXた組',
    lineUrl: 'https://line.me/R/ti/p/@953wnidc',
    consultTitle: '【Garden Living AIシミュレーター相談】',
    concept: '庭で過ごす時間、アウトドアリビング、ピザ窯、サウナ、ドッグランなど',
    promptPolicy: '既存の建物・窓・外壁・敷地形状はできるだけ維持し、現実的な外構施工として違和感のない完成イメージにしてください。写真全体の明るさ、素材感、植栽の自然さを整え、Garden Livingらしい温かい庭時間が伝わる雰囲気にしてください。',
    maxItems: 5,
    priceMaster: window.GARDEN_SIMULATOR_PRICE_MASTER || window.GARDEN_LIVING_ITEM_PRICE_MASTER || {},
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

  function buildSimulatorPrompt() {
    var selected = simulatorState.selectedItems;
    var itemText = selected.length
      ? selected.map(function (item) {
        return areaPromptText(item, simulatorState.placements[item]);
      }).join('、') + '配置してください。'
      : '必要な庭アイテムを自然に提案して配置してください。';

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
    if (!simulatorState.selectedItems.length) {
      simulatorSelectedPriceList.innerHTML = '<p class="empty-message">商品を選ぶと、参考価格が表示されます。</p>';
      simulatorTotalPrice.textContent = '¥0';
      return;
    }

    var total = 0;
    simulatorSelectedPriceList.innerHTML = simulatorState.selectedItems.map(function (item) {
      var price = simulatorItemPrice(item);
      if (price !== null) total += price;
      return '<div class="selected-price-row">' +
        '<span>' + escapeHtml(item) + '</span>' +
        '<strong>' + escapeHtml(formatSimulatorYen(price)) + '</strong>' +
      '</div>';
    }).join('');
    simulatorTotalPrice.textContent = formatSimulatorYen(total);
  }

  function simulatorTotalAmount() {
    return simulatorState.selectedItems.reduce(function (sum, item) {
      var price = simulatorItemPrice(item);
      return sum + (price !== null ? price : 0);
    }, 0);
  }

  function buildSimulatorConsultText() {
    var selectedLines = simulatorState.selectedItems.length
      ? simulatorState.selectedItems.map(function (item) {
        var placement = areaDisplay(simulatorState.placements[item]);
        return '・' + item + '　配置：' + placement + '　' + formatSimulatorYen(simulatorItemPrice(item));
      }).join('\n')
      : '・未選択';

    return (SIMULATOR_CONFIG.consultTitle || '【AIガーデンシミュレーター相談】') + '\n\n' +
      'シーン：' + simulatorState.scene + '\n' +
      '使用写真：' + consultPhotoLabel() + '\n\n' +
      '選択商品：\n' + selectedLines + '\n\n' +
      '商品代合計（税込参考）：' + formatSimulatorYen(simulatorTotalAmount()) + '\n\n' +
      '※施工費・基礎工事・運搬費等は含まれていません。\n\n' +
      'AI生成用指示文：\n' + buildSimulatorPrompt() + '\n\n' +
      'この内容で相談したいです。';
  }

  function simulatorSourceImage() {
    if (simulatorState.source === 'sample') return simulatorSample().image;
    return simulatorState.uploadedImageUrl || HERO_IMAGE;
  }

  function simulatorGenerationInput() {
    return {
      image_url: simulatorSourceImage(),
      image_source: simulatorState.source,
      simulator_id: SIMULATOR_CONFIG.id || 'garden-simulator',
      prompt: buildSimulatorPrompt(),
      selected_items: simulatorState.selectedItems.slice(),
      placements: Object.assign({}, simulatorState.placements),
      scene: simulatorState.scene,
    };
  }

  function generateGardenImage(input) {
    simulatorState.lastGenerationInput = input;

    // ここに画像生成APIを接続
    // TODO: Generation logging
    // input.image_url / input.prompt / input.selected_items / input.placements / input.scene を送信し、
    // 返却された画像URLまたはBase64画像を result.image_url として表示する想定です。
    return new Promise(function (resolve) {
      window.setTimeout(function () {
        resolve({
          image_url: input.image_url || HERO_IMAGE,
          message: 'API未接続のため、選択した写真を仮の完成イメージとして表示しています。',
        });
      }, 1800);
    });
  }

  function setSimulatorGenerating(isGenerating) {
    if (simulatorGenerate) simulatorGenerate.disabled = isGenerating;
    if (simulatorRetry) simulatorRetry.disabled = isGenerating;
    if (simulatorLoading) simulatorLoading.hidden = !isGenerating;
    if (isGenerating && simulatorResult) {
      simulatorResult.textContent = 'AIが完成イメージを作成中です…';
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
        if (simulatorGeneratedImage) {
          simulatorGeneratedImage.src = result.image_url || HERO_IMAGE;
        }
        if (simulatorGeneratedCaption) {
          simulatorGeneratedCaption.textContent = result.message || '完成イメージの生成が完了しました。';
        }
        if (simulatorResult) {
          simulatorResult.textContent = '仮の完成イメージを表示しました。API接続後はここに生成画像が表示されます。';
        }
      })
      .catch(function () {
        showSimulatorGenerationError('生成に失敗しました。時間をおいて再試行してください。');
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
    if (!simulatorItemList || !simulatorPrompt) return;
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

  Promise.allSettled([loadJson(PRODUCT_SOURCES), loadJson(G20_SOURCES)])
    .then(function (results) {
      var oldData = results[0].status === 'fulfilled' ? results[0].value : {};
      var g20Data = results[1].status === 'fulfilled' ? results[1].value : {};
      var oldProducts = (Array.isArray(oldData.products) ? oldData.products : [])
        .filter(oldProductIsPublished)
        .map(convertOldProduct);
      var g20Products = (Array.isArray(g20Data.products) ? g20Data.products : [])
        .filter(publishedG20)
        .map(convertG20Product);
      state.savedIds = readSavedIds();
      state.products = dedupe(oldProducts.concat(g20Products));
      renderHero();
      bindSearch();
      bindProductActions();
      initSimulator();
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
