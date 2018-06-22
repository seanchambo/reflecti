import { State, Actions, View, VNodeAttributes, VNodeChild, ComponentInterface } from "./index.d";
import { app } from './app';
import { VNode } from './vnode';
import { patch } from './patch';
import { flushLifecycleEvents } from "./lifecycle";

export class Component implements ComponentInterface {
  state: State;
  actions: Actions;
  props: VNodeAttributes;
  children: VNodeChild[];
  view: View;

  _element: HTMLElement | Text;

  constructor(props?: VNodeAttributes, children?: VNodeChild[]) {
    this.props = props;
    this.children = children;
  }

  render(): VNode | string {
    let result = this.view(this.props, this.children);

    if (typeof result === 'function') {
      result = result({ state: app.state, actions: app.actions }, { state: this.state, actions: this.actions });
    }

    return result;
  }
}

export const withState = (state: State, actions: Actions) => {
  return (view: View) => {
    return class extends Component {
      constructor(props?: VNodeAttributes, children?: VNodeChild[]) {
        super(props, children);

        this.state = state;
        this.view = view;
        this.actions = {};

        for (const action in actions) {
          this.actions[action] = (...args) => {
            let result = actions[action](...args);

            if (typeof result === 'function') {
              result = result(this.state, this.actions);
            }

            if (result && result !== this.state) {
              this.state = { ...this.state, ...result };
              const rendered = this.render();
              this._element = patch(this._element.parentNode as HTMLElement, this._element, rendered);
              this._element["component"] = this;
              flushLifecycleEvents();
            }
          }
        }
      }
    }
  }
}