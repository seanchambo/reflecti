import { App } from ".";

export interface VirtualNode {
  type: string;
  attributes: object;
  children: (ComponentNode | ((app: App) => ComponentNode))[];
  key?: string;
}

export interface ChildCompareData {
  index: number;
  element: Element;
}

export type ComponentNode = VirtualNode | number | string | Date;

export type Element = HTMLElement | Text | Node;