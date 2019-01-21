import { Props } from './index.d';
import VNode from './vnode';

const flatten = (thing: any): any => {
  return thing.reduce(
    (acc, elem) => {
      if (Array.isArray(elem)) {
        return [...acc, ...flatten(elem)];
      }
      else if (elem instanceof VNode) {
        return [...acc, elem];
      } else if (elem !== null && elem !== undefined && typeof elem !== 'boolean') {
        return [...acc, String(elem)];
      }
      return acc;
    }, []);
};

const r = (name: string | Function, props?: Props, ...children) => {
  children = flatten(children);

  return new VNode(name, props, children);
}

export default r;