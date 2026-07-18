/* global window */

// 画像サイト.txt の「個別写真リンク」だけを使用する。
// Unsplashの検索結果ページは画像URLではないため、ここには含めない。
const photoUrl = (photoId) =>
  `https://unsplash.com/photos/${photoId}/download?force=true&w=700`;

const item = (id, label, photoId, tags) => ({
  id,
  label,
  image: photoUrl(photoId),
  source: `https://unsplash.com/photos/${photoId}`,
  tags
});

const typeCatalog = [
  ["illustration", "✦", "イラスト・絵画", "アート・挿絵・一枚絵"],
  ["character", "◉", "キャラクター", "人物・マスコット・設定画"],
  ["web", "▤", "Webサイト", "コーポレート・EC・メディア"],
  ["app", "▣", "アプリ・UI", "モバイル・ダッシュボード"],
  ["logo", "◇", "ロゴ", "ブランド・シンボル・文字"],
  ["photo", "◎", "実写・写真", "人物・風景・商品写真"],
  ["product", "⬡", "パッケージ", "商品・容器・プロダクト"],
  ["fashion", "♢", "ファッション", "服・バッグ・アクセサリー"],
  ["interior", "⌂", "空間・インテリア", "部屋・店舗・オフィス"],
  ["social", "▶", "SNS・サムネイル", "投稿・広告・動画カバー"],
  ["landing", "↘", "LPデザイン", "商品・サービス紹介ページ"],
  ["slide", "▧", "スライド", "提案書・発表・企画資料"]
];

const curatedCategories = {
  illustration: [
    {
      name: "水墨画風",
      items: [
        item("sumi-bamboo", "輪画竹林", "Y8J81SnaSOA", ["水墨画", "墨と余白", "円形の竹林", "禅の静けさ", "簡素な構成"]),
        item("sumi-mountain", "霧山景観", "2A3UgkmsBXY", ["伝統的な水墨画", "霧の山岳風景", "掛け軸の構成", "淡い墨の濃淡", "静謐"]),
        item("sumi-pavilion", "東屋樹木", "HUyNhxE11Lw", ["絹本着色風", "樹木と東屋", "伝統的な鳥と風景", "繊細な筆致", "日本美術"]),
        item("sumi-valley", "山水幽谷", "edJGsYHArsM", ["山水画", "壮大な山と滝", "松の木", "紙に墨", "深い奥行き"])
      ]
    },
    {
      name: "ピクセルアート",
      items: [
        item("pixel-icons", "8ビットアイコン", "FFIiTiQ0ILs", ["ピクセルアート", "8ビット", "レトロゲーム", "カラフルなアイコン", "白い背景"])
      ]
    },
    {
      name: "切り絵・紙工作風",
      items: [
        item("paper-wave", "三色曲線", "FKmFggfUEic", ["切り絵風", "重なった紙", "赤・オレンジ・青", "波状の曲線", "幾何学構成"]),
        item("paper-pink-blue", "桃青曲面", "gKpX3rxe6Ow", ["ペーパーカット", "ピンクと青", "滑らかな波模様", "立体的な紙の層", "モダン"]),
        item("origami-stars", "立体折星", "mbxXtVILXWc", ["折り紙", "カラフルな星", "暗い背景", "幾何学模様", "手作りの質感"])
      ]
    }
  ],
  character: [
    {
      name: "スチームパンク",
      items: [
        item("steam-story", "煙霧人物", "h8nA563t2vo", ["スチームパンク人物", "トップハット", "煙を上げるケトル", "秋の道", "風変わりな物語性"]),
        item("steam-garden", "庭園の装束", "EsXDs7ToxpM", ["スチームパンク衣装", "緑の庭園", "コルセット", "ヴィンテージ服", "歴史ファンタジー"]),
        item("steam-goggles", "眼鏡と帽子", "Sp-AXFaEG-A", ["スチームパンク衣装", "ゴーグルと帽子", "歯車", "機械的な羽根", "レトロフューチャー"])
      ]
    },
    {
      name: "マンガ表現",
      items: [
        item("manga-page", "マンガ頁", "dtn13qlr2GY", ["マンガページ", "モノクロ線画", "コマ割り", "吹き出し", "日本のコミック表現"])
      ]
    },
    {
      name: "機械・小物",
      items: [
        item("steam-tower", "機械時計塔", "YeAHUF6R7sM", ["スチームパンク建築", "時計塔", "銅の配管", "真鍮の歯車", "産業ファンタジー"]),
        item("steam-elephant", "象置時計", "lC0yUjPu9x8", ["象型の機械時計", "真鍮の歯車", "金属の配管", "レトロ機械", "精密な装飾"])
      ]
    }
  ],
  web: [
    {
      name: "グラスモーフィズム",
      items: [
        item("glass-type", "歪みテキスト", "DPlX35exJdQ", ["グラスモーフィズム", "歪んだ文字", "暖色の発光粒子", "ガラスの屈折", "抽象的な背景"]),
        item("glass-green", "グリーンテック", "MoLXiLIW0t0", ["テクノロジー背景", "半透明パネル", "流れる線", "鮮やかなグリーン", "未来的"])
      ]
    }
  ],
  app: [
    {
      name: "モバイルUI",
      items: [
        item("ui-fashion", "アパレルUI", "7UNQ6Y7_hLo", ["モバイルアプリUI", "高級アパレル", "ミニマルな画面", "スマートフォンモックアップ", "クリーン"]),
        item("ui-office", "オフィス背景", "qstC1a31vCA", ["スマートフォンモックアップ", "現代的なオフィス", "手持ち端末", "画面プレースホルダー", "環境配慮"]),
        item("ui-crypto", "暗号資産チャート", "JNyiwlWktr4", ["金融アプリUI", "取引ダッシュボード", "チャート", "ダークモード", "データ可視化"]),
        item("ui-devices", "複数端末UI", "rIC8rWEe7cs", ["2台のスマートフォン", "複数画面のUI", "フラットレイ", "接続性", "グレーの背景"]),
        item("ui-hand", "手持ちスマホ", "I2dG8cdNgw8", ["手持ちスマートフォン", "白い端末", "画面モックアップ", "ミニマルな構図", "孤立した背景"])
      ]
    }
  ],
  photo: [
    {
      name: "風景写真",
      items: [
        item("landscape-green", "渓谷山岳", "5zAhR9dGK-Q", ["風景写真", "緑の山々", "ドラマチックな雲", "高いコントラスト", "深い被写界深度"]),
        item("landscape-mist", "朝靄山岳", "rXVFCA3fQ4I", ["山岳写真", "立ち上る朝靄", "壮大なスケール", "深い谷", "広角レンズ"])
      ]
    }
  ],
  interior: [
    {
      name: "インダストリアル",
      items: [
        item("industrial-living", "コンクリートLDK", "ugIfsN9l_q4", ["モダンインダストリアル", "淡色のソファ", "一枚板のテーブル", "コンクリート壁", "抽象アート"])
      ]
    },
    {
      name: "ミニマル",
      items: [
        item("minimal-arch", "アーチと対比", "sPW5sPCnOak", ["モダンミニマル", "抽象アート", "優雅なアーチ", "アースカラー", "落ち着いた空気"])
      ]
    },
    {
      name: "ジャパンディ",
      items: [
        item("japandi-sofa", "格子とソファー", "JXFnfu15SgI", ["ジャパンディ", "侘び寂び", "クリーム色のソファ", "塗り壁", "縦格子の木材"])
      ]
    },
    {
      name: "ラグジュアリー",
      items: [
        item("luxury-light", "豪華シャンデリア", "3tu1nlIg4XM", ["モダンラグジュアリー", "クリスタルシャンデリア", "木と大理石", "高級住宅", "洗練された家具"])
      ]
    },
    {
      name: "ボヘミアン",
      items: [
        item("boho-midcentury", "ミッドセンチュリー", "6QoUM-AgeJM", ["ボヘミアンリビング", "ミッドセンチュリー", "暖かな照明", "自然素材", "観葉植物"]),
        item("boho-beach", "ビーチスタイル", "zZUvDl5Ez7w", ["ボヘミアン装飾", "ビーチハウス", "緑の植物", "木製家具", "くつろいだ空気"]),
        item("boho-sun", "日差し植物", "HVUSherHy74", ["日差しの入る部屋", "茶色の革ソファ", "豊かな観葉植物", "木のテーブル", "暖かな雰囲気"]),
        item("boho-terrace", "テラスビュー", "jAs-pBgmuww", ["ボヘミアンテラス", "ドライ植物", "屋外の眺望", "木製ダイニング", "リゾート感"])
      ]
    }
  ]
};

window.VIS_PROMPT_TYPES = typeCatalog.map(([id, icon, name, description]) => ({
  id,
  icon,
  name,
  description,
  available: Boolean(curatedCategories[id]?.length),
  categories: (curatedCategories[id] || []).map((category, categoryIndex) => ({
    id: `${id}-${categoryIndex}`,
    ...category
  }))
}));
