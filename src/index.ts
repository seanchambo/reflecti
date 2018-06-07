import { VirtualNode, ComponentNode, Element } from './index.d';

import { patch } from './patch';
import { deepClone } from './utils';

const flatten = (thing: any): any => {
  if (!Array.isArray(thing)) { return thing; }
  return thing.reduce(
    (acc, elem) => {
      if (Array.isArray(elem)) {
        return [...acc, ...flatten(elem)];
      }
      return [...acc, elem];
    },
    [],
  );
};

export const r = (
  name: string | Function,
  props?: { [key: string]: any },
  ...children,
): VirtualNode => {
  let result = flatten(children);
  result = result.filter(elem => elem !== true && elem !== false && elem !== null);

  if (typeof name === 'function') { return name(props, result); }

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

export class App {
  state: { [key: string]: any };
  actions: { [key: string]: Function };
  originalComponent: ComponentNode | ((app: App) => ComponentNode);
  rootComponent: ComponentNode;
  rootElement: Element;
  childElement: Element;

  constructor(initialState: { [key: string]: any }, actions: { [key: string]: Function }) {
    this.state = { ...initialState };
    this.actions = {};
    this.rootComponent = null;
    this.rootElement = null;
    this.childElement = null;

    for (const action in actions) {
      this.actions[action] = (...args) => {
        let result = actions[action](...args);

        if (typeof result === 'function') {
          result = result(this.state, this.actions);
        }

        if (result && result !== this.state) {
          this.state = { ...this.state, ...result };
          this.render();
        }
      };
    }
  }

  mount(component: ComponentNode | ((app: App) => ComponentNode), element: Element): void {
    const oldComponent = elementToComponent(element.firstChild);
    const childElement = element.firstChild;
    this.originalComponent = component;
    this.rootElement = element;
    this.childElement = childElement;
    let clonedComponent;

    if (typeof component === 'function') {
      clonedComponent = component(this);
    } else {
      clonedComponent = deepClone(component);
    }

    [this.rootComponent, this.childElement] = patch(
      element,
      childElement,
      oldComponent,
      clonedComponent,
      this,
    );
  }

  render() {
    let clonedComponent;
    if (typeof this.originalComponent === 'function') {
      clonedComponent = this.originalComponent(this);
    } else {
      clonedComponent = deepClone(this.originalComponent);
    }

    [this.rootComponent, this.childElement] = patch(
      this.rootElement,
      this.childElement,
      this.rootComponent,
      clonedComponent,
      this,
    );
  }
}
