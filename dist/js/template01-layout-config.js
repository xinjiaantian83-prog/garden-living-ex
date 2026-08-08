window.GardenLivingTemplate01Layout = {
  version: "1.0.0",
  template_id: "template01",
  template_name: "標準的な建売住宅の裏庭",
  role: "Garden Living 展示場1号",
  before_image: "images/templates/template01/template01-before.jpg",
  image_size: {
    width: 829,
    height: 568
  },
  analysis: {
    garden_area: {
      label: "庭の主要土部分",
      polygon: [
        [0.02, 0.56],
        [0.19, 0.46],
        [0.53, 0.46],
        [0.98, 0.67],
        [0.98, 0.98],
        [0.00, 0.98]
      ]
    },
    building_area: {
      label: "建物外壁",
      polygon: [
        [0.39, 0.00],
        [1.00, 0.00],
        [1.00, 0.67],
        [0.52, 0.47],
        [0.38, 0.43]
      ]
    },
    sweep_windows: [
      {
        id: "center_window",
        label: "中央掃き出し窓",
        rect: { x: 0.50, y: 0.29, width: 0.12, height: 0.24 }
      },
      {
        id: "right_window",
        label: "右掃き出し窓",
        rect: { x: 0.76, y: 0.13, width: 0.17, height: 0.42 }
      }
    ],
    boundaries: [
      {
        id: "left_boundary",
        label: "左境界",
        route: [[0.00, 0.67], [0.18, 0.46]]
      },
      {
        id: "back_boundary",
        label: "奥境界",
        route: [[0.18, 0.46], [0.52, 0.46]]
      }
    ],
    placement_safe_area: {
      label: "商品配置可能エリア",
      polygon: [
        [0.09, 0.58],
        [0.50, 0.50],
        [0.93, 0.69],
        [0.92, 0.92],
        [0.06, 0.93]
      ]
    }
  },
  layer_model: {
    concept: "Garden Livingは施工順に近いレイヤー構造で管理する。",
    background_layers: {
      label: "背景レイヤー（地面のみ）",
      allowed: ["soil", "turf", "gravel", "decomposed_granite", "concrete"],
      current: "soil",
      notes: "土、人工芝、砂利、真砂土、土間コンなど地面状態だけを扱う。タイルデッキは含めない。"
    },
    product_layers: {
      label: "商品レイヤー",
      allowed: [
        "tile_deck",
        "american_fence",
        "garden_furniture",
        "pizza_oven",
        "gabion",
        "water_stand",
        "sauna"
      ],
      notes: "タイルデッキ、構造物、設備、家具はすべて背景ではなく商品として扱う。"
    },
    render_groups: [
      { id: "background", label: "背景（地面）", z_range: [0, 9] },
      { id: "structure", label: "構造物", z_range: [20, 59] },
      { id: "equipment_furniture", label: "設備・家具", z_range: [60, 89] },
      { id: "labels", label: "管理用ラベル", z_range: [90, 99] }
    ]
  },
  layer_order: [
    "background",
    "tile_deck",
    "american_fence",
    "gabion",
    "water_stand",
    "sauna",
    "pizza_oven",
    "garden_furniture",
    "labels"
  ],
  products: {
    turf: {
      label: "人工芝",
      layer_kind: "background",
      render_group: "background",
      z_index: 5,
      patterns: {
        A: {
          label: "ひろく敷く",
          type: "area",
          polygon: [
            [0.06, 0.56],
            [0.48, 0.50],
            [0.95, 0.68],
            [0.96, 0.95],
            [0.03, 0.95],
            [0.01, 0.73]
          ],
          notes: "庭の主要部分を広く芝化し、子ども・犬が遊べる印象を最優先する。"
        },
        B: {
          label: "控えめに敷く",
          type: "area",
          polygon: [
            [0.16, 0.59],
            [0.53, 0.53],
            [0.87, 0.68],
            [0.83, 0.88],
            [0.15, 0.88],
            [0.08, 0.73]
          ],
          notes: "タイルデッキや家具との余白を残し、芝の面積を抑える。"
        }
      }
    },
    tile_deck: {
      label: "タイルデッキ",
      layer_kind: "product",
      render_group: "structure",
      z_index: 20,
      patterns: {
        A: {
          label: "小さめ",
          type: "area",
          polygon: [
            [0.47, 0.55],
            [0.96, 0.67],
            [0.95, 0.78],
            [0.42, 0.69]
          ],
          notes: "右掃き出し窓前から庭へ自然につながる標準サイズ。"
        },
        B: {
          label: "広め",
          type: "area",
          polygon: [
            [0.33, 0.52],
            [0.98, 0.66],
            [0.98, 0.85],
            [0.24, 0.74]
          ],
          notes: "中央窓と右窓の両方を使いやすくする広めのデッキ。"
        }
      }
    },
    american_fence: {
      label: "アメリカンフェンス",
      layer_kind: "product",
      render_group: "structure",
      z_index: 50,
      patterns: {
        A: {
          label: "奥の一辺",
          type: "route",
          route: [
            [0.17, 0.48],
            [0.53, 0.48]
          ],
          notes: "奥境界に軽く抜け感を作る。圧迫感を抑えた最小構成。"
        },
        B: {
          label: "左境界+奥のL字",
          type: "route",
          route: [
            [0.03, 0.68],
            [0.18, 0.48],
            [0.54, 0.48]
          ],
          notes: "左境界から奥へL字に囲い、ドッグラン感と安心感を出す。"
        }
      }
    },
    garden_furniture: {
      label: "ガーデンファニチャー",
      layer_kind: "product",
      render_group: "equipment_furniture",
      z_index: 70,
      patterns: {
        A: {
          label: "ダイニング",
          type: "object",
          rect: { x: 0.68, y: 0.70, width: 0.18, height: 0.12 },
          rotation: -4,
          notes: "右側タイルデッキ上に食事用テーブルとチェアを置く。"
        },
        B: {
          label: "休憩席",
          type: "object",
          rect: { x: 0.42, y: 0.70, width: 0.20, height: 0.11 },
          rotation: -2,
          notes: "中央寄りに低めの休憩席を置き、芝庭との距離を近くする。"
        }
      }
    },
    pizza_oven: {
      label: "ピザ窯",
      layer_kind: "product",
      render_group: "equipment_furniture",
      z_index: 60,
      patterns: {
        A: {
          label: "デッキ脇",
          type: "object",
          rect: { x: 0.52, y: 0.56, width: 0.10, height: 0.14 },
          rotation: 0,
          notes: "タイルデッキ脇に控えめに置く。食事導線を優先。"
        },
        B: {
          label: "庭の端",
          type: "object",
          rect: { x: 0.78, y: 0.57, width: 0.11, height: 0.15 },
          rotation: -3,
          notes: "右奥側に独立配置し、庭のイベント感を出す。"
        }
      }
    }
  },
  recommended_sets: [
    {
      id: "playable-garden",
      label: "まずは遊べる庭",
      state: {
        turf: "A",
        tile_deck: "none",
        american_fence: "A",
        garden_furniture: "none",
        pizza_oven: "none"
      }
    },
    {
      id: "family-garden",
      label: "家族で過ごす庭",
      state: {
        turf: "A",
        tile_deck: "A",
        american_fence: "none",
        garden_furniture: "A",
        pizza_oven: "none"
      }
    },
    {
      id: "dogrun-garden",
      label: "ドッグランの庭",
      state: {
        turf: "A",
        tile_deck: "none",
        american_fence: "B",
        garden_furniture: "none",
        pizza_oven: "none"
      }
    },
    {
      id: "pizza-weekend",
      label: "休日の食事を楽しむ庭",
      state: {
        turf: "none",
        tile_deck: "A",
        american_fence: "none",
        garden_furniture: "A",
        pizza_oven: "B"
      }
    },
    {
      id: "complete-calm",
      label: "全部入り控えめ",
      state: {
        turf: "B",
        tile_deck: "A",
        american_fence: "A",
        garden_furniture: "A",
        pizza_oven: "B"
      }
    }
  ],
  constraints: [
    "背景レイヤーは地面のみ。土、人工芝、砂利、真砂土、土間コンを切り替える。",
    "タイルデッキは背景ではなく商品レイヤーとして扱う。",
    "タイルデッキと人工芝が重なる場合は、商品レイヤーであるタイルデッキを上位にする。",
    "ガーデンファニチャーはタイルデッキ上、または芝上でも不自然にならない範囲に置く。",
    "ピザ窯は掃き出し窓を塞がない。",
    "アメリカンフェンスは建物外壁に重ねない。",
    "全部入り構成では商品を詰め込みすぎず、芝面の余白を残す。"
  ]
};

if (typeof module !== "undefined") {
  module.exports = window.GardenLivingTemplate01Layout;
}
