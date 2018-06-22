import { VNode } from "./vnode";
import { patch } from "./patch";
import { app } from './app';
import { flushLifecycleEvents } from "./lifecycle";

export const mount = (vnode: VNode | string, parent: HTMLElement) => {
  const element = patch(parent, parent.firstChild as HTMLElement, vnode);
  flushLifecycleEvents();

  app._element = element;
  app._rootVNode = vnode;
}