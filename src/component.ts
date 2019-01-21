import { State, VNodeChild, View, Actions, Props } from "./index.d";
import RNode from "./rnode";
import VNode from "./vnode";
import patch from './patch';

export class Component {
  state: State;
  actions: Actions;
  props: Props;
  children: VNodeChild[];
  view: View;

  _rnode: RNode;
  _vnode: VNode;

  constructor(props?: Props, children?: VNodeChild[]) {
    this.props = props;
    this.children = children;
  }

  render(): VNode | string {
    let result = this.view(this.props, this.children);

    if (typeof result === 'function') {
      result = result({ state: this.state, actions: this.actions });
    }

    return result;
  }
}

const withState = (state: State, actions: Actions) => (view: View) =>
  class extends Component {
    constructor(props?: Props, children?: VNodeChild[]) {
      super(props, children);

      this.state = state;
      this.view = view;
      this.actions = {};

      for (const action in actions) {
        this.actions[action] = (...args) => {
          let result = actions[action](...args);

          if (typeof result === 'function') {
            result = result({ state: this.state, actions: this.actions });
          }

          if (result && result !== this.state) {
            this.state = { ...this.state, ...result };
            patch(this._rnode, this._vnode);
          }
        }
      }
    }
  }

export default withState;