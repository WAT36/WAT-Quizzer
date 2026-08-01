// next/navigation (App Router) の軽量スタブ。
// このプロジェクトは Pages Router がメインで、RequiredAuthComponent のみが
// next/navigation の useRouter を使用している。@storybook/nextjs の
// appDirectory モードは next/router (Pages Router) のモックと排他的に働くため、
// webpack alias でこのスタブに差し替えて両立させる。
export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
  prefetch: () => {}
});

export const usePathname = () => '/';
export const useSearchParams = () => new URLSearchParams();
export const useParams = () => ({});
