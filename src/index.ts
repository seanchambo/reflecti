import { VirtualNode, ComponentNode, Element } from './index.d';

import { patch } from './patch';

const flatten = (thing: any): any => {
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

  const component = {
    type: element.nodeName.toLowerCase(),
    attributes: {},
    children: [].map.call(element.childNodes, (childElement: (ChildNode & Node)) => {
      if (childElement.nodeType === 3) { return childElement.nodeValue; }
      return elementToComponent(childElement);
    }),
  };

  element['_reflecti'] = component;

  return component;
};

export class App {
  state: { [key: string]: any };
  actions: { [key: string]: Function };
  component: ComponentNode | ((app: App) => ComponentNode);
  rootElement: Element;
  childElement: Element;

  constructor(initialState: { [key: string]: any }, actions: { [key: string]: Function }) {
    this.state = { ...initialState };
    this.actions = {};
    this.component = null;
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
    elementToComponent(element.firstChild);
    this.component = component;
    this.rootElement = element;
    this.childElement = element.firstChild;

    this.render(element, element.firstChild);
  }

  render(root?: Element, element?: Element) {
    this.childElement = patch(
      root || this.rootElement,
      element || this.childElement,
      (typeof this.component === 'function' ? this.component(this) : this.component),
      this,
    );
  }
}
