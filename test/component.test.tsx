import { r } from '../src/r';
import { withState } from '../src/component';
import { mount } from '../src/mount';

beforeEach(() => {
  document.body.innerHTML = '';
})

describe('creating a component', () => {
  test('sets the right state and actions', () => {
    const view = (props) => (_, { state, actions }) => <div>{state.counter}</div>
    const Component = withState({ counter: 1 }, { increment: () => { } })(view);
    const instance = new Component();

    expect(instance.state).toEqual({ counter: 1 });
    expect(instance.actions).toHaveProperty('increment');
  });
});


describe('executing an action', () => {
  test('not based on previous state', () => {
    document.body.innerHTML = '<div></div>';

    const view = (props) => (_, { state, actions }) => <div>{state.counter}</div>
    const Component = withState({ counter: 0 }, { increment: (value) => ({ counter: value }) })(view);
    mount(<Component />, document.body);
    const component = document.body.firstChild["_component"];

    expect(document.body.innerHTML).toBe('<div>0</div>');

    component.actions.increment(4);

    expect(component.state).toEqual({ counter: 4 });
    expect(document.body.innerHTML).toBe('<div>4</div>');
  });

  test('based on previous state', () => {
    document.body.innerHTML = '<div></div>';

    const view = (props) => (_, { state, actions }) => <div>{state.counter}</div>
    const Component = withState({ counter: 1 }, { increment: (value) => (state) => ({ counter: state.counter + value }) })(view);
    mount(<Component />, document.body);
    const component = document.body.firstChild["_component"];

    expect(document.body.innerHTML).toBe('<div>1</div>');

    component.actions.increment(4);

    expect(component.state).toEqual({ counter: 5 });
    expect(document.body.innerHTML).toBe('<div>5</div>');
  });

  test('return null', () => {
    document.body.innerHTML = '<div></div>';

    const view = (props) => (_, { state, actions }) => <div>{state.counter}</div>
    const Component = withState({ counter: 1 }, { increment: (value) => null })(view);
    mount(<Component />, document.body);
    const component = document.body.firstChild["_component"];

    expect(document.body.innerHTML).toBe('<div>1</div>');

    component.actions.increment(4);

    expect(component.state).toEqual({ counter: 1 });
    expect(document.body.innerHTML).toBe('<div>1</div>');
  });
});

describe('with children', () => {
  const Component = (props, children) => <div>{children}</div>;
  mount(<div><Component><span>Hello</span></Component></div>, document.body);

  expect(document.body.innerHTML).toBe('<div><div><span>Hello</span></div></div>');
})