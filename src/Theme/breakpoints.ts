export const breakpoints = {
  sm: "567px",
  md: "768px",
  lg: "992px",
  xl: "1200px"
};

export type BreakPointType = typeof breakpoints;

export const generateMediaQueries = (points: BreakPointType) => ({
  sm: `@media (min-width: ${points.sm})`,
  md: `@media (min-width: ${points.md})`,
  lg: `@media (min-width: ${points.lg})`,
  xl: `@media (min-width: ${points.xl})`,
  hover: "@media (hover: hover)"
});


/* 旧的是， 参照修改。
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
*/
