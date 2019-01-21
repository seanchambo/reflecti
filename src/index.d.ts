import VNode from './vnode';

type VNodeChild = string | VNode;
interface Props { [key: string]: any }
interface State { [key: string]: any }
interface Actions { [key: string]: Function }
interface Stateful { actions: Actions, state: State }
interface StatefulView { (component: Stateful): VNode }
interface View { (props: Props, children: VNodeChild[]): VNode | StatefulView }