(function () {
  'use strict';

  var canvas = document.getElementById('composite-canvas');
  var ctx = canvas.getContext('2d');
  var controls = document.getElementById('product-controls');
  var presetButtons = document.querySelectorAll('.preset-button');
  var presetName = document.getElementById('preset-name');
  var renderTime = document.getElementById('render-time');
  var summary = document.getElementById('selection-summary');

  var baseImage = new Image();
  baseImage.src = '../generated/v05-tile-deck-area/source.jpg';

  var products = [
    { key: 'fence', label: 'アメリカンフェンス' },
    { key: 'tile', label: 'タイルデッキ' },
    { key: 'turf', label: '人工芝' },
    { key: 'pizza', label: 'ピザ窯' },
    { key: 'furniture', label: 'ガーデンファニチャー' },
  ];

  var patterns = {
    none: 'なし',
    A: 'パターンA',
    B: 'パターンB',
  };

  var presets = {
    'backyard-basic': {
      label: 'おすすめ 1 / 庭を整える基本',
      state: { fence: 'none', tile: 'A', turf: 'A', pizza: 'none', furniture: 'A' },
    },
    dogrun: {
      label: 'おすすめ 2 / ドッグラン寄り',
      state: { fence: 'B', tile: 'none', turf: 'A', pizza: 'none', furniture: 'none' },
    },
    'pizza-party': {
      label: 'おすすめ 3 / ピザ窯と食事',
      state: { fence: 'A', tile: 'A', turf: 'none', pizza: 'B', furniture: 'A' },
    },
    'clean-lawn': {
      label: 'おすすめ 4 / すっきり芝庭',
      state: { fence: 'none', tile: 'B', turf: 'B', pizza: 'none', furniture: 'B' },
    },
  };

  var state = Object.assign({}, presets['backyard-basic'].state);

  function px(point) {
    return [point[0] * canvas.width, point[1] * canvas.height];
  }

  function polygon(points) {
    ctx.beginPath();
    points.forEach(function (point, index) {
      var p = px(point);
      if (index === 0) ctx.moveTo(p[0], p[1]);
      else ctx.lineTo(p[0], p[1]);
    });
    ctx.closePath();
  }

  function drawShadow(x, y, w, h, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha || 0.18;
    ctx.filter = 'blur(10px)';
    ctx.fillStyle = '#1d160f';
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawTile(pattern) {
    if (pattern === 'none') return;
    var points = pattern === 'A'
      ? [[0.08, 0.55], [0.56, 0.54], [0.60, 0.73], [0.05, 0.77]]
      : [[0.42, 0.56], [0.91, 0.55], [0.88, 0.78], [0.38, 0.76]];

    ctx.save();
    polygon(points);
    ctx.clip();
    ctx.fillStyle = '#cfc4ad';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(105, 93, 78, .42)';
    ctx.lineWidth = 1.4;
    for (var x = -120; x < canvas.width + 120; x += 72) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 170, canvas.height);
      ctx.stroke();
    }
    for (var y = 350; y < canvas.height; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y - 18);
      ctx.stroke();
    }
    ctx.restore();
    ctx.save();
    polygon(points);
    ctx.strokeStyle = 'rgba(80, 70, 58, .38)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  function drawTurf(pattern) {
    if (pattern === 'none') return;
    var points = pattern === 'A'
      ? [[0.12, 0.60], [0.88, 0.58], [0.92, 0.91], [0.07, 0.92]]
      : [[0.18, 0.60], [0.80, 0.59], [0.84, 0.84], [0.14, 0.86]];

    ctx.save();
    polygon(points);
    ctx.clip();
    var gradient = ctx.createLinearGradient(0, canvas.height * 0.55, 0, canvas.height);
    gradient.addColorStop(0, '#658f3f');
    gradient.addColorStop(1, '#385f28');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.26;
    ctx.strokeStyle = '#d8efbd';
    ctx.lineWidth = 1;
    for (var i = 0; i < 90; i += 1) {
      var y = 430 + i * 5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y - 36);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawFence(pattern) {
    if (pattern === 'none') return;
    var routes = pattern === 'A'
      ? [[[0.07, 0.79], [0.91, 0.77]]]
      : [[[0.10, 0.57], [0.09, 0.84]], [[0.09, 0.84], [0.87, 0.80]]];

    ctx.save();
    routes.forEach(function (route) {
      var a = px(route[0]);
      var b = px(route[1]);
      ctx.strokeStyle = 'rgba(195, 205, 203, .92)';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(88, 102, 100, .76)';
      ctx.lineWidth = 2;
      for (var t = 0; t <= 1.001; t += 0.055) {
        var x = a[0] + (b[0] - a[0]) * t;
        var y = a[1] + (b[1] - a[1]) * t;
        ctx.beginPath();
        ctx.moveTo(x, y - 56);
        ctx.lineTo(x, y + 16);
        ctx.stroke();
      }
      for (var s = 0; s < 6; s += 1) {
        ctx.beginPath();
        ctx.moveTo(a[0], a[1] - 48 + s * 12);
        ctx.lineTo(b[0], b[1] - 48 + s * 12);
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  function drawPizza(pattern) {
    if (pattern === 'none') return;
    var x = pattern === 'A' ? canvas.width * 0.23 : canvas.width * 0.69;
    var y = pattern === 'A' ? canvas.height * 0.61 : canvas.height * 0.60;
    var scale = pattern === 'A' ? 0.86 : 0.72;
    var w = 150 * scale;
    var h = 120 * scale;
    drawShadow(x + w * 0.5, y + h * 0.9, w * 0.5, h * 0.14, 0.22);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#8a5a3a';
    ctx.fillRect(16, 56, 132, 52);
    ctx.fillStyle = '#b88458';
    for (var i = 0; i < 9; i += 1) {
      ctx.fillRect(18 + i * 14, 58, 10, 12);
      ctx.fillRect(18 + i * 14, 82, 10, 12);
    }
    ctx.beginPath();
    ctx.arc(82, 58, 55, Math.PI, 0);
    ctx.lineTo(137, 58);
    ctx.lineTo(27, 58);
    ctx.closePath();
    ctx.fillStyle = '#9f6a43';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(82, 63, 36, Math.PI, 0);
    ctx.lineTo(118, 63);
    ctx.lineTo(46, 63);
    ctx.closePath();
    ctx.fillStyle = '#2e251f';
    ctx.fill();
    ctx.fillStyle = '#d78a31';
    ctx.beginPath();
    ctx.arc(82, 67, 16, Math.PI, 0);
    ctx.fill();
    ctx.restore();
  }

  function drawFurniture(pattern) {
    if (pattern === 'none') return;
    var x = pattern === 'A' ? canvas.width * 0.62 : canvas.width * 0.31;
    var y = pattern === 'A' ? canvas.height * 0.75 : canvas.height * 0.72;
    drawShadow(x, y + 26, 70, 16, 0.18);
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#514036';
    ctx.lineWidth = 4;
    ctx.fillStyle = '#a7784f';
    ctx.beginPath();
    ctx.ellipse(0, 0, 58, 22, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#3f332b';
    [[-76, -20], [76, -18], [-68, 44], [70, 42]].forEach(function (chair) {
      ctx.strokeRect(chair[0] - 18, chair[1] - 14, 36, 28);
      ctx.beginPath();
      ctx.moveTo(chair[0] - 18, chair[1] + 14);
      ctx.lineTo(chair[0] - 26, chair[1] + 36);
      ctx.moveTo(chair[0] + 18, chair[1] + 14);
      ctx.lineTo(chair[0] + 26, chair[1] + 36);
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawComposite() {
    var start = performance.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    drawTurf(state.turf);
    drawTile(state.tile);
    drawPizza(state.pizza);
    drawFurniture(state.furniture);
    drawFence(state.fence);
    renderTime.textContent = 'render: ' + Math.max(1, Math.round(performance.now() - start)) + ' ms';
    updateSummary();
  }

  function updateSummary() {
    summary.innerHTML = products.map(function (product) {
      return '<li><strong>' + product.label + '</strong>: ' + patterns[state[product.key]] + '</li>';
    }).join('');
  }

  function setPreset(key) {
    var preset = presets[key];
    if (!preset) return;
    state = Object.assign({}, preset.state);
    presetName.textContent = preset.label;
    presetButtons.forEach(function (button) {
      button.classList.toggle('is-active', button.dataset.preset === key);
    });
    controls.querySelectorAll('.choice-button').forEach(function (button) {
      button.classList.toggle('is-active', state[button.dataset.product] === button.dataset.value);
    });
    drawComposite();
  }

  function setChoice(product, value) {
    state[product] = value;
    presetName.textContent = 'カスタム選択';
    presetButtons.forEach(function (button) {
      button.classList.remove('is-active');
    });
    controls.querySelectorAll('.choice-button').forEach(function (button) {
      if (button.dataset.product === product) {
        button.classList.toggle('is-active', button.dataset.value === value);
      }
    });
    drawComposite();
  }

  function renderControls() {
    controls.innerHTML = products.map(function (product) {
      return [
        '<div class="product-control">',
        '<h2>' + product.label + '</h2>',
        '<div class="choice-grid">',
        Object.keys(patterns).map(function (value) {
          return '<button type="button" class="choice-button ' + (state[product.key] === value ? 'is-active' : '') + '" data-product="' + product.key + '" data-value="' + value + '">' + patterns[value] + '</button>';
        }).join(''),
        '</div>',
        '</div>',
      ].join('');
    }).join('');
  }

  presetButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      setPreset(button.dataset.preset);
    });
  });

  controls.addEventListener('click', function (event) {
    var button = event.target.closest('.choice-button');
    if (!button) return;
    setChoice(button.dataset.product, button.dataset.value);
  });

  baseImage.onload = function () {
    renderControls();
    setPreset('backyard-basic');
  };
})();
