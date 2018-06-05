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
});
