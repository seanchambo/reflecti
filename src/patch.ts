/* tslint:disable:no-parameter-reassignment */

import { ComponentNode, Element, ChildCompareData, VirtualNode } from './index.d';
import { App } from './index';
import { createElement, replaceElement, updateElement } from './dom';

export const patch = (
  parent: Element,
  element: Element,
  component: ComponentNode | ((app: App) => ComponentNode),
  app?: App,
): Element => {
  const oldComponent = element ? element['_reflecti'] : null;
  component = typeof component === 'function' ? component(app) : component;

  if (oldComponent === component) {
  } else if (
    typeof oldComponent === 'string' ||
    typeof oldComponent === 'number' ||
    oldComponent instanceof Date
  ) {
    if (
      typeof component === 'string' ||
      typeof component === 'number' ||
      component instanceof Date
    ) {
      element.nodeValue = component.toString();
    } else {
      element = replaceElement(parent, element, oldComponent, component, app);
    }
  } else if (
    typeof component === 'string' ||
    typeof component === 'number' ||
    component instanceof Date
  ) {
    element = replaceElement(parent, element, oldComponent, component, app);
  } else if (oldComponent === null) {
    element = replaceElement(parent, element, oldComponent, component, app);
  } else if (oldComponent.type !== component.type) {
    element = replaceElement(parent, element, oldComponent, component, app);
  } else {
    updateElement(element, oldComponent, component);

    const oldElements: Element[] = [];
    const oldUnkeyed: ChildCompareData[] = [];
    const oldKeys: { [key: string]: ChildCompareData } = {};
    const newKeys: { [key: string]: ComponentNode } = {};

    oldComponent.children.forEach((child, index) => {
      oldElements.push(element.childNodes[index]);
      child = element.childNodes[index]['_reflecti'];
      if (
        typeof child !== 'string' &&
        typeof child !== 'number' &&
        !(child instanceof Date) &&
        child.key
      ) {
        oldKeys[child.key] = { index, element: element.childNodes[index] };
      } else {
        oldUnkeyed.push({ index, element: element.childNodes[index] });
      }
    });

    component.children.forEach((child, index) => {
      let newKey: string = null;

      if (typeof child === 'function') { child = child(app); }

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
          element.insertBefore(createElement(child), element.childNodes[index]);
        } else {
          if (index === movedComponent.index) {
            patch(
              element,
              movedComponent.element,
              child,
              app,
            );
          } else {
            patch(
              element,
              element.insertBefore(movedComponent.element, element.childNodes[index]),
              child,
              app,
            );
          }
        }
      } else {
        element.insertBefore(createElement(child), element.childNodes[index]);
      }

      if (newKey) {
        newKeys[newKey] = child;
      }
    });

    oldComponent.children.forEach((child, index) => {
      child = oldElements[index]['_reflecti'];
      if (
        typeof child !== 'number' &&
        typeof child !== 'string' &&
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

  return element;
};
