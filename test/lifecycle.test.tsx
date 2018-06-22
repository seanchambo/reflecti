import { r, mount, withState } from '../src';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('oncreate', () => {
  const mockFn = jest.fn();
  const component = <div oncreate={mockFn} />

  mount(component, document.body);

  expect(mockFn.mock.calls.length).toBe(1);
});

test('onupdate', () => {
  const mockFn = jest.fn();
  const view = (props) => (global, local) => <div onupdate={mockFn} id="counter" onclick={() => { local.actions.increment(1) }}>{local.state.counter}</div>
  const Component = withState({ counter: 0 }, { increment: (value) => (state) => ({ counter: state.counter + value }) })(view);

  mount(<Component />, document.body);

  expect(mockFn.mock.calls.length).toBe(0);

  document.getElementById('counter').click();

  expect(mockFn.mock.calls.length).toBe(1);
});

test('onremove', () => {
  const mockFn = jest.fn();
  const view = (props) => (global, local) => {
    if (local.state.counter === 0) { return <div id="counter" onclick={() => { local.actions.increment(1) }} onremove={mockFn} /> }
    return <span />
  }
  const Component = withState({ counter: 0 }, { increment: (value) => (state) => ({ counter: state.counter + value }) })(view);

  mount(<Component />, document.body);

  expect(mockFn.mock.calls.length).toBe(0);

  document.getElementById('counter').click();

  expect(mockFn.mock.calls.length).toBe(1);
});