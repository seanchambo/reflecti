import { r, App } from '../src';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('changing action triggers rerender', () => {
  const Component = props => global =>
    <div onClick={() => { global.actions.changeValue('end'); }}>{global.state.value}</div>;

  const app = new App({ value: 'start' }, { changeValue: value => ({ value }) });
  app.mount(<Component />, document.body);

  expect(document.body.innerHTML).toBe('<div>start</div>');

  (document.body.firstChild as HTMLElement).click();

  expect(app.state.value).toBe('end');
  expect(document.body.innerHTML).toBe('<div>end</div>');
});

test('action based on previous state', () => {
  const Component = props => global =>
    <div onClick={() => { global.actions.increment(1); }}>{global.state.counter}</div>;
  const app = new App(
    { counter: 0 },
    {
      increment: value => state => ({ counter: state.counter + value }),
    },
  );
  app.mount(<div><Component /></div>, document.body);

  expect(document.body.innerHTML).toBe('<div><div>0</div></div>');

  (document.body.firstChild.firstChild as HTMLElement).click();

  expect(app.state.counter).toBe(1);
  expect(document.body.innerHTML).toBe('<div><div>1</div></div>');
});

test('dont update when returning null', () => {
  const Component = props => global =>
    <div onClick={() => { global.actions.increment(1); }}>{global.state.counter}</div>;
  const app = new App(
    { counter: 0 },
    {
      increment: value => state => null,
    },
  );
  app.mount(<Component />, document.body);

  expect(document.body.innerHTML).toBe('<div>0</div>');

  (document.body.firstChild as HTMLElement).click();

  expect(app.state.counter).toBe(0);
  expect(document.body.innerHTML).toBe('<div>0</div>');
});
