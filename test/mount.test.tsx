import { r, mount } from '../src';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('container', () => {
  document.body.innerHTML = '<main></main>';

  mount(<div />, document.body.firstChild as HTMLElement);

  expect(document.body.innerHTML).toBe('<main><div></div></main>');
});

test('nested components', () => {
  const date = new Date();
  document.body.innerHTML = '<div id="root"><div><p>Initial</p></div></div>';

  mount(<p>{date}</p>, document.getElementById('root'));

  expect(document.body.innerHTML).toBe(`<div id="root"><p>${date.toString()}</p></div>`);
});

test('mount component to null element', () => {
  const Component = (props) => <div />

  mount(<Component />, document.body);

  expect(document.body.innerHTML).toBe('<div></div>');
})