import { ComponentConstructor } from "./index.d";
import { VNode } from "./vnode";
import { classNames } from './classNames';
import { Component } from "./component";
import { addLifecycleEvent } from "./lifecycle";

export const createElement = (vnode: VNode | string): HTMLElement | Text => {
  let element: HTMLElement | Text;

  if (typeof vnode === 'string') {
    element = document.createTextNode(vnode);
  } else {
    if (typeof vnode.type === 'string') {
      element = document.createElement(vnode.type)
      updateElement(element, vnode, true);

      vnode.children.forEach((childNode) => {
        replaceElement(element, null, childNode);
      });
    } else {
      let component;
      if (vnode.type.prototype && vnode.type.prototype.constructor) {
        component = new (vnode.type as ComponentConstructor)(vnode.attributes, vnode.children);
      } else {
        component = new Component(vnode.attributes, vnode.children);
        component.view = vnode.type;
      }

      const rendered = component.render();
      element = createElement(rendered);
      element["_component"] = component;
      component._element = element;
    }
  }

  if (typeof vnode !== 'string' && vnode.attributes.oncreate) {
    addLifecycleEvent(() => { vnode.attributes.oncreate(element); });
  }

  return element;
}

export const replaceElement = (parent: HTMLElement | Text, element: HTMLElement | Text, vnode: VNode | string) => {
  const newElement = createElement(vnode);
  if (element === null || element === undefined) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, element);
    removeElement(parent, element);
  }

  return newElement;
}

export const removeElement = (parent: HTMLElement | Text | ChildNode & Node, element: HTMLElement | Text | ChildNode & Node) => {
  [].map.call(element.childNodes, (node) => {
    removeElement(element, node);
  });

  if (element["_props"] && element["_props"].onremove) {
    element["_props"].onremove(element);
  }

  parent.removeChild(element);
}

export const updateElement = (element: HTMLElement, vnode: VNode, creating: boolean = false) => {
  const oldAttributes = element["_props"] || {};
  Object.keys({ ...oldAttributes, ...vnode.attributes }).forEach((key) => {
    updateAttribute(element, key, oldAttributes[key], vnode.attributes[key]);
  });

  element["_props"] = vnode.attributes;

  if (!creating && vnode.attributes.onupdate) {
    addLifecycleEvent(() => { vnode.attributes.onupdate(element, oldAttributes); });
  }
}

export const updateAttribute = (element: HTMLElement, attributeName: string, oldValue: any, newValue: any) => {
  if (oldValue !== newValue && attributeName !== 'key') {
    if (attributeName === 'className') {
      element.className = classNames(newValue) || '';
    } else if (attributeName === 'style') {
      if (!newValue || typeof newValue === 'string' || typeof oldValue === 'string') {
        element.style.cssText = newValue || '';
      }
      if (newValue && typeof newValue === 'object') {
        if (typeof oldValue === 'object') { for (const i in oldValue) { element.style[i] = ''; } }
        for (const i in newValue) { element.style[i] = newValue[i]; }
      }
    } else if (attributeName[0] === 'o' && attributeName[1] === 'n') {
      const eventName = attributeName.toLowerCase().substring(2);
      if (newValue) {
        if (!oldValue) { element.addEventListener(eventName, newValue); }
      } else {
        element.removeEventListener(eventName, oldValue);
      }
    } else if (!newValue) {
      element.removeAttribute(attributeName);
    } else {
      element.setAttribute(attributeName, newValue);
    }
  }
}