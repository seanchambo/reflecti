import { ComponentNode, Element, ChildCompareData } from './index.d';
import { createElement, replaceElement, updateElement } from './dom';

export const patch = (
  parent: Element,
  element: Element,
  oldComponent: ComponentNode,
  newComponent: ComponentNode,
): Element => {
  if (oldComponent === newComponent) {
    return element;
  }
  else if (typeof oldComponent === 'string' || typeof oldComponent === 'number') {
    if (typeof newComponent === 'string' || typeof newComponent === 'number') {
      element.nodeValue = newComponent.toString();
      return element;
    }

    return replaceElement(parent, element, oldComponent, newComponent);
  }
  else if (typeof newComponent === 'string' || typeof newComponent === 'number') {
    return replaceElement(parent, element, oldComponent, newComponent);
  }
  else if (oldComponent === null) {
    return replaceElement(parent, element, oldComponent, newComponent);
  }
  else if (oldComponent.type !== newComponent.type) {
    return replaceElement(parent, element, oldComponent, newComponent);
  } else {
    updateElement(element, oldComponent, newComponent);

    const oldElements: Element[] = [];
    const oldUnkeyed: ChildCompareData[] = [];
    const oldKeys: { [key: string]: ChildCompareData } = {};
    const newKeys: { [key: string]: ComponentNode } = {};

    oldComponent.children.forEach((child, index) => {
      oldElements.push(element.childNodes[index]);
      if (typeof child !== 'string' && typeof child !== 'number' && child.key) {
        oldKeys[child.key] = { index, element: element.childNodes[index], component: child };
      } else {
        oldUnkeyed.push({ index, element: element.childNodes[index], component: child });
      }
    });

    newComponent.children.forEach((child, index) => {
      let newKey: string = null;
      if (typeof child !== 'number' && typeof child !== 'string' && child.key) {
        newKey = child.key;
      }

      if (oldKeys[newKey] || newKey === null) {
        const movedComponent = oldKeys[newKey] || oldUnkeyed.pop();

        if (!movedComponent) {
          const newElement = createElement(child);
          element.insertBefore(newElement, element.childNodes[index]);
        } else {
          if (index === movedComponent.index) {
            patch(
              element,
              movedComponent.element,
              movedComponent.component,
              child,
            );
          } else {
            patch(
              element,
              element.insertBefore(movedComponent.element, element.childNodes[index]),
              movedComponent.component,
              child,
            );
          }
        }
      } else {
        const newElement = createElement(child);
        element.insertBefore(newElement, element.childNodes[index]);
      }

      if (newKey) {
        newKeys[newKey] = child;
      }
    });

    oldComponent.children.forEach((child, index) => {
      if (typeof child !== 'number' && typeof child !== 'string' && child.key && !newKeys[child.key]) {
        element.removeChild(oldElements[index]);
      }
    });

    oldUnkeyed.forEach((data) => {
      element.removeChild(data.element);
    });
  }
};
