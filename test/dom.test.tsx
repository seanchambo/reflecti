import { r } from '../src';
import RNode from '../src/rnode'
import { createElement, replaceElement, updateElement } from '../src/dom';
import VNode from '../src/vnode';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('#createElement', () => {
  const create = (vnode: string | VNode): HTMLElement | Text => {
    const rnode = new RNode();
    rnode.nextVnode = vnode;
    return createElement(rnode);
  }

  test('text', () => {
    const vnode = 'abcd';
    const element = create(vnode);

    expect(element.nodeValue).toBe('abcd');
    expect(element.nodeName).toBe('#text');
  });

  test('container', () => {
    const vnode = <div />;
    const element = create(vnode);

    expect(element.nodeName.toLowerCase()).toBe('div');
  });
});

describe('#replaceElement', () => {
  const create = (oldVnode: VNode | string, newVnode: VNode | string, element: HTMLElement) => {
    const parentRnode = new RNode();
    parentRnode.element = document.body;

    const childRnode = new RNode();
    childRnode.parent = parentRnode;
    childRnode.nextVnode = newVnode;
    childRnode.vnode = oldVnode;
    childRnode.element = element;
    parentRnode.children = [childRnode];

    replaceElement(childRnode);
  }

  test('when no previous element', () => {
    const vnode = <div />;
    create(null, vnode, null);

    expect(document.body.innerHTML).toBe('<div></div>');
  });

  test('full replace', () => {
    document.body.innerHTML = '<div></div>';
    const oldVnode = <div />;
    const newVnode = <span>abcd</span>;
    create(oldVnode, newVnode, document.body.firstChild as HTMLElement);

    expect(document.body.innerHTML).toBe('<span>abcd</span>');
  });
});

describe('#updateElement', () => {
  const testUpdate = (oldVnode: VNode | string, newVnode: VNode | string, expected: string): RNode => {
    const parentRnode = new RNode();
    parentRnode.element = document.body;

    const childRnode = new RNode();
    childRnode.element = document.body.firstChild as HTMLElement;
    childRnode.parent = parentRnode;
    parentRnode.children = [childRnode];
    childRnode.nextVnode = oldVnode;

    replaceElement(childRnode);

    childRnode.vnode = oldVnode;
    childRnode.nextVnode = newVnode;

    updateElement(childRnode);

    expect(document.body.innerHTML).toBe(expected);

    return childRnode;
  }

  test('update className', () => {
    const oldVnode = <div />;
    const newVnode = <div className="test" />;

    testUpdate(oldVnode, newVnode, '<div class="test"></div>');
  });

  test('remove className', () => {
    const oldVnode = <div className="test" />;
    const newVnode = <div />;

    testUpdate(oldVnode, newVnode, '<div class=""></div>');
  });

  test('update attribute', () => {
    const oldVnode = <div />;
    const newVnode = <div align="test" />;

    testUpdate(oldVnode, newVnode, '<div align="test"></div>');
  });

  test('remove attribute', () => {
    const oldVnode = <div align="left" />;
    const newVnode = <div />;

    testUpdate(oldVnode, newVnode, '<div></div>');
  });

  test('keep same attribute value', () => {
    const oldVnode = <div align="left" />;
    const newVnode = <div align="left" />;

    testUpdate(oldVnode, newVnode, '<div align="left"></div>');
  });

  test('add style with string', () => {
    const oldVnode = <div />;
    const newVnode = <div style="display: none;" />;

    testUpdate(oldVnode, newVnode, '<div style="display: none;"></div>');
  });

  test('remove string style', () => {
    const oldVnode = <div style="display: none;" />;
    const newVnode = <div />;

    testUpdate(oldVnode, newVnode, '<div style=""></div>');
  });

  test('add object style', () => {
    const oldVnode = <div />;
    const newVnode = <div style={{ fontSize: '16px' }} />;

    testUpdate(oldVnode, newVnode, '<div style="font-size: 16px;"></div>');
  });

  test('remove object style', () => {
    const oldVnode = <div style={{ fontSize: '16px' }} />;
    const newVnode = <div />;

    testUpdate(oldVnode, newVnode, '<div style=""></div>');
  });

  test('replace string style with object style', () => {
    const oldVnode = <div style="display: none;" />;
    const newVnode = <div style={{ fontSize: '16px' }} />;

    testUpdate(oldVnode, newVnode, '<div style="font-size: 16px;"></div>');
  });

  test('replace object style with object style', () => {
    const oldVnode = <div style={{ display: 'none' }} />;
    const newVnode = <div style={{ fontSize: '16px' }} />;

    testUpdate(oldVnode, newVnode, '<div style="font-size: 16px;"></div>');
  });

  test('add event listener', () => {
    let value = false;
    const func = () => { value = !value; };
    const oldVnode = <div />;
    const newVnode = <div onclick={func} />;

    const rnode = testUpdate(oldVnode, newVnode, '<div></div>');

    (rnode.getChildElement() as HTMLElement).click();
    expect(value).toBe(true);
  });

  test('remove event listener', () => {
    let value = false;
    const func = () => { value = !value; };
    const oldVnode = <div onclick={func} />;
    const newVnode = <div />;

    const rnode = testUpdate(oldVnode, newVnode, '<div></div>');

    (rnode.getChildElement() as HTMLElement).click();
    expect(value).toBe(false);
  });

  test('replace event listener', () => {
    let value: string | boolean = false;
    const func = () => { value = !value; };
    const func2 = () => { value = 'bob'; };
    const oldVnode = <div onclick={func} />;
    const newVnode = <div onclick={func2} />;

    const rnode = testUpdate(oldVnode, newVnode, '<div></div>');

    (rnode.getChildElement() as HTMLElement).click();
    expect(value).toBe('bob');
  });
});
