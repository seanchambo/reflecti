import VNode from './vnode';
import { Component } from './component';

class RNode {
  element?: HTMLElement | Text;
  vnode?: VNode | string;
  nextVnode?: VNode | string;
  component?: Component;
  parent: RNode;
  children: RNode[] = [];

  getParentElement(): HTMLElement | Text {
    let parent = this.parent;
    while (!parent.element) {
      parent = parent.parent;
    }
    return parent.element;
  }

  getChildElement(): HTMLElement | Text {
    let child: RNode = this;
    while (!child.element) {
      child = child.children[0];
    }
    return child.element;
  }
}

export default RNode;