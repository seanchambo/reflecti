import { State, Actions } from "./index.d";
import RNode from './rnode';
import VNode from './vnode';
import patch from './patch';

class App {
  state: State;
  actions: Actions;

  _rnode: RNode;
  _vnode: VNode | string;

  mount(vnode: VNode | string, element: HTMLElement) {
    const parentRnode = new RNode();
    parentRnode.element = element;

    const appRnode = new RNode();
    appRnode.parent = parentRnode;
    parentRnode.children = [appRnode];
    this._rnode = appRnode;
    this._vnode = vnode;

    window['structure'] = this._rnode;

    patch(this._rnode, this._vnode);
  }
}

const createApp = (state: State, actions: Actions): App => {
  const app = new App();
  app.state = state;
  app.actions = {};

  for (const action in actions) {
    app.actions[action] = (...args) => {
      let result = actions[action](...args);

      if (result && result !== app.state) {
        app.state = { ...app.state, ...result };
        patch(app._rnode, app._vnode);
      }
    }
  }

  return app;
}

export default createApp;