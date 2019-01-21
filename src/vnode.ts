import { VNodeChild, Props } from './index.d';

class VNode {
  type: string | Function;
  children: VNodeChild[];
  key?: string;
  attributes: Props;

  constructor(type: string | Function, attributes: Props, children: VNodeChild[]) {
    this.type = type;
    this.attributes = attributes || {};
    this.children = children;
    this.key = (attributes && attributes.key) || null
  }
}

export default VNode;