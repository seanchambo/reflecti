import r from '../src/r';
import createApp from '../src/app';

beforeEach(() => {
  document.body.innerHTML = '';
})

describe('creating an app', () => {
  test('sets the right state and actions', () => {
    const app = createApp({ counter: 1 }, { increment: () => { } });

    expect(app.state).toEqual({ counter: 1 });
    expect(app.actions).toHaveProperty('increment');
  });
});

describe('executing an action', () => {
  test('not based on previous state', () => {
    document.body.innerHTML = '<div></div>';

    const app = createApp(
      { counter: 1 },
      { increment: (value) => ({ counter: value }) }
    )

    const Component = (props) => <div>{app.state.counter}</div>;
    app.mount(<Component />, document.body.firstChild as HTMLElement);

    expect(document.body.innerHTML).toBe('<div><div>1</div></div>')

    app.actions.increment(4);

    expect(app.state.counter).toBe(4)
    expect(document.body.innerHTML).toBe('<div><div>4</div></div>')
  });

  test('based on previous state', () => {
    document.body.innerHTML = '<div></div>';

    const app = createApp(
      { counter: 0 },
      { increment: (value) => ({ counter: app.state.counter + value }) }
    )

    const Component = (props) => <div>{app.state.counter}</div>;
    app.mount(<Component />, document.body.firstChild as HTMLElement);

    expect(document.body.innerHTML).toBe('<div><div>0</div></div>')

    app.actions.increment(1);

    expect(app.state.counter).toBe(1)
    expect(document.body.innerHTML).toBe('<div><div>1</div></div>')
  });

  test('returning null', () => {
    document.body.innerHTML = '<div></div>';

    const app = createApp(
      { counter: 1 },
      { increment: (value) => null }
    )

    const Component = (props) => <div>{app.state.counter}</div>;
    app.mount(<Component />, document.body.firstChild as HTMLElement);

    expect(document.body.innerHTML).toBe('<div><div>1</div></div>')

    app.actions.increment(4);

    expect(app.state.counter).toBe(1)
    expect(document.body.innerHTML).toBe('<div><div>1</div></div>')
  });
});