import { VirtualNode, ComponentNode, Element } from './index.d';

import { patch } from './patch';

const flatten = (thing: any): any => {
  if (!Array.isArray(thing)) { return thing; }
  return thing.reduce((acc, elem) => {
    if (Array.isArray(elem)) {
      return [...acc, ...flatten(elem)];
    }
    return [...acc, elem];
  }, []);
};

export const r = (name: string | Function, props?: { [key: string]: any }, ...children): VirtualNode => {
  let result = flatten(children);
  result = result.filter(elem => elem !== true && elem !== false && elem !== null);

  if (typeof name === 'function') {
    return name(props, result);
  }

  return {
    type: name,
    attributes: props || {},
    children: result,
    key: (props && props['key']) || null,
  };
};

const elementToComponent = (element: Element): ComponentNode => {
  if (element === null) { return null; }

  return {
    type: element.nodeName.toLowerCase(),
    attributes: {},
    children: [].map.call(element.childNodes, (childElement: (ChildNode & Node)) => {
      if (childElement.nodeType === 3) { return childElement.nodeValue; }
      return elementToComponent(childElement);
    }),
  };
};

export const mount = (component: ComponentNode, element: Element): void => {
  const oldComponent = elementToComponent(element.firstChild);
  const childElement = element.firstChild;

  patch(element, childElement, oldComponent, component);
};
