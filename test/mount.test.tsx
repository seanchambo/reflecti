import { mount, r } from '../src';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('container', () => {
  document.body.innerHTML = '<main></main>';
  mount(<div />, document.body.firstChild);

  expect(document.body.innerHTML).toBe('<main><div></div></main>');
});

test('nested components', () => {
  document.body.innerHTML = '<div id="root"><div></div></div>';
  mount(<p>Hello</p>, document.getElementById('root'));

  expect(document.body.innerHTML).toBe('<div id="root"><p>Hello</p></div>');
});
