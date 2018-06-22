import { App, State, Actions } from "./index.d";
import { patch } from "./patch";
import { flushLifecycleEvents } from "./lifecycle";

export const app: App = {
  state: null,
  actions: null,
  _element: null,
  _rootVNode: null,
};

export const createApp = (state: State, actions: Actions) => {
  app.state = state;
  app.actions = {};

  for (const action in actions) {
    app.actions[action] = (...args) => {
      let result = actions[action](...args);

      if (typeof result === 'function') {
        result = result(app.state, app.actions);
      }

      if (result && result !== app.state) {
        app.state = { ...app.state, ...result };
        app._element = patch(app._element.parentNode as HTMLElement, app._element, app._rootVNode);
        flushLifecycleEvents();
      }
    }
  }

  return app;
}