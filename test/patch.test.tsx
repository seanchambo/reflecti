import { r } from '../src';
import { patch } from '../src/patch';
import { createElement } from '../src/dom';
import { withState } from '../src/component';
import { createApp } from '../src/app';

const testPatch = (oldComponent, newComponent, html) => {
  const element = createElement(oldComponent);
  document.body.firstChild.appendChild(element);

  patch(document.body.firstChild as HTMLElement | Text, element, newComponent);

  expect(document.body.innerHTML).toBe(html);
};

beforeEach(() => {
  document.body.innerHTML = '<div></div>';
});

test('when boolean', () => {
  const component = 'abcd'
  const newComponent = true;
  testPatch(component, newComponent, '<div></div>');
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

test('when component changes to functional component', () => {
  const component = <div>abcd</div>
  const Functional = (props) => <div>functional</div>
  testPatch(component, <Functional />, '<div><div>functional</div></div>');
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

  test('change from element to component', () => {
    const component = <main><div>A</div></main>;
    const view = (props) => <div>B</div>
    const NewComponent = withState({}, {})(view);
    const newComponent = <main><NewComponent /></main>
    const html = '<div><main><div>B</div></main></div>';
    testPatch(component, newComponent, html);
  });

  test('change from same component to component', () => {
    const view = (props) => <div>{props.value}</div>
    const Component = withState({}, {})(view);
    const component = <main><Component value="A" /></main>;
    const newComponent = <main><Component value="B" /></main>
    const html = '<div><main><div>B</div></main></div>';
    testPatch(component, newComponent, html);
  });

  test('change from component to element', () => {
    const view = (props) => <div>{props.value}</div>
    const Component = withState({}, {})(view);
    const component = <main><Component value="A" /></main>;
    const newComponent = <main><div>B</div></main>
    const html = '<div><main><div>B</div></main></div>';
    testPatch(component, newComponent, html);
  });

  test('change from element to functional', () => {
    const Component = (props) => <div>{props.value}</div>
    const component = <main><div>A</div></main>;
    const newComponent = <main><Component value="B" /></main>
    const html = '<div><main><div>B</div></main></div>';
    testPatch(component, newComponent, html);
  });

  test('change from functional to functional', () => {
    const Component = (props) => <div>{props.value}</div>
    const component = <main><Component value="A" /></main>;
    const newComponent = <main><Component value="B" /></main>
    const html = '<div><main><div>B</div></main></div>';
    testPatch(component, newComponent, html);
  });

  test('change from functional to element', () => {
    const Component = (props) => <div>{props.value}</div>
    const component = <main><Component value="A" /></main>;
    const newComponent = <main><div>B</div></main>
    const html = '<div><main><div>B</div></main></div>';
    testPatch(component, newComponent, html);
  });

  test('change from functional to component', () => {
    const View = (props) => <div>{props.value}</div>;
    const component = <main><View value="A" /></main>;
    const NewComponent = withState({}, {})(View);
    const newComponent = <main><NewComponent value="B" /></main>
    const html = '<div><main><div>B</div></main></div>';
    testPatch(component, newComponent, html);
  });

  test('change from component to functional', () => {
    const View = (props) => <div>{props.value}</div>;
    const Component = withState({}, {})(View);
    const component = <main><Component value="A" /></main>;
    const newComponent = <main><View value="B" /></main>
    const html = '<div><main><div>B</div></main></div>';
    testPatch(component, newComponent, html);
  });

  test('component with state', () => {
    const app = createApp({ counter: 2 }, {});
    const component = <main><div>1</div></main>;
    const Component = props => ({ state: globalState }) => <div>{globalState.counter}</div>;
    const newComponent = <main><Component /></main>;
    testPatch(component, newComponent, '<div><main><div>2</div></main></div>');
  });
});