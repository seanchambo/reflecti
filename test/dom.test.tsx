import { r } from '../src';
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

  test('number', () => {
    const component = 3;
    const element = createElement(component);

    expect(element.nodeValue).toBe('3');
    expect(element.nodeName).toBe('#text');
  });

  test('date', () => {
    const component = new Date();
    const element = createElement(component);

    expect(element.nodeValue).toBe(component.toString());
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
    const component = <div onClick={func} />;
    const element = createElement(component) as HTMLElement;
    element.click();

    expect(value).toBe(true);
  });
});

describe('#replaceElement', () => {
  test('when no previous element', () => {
    const component = <div />;
    replaceElement(document.body, null, null, component);

    expect(document.body.innerHTML).toBe('<div></div>');
  });

  test('full replace', () => {
    document.body.innerHTML = '<div></div>';
    const oldComponent = <div />;
    const component = <span>abcd</span>;
    replaceElement(document.body, document.body.firstChild, oldComponent, component);

    expect(document.body.innerHTML).toBe('<span>abcd</span>');
  });
});

describe('#updateElement', () => {
  // this should never happen but still need to test
  test('update text element with vnode', () => {
    document.body.innerHTML = 'abcd';
    const oldComponent = <div />;
    const newComponent = <div className="test" />;
    updateElement(document.body.firstChild, oldComponent, newComponent);

    expect(document.body.innerHTML).toBe('abcd');
  });

  test('update className', () => {
    document.body.innerHTML = '<div></div>';
    const oldComponent = <div />;
    const newComponent = <div className="test" />;
    updateElement(document.body.firstChild, oldComponent, newComponent);

    expect(document.body.innerHTML).toBe('<div class="test"></div>');
  });

  test('remove className', () => {
    document.body.innerHTML = '<div></div>';
    const oldComponent = <div className="test" />;
    const newComponent = <div />;
    updateElement(document.body.firstChild, oldComponent, newComponent);

    expect(document.body.innerHTML).toBe('<div class=""></div>');
  });

  test('update attribute', () => {
    document.body.innerHTML = '<div></div>';
    const oldComponent = <div />;
    const newComponent = <div align="test" />;
    updateElement(document.body.firstChild, oldComponent, newComponent);

    expect(document.body.innerHTML).toBe('<div align="test"></div>');
  });

  test('remove attribute', () => {
    document.body.innerHTML = '<div align="left"></div>';
    const oldComponent = <div align="left" />;
    const newComponent = <div />;
    updateElement(document.body.firstChild, oldComponent, newComponent);

    expect(document.body.innerHTML).toBe('<div></div>');
  });

  test('keep same attribute value', () => {
    document.body.innerHTML = '<div align="left"></div>';
    const oldComponent = <div align="left" />;
    const newComponent = <div align="left" />;
    updateElement(document.body.firstChild, oldComponent, newComponent);

    expect(document.body.innerHTML).toBe('<div align="left"></div>');
  });

  test('add style with string', () => {
    document.body.innerHTML = '<div></div>';
    const oldComponent = <div />;
    const newComponent = <div style="display: none;" />;
    updateElement(document.body.firstChild, oldComponent, newComponent);

    expect(document.body.innerHTML).toBe('<div style="display: none;"></div>');
  });

  test('remove string style', () => {
    document.body.innerHTML = '<div style="display: none;"></div>';
    const oldComponent = <div style="display: none;" />;
    const newComponent = <div />;
    updateElement(document.body.firstChild, oldComponent, newComponent);

    expect(document.body.innerHTML).toBe('<div style=""></div>');
  });

  test('add object style', () => {
    document.body.innerHTML = '<div></div>';
    const oldComponent = <div />;
    const newComponent = <div style={{ fontSize: '16px' }} />;
    updateElement(document.body.firstChild, oldComponent, newComponent);

    expect(document.body.innerHTML).toBe('<div style="font-size: 16px;"></div>');
  });

  test('remove object style', () => {
    document.body.innerHTML = '<div style="font-size: 16px;"></div>';
    const oldComponent = <div style={{ fontSize: '16px' }} />;
    const newComponent = <div />;
    updateElement(document.body.firstChild, oldComponent, newComponent);

    expect(document.body.innerHTML).toBe('<div style=""></div>');
  });

  test('replace string style with object style', () => {
    document.body.innerHTML = '<div style="display: none;"></div>';
    const oldComponent = <div style="display: none;" />;
    const newComponent = <div style={{ fontSize: '16px' }} />;
    updateElement(document.body.firstChild, oldComponent, newComponent);

    expect(document.body.innerHTML).toBe('<div style="font-size: 16px;"></div>');
  });

  test('replace object style with object style', () => {
    document.body.innerHTML = '<div style="display: none;"></div>';
    const oldComponent = <div style={{ display: 'none' }} />;
    const newComponent = <div style={{ fontSize: '16px' }} />;
    updateElement(document.body.firstChild, oldComponent, newComponent);

    expect(document.body.innerHTML).toBe('<div style="font-size: 16px;"></div>');
  });

  test('add event listener', () => {
    let value = false;
    const func = () => { value = !value; };
    document.body.innerHTML = '<div></div>';
    const oldComponent = <div />;
    const newComponent = <div onClick={func} />;
    updateElement(document.body.firstChild, oldComponent, newComponent);
    (document.body.firstChild as HTMLElement).click();

    expect(value).toBe(true);
  });

  test('remove event listener', () => {
    let value = false;
    const func = () => { value = !value; };
    document.body.innerHTML = '<div></div>';
    document.body.firstChild.addEventListener('click', func);
    const oldComponent = <div onClick={func} />;
    const newComponent = <div />;
    updateElement(document.body.firstChild, oldComponent, newComponent);
    (document.body.firstChild as HTMLElement).click();

    expect(value).toBe(false);
  });

  test('replace event listener', () => {
    let value: string | boolean = false;
    const func = () => { value = !value; };
    const func2 = () => { value = 'bob'; };
    document.body.innerHTML = '<div></div>';
    document.body.firstChild.addEventListener('click', func);
    const oldComponent = <div onClick={func} />;
    const newComponent = <div onClick={func2} />;
    updateElement(document.body.firstChild, oldComponent, newComponent);
    (document.body.firstChild as HTMLElement).click();

    expect(value).toBe(true);
  });
});
