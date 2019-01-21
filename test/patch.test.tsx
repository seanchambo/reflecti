import { r } from '../src';
import { patch } from '../src/patch';
import { createElement } from '../src/dom';
import { withState } from '../src/oldVnode';
import { createApp } from '../src/app';

const testPatch = (oldVnode, newVnode, html) => {
  const [element] = createElement(oldVnode);
  document.body.firstChild.appendChild(element);

  patch(document.body.firstChild as HTMLElement | Text, element, newVnode);

  expect(document.body.innerHTML).toBe(html);
};

beforeEach(() => {
  document.body.innerHTML = '<div></div>';
});

test('when boolean', () => {
  const oldVnode = 'abcd'
  const newVnode = true;
  testPatch(oldVnode, newVnode, '<div></div>');
});

test('when they are the same', () => {
  const oldVnode = 'abcd';
  const newVnode = oldVnode;
  testPatch(oldVnode, newVnode, '<div>abcd</div>');
});

test('when text changes', () => {
  const oldVnode = 'abcd';
  const newVnode = 'abcde';
  testPatch(oldVnode, newVnode, '<div>abcde</div>');
});

test('when text changes to number', () => {
  const oldVnode = 'abcd';
  const newVnode = 3;
  testPatch(oldVnode, newVnode, '<div>3</div>');
});

test('when text changes to oldVnode', () => {
  const oldVnode = 'abcd';
  const newVnode = <div>abcd</div>;
  testPatch(oldVnode, newVnode, '<div><div>abcd</div></div>');
});

test('when oldVnode changes to text', () => {
  const oldVnode = <div>abcd</div>;
  const newVnode = 'abcd';
  testPatch(oldVnode, newVnode, '<div>abcd</div>');
});

test('when oldVnode changes to number', () => {
  const oldVnode = <div>abcd</div>;
  const newVnode = 3;
  testPatch(oldVnode, newVnode, '<div>3</div>');
});

test('when oldVnode changes to another type of oldVnode', () => {
  const oldVnode = <div>abcd</div>;
  const newVnode = <span>abcd</span>;
  testPatch(oldVnode, newVnode, '<div><span>abcd</span></div>');
});

test('when oldVnode changes to functional oldVnode', () => {
  const oldVnode = <div>abcd</div>
  const Functional = (props) => <div>functional</div>
  testPatch(oldVnode, <Functional />, '<div><div>functional</div></div>');
});

describe('when children change', () => {
  test('when children oldVnodes reorder', () => {
    const oldVnode = <main><div key="a">A</div><div key="b">B</div><div key="c">C</div></main>;
    const newVnode = <main><div key="b">B</div><div key="c">C</div><div key="a">A</div></main>;
    const html = '<div><main><div>B</div><div>C</div><div>A</div></main></div>';
    testPatch(oldVnode, newVnode, html);
  });

  test('when adding children oldVnode in between', () => {
    const oldVnode = <main><div key="a">A</div><div key="b">B</div><div key="c">C</div></main>;
    const newVnode = <main>
      <div key="a">A</div><div key="d">D</div><div key="b">B</div><div key="c">C</div>
    </main>;
    const html = '<div><main><div>A</div><div>D</div><div>B</div><div>C</div></main></div>';
    testPatch(oldVnode, newVnode, html);
  });

  test('when adding children oldVnode to end', () => {
    const oldVnode = <main><div key="a">A</div><div key="b">B</div><div key="c">C</div></main>;
    const newVnode = <main>
      <div key="a">A</div><div key="b">B</div><div key="c">C</div><div key="d">D</div>
    </main>;
    const html = '<div><main><div>A</div><div>B</div><div>C</div><div>D</div></main></div>';
    testPatch(oldVnode, newVnode, html);
  });

  test('when removing child oldVnodes in between', () => {
    const oldVnode = <main><div key="a">A</div><div key="b">B</div><div key="c">C</div></main>;
    const newVnode = <main><div key="a">A</div><div key="c">C</div></main>;
    const html = '<div><main><div>A</div><div>C</div></main></div>';
    testPatch(oldVnode, newVnode, html);
  });

  test('when removing child oldVnodes from the end', () => {
    const oldVnode = <main><div key="a">A</div><div key="b">B</div><div key="c">C</div></main>;
    const newVnode = <main><div key="a">A</div><div key="b">B</div></main>;
    const html = '<div><main><div>A</div><div>B</div></main></div>';
    testPatch(oldVnode, newVnode, html);
  });

  test('when moving non-keyed element', () => {
    const oldVnode = <main><div>A</div><div key="b">B</div><div key="c">C</div></main>;
    const newVnode = <main><div key="b">B</div><div key="c">C</div><div>A</div></main>;
    const html = '<div><main><div>B</div><div>C</div><div>A</div></main></div>';
    testPatch(oldVnode, newVnode, html);
  });

  test('when remove non-keyed element add keyed', () => {
    const oldVnode = <main><div>A</div><div key="b">B</div><div key="c">C</div></main>;
    const newVnode = <main><div key="b">B</div><div key="c">C</div><div key="a">A</div></main>;
    const html = '<div><main><div>B</div><div>C</div><div>A</div></main></div>';
    testPatch(oldVnode, newVnode, html);
  });

  test('when add non-keyed element remove keyed', () => {
    const oldVnode = <main><div key="a">A</div><div key="b">B</div><div key="c">C</div></main>;
    const newVnode = <main>
      <div key="b">B</div><div>C</div><div key="a">A</div><div>D</div>
    </main>;
    const html = '<div><main><div>B</div><div>C</div><div>A</div><div>D</div></main></div>';
    testPatch(oldVnode, newVnode, html);
  });

  test('removing non-keyed elements', () => {
    const oldVnode = <main><div>A</div><div>B</div><div>D</div><div key="c">C</div></main>;
    const newVnode = <main>
      <div key="b">B</div><div key="c"><p>C</p></div><div key="a">A</div>
    </main>;
    const html = '<div><main><div>B</div><div><p>C</p></div><div>A</div></main></div>';
    testPatch(oldVnode, newVnode, html);
  });

  test('change from element to oldVnode', () => {
    const oldVnode = <main><div>A</div></main>;
    const view = (props) => <div>B</div>
    const newVnode = withState({}, {})(view);
    const newVnode = <main><newVnode /></main>
    const html = '<div><main><div>B</div></main></div>';
    testPatch(oldVnode, newVnode, html);
  });

  test('change from same oldVnode to oldVnode', () => {
    const view = (props) => <div>{props.value}</div>
    const oldVnode = withState({}, {})(view);
    const oldVnode = <main><oldVnode value="A" /></main>;
    const newVnode = <main><oldVnode value="B" /></main>
    const html = '<div><main><div>B</div></main></div>';
    testPatch(oldVnode, newVnode, html);
  });

  test('change from oldVnode to element', () => {
    const view = (props) => <div>{props.value}</div>
    const oldVnode = withState({}, {})(view);
    const oldVnode = <main><oldVnode value="A" /></main>;
    const newVnode = <main><div>B</div></main>
    const html = '<div><main><div>B</div></main></div>';
    testPatch(oldVnode, newVnode, html);
  });

  test('change from element to functional', () => {
    const oldVnode = (props) => <div>{props.value}</div>
    const oldVnode = <main><div>A</div></main>;
    const newVnode = <main><oldVnode value="B" /></main>
    const html = '<div><main><div>B</div></main></div>';
    testPatch(oldVnode, newVnode, html);
  });

  test('change from functional to functional', () => {
    const oldVnode = (props) => <div>{props.value}</div>
    const oldVnode = <main><oldVnode value="A" /></main>;
    const newVnode = <main><oldVnode value="B" /></main>
    const html = '<div><main><div>B</div></main></div>';
    testPatch(oldVnode, newVnode, html);
  });

  test('change from functional to element', () => {
    const oldVnode = (props) => <div>{props.value}</div>
    const oldVnode = <main><oldVnode value="A" /></main>;
    const newVnode = <main><div>B</div></main>
    const html = '<div><main><div>B</div></main></div>';
    testPatch(oldVnode, newVnode, html);
  });

  test('change from functional to oldVnode', () => {
    const View = (props) => <div>{props.value}</div>;
    const oldVnode = <main><View value="A" /></main>;
    const newVnode = withState({}, {})(View);
    const newVnode = <main><newVnode value="B" /></main>
    const html = '<div><main><div>B</div></main></div>';
    testPatch(oldVnode, newVnode, html);
  });

  test('change from oldVnode to functional', () => {
    const View = (props) => <div>{props.value}</div>;
    const oldVnode = withState({}, {})(View);
    const oldVnode = <main><oldVnode value="A" /></main>;
    const newVnode = <main><View value="B" /></main>
    const html = '<div><main><div>B</div></main></div>';
    testPatch(oldVnode, newVnode, html);
  });

  test('oldVnode with state', () => {
    const app = createApp({ counter: 2 }, {});
    const oldVnode = <main><div>1</div></main>;
    const oldVnode = props => ({ state: globalState }) => <div>{globalState.counter}</div>;
    const newVnode = <main><oldVnode /></main>;
    testPatch(oldVnode, newVnode, '<div><main><div>2</div></main></div>');
  });
});