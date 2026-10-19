// Storybook用のNext.jsフォントモック
// next/font/googleをStorybookで使用する際のモック実装

type FontOptions = {
  subsets?: string[];
  weight?: string[] | number[];
  style?: string[];
  variable?: string;
  display?: string;
  preload?: boolean;
  fallback?: string[];
  adjustFontFallback?: boolean;
  declarations?: Array<{ prop: string; value: string }>;
};

export function Inter(options?: FontOptions) {
  // Storybookでは実際のフォントローディングを行わず、クラス名のみを返す
  return {
    className: 'font-inter',
    style: {
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    variable: '--font-inter'
  };
}

// 他のフォントも必要に応じて追加
export function Roboto(options?: FontOptions) {
  return {
    className: 'font-roboto',
    style: {
      fontFamily: 'Roboto, system-ui, sans-serif'
    },
    variable: '--font-roboto'
  };
}

// デフォルトエクスポート（必要に応じて）
const nextFontGoogle = {
  Inter,
  Roboto
};
export default nextFontGoogle;
