import { VNode } from "./vnode";
import { replaceElement, updateElement, createElement, removeElement } from './dom';
import { Component } from './component';

export const patch = (parent: HTMLElement | Text, element: HTMLElement | Text, vnode: any | VNode): HTMLElement | Text => {
  let newElement: HTMLElement | Text = element;

  if (vnode instanceof VNode) {
    if (typeof vnode.type === 'function') {
      newElement = patchComponent(parent, element, vnode);
    } else {
      if (!element || element instanceof Text || vnode.type.toLowerCase() !== element.nodeName.toLowerCase()) {
        newElement = replaceElement(parent, element, vnode);
      } else {
        updateElement(element, vnode);
        patchChildren(element, vnode);
      }
    }
  } else {
    let text = ''
    if (vnode && typeof vnode !== 'boolean') { text = String(vnode) }
    if (element && element instanceof Text && element.nodeValue !== text) {
      element.nodeValue = text;
    } else {
      newElement = replaceElement(parent, element, text);
    }
  }

  return newElement;
}

export const patchComponent = (parent: HTMLElement | Text, element: HTMLElement | Text, vnode: VNode): HTMLElement | Text => {
  if (!element) { return replaceElement(parent, element, vnode) }

  let newComponent = element["_component"];
  vnode.type = vnode.type as Function;
  const componentConstructor = newComponent && newComponent.constructor;
  const vnodeConstructor = vnode.type.prototype && vnode.type.prototype.constructor;

  if (newComponent && componentConstructor && vnodeConstructor && componentConstructor === vnodeConstructor) {
    newComponent.props = vnode.attributes;
  } else {
    if (vnodeConstructor) {
      newComponent = new vnodeConstructor(vnode.attributes, vnode.children);
    } else {
      newComponent = new Component(vnode.attributes, vnode.children);
      newComponent.view = vnode.type;
    }
  }

  const rendered = newComponent.render();
  const newElement = patch(parent, element, rendered);

  newComponent._element = newElement;
  newElement['_component'] = newComponent;
  return newElement;
}

export const patchChildren = (element: HTMLElement, vnode: VNode) => {
  const oldElements: Node[] = [];
  const oldUnkeyed: { [key: string]: any }[] = [];
  const oldKeys: { [key: string]: { [key: string]: any } } = {};
  const newKeys: { [key: string]: VNode | string } = {};

  [].map.call(element.childNodes, (childNode, index) => {
    oldElements.push(childNode);

    if (childNode instanceof HTMLElement && childNode["_props"] && childNode["_props"]["key"]) {
      oldKeys[childNode["_props"]["key"]] = { index, element: childNode }
    } else {
      oldUnkeyed.push({ index, element: childNode });
    }
  });

  vnode.children.forEach((child, index) => {
    let newKey: string | number = null;

    if (child instanceof VNode && child.key) { newKey = child.key }

    if (oldKeys[newKey] || newKey === null) {
      const movedComponent = oldKeys[newKey] || oldUnkeyed.pop();

      if (!movedComponent) {
        element.insertBefore(createElement(child), element.childNodes[index]);
      } else {
        if (index === movedComponent.index) {
          patch(element, movedComponent.element, child);
        } else {
          patch(element, element.insertBefore(movedComponent.element, element.childNodes[index]), child)
        }
      }
    } else {
      element.insertBefore(createElement(child), element.childNodes[index]);
    }

    if (newKey) { newKeys[newKey] = child }
  });

  oldElements.forEach((childNode) => {
    const key = childNode["_props"] && childNode["_props"]["key"] || null
    if (childNode instanceof HTMLElement && childNode["_props"] && key && !newKeys[key]) {
      removeElement(element, childNode);
    }
  });

  oldUnkeyed.forEach((data) => {
    removeElement(element, data.element);
  });
}
