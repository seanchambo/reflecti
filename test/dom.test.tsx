import { r } from '../src';
import { VNode } from '../src/vnode'
import { createElement, replaceElement, updateElement } from '../src/dom';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('#createElement', () => {
  test('text', () => {
    const component = 'abcd';
    const element = createElement(component);

    expect(element.nodeValue).toBe('abcd');
    expect(element.nodeName).toBe('#text');
  });

  test('container', () => {
    const component = <div />;
    const element = createElement(component);

    expect(element.nodeName.toLowerCase()).toBe('div');
  });

  test('with attributes', () => {
    const component = <div id="test" />;
    const element = createElement(component) as HTMLElement;

    expect(element.id).toBe('test');
  });

  test('with children', () => {
    const component = <div id="test"><div className="test">abcd</div></div>;
    const element = createElement(component) as HTMLElement;

    expect(element.innerHTML).toBe('<div class="test">abcd</div>');
  });

  test('with event listener', () => {
    let value = false;
    const func = () => { value = !value; };
    const component = <div onclick={func} />;
    const element = createElement(component) as HTMLElement;
    element.click();

    expect(value).toBe(true);
  });
});

describe('#replaceElement', () => {
  test('when no previous element', () => {
    const component = <div />;
    replaceElement(document.body, null, component);

    expect(document.body.innerHTML).toBe('<div></div>');
  });

  test('full replace', () => {
    const oldComponent = <div />;
    const component = <span>abcd</span>;
    document.body.innerHTML = '<div></div>';
    document.body.firstChild["_props"] = oldComponent.attributes;
    replaceElement(document.body, document.body.firstChild as HTMLElement, component);

    expect(document.body.innerHTML).toBe('<span>abcd</span>');
  });
});

describe('#updateElement', () => {
  const testUpdate = (oldComponent, newComponent, expected) => {
    const element = replaceElement(document.body, null, oldComponent);
    updateElement(document.body.firstChild as HTMLElement, newComponent);

    expect(document.body.innerHTML).toBe(expected);

    return element;
  }

  test('update className', () => {
    const oldComponent = <div />;
    const newComponent = <div className="test" />;

    testUpdate(oldComponent, newComponent, '<div class="test"></div>');
  });

  test('remove className', () => {
    const oldComponent = <div className="test" />;
    const newComponent = <div />;

    testUpdate(oldComponent, newComponent, '<div class=""></div>');
  });

  test('update attribute', () => {
    const oldComponent = <div />;
    const newComponent = <div align="test" />;

    testUpdate(oldComponent, newComponent, '<div align="test"></div>');
  });

  test('remove attribute', () => {
    const oldComponent = <div align="left" />;
    const newComponent = <div />;

    testUpdate(oldComponent, newComponent, '<div></div>');
  });

  test('keep same attribute value', () => {
    const oldComponent = <div align="left" />;
    const newComponent = <div align="left" />;

    testUpdate(oldComponent, newComponent, '<div align="left"></div>');
  });

  test('add style with string', () => {
    const oldComponent = <div />;
    const newComponent = <div style="display: none;" />;

    testUpdate(oldComponent, newComponent, '<div style="display: none;"></div>');
  });

  test('remove string style', () => {
    const oldComponent = <div style="display: none;" />;
    const newComponent = <div />;

    testUpdate(oldComponent, newComponent, '<div style=""></div>');
  });

  test('add object style', () => {
    const oldComponent = <div />;
    const newComponent = <div style={{ fontSize: '16px' }} />;

    testUpdate(oldComponent, newComponent, '<div style="font-size: 16px;"></div>');
  });

  test('remove object style', () => {
    const oldComponent = <div style={{ fontSize: '16px' }} />;
    const newComponent = <div />;

    testUpdate(oldComponent, newComponent, '<div style=""></div>');
  });

  test('replace string style with object style', () => {
    const oldComponent = <div style="display: none;" />;
    const newComponent = <div style={{ fontSize: '16px' }} />;

    testUpdate(oldComponent, newComponent, '<div style="font-size: 16px;"></div>');
  });

  test('replace object style with object style', () => {
    const oldComponent = <div style={{ display: 'none' }} />;
    const newComponent = <div style={{ fontSize: '16px' }} />;

    testUpdate(oldComponent, newComponent, '<div style="font-size: 16px;"></div>');
  });

  test('add event listener', () => {
    let value = false;
    const func = () => { value = !value; };
    const oldComponent = <div />;
    const newComponent = <div onclick={func} />;

    const element = testUpdate(oldComponent, newComponent, '<div></div>') as HTMLElement;

    element.click();
    expect(value).toBe(true);
  });

  test('remove event listener', () => {
    let value = false;
    const func = () => { value = !value; };
    const oldComponent = <div onclick={func} />;
    const newComponent = <div />;

    const element = testUpdate(oldComponent, newComponent, '<div></div>') as HTMLElement;

    element.click();
    expect(value).toBe(false);
  });

  test('replace event listener', () => {
    let value: string | boolean = false;
    const func = () => { value = !value; };
    const func2 = () => { value = 'bob'; };
    const oldComponent = <div onclick={func} />;
    const newComponent = <div onclick={func2} />;

    const element = testUpdate(oldComponent, newComponent, '<div></div>') as HTMLElement;

    element.click();
    expect(value).toBe(true);
  });
});
