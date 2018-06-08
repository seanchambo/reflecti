/* tslint:disable:no-parameter-reassignment */

import { ComponentNode, Element, VirtualNode } from './index.d';

import { classNames } from './classNames';
import { App } from '.';

export const createElement = (component: ComponentNode, app?: App): Element => {
  if (typeof component === 'string' || typeof component === 'number' || component instanceof Date) {
    const element = document.createTextNode(component.toString());
    element['_reflecti'] = component;
    return element;
  }

  const element = document.createElement(component.type);

  Object.keys(component.attributes).forEach((attribute) => {
    updateAttribute(element, attribute, null, component.attributes[attribute]);
  });

  component.children.forEach((
    child: ComponentNode | ((app: App) => ComponentNode),
    index: number,
  ) => {
    if (typeof child === 'function') { child = child(app); }
    const childElement = createElement(child, app);
    element.appendChild(childElement);
  });

  element['_reflecti'] = { ...component };

  return element;
};

export const replaceElement = (
  parent: Element,
  element: Element,
  oldComponent: ComponentNode,
  newComponent: ComponentNode,
  app?: App,
): Element => {
  const newElement = createElement(newComponent, app);
  if (element === null || element === undefined) { parent.appendChild(newElement); }
  else { parent.insertBefore(newElement, element); }

  if (element !== null && element !== undefined) { parent.removeChild(element); }

  return newElement;
};

export const updateAttribute = (
  element: HTMLElement,
  attributeName: string,
  oldValue: any,
  newValue: any,
): void => {
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
};

export const updateElement = (
  element: Element,
  oldComponent: VirtualNode,
  newComponent: VirtualNode,
): void => {
  if (element instanceof HTMLElement) {
    Object.keys({ ...oldComponent.attributes, ...newComponent.attributes }).forEach((key) => {
      updateAttribute(element, key, oldComponent.attributes[key], newComponent.attributes[key]);
    });

    element['_reflecti'] = { ...newComponent };
  }
};
