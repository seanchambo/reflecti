import { VNodeName, VNodeKey, VNodeAttributes, VNodeChild } from './index.d';

export class VNode {
  type: VNodeName;
  children: VNodeChild[];
  key?: VNodeKey;
  attributes: VNodeAttributes;

  constructor(type: VNodeName, attributes: VNodeAttributes, children: VNodeChild[]) {
    this.type = type;
    this.attributes = attributes || {};
    this.children = children;
    this.key = (attributes && attributes.key) || null
  }
}