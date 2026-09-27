/**
 * 演示素材路径：preview/assets 下的游戏图。Storybook 与文档站都把仓库的 preview/ 挂在站点的 preview/ 下（staticDirs / public 链接），
 * BASE_URL 在 Storybook 是 "./"（相对 iframe.html）、文档站是站点 base（"/prts-design/"）。组件本身不关心素材从哪来——生产里是 media.prts.wiki 的地址。
 */
export const asset = (path: string) => `${import.meta.env.BASE_URL}preview/assets/${path}`;
