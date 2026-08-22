const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const base = 'https://gardenliving-ex.net';
const lineUrl = 'https://lin.ee/sQNwZUv';

const products = [
  {slug:'fence-900x900',name:'アメリカンフェンス 900×900',sku:'ST2-OAMF09',price:'14,256',rawPrice:'14256',image:'american-fence-panel-900x900-product.jpg',use:'低めの庭囲い、ドッグラン、店舗什器などに使いやすい完成品パネルです。',parts:'設置にはポール、ジョイント、基礎・固定部材が必要です。',related:['post-h1500','joint']},
  {slug:'fence-1500x900',name:'アメリカンフェンス 1500×900',sku:'ST2-OAMF15',price:'18,304',rawPrice:'18304',image:'american-fence-panel-1500x900-product.jpg',use:'横張り・縦張りに対応し、庭囲い、ガレージ、店舗外構に使える完成品パネルです。',parts:'施工方向に合うポール、ジョイント、基礎・固定部材が必要です。',related:['post-h1500','post-h2000','joint']},
  {slug:'post-h1500',name:'アメリカンフェンス ポール H1500',sku:'ST2-OAMP15',price:'6,864',rawPrice:'6864',image:'american-fence-pole-h1500-h2000-product.jpg',use:'φ32×1500mm。主に横張り構成の支柱として使用します。',parts:'パネルとの接続にはジョイントが必要です。設置条件に合う基礎・固定方法をご確認ください。',related:['fence-1500x900','joint']},
  {slug:'post-h2000',name:'アメリカンフェンス ポール H2000',sku:'ST2-OAMP20',price:'8,448',rawPrice:'8448',image:'american-fence-pole-h1500-h2000-product.jpg',use:'φ32×2000mm。主に縦張り構成の支柱として使用します。',parts:'パネルとの接続にはジョイントが必要です。設置条件に合う基礎・固定方法をご確認ください。',related:['fence-1500x900','joint']},
  {slug:'joint',name:'アメリカンフェンス ジョイント',sku:'ST2-OAMJNT',price:'1,496',rawPrice:'1496',image:'american-fence-joint-product.jpg',use:'パネルとポールを固定する接続部材です。約40×133mm。',parts:'必要数はパネルの張り方向と枚数で変わります。自動見積もりでまとめて確認できます。',related:['fence-900x900','fence-1500x900']},
  {slug:'hinge',name:'アメリカンフェンス ヒンジ',sku:'ST2-OAMHNJ',price:'1,936',rawPrice:'1936',image:'american-fence-hinge-product.jpg',use:'フェンスパネルを片開き門扉として使用する際の可動部材です。',parts:'門扉構成にはヒンジに加え、ドアラッチ、パネル、ポール等が必要です。',related:['door-latch','fence-900x900']},
  {slug:'door-latch',name:'アメリカンフェンス ドアラッチ',sku:'ST2-OAMDRL',price:'1,760',rawPrice:'1760',image:'american-fence-door-latch-product.jpg',use:'片開き門扉の開閉部を留めるための部材です。',parts:'門扉構成にはドアラッチに加え、ヒンジ、パネル、ポール等が必要です。',related:['hinge','fence-900x900']},
];

const uses = [
  {slug:'dog-run',title:'アメリカンフェンスで作るドッグラン',image:'dogrun.jpg',desc:'愛犬の飛び出しを防ぎながら、圧迫感を抑えた屋外スペースを作りたい方向けです。',points:['犬の大きさとジャンプ力に合わせて高さを選ぶ','扉の位置と開閉方向を先に決める','足元の隙間と基礎の安定を確認する'],links:['fence-900x900','fence-1500x900','hinge','door-latch']},
  {slug:'garden-enclosure',title:'庭囲いに合うアメリカンフェンス',image:'garden-family.jpg',desc:'庭の見通しを残しながら、敷地の区切りや子どもの遊び場を整えたい方向けです。',points:['道路側からの見え方と必要な高さを確認する','植栽や動線を妨げないパネル割りにする','出入口が必要なら門扉部材を含める'],links:['fence-900x900','fence-1500x900','post-h1500']},
  {slug:'parking',title:'駐車場まわりのアメリカンフェンス',image:'american-fence-panel-1500x900-installation-02.jpg',desc:'駐車スペースと庭の境界を分け、車の出入りを妨げずに外構の印象を整えたい方向けです。',points:['車のドア開閉と切り返し寸法を確保する','道路境界や視界を遮らない高さにする','車止めや門扉との干渉を確認する'],links:['fence-900x900','post-h1500','joint']},
  {slug:'garage',title:'ガレージに映えるアメリカンフェンス',image:'garage.jpg',desc:'工具掛け、仕切り、ディスプレイなど、ガレージの無骨な雰囲気を活かしたい方向けです。',points:['壁面利用か自立設置かを決める','工具や看板の荷重を考慮する','動線を確保してパネル寸法を選ぶ'],links:['fence-900x900','fence-1500x900','joint']},
  {slug:'shop',title:'店舗に使うアメリカンフェンス',image:'shop.jpg',desc:'店舗の外構、売場の仕切り、商品ディスプレイをアメリカンテイストでまとめたい方向けです。',points:['お客様の通路幅と安全性を優先する','サインや小物を掛ける位置を決める','屋外設置では転倒防止を確実に行う'],links:['fence-900x900','fence-1500x900','post-h1500']},
  {slug:'west-coast-exterior',title:'西海岸風・アメリカン外構の作り方',image:'american-fence-usage-image-02.jpg',desc:'メッシュの抜け感と金属の素材感を活かし、西海岸風の外構や庭を作りたい方向けです。',points:['植栽・砂利・サインと素材感を揃える','見せる場所と囲う場所を分ける','フェンスの高さを揃えて外観を整える'],links:['fence-1500x900','fence-900x900','post-h2000']},
  {slug:'diy-fence',title:'DIYでアメリカンフェンスを設置したい方へ',image:'american-fence-panel-1500x900-installation-01.jpg',desc:'必要なパネルと部材を自分で選び、全国配送で購入したい方向けの確認ポイントをまとめました。',points:['設置形状と各辺の寸法を測る','パネル・ポール・ジョイントの数量を確認する','地面と風当たりに合う固定方法を選ぶ'],links:['fence-900x900','fence-1500x900','joint']},
];

const imageBase = '/images/products/american-fence/official/';
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const productBySlug = Object.fromEntries(products.map(p=>[p.slug,p]));
const org = {"@context":"https://schema.org","@type":"Organization","@id":`${base}/#organization`,name:'EXた組',url:'https://ex-takumi.net/',brand:{"@type":"Brand",name:'Garden Living',url:`${base}/`}};

function shell({title,description,canonical,image,body,jsonLd,type='website'}){
  const data = Array.isArray(jsonLd)?jsonLd:[org,jsonLd].filter(Boolean);
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="${type}"><meta property="og:url" content="${canonical}"><meta property="og:site_name" content="Garden Living"><meta property="og:image" content="${image}"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${JSON.stringify(data)}</script><link rel="stylesheet" href="/seo-pages.css"><script src="/analytics.js"></script></head><body><header class="site-header"><div class="header-inner"><a class="brand" href="/">Garden Living</a><nav class="nav"><a href="/products/">商品一覧</a><a href="/uses/">用途から選ぶ</a><a href="/#estimateInput">自動見積</a></nav></div></header>${body}<footer class="site-footer">運営：EXた組｜<a href="/legal/">特定商取引法に基づく表記</a>｜<a href="/returns/">返品・交換</a></footer></body></html>`;
}

function relatedCards(slugs){return slugs.map(slug=>{const p=productBySlug[slug];return `<article class="card"><h3>${esc(p.name)}</h3><p>${esc(p.sku)}｜税込 ${p.price}円</p><a class="text-link" href="/products/${p.slug}/">商品詳細を見る</a></article>`}).join('')}

function productPage(p){
  const canonical=`${base}/products/${p.slug}/`, image=`${base}${imageBase}${p.image}`;
  const desc=`OnlyOne Club ${p.name}（${p.sku}）を1点から全国配送。販売価格は税込${p.price}円。用途、必要部材、自動見積・LINE相談をご案内します。`;
  const ld={"@context":"https://schema.org","@type":"Product",name:`OnlyOne Club ${p.name}`,sku:p.sku,brand:{"@type":"Brand",name:'OnlyOne Club'},image,description:desc,offers:{"@type":"Offer",url:canonical,priceCurrency:'JPY',price:p.rawPrice,seller:{"@type":"Organization",name:'Garden Living'}}};
  const body=`<main class="page"><nav class="breadcrumbs"><a href="/">トップ</a> / <a href="/products/">商品一覧</a> / ${esc(p.name)}</nav><section class="hero"><div><p class="eyebrow">ONLYONE CLUB / AMERICAN FENCE</p><h1>${esc(p.name)}</h1><p class="lead">${esc(p.use)}</p><div class="price-box"><small>Garden Living販売価格・税込／1点</small><div class="price">${p.price}円 <span>送料込（離島・一部地域を除く）</span></div><small>型番 ${esc(p.sku)}</small></div><div class="actions"><a class="btn" href="/#estimateInput">必要数を自動見積</a><a class="btn secondary" href="${lineUrl}" target="_blank" rel="noopener">LINEで購入相談</a></div></div><figure class="hero-media"><img src="${imageBase}${p.image}" alt="OnlyOne Club ${esc(p.name)} ${esc(p.sku)}" width="800" height="800"></figure></section><section class="section"><h2>用途・必要部材</h2><ul class="facts"><li><strong>主な用途</strong>${esc(p.use)}</li><li><strong>必要部材</strong>${esc(p.parts)}</li><li><strong>購入単位</strong>1点から必要数だけ購入できます。</li><li><strong>配送</strong>全国配送。離島・一部地域は事前確認が必要です。</li></ul></section><section class="section"><h2>一緒に確認される商品</h2><div class="grid">${relatedCards(p.related)}</div></section><p class="note section">既存の返品・交換条件が適用されます。屋外設置は、地面・風当たり・境界条件に合う施工方法をご確認ください。</p><section class="cta"><h2>寸法から必要部材を確認</h2><p>設置形状と寸法を入力すると、パネル・ポール・ジョイントの目安を約30秒で確認できます。</p><div class="actions"><a class="btn" href="/#estimateInput">自動見積もりを開く</a></div></section></main>`;
  return shell({title:`${p.name} ${p.sku}・価格｜Garden Living`,description:desc,canonical,image,body,jsonLd:[org,ld]});
}

function usePage(u){
  const canonical=`${base}/uses/${u.slug}/`;
  const imgPath=u.image.includes('american-fence-')?imageBase+u.image:'/images/'+u.image;
  const image=`${base}${imgPath}`;
  const desc=`${u.title}を検討中の方向けに、サイズ選び、必要部材、設置前の確認点、購入・見積方法を現場目線で簡潔に案内します。`;
  const body=`<main class="page"><nav class="breadcrumbs"><a href="/">トップ</a> / <a href="/uses/">用途から選ぶ</a> / ${esc(u.title)}</nav><section class="hero"><div><p class="eyebrow">AMERICAN FENCE IDEAS</p><h1>${esc(u.title)}</h1><p class="lead">${esc(u.desc)}</p><div class="actions"><a class="btn" href="/#estimateInput">寸法から自動見積</a><a class="btn secondary" href="${lineUrl}" target="_blank" rel="noopener">LINEで相談</a></div></div><figure class="hero-media"><img src="${imgPath}" alt="${esc(u.title)}の施工イメージ"></figure></section><section class="section"><h2>計画するときの確認ポイント</h2><ul class="facts">${u.points.map((x,i)=>`<li><strong>POINT ${i+1}</strong>${esc(x)}</li>`).join('')}</ul></section><section class="section"><h2>この用途で確認したい商品</h2><div class="grid">${relatedCards(u.links)}</div></section><section class="cta"><h2>必要数と価格をすぐ確認</h2><p>形状と寸法からパネル構成、必要部材、Garden Living価格を確認できます。</p><div class="actions"><a class="btn" href="/#estimateInput">自動見積もりを始める</a></div></section></main>`;
  const ld={"@context":"https://schema.org","@type":"Article",headline:u.title,description:desc,image,author:{"@id":`${base}/#organization`},publisher:{"@id":`${base}/#organization`},mainEntityOfPage:canonical};
  return shell({title:`${u.title}｜Garden Living`,description:desc,canonical,image,body,jsonLd:[org,ld],type:'article'});
}

function listing(kind){
  const isProducts=kind==='products';
  const items=isProducts?products:uses;
  const title=isProducts?'アメリカンフェンス商品・部材一覧':'アメリカンフェンスを用途から選ぶ';
  const description=isProducts?'OnlyOne Clubアメリカンフェンスのパネル、ポール、ジョイント、ヒンジ、ドアラッチを価格・型番別に確認できます。':'ドッグラン、庭囲い、駐車場、ガレージ、店舗、西海岸風外構、DIYなど目的別にアメリカンフェンスを選べます。';
  const cards=items.map(x=>isProducts?`<article class="card"><h3>${esc(x.name)}</h3><p>${esc(x.sku)}｜税込 ${x.price}円</p><a class="text-link" href="/products/${x.slug}/">商品詳細を見る</a></article>`:`<article class="card"><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p><a class="text-link" href="/uses/${x.slug}/">用途別ガイドを見る</a></article>`).join('');
  const extra=isProducts?`<article class="card"><h3>DIY向け購入</h3><p>単品購入から必要部材の確認まで。</p><a class="text-link" href="/buy/diy/">DIY購入ガイド</a></article><article class="card"><h3>全国配送</h3><p>送料・配送条件を購入前に確認。</p><a class="text-link" href="/shipping/nationwide/">全国配送について</a></article>`:'';
  const body=`<main class="page"><nav class="breadcrumbs"><a href="/">トップ</a> / ${title}</nav><section class="hero copy-only"><div><p class="eyebrow">GARDEN LIVING</p><h1>${title}</h1><p class="lead">${description}</p></div></section><section class="section"><div class="grid">${cards}${extra}</div></section><section class="cta"><h2>どれを選ぶか迷ったら</h2><p>設置寸法から必要部材を自動計算できます。</p><div class="actions"><a class="btn" href="/#estimateInput">自動見積もりを開く</a></div></section></main>`;
  const canonical=`${base}/${kind}/`;
  const itemList={"@context":"https://schema.org","@type":"ItemList",name:title,itemListElement:items.map((x,i)=>({"@type":"ListItem",position:i+1,url:`${canonical}${x.slug}/`}))};
  return shell({title:`${title}｜Garden Living`,description,canonical,image:`${base}/images/hero-1600.jpg`,body,jsonLd:[org,itemList]});
}

function guide(kind){
  const diy=kind==='diy';
  const canonical=diy?`${base}/buy/diy/`:`${base}/shipping/nationwide/`;
  const title=diy?'アメリカンフェンスをDIYで購入する方法':'アメリカンフェンスの全国配送について';
  const desc=diy?'アメリカンフェンスをDIYで設置する方向けに、採寸、商品・部材選び、自動見積、購入相談までを簡潔に案内します。':'Garden Livingのアメリカンフェンス全国配送について、送料、配送前の確認事項、注文までの流れをご案内します。';
  const facts=diy?['設置形状と各辺の寸法を測る','パネルの高さ・張り方向を選ぶ','自動見積でポール・ジョイント数を確認する','LINEまたはメールで配送可否・納期を確認する']:['表示価格は送料込（離島・一部地域を除く）','大型商品のため配送先・搬入条件を事前確認','配送可否と納期は注文確定前にご案内','破損や誤配送は返品・交換条件に沿って対応'];
  const body=`<main class="page"><nav class="breadcrumbs"><a href="/">トップ</a> / ${title}</nav><section class="hero copy-only"><div><p class="eyebrow">BUY & SHIPPING GUIDE</p><h1>${title}</h1><p class="lead">${desc}</p><div class="actions"><a class="btn" href="/#estimateInput">自動見積もりを開く</a><a class="btn secondary" href="${lineUrl}" target="_blank" rel="noopener">LINEで相談</a></div></div></section><section class="section"><h2>${diy?'購入までの4ステップ':'配送前にご確認ください'}</h2><ul class="facts">${facts.map((x,i)=>`<li><strong>${diy?'STEP':'CHECK'} ${i+1}</strong>${x}</li>`).join('')}</ul></section><section class="section"><h2>主な商品</h2><div class="grid">${relatedCards(['fence-900x900','fence-1500x900','joint'])}</div></section><p class="note section">価格・型番・返品条件は各商品ページおよび返品・交換ページをご確認ください。</p></main>`;
  const ld={"@context":"https://schema.org","@type":"WebPage",name:title,description:desc,url:canonical,about:{"@type":"Product",name:'OnlyOne Club アメリカンフェンス'}};
  return shell({title:`${title}｜Garden Living`,description:desc,canonical,image:`${base}/images/hero-1600.jpg`,body,jsonLd:[org,ld]});
}

function write(rel,html){const file=path.join(root,rel,'index.html');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,html)}
write('products',listing('products')); products.forEach(p=>write(`products/${p.slug}`,productPage(p)));
write('uses',listing('uses')); uses.forEach(u=>write(`uses/${u.slug}`,usePage(u)));
write('buy/diy',guide('diy')); write('shipping/nationwide',guide('shipping'));
console.log(`Generated ${products.length+uses.length+4} SEO pages.`);
