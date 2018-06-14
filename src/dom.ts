import { ComponentConstructor } from "./index.d";
import { VNode } from "./vnode";
import { classNames } from './classNames';
import { Component } from "./component";

export const createElement = (vnode: VNode | string): HTMLElement | Text => {
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  } else {
    if (typeof vnode.type === 'string') {
      const element = document.createElement(vnode.type)
      updateElement(element, vnode);

      vnode.children.forEach((childNode) => {
        replaceElement(element, null, childNode);
      });

      return element;
    }

    let component;
    if (vnode.type.prototype && vnode.type.prototype.constructor) {
      component = new (vnode.type as ComponentConstructor)(vnode.attributes, vnode.children);
    } else {
      component = new Component(vnode.attributes, vnode.children);
      component.view = vnode.type;
    }

    const rendered = component.render();
    const element = createElement(rendered);
    element["_component"] = component;
    component._element = element;

    return element;
  }
}

export const replaceElement = (parent: HTMLElement | Text, element: HTMLElement | Text, vnode: VNode | string) => {
  const newElement = createElement(vnode);
  if (element === null || element === undefined) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, element);
    parent.removeChild(element);
  }

  return newElement;
}

export const updateElement = (element: HTMLElement, vnode: VNode) => {
  const oldAttributes = element["_props"] || {};
  Object.keys({ ...oldAttributes, ...vnode.attributes }).forEach((key) => {
    updateAttribute(element, key, oldAttributes[key], vnode.attributes[key]);
  });

  element["_props"] = vnode.attributes;
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