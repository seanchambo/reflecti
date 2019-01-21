import r from '../src/r';
import withState from '../src/component';
import createApp from '../src/app';

beforeEach(() => {
  document.body.innerHTML = '';
})

describe('creating a component', () => {
  test('sets the right state and actions', () => {
    const view = (props) => ({ state, actions }) => <div>{state.counter}</div>
    const Component = withState({ counter: 1 }, { increment: () => { } })(view);
    const instance = new Component();

    expect(instance.state).toEqual({ counter: 1 });
    expect(instance.actions).toHaveProperty('increment');
  });
});


describe('executing an action', () => {
  test('not based on previous state', () => {
    document.body.innerHTML = '<div></div>';
    const app = createApp({}, {});

    const view = (props) => ({ state, actions }) => <div>{state.counter}</div>
    const Component = withState({ counter: 0 }, { increment: (value) => ({ counter: value }) })(view);
    app.mount(<Component />, document.body.firstChild as HTMLElement);

    expect(document.body.innerHTML).toBe('<div><div>0</div></div>');

    app._rnode.component.actions.increment(4);

    expect(app._rnode.component.state).toEqual({ counter: 4 });
    expect(document.body.innerHTML).toBe('<div><div>4</div></div>');
  });

  test('based on previous state', () => {
    document.body.innerHTML = '<div></div>';
    const app = createApp({}, {});

    const view = (props) => ({ state, actions }) => <div>{state.counter}</div>
    const Component = withState({ counter: 1 }, { increment: (value) => ({ state }) => ({ counter: state.counter + value }) })(view);
    app.mount(<Component />, document.body.firstChild as HTMLElement);

    expect(document.body.innerHTML).toBe('<div><div>1</div></div>');

    app._rnode.component.actions.increment(4);

    expect(app._rnode.component.state).toEqual({ counter: 5 });
    expect(document.body.innerHTML).toBe('<div><div>5</div></div>');
  });

  test('return null', () => {
    document.body.innerHTML = '<div></div>';
    const app = createApp({}, {});

    const view = (props) => ({ state, actions }) => <div>{state.counter}</div>
    const Component = withState({ counter: 1 }, { increment: (value) => null })(view);
    app.mount(<Component />, document.body.firstChild as HTMLElement);

    expect(document.body.innerHTML).toBe('<div><div>1</div></div>');

    app._rnode.component.actions.increment(4);

    expect(app._rnode.component.state).toEqual({ counter: 1 });
    expect(document.body.innerHTML).toBe('<div><div>1</div></div>');
  });
});

describe('with children', () => {
  test('should render correctly', () => {
    document.body.innerHTML = '<div></div>';
    const app = createApp({}, {});
    const Component = (props, children) => <div>{children}</div>;
    app.mount(<div><Component><span>Hello</span></Component></div>, document.body.firstChild as HTMLElement);

    expect(document.body.innerHTML).toBe('<div><div><div><span>Hello</span></div></div></div>');
  });
})