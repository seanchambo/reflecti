import { VNode } from "./vnode";
import { Component } from "./component";

export interface App extends Stateful {
  _element: HTMLElement | Text;
  _rootVNode: VNode | string;
}

export interface ComponentInterface extends Stateful {
  state: State;
  actions: Actions;
  view: View;
  props: VNodeAttributes;
  children: VNodeChild[];

  _element: HTMLElement | Text;

  render(): VNode | string
}

interface ComponentConstructor {
  new(props?: VNodeAttributes, children?: VNodeChild[]): ComponentInterface;
}

export interface Actions {
  [key: string]: Function
}

export interface Stateful {
  actions: Actions;
  state: State;
}

export interface State {
  [key: string]: any
}

export interface VNodeAttributes {
  [key: string]: any
}

export interface View {
  (props: VNodeAttributes, children: VNodeChild[]): StatefulView | VNode
}

export interface StatefulView {
  (app: Stateful, component?: Stateful): VNode
}

export type VNodeName = string | Function | ComponentConstructor;
export type VNodeKey = string | number;
export type VNodeChild = string | VNode 