import { View } from "./index.d";
import RNode from "./rnode";
import VNode from "./vnode";
import { replaceElement, updateElement, removeElement } from './dom';
import { Component } from "./component";

const patch = (rnode: RNode, vnode: string | VNode) => {
  if (vnode instanceof VNode && typeof vnode.type === 'function') {
    // Component
    rnode.nextVnode = vnode;
    patchComponent(rnode);
    rnode.element = null;
  } else if (vnode instanceof VNode && typeof vnode.type === 'string') {
    // Element
    rnode.nextVnode = vnode;
    if (!rnode.element || rnode.element instanceof Text || vnode.type.toLowerCase() !== rnode.element.nodeName.toLowerCase()) {
      replaceElement(rnode);
    } else {
      updateElement(rnode);
      patchChildren(rnode);
    }
    rnode.component = null;
  } else {
    // Text Element
    let text = ''
    if (vnode && typeof vnode !== 'boolean') { text = String(vnode) }

    rnode.nextVnode = text;

    if (rnode.element && rnode.element instanceof Text && rnode.element.nodeValue !== text) {
      rnode.element.nodeValue = text;
    } else {
      replaceElement(rnode);
    }

    rnode.component = null;
  }

  rnode.vnode = rnode.nextVnode;
}

const patchComponent = (rnode: RNode) => {
  if (rnode.nextVnode instanceof VNode) {
    // Sanity check
    if (
      rnode.vnode &&
      ((rnode.vnode as VNode).type as Function).prototype &&
      (rnode.nextVnode.type as Function).prototype &&
      ((rnode.vnode as VNode).type as Function).prototype === (rnode.nextVnode.type as Function).prototype) {
      // Components that are equal
      rnode.component.props = rnode.nextVnode.attributes;
    } else {
      if ((rnode.nextVnode.type as Function).prototype) {
        // New component
        rnode.component = new ((rnode.nextVnode as VNode).type as Function).prototype.constructor(rnode.nextVnode.attributes, rnode.nextVnode.children);
      } else {
        // Stateless component
        rnode.component = new Component(rnode.nextVnode.attributes, rnode.nextVnode.children);
        rnode.component.view = rnode.nextVnode.type as View
      }
    }

    if (typeof rnode.vnode === 'string' || rnode.vnode instanceof VNode && typeof rnode.vnode.type === 'string') {
      removeElement(rnode);
    }

    const rendered: VNode | string = rnode.component.render();
    let childRnode: RNode = rnode.children.shift();
    if (!childRnode) {
      childRnode = new RNode();
      childRnode.parent = rnode;
    }
    rnode.children = [childRnode];
    rnode.component._rnode = rnode;
    rnode.component._vnode = rnode.nextVnode;
    patch(childRnode, rendered);
  } else {
    throw new Error('Cant call patchComponent on a string vNode');
  }
}

const patchChildren = (rnode: RNode) => {
  const oldUnkeyed: { index: number, rnode: RNode }[] = [];
  const oldKeys: { [key: string]: { index: number, rnode: RNode } } = {};
  const newKeys: { [key: string]: RNode } = {};
  const newChildren: RNode[] = [];

  rnode.children.forEach((childRnode, index) => {
    if (childRnode.vnode instanceof VNode && childRnode.vnode.key) {
      oldKeys[childRnode.vnode.key] = { index, rnode: childRnode }
    } else {
      oldUnkeyed.push({ index, rnode: childRnode });
    }
  });

  (rnode.nextVnode as VNode).children.forEach((childVnode, index) => {
    let newKey: string = null;
    let newRnode: RNode = null;

    if (childVnode instanceof VNode && childVnode.key) { newKey = childVnode.key };

    if (oldKeys[newKey] || newKey === null) {
      const movedNode = oldKeys[newKey] || oldUnkeyed.shift();

      if (!movedNode) {
        const childRnode = new RNode();
        childRnode.parent = rnode;
        newRnode = childRnode;
        patch(childRnode, childVnode);
      } else {
        newRnode = movedNode.rnode;
        if (index === movedNode.index) {
          patch(movedNode.rnode, childVnode);
        } else {
          const parentElement = rnode.getParentElement();
          if (movedNode.rnode.getChildElement()) {
            parentElement.insertBefore(movedNode.rnode.getChildElement(), parentElement.childNodes[index]);
          }
          patch(movedNode.rnode, childVnode);
        }
      }
    } else {
      const childRnode = new RNode();
      childRnode.parent = rnode;
      newRnode = childRnode;
      patch(childRnode, childVnode);
    }

    newChildren.push(newRnode);
    if (newKey) { newKeys[newKey] = newRnode }
  });

  rnode.children.forEach((childRnode) => {
    if (childRnode.getChildElement() && childRnode.vnode instanceof VNode && childRnode.vnode.key && !newKeys[childRnode.vnode.key]) {
      removeElement(childRnode);
    }
  });

  oldUnkeyed.forEach((data) => {
    if (data.rnode.getChildElement()) {
      removeElement(data.rnode);
    }
  });

  rnode.children = newChildren;
}

export default patch;
