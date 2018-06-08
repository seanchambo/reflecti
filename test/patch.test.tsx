import { r, App } from '../src';
import { patch } from '../src/patch';
import { createElement } from '../src/dom';

const testPatch = (oldComponent, newComponent, html, app?) => {
  const element = createElement(oldComponent);
  document.body.firstChild.appendChild(element);

  patch(document.body.firstChild, element, newComponent, app);

  expect(document.body.innerHTML).toBe(html);
};

beforeEach(() => {
  document.body.innerHTML = '<div></div>';
});

test('when they are the same', () => {
  const component = 'abcd';
  const newComponent = component;
  testPatch(component, newComponent, '<div>abcd</div>');
});

test('when text changes', () => {
  const component = 'abcd';
  const newComponent = 'abcde';
  testPatch(component, newComponent, '<div>abcde</div>');
});

test('when text changes to number', () => {
  const component = 'abcd';
  const newComponent = 3;
  testPatch(component, newComponent, '<div>3</div>');
});

test('when text changes to component', () => {
  const component = 'abcd';
  const newComponent = <div>abcd</div>;
  testPatch(component, newComponent, '<div><div>abcd</div></div>');
});

test('when component changes to text', () => {
  const component = <div>abcd</div>;
  const newComponent = 'abcd';
  testPatch(component, newComponent, '<div>abcd</div>');
});

test('when component changes to number', () => {
  const component = <div>abcd</div>;
  const newComponent = 3;
  testPatch(component, newComponent, '<div>3</div>');
});

test('when component changes to another type of component', () => {
  const component = <div>abcd</div>;
  const newComponent = <span>abcd</span>;
  testPatch(component, newComponent, '<div><span>abcd</span></div>');
});

test('component with state', () => {
  const app = new App({ counter: 2 }, {});
  const component = <div>1</div>;
  const Component = props => ({ state: globalState }) => <div>{globalState.counter}</div>;
  const newComponent = <Component />;
  testPatch(component, newComponent, '<div><div>2</div></div>', app);
});

describe('when children change', () => {
  test('when children components reorder', () => {
    const component = <main><div key="a">A</div><div key="b">B</div><div key="c">C</div></main>;
    const newComponent = <main><div key="b">B</div><div key="c">C</div><div key="a">A</div></main>;
    const html = '<div><main><div>B</div><div>C</div><div>A</div></main></div>';
    testPatch(component, newComponent, html);
  });

  test('when adding children component in between', () => {
    const component = <main><div key="a">A</div><div key="b">B</div><div key="c">C</div></main>;
    const newComponent = <main>
      <div key="a">A</div><div key="d">D</div><div key="b">B</div><div key="c">C</div>
    </main>;
    const html = '<div><main><div>A</div><div>D</div><div>B</div><div>C</div></main></div>';
    testPatch(component, newComponent, html);
  });

  test('when adding children component to end', () => {
    const component = <main><div key="a">A</div><div key="b">B</div><div key="c">C</div></main>;
    const newComponent = <main>
      <div key="a">A</div><div key="b">B</div><div key="c">C</div><div key="d">D</div>
    </main>;
    const html = '<div><main><div>A</div><div>B</div><div>C</div><div>D</div></main></div>';
    testPatch(component, newComponent, html);
  });

  test('when removing child components in between', () => {
    const component = <main><div key="a">A</div><div key="b">B</div><div key="c">C</div></main>;
    const newComponent = <main><div key="a">A</div><div key="c">C</div></main>;
    const html = '<div><main><div>A</div><div>C</div></main></div>';
    testPatch(component, newComponent, html);
  });

  test('when removing child components from the end', () => {
    const component = <main><div key="a">A</div><div key="b">B</div><div key="c">C</div></main>;
    const newComponent = <main><div key="a">A</div><div key="b">B</div></main>;
    const html = '<div><main><div>A</div><div>B</div></main></div>';
    testPatch(component, newComponent, html);
  });

  test('when moving non-keyed element', () => {
    const component = <main><div>A</div><div key="b">B</div><div key="c">C</div></main>;
    const newComponent = <main><div key="b">B</div><div key="c">C</div><div>A</div></main>;
    const html = '<div><main><div>B</div><div>C</div><div>A</div></main></div>';
    testPatch(component, newComponent, html);
  });

  test('when remove non-keyed element add keyed', () => {
    const component = <main><div>A</div><div key="b">B</div><div key="c">C</div></main>;
    const newComponent = <main><div key="b">B</div><div key="c">C</div><div key="a">A</div></main>;
    const html = '<div><main><div>B</div><div>C</div><div>A</div></main></div>';
    testPatch(component, newComponent, html);
  });

  test('when add non-keyed element remove keyed', () => {
    const component = <main><div key="a">A</div><div key="b">B</div><div key="c">C</div></main>;
    const newComponent = <main>
      <div key="b">B</div><div>C</div><div key="a">A</div><div>D</div>
    </main>;
    const html = '<div><main><div>B</div><div>C</div><div>A</div><div>D</div></main></div>';
    testPatch(component, newComponent, html);
  });

  test('removing non-keyed elements', () => {
    const component = <main><div>A</div><div>B</div><div>D</div><div key="c">C</div></main>;
    const newComponent = <main>
      <div key="b">B</div><div key="c"><p>C</p></div><div key="a">A</div>
    </main>;
    const html = '<div><main><div>B</div><div><p>C</p></div><div>A</div></main></div>';
    testPatch(component, newComponent, html);
  });

  test('component with state', () => {
    const app = new App({ counter: 2 }, {});
    const component = <main><div>1</div></main>;
    const Component = props => ({ state: globalState }) => <div>{globalState.counter}</div>;
    const newComponent = <main><Component /></main>;
    testPatch(component, newComponent, '<div><main><div>2</div></main></div>', app);
  });
});
