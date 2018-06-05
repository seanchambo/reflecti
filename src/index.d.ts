export interface VirtualNode {
  type: string;
  attributes: object;
  children: ComponentNode[];
  key?: string;
}

export interface ChildCompareData {
  index: number;
  element: Element;
  component: ComponentNode;
}

export type ComponentNode = VirtualNode | number | string;

export type Element = HTMLElement | Text | Node;
