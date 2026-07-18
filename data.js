/* global window */

const imagePool = [
  "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80"
];

const rawTypes = [
  {
    id: "illustration", icon: "✦", name: "イラスト・絵画", description: "アート・挿絵・一枚絵",
    categories: [
      ["全体スタイル", ["透明感のある水彩画", "重厚な油絵", "鮮やかなポップアート", "繊細な線画", "和紙の水墨画"]],
      ["色・配色", ["柔らかなパステルカラー", "深みのあるアースカラー", "高彩度のビビッドカラー", "静かなモノトーン", "幻想的なネオンカラー"]],
      ["光・雰囲気", ["柔らかい自然光", "ドラマチックな逆光", "静謐で幻想的", "温かな夕暮れ", "月明かりのミステリアスな空気"]]
    ]
  },
  {
    id: "character", icon: "◉", name: "キャラクター", description: "人物・マスコット・設定画",
    categories: [
      ["画風テイスト", ["現代的なアニメ調", "親しみやすいデフォルメ", "精密なリアル調", "力強いコミック調", "絵本のような手描き調"]],
      ["衣装・系統", ["中世ファンタジー衣装", "近未来のサイバー衣装", "洗練された現代服", "伝統的な和装", "レトロフューチャー衣装"]],
      ["表情・ポーズ", ["自然で明るい笑顔", "クールな立ちポーズ", "躍動感のあるアクション", "穏やかに座る姿", "不思議そうに振り返る姿"]]
    ]
  },
  {
    id: "web", icon: "▤", name: "Webサイト", description: "コーポレート・EC・メディア",
    categories: [
      ["デザインテイスト", ["余白を活かしたミニマル", "信頼感のあるコーポレート", "透明感のあるグラスモーフィズム", "大胆なブルータリズム", "上質なラグジュアリー"]],
      ["レイアウト", ["フルスクリーンのヒーロー", "整然としたグリッド", "動きのある非対称構成", "読みやすいシングルカラム", "カード型のタイル構成"]],
      ["配色・文字", ["モノトーンと差し色", "落ち着いたアースカラー", "ダークモードとネオン", "大胆な太字見出し", "上品な明朝体中心"]]
    ]
  },
  {
    id: "app", icon: "▣", name: "アプリ・UI", description: "モバイル・ダッシュボード",
    categories: [
      ["UIテイスト", ["クリーンなフラットUI", "柔らかなニューモーフィズム", "透明なガラス質感", "洗練されたダークUI", "親しみやすいミニマルUI"]],
      ["画面構成", ["ボトムナビゲーション", "カード型ダッシュボード", "グリッドギャラリー", "リスト中心の情報設計", "大きなアクションボタン"]],
      ["パーツ・密度", ["丸みのあるピル型ボタン", "繊細なラインアイコン", "余白多めの低密度", "情報量の多い高密度", "立体的なシャドウカード"]]
    ]
  },
  {
    id: "logo", icon: "◇", name: "ロゴ", description: "ブランド・シンボル・文字",
    categories: [
      ["ロゴタイプ", ["象徴的なシンボルマーク", "文字のみのロゴタイプ", "伝統的なエンブレム", "頭文字のレターマーク", "文字と図形の組み合わせ"]],
      ["造形", ["ミニマルな幾何学形状", "余白を活かした造形", "手描きの有機的な線", "左右対称の安定した構成", "非対称で動きのある構成"]],
      ["印象・配色", ["先進的なモノクロ", "親しみやすい暖色", "高級感のある深い配色", "自然なアースカラー", "遊び心のある鮮やかな配色"]]
    ]
  },
  {
    id: "photo", icon: "◎", name: "実写・写真", description: "人物・風景・商品写真",
    categories: [
      ["撮影スタイル", ["自然なポートレート写真", "壮大な風景写真", "洗練された商品写真", "日常を切り取るストリート写真", "映画のワンシーンのような写真"]],
      ["カメラ・構図", ["浅い被写界深度と美しいボケ", "広角レンズのダイナミックな構図", "望遠レンズの圧縮感", "真上からの俯瞰構図", "三分割法の安定した構図"]],
      ["光・色調", ["柔らかい自然光", "黄金色のゴールデンアワー", "印象的なスタジオ照明", "粒子感のあるフィルム調", "高コントラストのモノクロ"]]
    ]
  },
  {
    id: "product", icon: "⬡", name: "パッケージ", description: "商品・容器・プロダクト",
    categories: [
      ["形状・素材", ["上質なガラスボトル", "温かいクラフト紙の箱", "機能的なパウチ容器", "洗練された金属缶", "ミニマルなチューブ容器"]],
      ["グラフィック", ["ロゴ中心のミニマルデザイン", "印象的な幾何学パターン", "親しみやすいイラスト", "大胆なタイポグラフィ", "素材を引き立てる透明ラベル"]],
      ["ブランド印象", ["自然でオーガニック", "上質でラグジュアリー", "日常的で親しみやすい", "贈り物に適した華やかさ", "未来的で機能的"]]
    ]
  },
  {
    id: "fashion", icon: "♢", name: "ファッション", description: "服・バッグ・アクセサリー",
    categories: [
      ["スタイル", ["都会的なストリートスタイル", "端正なフォーマルスタイル", "自然体のカジュアル", "装飾を抑えたミニマル", "クラシックなヴィンテージ"]],
      ["素材・柄", ["風合いのあるデニム", "上質なレザー", "柔らかなニット", "軽やかなシルク", "大胆な幾何学模様"]],
      ["配色・季節", ["洗練されたモノトーン", "自然なアースカラー", "明るい春夏カラー", "深みのある秋冬カラー", "未来的なメタリックカラー"]]
    ]
  },
  {
    id: "interior", icon: "⌂", name: "空間・インテリア", description: "部屋・店舗・オフィス",
    categories: [
      ["テイスト", ["明るく温かな北欧風", "素材感のあるインダストリアル", "静かなジャパンディ", "上質なラグジュアリー", "植物のあるボヘミアン"]],
      ["素材", ["自然な木材を多用", "コンクリート打ちっぱなし", "柔らかなファブリック", "大理石と金属の組み合わせ", "土壁と和紙の質感"]],
      ["照明・空気感", ["大きな窓からの自然光", "温かな間接照明", "印象的なペンダントライト", "開放感のある高い天井", "落ち着いた静かな空間"]]
    ]
  },
  {
    id: "social", icon: "▶", name: "SNS・サムネイル", description: "投稿・広告・動画カバー",
    categories: [
      ["用途・構成", ["目を引く動画サムネイル", "統一感のあるSNS投稿", "横長の広告バナー", "ブランドを伝えるヘッダー", "情報を整理した告知画像"]],
      ["テキスト", ["大きな見出しを中央配置", "短い言葉だけの構成", "吹き出しと強調枠", "端正な左揃えレイアウト", "数字を大きく強調"]],
      ["視覚効果", ["高コントラストで目立つ配色", "人物を大きく配置", "アイコン中心の構成", "太枠で印象を強調", "余白を活かした上品な構成"]]
    ]
  },
  {
    id: "landing", icon: "↘", name: "LPデザイン", description: "商品・サービス紹介ページ",
    categories: [
      ["構成", ["ファーストビュー訴求型", "課題から解決へ導く物語型", "違いが伝わる比較表型", "数字と実績を強調", "利用者の声を中心に構成"]],
      ["テイスト", ["信頼感のあるコーポレート", "軽快で親しみやすいポップ", "余白のあるミニマル", "上質なラグジュアリー", "先進的なテック系"]],
      ["CTA・区切り", ["大きく目立つCTAボタン", "控えめなテキストリンク", "カードで明確に区切る", "装飾的なセクション境界", "余白だけで自然に区切る"]]
    ]
  },
  {
    id: "slide", icon: "▧", name: "スライド", description: "提案書・発表・企画資料",
    categories: [
      ["用途・印象", ["信頼感のある営業提案資料", "簡潔な社内報告資料", "大胆な登壇スライド", "論理的な学術発表", "発想を伝える企画書"]],
      ["レイアウト", ["要点を絞ったテキスト中心", "図解とチャート中心", "写真を全面に配置", "比較しやすい左右分割", "数字を大きく見せる構成"]],
      ["デザイン", ["ブランドカラーで統一", "モノトーンと差し色", "親しみやすいパステル", "集中できるダークテーマ", "情報を伝えるインフォグラフィック"]]
    ]
  }
];

let imageIndex = 0;
window.VIS_PROMPT_TYPES = rawTypes.map((type) => ({
  ...type,
  categories: type.categories.map(([name, labels], categoryIndex) => ({
    id: `${type.id}-${categoryIndex}`,
    name,
    items: labels.map((label, itemIndex) => {
      const item = {
        id: `${type.id}-${categoryIndex}-${itemIndex}`,
        label,
        image: imagePool[imageIndex % imagePool.length],
        tags: label.split("、")
      };
      imageIndex += 1;
      return item;
    })
  }))
}));
