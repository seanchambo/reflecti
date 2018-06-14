import { VNode } from "./vnode";
import { patch } from "./patch";
import { app } from './app';

export const mount = (vnode: VNode | string, parent: HTMLElement) => {
  const element = patch(parent, parent.firstChild as HTMLElement, vnode);

  app._element = element;
  app._rootVNode = vnode;
}