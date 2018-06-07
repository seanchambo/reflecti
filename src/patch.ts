/* tslint:disable:no-parameter-reassignment */

import { ComponentNode, Element, ChildCompareData, VirtualNode } from './index.d';
import { App } from './index';
import { createElement, replaceElement, updateElement } from './dom';

export const patch = (
  parent: Element,
  element: Element,
  oldComponent: ComponentNode,
  newComponent: ComponentNode | ((app: App) => ComponentNode),
  app?: App,
): [ComponentNode, Element] => {
  newComponent = typeof newComponent === 'function' ? newComponent(app) : newComponent;

  if (oldComponent === newComponent) {
  } else if (
    typeof oldComponent === 'string' ||
    typeof oldComponent === 'number' ||
    oldComponent instanceof Date
  ) {
    if (
      typeof newComponent === 'string' ||
      typeof newComponent === 'number' ||
      newComponent instanceof Date
    ) {
      element.nodeValue = newComponent.toString();
    } else {
      element = replaceElement(parent, element, oldComponent, newComponent, app);
    }
  } else if (
    typeof newComponent === 'string' ||
    typeof newComponent === 'number' ||
    newComponent instanceof Date
  ) {
    element = replaceElement(parent, element, oldComponent, newComponent, app);
  } else if (oldComponent === null) {
    element = replaceElement(parent, element, oldComponent, newComponent, app);
  } else if (oldComponent.type !== newComponent.type) {
    element = replaceElement(parent, element, oldComponent, newComponent, app);
  } else {
    updateElement(element, oldComponent, newComponent);

    const oldElements: Element[] = [];
    const oldUnkeyed: ChildCompareData[] = [];
    const oldKeys: { [key: string]: ChildCompareData } = {};
    const newKeys: { [key: string]: ComponentNode } = {};

    oldComponent.children.forEach((child, index) => {
      oldElements.push(element.childNodes[index]);
      if (typeof child !== 'function') {
        if (
          typeof child !== 'string' &&
          typeof child !== 'number' &&
          !(child instanceof Date) &&
          child.key
        ) {
          oldKeys[child.key] = { index, element: element.childNodes[index], component: child };
        } else {
          oldUnkeyed.push({ index, element: element.childNodes[index], component: child });
        }
      }
    });

    newComponent.children.forEach((child, index) => {
      let newKey: string = null;

      if (typeof child === 'function') {
        (newComponent as VirtualNode).children[index] = child = child(app);
      }

      if (
        typeof child !== 'number' &&
        typeof child !== 'string' &&
        !(child instanceof Date) &&
        child.key
      ) {
        newKey = child.key;
      }

      if (oldKeys[newKey] || newKey === null) {
        const movedComponent = oldKeys[newKey] || oldUnkeyed.pop();

        if (!movedComponent) {
          const createdElement = createElement(child);
          element.insertBefore(createdElement, element.childNodes[index]);
        } else {
          if (index === movedComponent.index) {
            patch(
              element,
              movedComponent.element,
              movedComponent.component,
              child,
              app,
            );
          } else {
            patch(
              element,
              element.insertBefore(movedComponent.element, element.childNodes[index]),
              movedComponent.component,
              child,
              app,
            );
          }
        }
      } else {
        const createdElement = createElement(child);
        element.insertBefore(createdElement, element.childNodes[index]);
      }

      if (newKey) {
        newKeys[newKey] = child;
      }
    });

    oldComponent.children.forEach((child, index) => {
      if (
        typeof child !== 'number' &&
        typeof child !== 'string' &&
        typeof child !== 'function' &&
        !(child instanceof Date)
      ) {
        if (child.key && !newKeys[child.key]) {
          element.removeChild(oldElements[index]);
        }
      }
    });

    oldUnkeyed.forEach((data) => {
      element.removeChild(data.element);
    });
  }

  return [newComponent, element];
};
