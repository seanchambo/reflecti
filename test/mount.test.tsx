import { App, r } from '../src';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('container', () => {
  document.body.innerHTML = '<main></main>';

  const app = new App({}, {});
  app.mount(<div />, document.body.firstChild);

  expect(document.body.innerHTML).toBe('<main><div></div></main>');
});

test('nested components', () => {
  const date = new Date();
  document.body.innerHTML = '<div id="root"><div><p>Initial</p></div></div>';

  const app = new App({}, {});
  app.mount(<p>{date}</p>, document.getElementById('root'));

  expect(document.body.innerHTML).toBe(`<div id="root"><p>${date.toString()}</p></div>`);
});

test('with app state', () => {
  document.body.innerHTML = '<main></main>';

  const app = new App({ counter: 0 }, {});
  const AppRoot = props => ({ state: globalState }) => {
    return (<div>{globalState.counter}</div>);
  };

  app.mount(<div><AppRoot /></div>, document.body.firstChild);

  expect(document.body.innerHTML).toBe('<main><div><div>0</div></div></main>');
});
