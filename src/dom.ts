import { ComponentNode, Element, VirtualNode } from './index.d';

export const createElement = (component: ComponentNode): Element => {
  if (typeof component === 'string' || typeof component === 'number') {
    return document.createTextNode(component.toString());
  }

  const element = document.createElement(component.type);

  Object.keys(component.attributes).forEach((attribute) => {
    updateAttribute(element, attribute, null, component.attributes[attribute]);
  });

  component.children.forEach((child: ComponentNode) => {
    const childElement = createElement(child);
    element.appendChild(childElement);
  });

  return element;
};

export const replaceElement = (
  parent: Element,
  element: Element,
  oldComponent: ComponentNode,
  newComponent: ComponentNode,
): Element => {
  const newElement = createElement(newComponent);
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
    if (attributeName === 'className') { element.className = newValue || ''; }
    else if (!newValue) { element.removeAttribute(attributeName); }
    else { element.setAttribute(attributeName, newValue); }
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
  }
};
