import RNode from "./rnode";
import VNode from "./vnode";
import classNames from './classNames';
import patch from './patch';

export const createElement = (rnode: RNode): HTMLElement | Text => {
  let element: HTMLElement | Text;

  if (typeof rnode.nextVnode === 'string') {
    element = document.createTextNode(rnode.nextVnode);
    return element;
  } else {
    if (typeof rnode.nextVnode.type === 'string') {
      element = document.createElement(rnode.nextVnode.type);
      return element;
    } else {
      throw new Error('Cant create element for Component');
    }
  }
}

export const replaceElement = (rnode: RNode) => {
  const element = createElement(rnode);
  if (!rnode.element) {
    rnode.getParentElement().appendChild(element);
  } else {
    rnode.getParentElement().insertBefore(element, rnode.element);
    removeElement(rnode);
  }

  rnode.element = element;

  if (rnode.nextVnode instanceof VNode && typeof rnode.nextVnode.type === 'string') {
    updateElement(rnode);
    rnode.nextVnode.children.forEach((childVnode) => {
      const childRnode = new RNode();
      childRnode.parent = rnode;
      rnode.children.push(childRnode);
      patch(childRnode, childVnode)
    });
  }
}

export const removeElement = (rnode: RNode) => {
  rnode.getParentElement().removeChild(rnode.getChildElement());
}

export const updateElement = (rnode: RNode) => {
  const oldAttributes = (rnode.vnode && (rnode.vnode as VNode).attributes) || {};
  const newAttributes = (rnode.nextVnode as VNode).attributes
  Object.keys({ ...oldAttributes, ...newAttributes }).forEach((key) => {
    updateAttribute(
      rnode.element as HTMLElement,
      key,
      oldAttributes[key],
      newAttributes[key]
    );
  });
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
        element.addEventListener(eventName, newValue);
      }
      element.removeEventListener(eventName, oldValue);
    } else if (!newValue) {
      element.removeAttribute(attributeName);
    } else {
      element.setAttribute(attributeName, newValue);
    }
  }
}