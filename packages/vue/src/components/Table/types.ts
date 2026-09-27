import type { VNodeChild } from "vue";

/** AkDataTable 的一列（NDataTable 列定义的精简版：只留 CSS 支持的——数字列、排序） */
export interface DataTableColumn<T> {
  /** 列标识，也是取值的字段名（row[key]）；#cell-<key> 插槽按它找 */
  key: Extract<keyof T, string> | (string & {});
  /** 表头文字 */
  title?: string;
  /** 数字列：右对齐 + 等宽数字（.num） */
  num?: boolean;
  /** 可排序：true 按 row[key] 比较（数字比大小、文字按中文排序），或者自己给比较函数（升序时的结果） */
  sorter?: boolean | ((a: T, b: T) => number);
  /** 自定义单元格（同 Naive 的 render）；SFC 里用 #cell-<key> 插槽更顺手 */
  render?: (row: T, index: number) => VNodeChild;
  /** 这一列 th / td 的额外类名 */
  className?: string;
}

/** 排序状态（aria-sort 的取值）：哪一列、升序还是降序 */
export interface DataTableSort {
  key: string;
  order: "ascending" | "descending";
}
