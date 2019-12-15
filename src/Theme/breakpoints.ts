// Change the default value to [>319px ,<=629px] because the phone is the most used。
// 把缺省值改成[>319px ,<=629px]，因为手机使用最多, 手机优先。

export const breakpoints = {
  sm: "319px",
  default:   "*",
  md: "629px",
  lg: "1120px",
  xl: "1440px"
};

export type BreakPointType = typeof breakpoints;
//按照顺序/剩下缺省的[*] 把320px-628px范围当作缺省值的。 ==手机/非折叠非横屏的；
export const generateMediaQueries = (points: BreakPointType) => ({
  sm: `@media (max-width: ${points.sm})`,
  default: `@media (min-width: 320px) and (max-width: 628px)`,
  md: `@media (min-width: ${points.md})`,
  lg: `@media (min-width: ${points.lg})`,
  xl: `@media (min-width: ${points.xl})`,
  hover: "@media (hover: hover)"
});


/* 旧的是这样，升级版本需要 参照修改。
const breakpoints = {
  sm: "567px",
  md: "768px",
  lg: "992px",
  xl: "1200px"
};const generateMediaQueries = (points: BreakPointType) => ({
  sm: `@media (min-width: ${points.sm})`,
  md: `@media (min-width: ${points.md})`,
  lg: `@media (min-width: ${points.lg})`,
  xl: `@media (min-width: ${points.xl})`,
  hover: "@media (hover: hover)"
});
版本接口适应性修改：
  原来使用[theme.mediaQueries.sm] [theme.mediaQueries.md] [theme.mediaQueries.lg]， theme.breakpoints.?的地方，需要改动;
  缺省值改成手机，原来若缺省电脑的宽度的设计就要考虑要转变了。
*/

